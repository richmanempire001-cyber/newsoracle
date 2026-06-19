import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const RSS_SOURCES = {
  finance: [
    'https://feeds.reuters.com/reuters/businessNews',
    'https://finance.yahoo.com/news/rssindex',
    'https://feeds.reuters.com/reuters/technologyNews',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://www.cnbc.com/id/10000664/device/rss/rss.html',
  ],
  sports: [
    'https://www.espn.com/espn/rss/news',
    'https://feeds.bbci.co.uk/sport/rss.xml',
    'https://feeds.bbci.co.uk/sport/football/rss.xml',
    'https://feeds.bbci.co.uk/sport/cricket/rss.xml',
    'https://feeds.bbci.co.uk/sport/tennis/rss.xml',
    'https://feeds.bbci.co.uk/sport/boxing/rss.xml',
    'https://www.skysports.com/rss/12040',
  ],
  politics: [
    'https://feeds.reuters.com/Reuters/PoliticsNews',
    'https://feeds.reuters.com/reuters/worldNews',
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml',
    'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
    'https://feeds.reuters.com/Reuters/domesticNews',
  ]
};

async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const items = [...text.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, 10);
    if (items.length === 0) return null;
    const randomItem = items[Math.floor(Math.random() * Math.min(5, items.length))];
    const titleMatch = randomItem[0].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
    const descMatch = randomItem[0].match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : '';
    const description = descMatch ? (descMatch[1] || descMatch[2]).replace(/<[^>]*>/g, '').trim() : '';
    if (!title || title.length < 10) return null;
    return { title, description };
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
- image_keyword: (2-3 words for finding relevant image e.g. "white house politics", "stock market", "football match")
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

    if (financeRSS) {
      const article = await generateArticle(financeRSS.title, financeRSS.description, 'finance');
      results.push({
        title: article.title,
        summary: article.summary,
        prediction: article.prediction,
        category: article.category,
        tag: article.tag,
        image: `https://source.unsplash.com/800x500/?${encodeURIComponent(article.image_keyword)}`,
        sentiment: article.sentiment,
        confidence: article.confidence,
        disclaimer: article.disclaimer,
        pub_date: new Date().toISOString(),
        posted_at: new Date().toISOString()
      });
    }

    if (sportsRSS) {
      const article = await generateArticle(sportsRSS.title, sportsRSS.description, 'sports');
      results.push({
        title: article.title,
        summary: article.summary,
        prediction: article.prediction,
        category: article.category,
        tag: article.tag,
        image: `https://source.unsplash.com/800x500/?${encodeURIComponent(article.image_keyword)}`,
        sentiment: article.sentiment,
        confidence: article.confidence,
        disclaimer: article.disclaimer,
        pub_date: new Date().toISOString(),
        posted_at: new Date().toISOString()
      });
    }

    if (politicsRSS) {
      const article = await generateArticle(politicsRSS.title, politicsRSS.description, 'politics');
      results.push({
        title: article.title,
        summary: article.summary,
        prediction: article.prediction,
        category: article.category,
        tag: article.tag,
        image: `https://source.unsplash.com/800x500/?${encodeURIComponent(article.image_keyword)}`,
        sentiment: article.sentiment,
        confidence: article.confidence,
        disclaimer: article.disclaimer,
        pub_date: new Date().toISOString(),
        posted_at: new Date().toISOString()
      });
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'No RSS feeds returned data' });
    }

    const { error } = await supabase.from('articles').insert(results);
    if (error) throw error;

    return res.status(200).json({
      success: true,
      count: results.length,
      published: results.map(a => a.title)
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
