import Anthropic from '@anthropic-ai/sdk';
import { slugify } from '../../lib/slugify';
async function postToFacebook(article) {
  try {
    const message = `🔴 ${article.title}\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: https://www.newsoracle.online`;
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
    const caption = `🔴 *${article.title}*\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: https://www.newsoracle.online`;
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
    const text = `🔴 ${article.title}\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: https://www.newsoracle.online`;
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
  const categoryInstructions = {
    sports: `
- Start with a dateline in caps (e.g. "LONDON —", "NEW YORK —", "MIAMI —") based on where the event took place.
- Focus on: final score, key player performances, decisive moments, what this means for standings/tournament.
- Write like a CNN Sports or ESPN reporter — vivid, immediate, factual.
- Do NOT generate prediction, sentiment, or confidence fields. Only return: title, summary, category, tag, disclaimer.`,
    finance: `
- Start with a dateline in caps (e.g. "NEW YORK —", "WASHINGTON —", "LONDON —") based on the market or institution involved.
- Focus on: exact numbers (price, percentage move, market cap), who said what, what triggered the move, immediate market reaction.
- Write like a Bloomberg or CNBC reporter — precise, data-driven, authoritative.
- Include prediction, sentiment, and confidence fields.`,
    politics: `
- Start with a dateline in caps (e.g. "WASHINGTON —", "BRUSSELS —", "LONDON —") based on where the political event occurred.
- Focus on: who did what, the specific policy or decision, direct consequences, who opposes it, what happens next.
- Write like a CNN Politics or AP reporter — neutral, factual, no editorializing.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`
  };

  const fieldsInstruction = {
    sports: `Return ONLY a JSON object with these fields:
- title: (SEO headline, max 12 words, must include specific names/scores/teams people would search for)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- summary: (full news article, 350-600 words, must contain at least 3 specific named facts from source — names, scores, stats, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- category: ("${category}")
- tag: (specific tag like "Premier League", "NBA", "UFC", "Tennis", "Cricket")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    finance: `Return ONLY a JSON object with these fields:
- title: (SEO headline, max 12 words, must include specific names/numbers people would search for)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- summary: (full news article, 350-600 words, must contain at least 3 specific named facts from source — prices, percentages, names, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (future outlook or analysis, written as expert market view, 60-80 words)
- category: ("${category}")
- tag: (specific tag like "Bitcoin", "S&P 500", "Fed", "Inflation", "Crypto")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    politics: `Return ONLY a JSON object with these fields:
- title: (SEO headline, max 12 words, must include specific names/policies people would search for)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- summary: (full news article, 350-600 words, must contain at least 3 specific named facts from source — names, decisions, votes, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (what happens next politically, written as neutral analysis, 60-80 words)
- category: ("${category}")
- tag: (specific tag like "Trump", "Congress", "Supreme Court", "NATO", "Senate")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`
  };

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 2048,
    messages: [{
      role: 'user',
      content: `You are a senior journalist at a major international newsroom like CNN, BBC, or Reuters. Based on this real news headline and source material, write a professional news article.

Headline: "${headline}"
Source material: "${description}"

ABSOLUTE RULES — violating any of these makes the article unpublishable:
- Write ONLY based on facts in the headline and source material. Do NOT invent quotes, statistics, names, or details.
- The first sentence MUST be a dateline followed by the single most important concrete fact. Example: "WASHINGTON — The Senate voted 52-48 on Thursday to confirm..."
- The article MUST contain at least 3 specific named facts from the source material (names, numbers, scores, quotes, dates, locations). If the source doesn't have 3 facts, use every fact it does have and keep the article short.
- NEVER write generic background explaining what something generally is (e.g. "Executive orders are a tool presidents use...", "Small-cap stocks are companies with...", "The Supreme Court is the highest court..."). Only explain THIS specific event.
- NEVER start any sentence with these banned phrases: "In a move that", "This comes as", "It remains to be seen", "Only time will tell", "In today's", "In the world of", "The landscape of", "It's worth noting"
- NEVER use the phrase "the question remains" or "all eyes are on" or "sent shockwaves"
- Every paragraph must contain at least one specific fact — no paragraph should be pure commentary or filler
- Match article length to available facts. If the source material is thin, write 250 words. Do NOT pad with filler to reach a word count.
- If the article is 350+ words, insert exactly ONE subheading after the 3rd paragraph. Format it on its own line as ## followed by the subheading text (e.g. "## Impact on Global Markets"). The subheading must be specific to THIS story — never generic like "## Background" or "## Analysis"
- End with a brief "why this matters" paragraph — one specific consequence, not a vague summary
- Do NOT mention AI, Claude, or that this was rewritten
${categoryInstructions[category]}

${fieldsInstruction[category]}

Return ONLY the JSON object. No markdown, no backticks, no extra text.`
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

      // QUALITY GATE 1: Skip if no full article AND RSS description is too thin
      if (!fullText && rss.description.length < 300) {
        console.log(`Skipped ${category}: thin source (${rss.description.length} chars, no full article)`);
        continue;
      }

      const article = await generateArticle(rss.title, sourceMaterial, category);

      // QUALITY GATE 2: Skip if generated article is under 250 words
      const wordCount = article.summary?.trim().split(/\s+/).length || 0;
      if (wordCount < 250) {
        console.log(`Skipped ${category}: article too short (${wordCount} words)`);
        continue;
      }

      // QUALITY GATE 3: Skip if no full article but Claude padded over 400 words (filler detected)
      if (!fullText && wordCount > 400) {
        console.log(`Skipped ${category}: filler detected (${wordCount} words from thin source)`);
        continue;
      }

      const authorNames = { sports: 'Sports Desk', finance: 'Markets Desk', politics: 'Politics Desk' };

      results.push({
        link: rss.itemLink,
        source: rss.sourceName || '',
        title: article.title,
        summary: article.summary,
        meta_description: article.metaDescription || null,
        prediction: article.prediction || null,
        category: category,
        tag: article.tag,
        author: authorNames[category] || 'NewsOracle Editorial',
        image: await getPexelsImage(article.tag || article.category) || rss.image || FALLBACK_IMAGES[category],
        sentiment: article.sentiment || null,
        confidence: article.confidence || null,
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
  const urls = (insertedArticles || []).map(a => `https://www.newsoracle.online/article/${a.id}-${slugify(a.title)}`);
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
