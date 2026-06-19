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
    const titles = [...text.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g)]
      .map(m => m[1] || m[2])
      .filter(t => t && !t.includes('RSS') && !t.includes('Feed') && t.length > 10)
      .slice(0, 5);
    const descs = [...text.matchAll(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/g)]
      .map(m => m[1] || m[2])
      .filter(d => d && d.length > 20)
      .slice(0, 5);
    return { title: titles[0] || '', description: descs[0] || '' };
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
      content: `You are a senior journalist at Bloomberg or Reuters.
Based on this real news headline and description, write a professional news article.
Headline: "${headline}"
Description: "${description}"
Rewrite this completely in your own words. Do NOT copy the original text.
Write professionally like Bloomberg/Reuters.
Do NOT mention AI, Claude, or that this was rewritten.
Return ONLY a JSON object with NO extra text or markdown.
Fields:
- title: (compelling headline, max 12 words)
- summary: (3-4 sentences, professional journalism style, 100-150 words)
- prediction: (market outlook or match prediction, written as analyst view, 50 words)
- category: ("${category}")
- tag: (specific tag like "NFL", "S&P 500", "Premier League", "Crypto", "Tesla", "NBA")
- image_keyword: (2-3 words for finding relevant image e.g. "stock market chart", "football stadium")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only and does not constitute financial or betting advice.")`
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

    const [financeRSS, sportsRSS] = await Promise.all([
      fetchRSS(financeSource),
      fetchRSS(sportsSource)
    ]);

    if (!financeRSS || !sportsRSS) {
      return res.status(500).json({ error: 'Failed to fetch RSS feeds' });
    }

    const [financeArticle, sportsArticle] = await Promise.all([
      generateArticle(financeRSS.title, financeRSS.description, 'finance'),
      generateArticle(sportsRSS.title, sportsRSS.description, 'sports')
    ]);

    const now = new Date().toISOString();

    const { error } = await supabase.from('articles').insert([
      {
        title: financeArticle.title,
        summary: financeArticle.summary,
        prediction: financeArticle.prediction,
        category: financeArticle.category,
        tag: financeArticle.tag,
        image: `https://source.unsplash.com/800x500/?${encodeURIComponent(financeArticle.image_keyword)}`,
        sentiment: financeArticle.sentiment,
        confidence: financeArticle.confidence,
        disclaimer: financeArticle.disclaimer,
        pub_date: now,
        posted_at: now
      },
      {
        title: sportsArticle.title,
        summary: sportsArticle.summary,
        prediction: sportsArticle.prediction,
        category: sportsArticle.category,
        tag: sportsArticle.tag,
        image: `https://source.unsplash.com/800x500/?${encodeURIComponent(sportsArticle.image_keyword)}`,
        sentiment: sportsArticle.sentiment,
        confidence: sportsArticle.confidence,
        disclaimer: sportsArticle.disclaimer,
        pub_date: now,
        posted_at: now
      }
    ]);

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      published: [financeArticle.title, sportsArticle.title]
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
