import Anthropic from '@anthropic-ai/sdk';async function postToFacebook(article) {
  try {
    const message = `🔴 ${article.title}\n\n${article.summary?.substring(0, 200)}...\n\n🔗 Read more: https://newsoracle.online`;
   await fetch(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message,
        url: article.image,
        access_token: process.env.FACEBOOK_PAGE_TOKEN
      })
    });
  } catch (err) {
    console.error('Facebook error:', err);
  }
}async function postToTelegram(article) {
  try {
    const caption = `🔴 *${article.title}*\n\n${article.summary?.substring(0, 200)}...\n\n🔗 Read more: https://newsoracle.online`;
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        photo: article.image,
        caption: caption,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('Telegram error:', err);
  }
}async function postToThreads(article) {
  try {
    const text = `🔴 ${article.title}\n\n${article.summary?.substring(0, 200)}...\n\n🔗 Read more: https://newsoracle.online`;
    const containerRes = await fetch(`https://graph.threads.net/v1.0/${process.env.THREADS_USER_ID}/threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        media_type: 'IMAGE',
        image_url: article.image,
        text: text,
        access_token: process.env.THREADS_ACCESS_TOKEN
      })
    });
    const container = await containerRes.json();
    if (!container.id) return;
    await fetch(`https://graph.threads.net/v1.0/${process.env.THREADS_USER_ID}/threads_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: process.env.THREADS_ACCESS_TOKEN
      })
    });
  } catch (err) {
    console.error('Threads error:', err);
  }
}
async function postToInstagram(article) {
  try {
    const imageUrl = article.image;
    const caption = `🔴 ${article.title}\n\n${article.summary?.substring(0, 200)}...\n\n🔗 Read more: https://newsoracle.online`;
    const containerRes = await fetch(`https://graph.instagram.com/v21.0/${process.env.INSTAGRAM_USER_ID}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      })
    });
    const container = await containerRes.json();
    if (!container.id) return;
    await new Promise(resolve => setTimeout(resolve, 5000));
    await fetch(`https://graph.instagram.com/v21.0/${process.env.INSTAGRAM_USER_ID}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: container.id,
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN
      })
    });
  } catch (err) {
    console.error('Instagram error:', err);
  }
}
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const RSS_SOURCES = {
  finance: [
    'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
    'https://cointelegraph.com/rss',
  ],
  sports: [
    'https://news.google.com/rss/search?q=NFL+OR+NBA+OR+soccer+OR+cricket+OR+tennis+OR+Premier+League+OR+UFC&ceid=US:en&hl=en-US&gl=US',
    'https://www.espn.com/espn/rss/news',
  ],
  politics: [
    'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
    'https://www.aljazeera.com/xml/rss/all.xml',
  ]
};
const FALLBACK_IMAGES = {
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80'
};async function getPexelsImage(query) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
      headers: { Authorization: process.env.PEXELS_API_KEY }
    });
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      const random = data.photos[Math.floor(Math.random() * data.photos.length)];
      return random.src.large2x;
    }
    return null;
  } catch {
    return null;
  }
}

async function extractRealUrlFromGoogleWrapper(html) {
  const metaRefresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"'>]+)["']/i);
  if (metaRefresh) return metaRefresh[1];

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonical && !canonical[1].includes('news.google.com')) return canonical[1];

  const jsRedirect = html.match(/(?:window\.location|location\.href)\s*=\s*["']([^"']+)["']/i);
  if (jsRedirect) return jsRedirect[1];

  const dataNUrl = html.match(/data-n-au="([^"]+)"/i);
  if (dataNUrl) return dataNUrl[1];

  return null;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsOracleBot/1.0)' },
    redirect: 'follow'
  });
  if (!res.ok) return null;
  const html = await res.text();
  return { html, finalUrl: res.url };
}

async function fetchFullArticle(url) {
  try {
    let result = await fetchHtml(url);
    if (!result) return null;

    if (result.finalUrl.includes('news.google.com')) {
      const realUrl = await extractRealUrlFromGoogleWrapper(result.html);
      if (realUrl) {
        const secondResult = await fetchHtml(realUrl);
        if (secondResult) result = secondResult;
      }
    }

    const paragraphs = [...result.html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)]
      .map(m => m[1].replace(/<[^>]*>/g, '').trim())
      .filter(p => p.length > 40);

    const text = paragraphs.slice(0, 12).join(' ').substring(0, 3000);
    return text.length > 150 ? text : null;
  } catch {
    return null;
  }
}

async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const items = [...text.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, 10);
    if (items.length === 0) return null;

    for (let i = 0; i < Math.min(3, items.length); i++) {
      const itemText = items[i][0];

      const linkMatch = itemText.match(/<link>(.*?)<\/link>|<link[^>]*href="([^"]+)"/);
      const itemLink = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
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
      const sourceMatch = itemText.match(/<source[^>]*>(.*?)<\/source>/);
      const sourceName = sourceMatch ? sourceMatch[1].trim() : '';

      if (!title || title.length < 10) continue;
      if (!description || description.length < 100) continue;

      return { title, description, image, sourceUrl: url, originalTitle: title, itemLink: itemLink || title, sourceName };
    }
    return null;
  } catch {
    return null;
  }
}

async function generateArticle(headline, description, category) {
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `You are a professional news writer. Based on this real news headline and source material, write an engaging news article that people want to read and share.
Headline: "${headline}"
Source material: "${description}"

Rules:
- Write ONLY based on the facts in the headline and source material above
- Do NOT invent quotes, statistics, or details not mentioned
- Do NOT mention AI, Claude, or that this was rewritten
- Do NOT write generic background filler about how things "typically" work in general (e.g. explaining what an executive order is, how markets usually move). Only write about THIS specific event.
- The opening sentence must state the single most important concrete fact from the source material — not a generic introduction.
- Write in an engaging, easy-to-read style that attracts readers, mixing short punchy sentences with longer explanatory ones
- Use active voice and strong verbs
- Make it feel urgent and relevant
- End with a short "why this matters" paragraph giving the reader real context, not a vague summary
- Match the article length to how much real detail the source material actually supports — do not pad with filler to hit a word count
- If the source material contains a specific score, percentage, number, or direct quote — that fact MUST appear in the first paragraph. Never bury a concrete fact.
- Never explain what something generally is (e.g. what small-cap stocks are, how the Supreme Court works, what executive orders do). Only write about THIS specific event and its specific outcome.
- If the source material contains no specific numbers, scores, quotes or named outcomes, write a focused 200-word article about the single most concrete fact available. Do NOT pad with general context to reach a word count.

Return ONLY a JSON object with NO extra text or markdown.
Fields:
- title: (SEO-optimized headline, max 12 words, include the main keyword people would search for on Google, be specific with names, numbers, and locations)
- summary: (a full news article, written in engaging journalism style, length matched to available facts (roughly 250-500 words). Start with the strongest concrete fact. Cover the who, what, when, where, why. End with a brief "why this matters" close. Use paragraph breaks between each paragraph using \\n\\n)
- prediction: (future outlook or analysis, written as expert view, 60-80 words)
- category: ("${category}")
- tag: (specific tag like "Trump", "Trade War", "NATO", "S&P 500", "Premier League", "NBA", "Crypto")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`
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

      const titleWords = rss.title.toLowerCase().split(' ').filter(w => w.length > 4).slice(0, 3).join('%');
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .or(`link.eq.${rss.itemLink},title.ilike.%${titleWords}%`)
        .limit(1);
      if (existing && existing.length > 0) continue;

      const fullText = await fetchFullArticle(rss.itemLink);
      const sourceMaterial = fullText || rss.description;

      const article = await generateArticle(rss.title, sourceMaterial, category);
      results.push({
        link: rss.itemLink,
        source: rss.sourceName || '',
        title: article.title,
        summary: article.summary,
        prediction: article.prediction,
        category: article.category,
        tag: article.tag,
        image: await getPexelsImage(article.tag || article.category) || rss.image || FALLBACK_IMAGES[category],
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

    if (results.length === 0) {
  return res.status(200).json({ message: 'No new articles to publish' });
}

const { data: insertedArticles, error } = await supabase.from('articles').insert(results).select();
if (error) throw error;

for (const article of results) {
  await Promise.all([
    postToTelegram(article),
    postToFacebook(article),
    postToThreads(article)
  ]);
}

// IndexNow ping — notify Bing and Google instantly
try {
  const urls = (insertedArticles || []).map(a => `https://www.newsoracle.online/article/${a.id}`);
  await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'www.newsoracle.online',
      key: 'newsoracle2026bing',
      keyLocation: 'https://www.newsoracle.online/newsoracle2026bing.txt',
      urlList: urls
    })
  });
} catch (err) {
  console.error('IndexNow error:', err);
}

    return res.status(200).json({
      success: true,
      count: results.length,
      published: results.map(a => ({ title: a.title, image: a.image }))
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
