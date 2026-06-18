const DISCLAIMERS = {
  Sports: "For informational purposes only. Not a guarantee of outcome.",
  Markets: "Not financial advice. Always consult a qualified adviser.",
  Crypto: "Cryptocurrency is highly volatile. Not financial advice. DYOR.",
};

const RSS_SOURCES = [
  { name: "ESPN", url: "https://www.espn.com/espn/rss/news", category: "Sports", tag: "ESPN" },
  { name: "BBC Sport", url: "https://feeds.bbci.co.uk/sport/rss.xml", category: "Sports", tag: "BBC Sport" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex", category: "Markets", tag: "Yahoo Finance" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/", category: "Crypto", tag: "CoinDesk" },
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/businessNews", category: "Markets", tag: "Reuters" },
];

async function parseFeed(url, source) {
  try {
    const res = await fetch(url);
    const xml = await res.text();
    const items = [];
    const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    for (const match of itemMatches.slice(0, 3)) {
      const item = match[1];
      const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const link = item.match(/<link[^>]*>(.*?)<\/link>/)?.[1]?.trim();
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();
      const description = item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]+>/g, "").slice(0, 400).trim();
      if (title && link) items.push({ title, link, pubDate: pubDate || new Date().toISOString(), description: description || "", source: source.name, tag: source.tag, category: source.category });
    }
    return items;
  } catch { return []; }
}

async function callClaude(article) {
  const isSports = article.category === "Sports";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
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
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const raw = data.content[0].text.replace(/```json|```/g, "").trim();
  return JSON.parse(raw);
}

async function saveToSupabase(article, parsed) {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": process.env.SUPABASE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify({
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
    })
  });
  return res.ok;
}

async function getExistingLinks() {
  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles?select=link&order=posted_at.desc&limit=100`, {
    headers: {
      "apikey": process.env.SUPABASE_KEY,
      "Authorization": `Bearer ${process.env.SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  return new Set(data.map(a => a.link));
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
    const existingLinks = await getExistingLinks();
    const newArticles = allArticles.filter(a => !existingLinks.has(a.link));
    let published = 0;
    for (const article of newArticles.slice(0, 10)) {
      try {
        const parsed = await callClaude(article);
        const saved = await saveToSupabase(article, parsed);
        if (saved) published++;
      } catch { continue; }
    }
    return res.status(200).json({ success: true, published });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
