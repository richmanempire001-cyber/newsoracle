import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const RSS_SOURCES = {
  finance: [
    'https://feeds.reuters.com/reuters/topNews',
    'https://feeds.reuters.com/reuters/businessNews',
    'https://feeds.reuters.com/reuters/technologyNews',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://finance.yahoo.com/news/rssindex',
  ],
  sports: [
    'https://www.espn.com/espn/rss/news',
    'https://sports.yahoo.com/rss/',
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://feeds.bbci.co.uk/sport/cricket/rss.xml',
    'https://feeds.skysports.com/feeds/rss/home.xml',
  ],
  politics: [
    'https://feeds.bbci.co.uk/news/rss.xml',
    'https://rss.cnn.com/rss/edition.rss',
    'https://feeds.skynews.com/feeds/rss/home.xml',
    'https://feeds.reuters.com/Reuters/PoliticsNews',
    'https://feeds.reuters.com/reuters/worldNews',
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
  ]
};
const FALLBACK_IMAGES = {
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
};

async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const items = [...text.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, 10);
    if (items.length === 0) return null;

    const randomItem = items[Math.floor(Math.random() * Math.min(5, items.length))];
    const itemText = randomItem[0];

    const titleMatch = itemText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const descMatch = itemText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);

    const imageMatch =
      itemText.match(/url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/) ||
      itemText.match(/<media:content[^>]+url="([^"]+)"/) ||
      itemText.match(/<media:thumbnail[^>]+url="([^"]+)"/) ||
      itemText.match(/<enclosure[^>]+url="([^"]+\.(jpg|jpeg|png|webp)[^"]*)"/) ||
      itemText.match(/https?:\/\/[^\s"'<>]+\.(jpg|jpeg|png|webp)/i);

    const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : '';
    const description = descMatch ? (descMatch[1] || descMatch[2]).replace(/<[^>]*>/g, '').trim() : '';
    const image = imageMatch ? (imageMatch[1] || imageMatch[0]) : null;

    if (!title || title.length < 10) return null;

    return { title, description, image };
  } catch {
    return null;
  }
}

async function generateArticle(headline, description, category) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a senior journalist at Reuters or BBC News.
Based on this real news headline and description, write a professional news article.
Headline: "${headline}"
Description: "${description}"
Rewrite this completely in your own words. Do NOT copy the original text.
Write professionally like Reuters/BBC.
Do NOT mention AI, Claude, or that this was rewritten.
Return ONLY a JSON object with NO extra text or markdown.
Fields:
- title: (compelling headline, max 12 words, attention grabbing)
- summary: (3-4 sentences, professional journalism style, 100-150 words)
- prediction: (future outlook or analysis, written as expert view, 50 words)
- category: ("${category}")
- tag: (specific tag like "Trump", "Trade War", "NATO", "S&P 500", "Premier League", "NBA", "Crypto")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only.")`
    }]
  });

  const text = message.content[0].text;
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(clean);
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const financeSource = RSS_SOURCES.finance[Math.floor(Math.random() * RSS_SOURCES.finance.length)];
    const sportsSource = RSS_SOURCES.sports[Math.floor(Math.random() * RSS_SOURCES.sports.length)];
    const politicsSource = RSS_SOURCES.politics[Math.floor(Math.random() * RSS_SOURCES.politics.length)];

    const [financeRSS, sportsRSS, politicsRSS] = await Promise.all([
      fetchRSS(financeSource),
      fetchRSS(sportsSource),
      fetchRSS(politicsSource)
    ]);

    const results = [];
    const now = new Date().toISOString();

    for (const [rss, category] of [
      [financeRSS, 'finance'],
      [sportsRSS, 'sports'],
      [politicsRSS, 'politics']
    ]) {
      if (!rss) continue;
      const article = await generateArticle(rss.title, rss.description, category);
      results.push({
        title: article.title,
        summary: article.summary,
        prediction: article.prediction,
        category: article.category,
        tag: article.tag,
        image: rss.image || FALLBACK_IMAGES[category],
        sentiment: article.sentiment,
        confidence: article.confidence,
        disclaimer: article.disclaimer,
        pub_date: now,
        posted_at: now
      });
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'No RSS feeds returned data' });
    }

    const filteredResults = [];
for (const article of results) {
  const { data: existing } = await supabase
    .from('articles')
    .select('id')
    .ilike('title', `%${article.title.substring(0, 30)}%`)
    .limit(1);
  
  if (!existing || existing.length === 0) {
    filteredResults.push(article);
  }
}

if (filteredResults.length === 0) {
  return res.status(200).json({ message: 'No new articles to publish' });
}

const { error } = await supabase.from('articles').insert(filteredResults);
    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: results.length,
      published: results.map(a => ({ title: a.title, image: a.image }))
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
