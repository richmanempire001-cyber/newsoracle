import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RSS_SOURCES = [
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "Sports", tag: "ESPN" },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml", category: "Sports", tag: "BBC Sport" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", category: "Markets", tag: "Yahoo Finance" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "Crypto", tag: "CoinDesk" },
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/businessNews", category: "Markets", tag: "Reuters" },
];

const DISCLAIMERS = {
  Sports: "For informational purposes only. Not a guarantee of outcome.",
  Markets: "Not financial advice. Always consult a qualified adviser.",
  Crypto: "Cryptocurrency is highly volatile. Not financial advice. DYOR.",
};

async function parseFeed(url, source) {
  try {
    const res = await fetch(url);
    const xml = await res.text();
    const items = [];
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
    for (const match of itemMatches) {
      const item = match[1];
      const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const link = item.match(/<link[^>]*>(.*?)<\/link>/)?.[1]?.trim();
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();
      const description = item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]+>/g, "").slice(0, 400).trim();
      if (title && link) items.push({ title, link, pubDate: pubDate || new Date().toISOString(), description: description || "", source: source.name, tag: source.tag, category: source.category });
      if (items.length >= 3) break;
    }
    return items;
  } catch { return []; }
}

async function processArticle(article) {
  try {
    const isSports = article.category === "Sports";
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{
        role: "user",
        content: `You are a senior editor. Write professional news analysis.
Title: ${article.title}
Content: ${article.description}
Category: ${article.category}

Return ONLY JSON no markdown:
{
  "summary": "3 factual sentences in journalistic style.",
  "prediction": "${isSports ? "2 sentences on likely outcomes." : "2 sentences of market analysis."}",
  "confidence": <integer 55-92>,
  "sentiment": "${isSports ? "home_win OR away_win OR draw OR bullish OR bearish" : "bullish OR bearish OR neutral"}"
}`
      }]
    });

    const raw = message.content[0].text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);

    await supabase.from("articles").insert({
      title: article.title,
      summary: parsed.summary,
      prediction: parsed.prediction,
      confidence: parsed.confidence,
      sentiment: parsed.sentiment,
      category: article.category,
      tag: article.tag,
      link: article.link,
      pub_date: article.pubDate,
      posted_at: new Date().toISOString(),
      disclaimer: DISCLAIMERS[article.category] || DISCLAIMERS.Markets,
    });

    return true;
  } catch { return false; }
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const allArticles = [];
    for (const source of RSS_SOURCES) {
      const articles = await parseFeed(source.url, source);
      allArticles.push(...articles);
    }

    const { data: existing } = await supabase
      .from("articles")
      .select("link")
      .order("posted_at", { ascending: false })
      .limit(100);

    const existingLinks = new Set(existing?.map(a => a.link) || []);
    const newArticles = allArticles.filter(a => !existingLinks.has(a.link));

    let published = 0;
    for (const article of newArticles.slice(0, 10)) {
      const success = await processArticle(article);
      if (success) published++;
    }

    return res.status(200).json({ success: true, published });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
