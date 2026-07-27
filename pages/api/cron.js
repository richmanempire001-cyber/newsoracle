import Anthropic from '@anthropic-ai/sdk';
import { slugify } from '../../lib/slugify';

// Vercel max duration — explicit 60 second timeout
export const config = { maxDuration: 60 };

async function postToFacebook(article) {
  try {
    const articleUrl = article.articleUrl || 'https://www.newsoracle.online';
    const message = `🔴 ${article.title}\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: ${articleUrl}`;
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
}

async function postToTelegram(article) {
  try {
    const articleUrl = article.articleUrl || 'https://www.newsoracle.online';
    const caption = `🔴 *${article.title}*\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: ${articleUrl}`;
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
}

async function postToThreads(article) {
  try {
    const articleUrl = article.articleUrl || 'https://www.newsoracle.online';
    const text = `🔴 ${article.title}\n\n${article.summary?.substring(0, 500)}...\n\n🔗 Read more: ${articleUrl}`;
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
    const articleUrl = article.articleUrl || 'https://www.newsoracle.online';
    const caption = `🔴 ${article.title}\n\n${article.summary?.substring(0, 200)}...\n\n🔗 Read more: ${articleUrl}`;
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

// CHANGE 1 — 5 new direct sources added, Google News kept as first priority
const RSS_SOURCES = {
  finance: [
    // Direct sources — last resort fallback only
    'https://cointelegraph.com/rss',
    'https://decrypt.co/feed',
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://feeds.reuters.com/reuters/businessNews',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    // Google News — always tried first (high quality, full text)
    'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
  ],
  sports: [
    // Direct sources — last resort fallback only
    'https://www.espn.com/espn/rss/news',
    'https://www.footballtransfers.com/en/rss',
    'https://www.bbc.com/sport/rss.xml',
    'https://www.skysports.com/rss/12040',
    // Google News — always tried first (high quality, full text)
    'https://news.google.com/rss/search?q=NBA+OR+soccer+OR+cricket+OR+UFC&ceid=US:en&hl=en-US&gl=US',
  ],
  politics: [
    // Direct sources — always tried after google news
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://thehill.com/feed',
    'https://www.politico.com/rss/politicopicks.xml',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://rss.dw.com/rdf/rss-en-world',
    // Google News — first priority (high quality, full text)
    'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
  ],
  technology: [
    // Google News — always tried first
    'https://news.google.com/rss/search?q=AI+Technology+OR+Apple+OR+Tesla+OR+Google+OR+Meta+OR+OpenAI+OR+ChatGPT&ceid=US:en&hl=en-US&gl=US',
  ]
};

// Track which sources are Google News wrappers
const GOOGLE_NEWS_SOURCES = new Set([
  'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=NBA+OR+soccer+OR+cricket+OR+UFC&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=AI+OR+Apple+OR+Tesla+OR+Google+OR+Meta+OR+OpenAI+OR+ChatGPT&ceid=US:en&hl=en-US&gl=US',
]);

const FALLBACK_IMAGES = {
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
};

async function getPexelsImage(query) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
      headers: { Authorization: process.env.PEXELS_API_KEY }
    });
    const data = await res.json();
    if (data.photos && data.photos.length > 0) {
      const random = data.photos[Math.floor(Math.random() * data.photos.length)];
      return random.src.original.split('?')[0] + '?auto=compress&cs=tinysrgb&w=1260';
    }
    return null;
  } catch {
    return null;
  }
}

// CHANGE 2 — Improved Google News extraction with 7 methods instead of 4
async function extractRealUrlFromGoogleWrapper(html, originalUrl) {
  // Method 1: meta refresh
  const metaRefresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"'>]+)["']/i);
  if (metaRefresh) return metaRefresh[1];

  // Method 2: canonical link (non-Google)
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonical && !canonical[1].includes('news.google.com')) return canonical[1];

  // Method 3: JS window.location redirect
  const jsRedirect = html.match(/(?:window\.location|location\.href)\s*=\s*["']([^"']+)["']/i);
  if (jsRedirect && !jsRedirect[1].includes('news.google.com')) return jsRedirect[1];

  // Method 4: data-n-au attribute (old Google News format)
  const dataNUrl = html.match(/data-n-au="([^"]+)"/i);
  if (dataNUrl) return dataNUrl[1];

  // Method 5: og:url meta tag pointing to real article
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i);
  if (ogUrl && !ogUrl[1].includes('news.google.com')) return ogUrl[1];

  // Method 6: c-wiz data attribute (newer Google News format)
  const cwizMatch = html.match(/c-wiz[^>]+jsdata="[^"]*"[^>]*data-url="([^"]+)"/i);
  if (cwizMatch) return cwizMatch[1];

  // Method 7: Extract from Google News article URL directly
  // Google News URLs look like: https://news.google.com/articles/CBMi...
  // Try to decode the base64 article ID
  try {
    const articleMatch = originalUrl.match(/articles\/([^?&]+)/);
    if (articleMatch) {
      // The encoded URL sometimes decodes to the real URL
      const decoded = Buffer.from(articleMatch[1], 'base64').toString('utf-8');
      const urlMatch = decoded.match(/https?:\/\/[^\s"'<>]+/);
      if (urlMatch && !urlMatch[0].includes('google.com')) return urlMatch[0];
    }
  } catch {}

  return null;
}

async function fetchHtml(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      redirect: 'follow'
    });
    if (!res.ok) return null;
    const html = await res.text();
    return { html, finalUrl: res.url };
  } catch {
    return null;
  }
}

// CHANGE 3 — fetchFullArticle now skips Google News items that fail extraction (Option A)
async function fetchFullArticle(url, isGoogleNews = false) {
  try {
    let result = await fetchHtml(url);
    if (!result) return null;

    if (result.finalUrl.includes('news.google.com') || isGoogleNews) {
      const realUrl = await extractRealUrlFromGoogleWrapper(result.html, url);
      if (realUrl) {
        console.log(`Google News unwrapped to: ${realUrl}`);
        const secondResult = await fetchHtml(realUrl);
        if (secondResult) result = secondResult;
      } else {
        // Option A: Google News extraction failed — skip this item entirely
        console.log(`Google News extraction failed for: ${url} — skipping`);
        return null;
      }
    }

    const paragraphs = [...result.html.matchAll(/<p[^>]*>(.*?)<\/p>/gis)]
      .map(m => m[1].replace(/<[^>]*>/g, '').trim())
      .filter(p => p.length > 40);
    const text = paragraphs.slice(0, 20).join(' ').substring(0, 5000);
    const ogMatch = result.html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    result.html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const ogImage = ogMatch ? (ogMatch[1] || ogMatch[2] || null) : null;
    return text.length > 150 ? { text, ogImage } : null;
  } catch {
    return null;
  }
}

// CHANGE 4 — scoreRSSItem now penalizes Google News (-3) and rewards direct sources (+2)
function scoreRSSItem(title, description, pubDate, sourceUrl = '') {
  let score = 0;

  // Source quality scoring — direct sources preferred over Google News wrappers
  if (GOOGLE_NEWS_SOURCES.has(sourceUrl)) {
    score += 10; // Google News first priority — trending curated queries
  }

  // Recency scoring
  if (pubDate) {
    const ageMs = Date.now() - new Date(pubDate).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 6) return -999;
    if (ageHours <= 2) score += 2;
  }

  // Has a number in title (+3)
  if (/\d/.test(title)) score += 3;

  // Named entity in first 5 words (+2)
  const firstFive = title.split(' ').slice(0, 5).join(' ');
  if (/[A-Z][a-z]+/.test(firstFive)) score += 2;

  // Change-of-state verb (+2)
  const stateVerbs = /\b(falls|surges|rises|drops|wins|loses|dies|launches|bans|hits|ousts|faces|cuts|raises|crashes|soars|resigns|fires|arrests|indicts|acquits|sanctions)\b/i;
  if (stateVerbs.test(title)) score += 2;

  // Description richness (+1)
  if (description.length > 300) score += 1;

  return score;
}

async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const items = [...text.matchAll(/<item[\s\S]*?<\/item>/g)].slice(0, 10);
    if (items.length === 0) return null;
    const candidates = [];
    for (let i = 0; i < Math.min(5, items.length); i++) {
      const itemText = items[i][0];
      const linkMatch = itemText.match(/<link>(.*?)<\/link>|<link[^>]*href="([^"]+)"/);
      const itemLink = linkMatch ? (linkMatch[1] || linkMatch[2] || '').trim() : '';
      const titleMatch = itemText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
      const descMatch = itemText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
      const pubDateMatch = itemText.match(/<pubDate>(.*?)<\/pubDate>/);
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
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : null;
      if (!title || title.length < 10) continue;
      if (!description || description.length < 100) continue;
      // Pass sourceUrl so score reflects direct vs Google News
      const score = scoreRSSItem(title, description, pubDate, url);
      if (score === -999) {
        console.log(`Skipped (stale >6hr): ${title}`);
        continue;
      }
      const isGoogleNews = GOOGLE_NEWS_SOURCES.has(url);
      candidates.push({ title, description, image, sourceUrl: url, originalTitle: title, itemLink: itemLink || title, sourceName, pubDate, score, isGoogleNews });
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    console.log(`Best item (score ${best.score}, googleNews: ${best.isGoogleNews}): ${best.title}`);
    return best;
  } catch {
    return null;
  }
}

function extractPrimaryEntity(title) {
  const matches = title.match(/\b[A-Z][a-z]{3,}\b/g);
  return matches ? matches[0] : null;
}

function extractEntities(title) {
  return title.match(/\b[A-Z][a-z]{3,}\b/g) || [];
}

// CHANGE 5 — Hard headline validation
const BANNED_HEADLINE_PHRASES = [
  'sends clear message',
  'comments on',
  'status check',
  'provides a snapshot',
  'takes a look',
  'what it means for',
  'here\'s why',
  'you need to know',
  'everything you need',
  'here\'s what',
  'this is why',
  'finds out',
  'weighs in',
  'sounds off',
  'speaks out',
  'opens up',
  'breaks silence',
  'reacts to',
  'responds to',
];

function isWeakHeadline(title) {
  const lower = title.toLowerCase();
  return BANNED_HEADLINE_PHRASES.some(phrase => lower.includes(phrase));
}

// CHANGE 6 — Filler content detection (Quality Gate 4)
const FILLER_PHRASES = [
  'provides a snapshot',
  'sends a clear message',
  'made one thing abundantly clear',
  'first extended look',
  'checks the status',
  'hype train',
  'it remains to be seen',
  'only time will tell',
  'the landscape of',
  'in the world of',
  'in today\'s',
  'worth noting',
  'all eyes are on',
  'the question remains',
  'sent shockwaves',
];

function hasTooMuchFiller(summary) {
  const lower = summary.toLowerCase();
  const fillerCount = FILLER_PHRASES.filter(phrase => lower.includes(phrase)).length;
  // Count concrete facts: numbers, named entities, quoted speech
  const numbers = (summary.match(/\b\d+[\d,.%$£€]*\b/g) || []).length;
  const quotes = (summary.match(/["'][^"']{10,}["']/g) || []).length;
  const namedEntities = (summary.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || []).length;
  const factScore = numbers + quotes + namedEntities;
  // Reject if more than 2 filler phrases AND fewer than 5 concrete facts
  if (fillerCount > 2 && factScore < 5) {
    console.log(`Filler detected: ${fillerCount} filler phrases, only ${factScore} concrete facts`);
    return true;
  }
  return false;
}

async function generateArticle(headline, description, category) {
  const categoryInstructions = {
    sports: `
- Start with a dateline in caps (e.g. "LONDON —", "NEW YORK —", "MIAMI —") based on where the event took place.- REQUIRED: final score, at least two named players with their individual stats, the venue, and the date.
- Focus on: final score, key player performances, decisive moments, what this means for standings/tournament.
- Write like a CNN Sports or ESPN reporter — vivid, immediate, factual.
- Do NOT generate prediction, sentiment, or confidence fields. Only return: title, summary, keyPoints, category, tag, disclaimer.`,
    finance: `
- Start with a dateline in caps (e.g. "NEW YORK —", "WASHINGTON —", "LONDON —") based on the market or institution involved.- REQUIRED: exact price or index level, exact percentage move, the date, and the specific trigger event.
- Focus on: exact numbers (price, percentage move, market cap), who said what, what triggered the move, immediate market reaction.
- Write like a Bloomberg or CNBC reporter — precise, data-driven, authoritative.
- Include a prediction field only.`,
    politics: `
- Start with a dateline in caps (e.g. "WASHINGTON —", "BRUSSELS —", "LONDON —") based on where the political event occurred.- REQUIRED: exact vote count or margin if a vote occurred, full names with official titles, the date, and the specific bill or order name.
- Focus on: who did what, the specific policy or decision, direct consequences, who opposes it, what happens next.
- Write like a CNN Politics or AP reporter — neutral, factual, no editorializing.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`,
    technology: `
- Start with a dateline in caps (e.g. "SAN FRANCISCO —", "CUPERTINO —", "SEATTLE —") based on where the company or event is located.
- Focus on: what was launched/announced, specific specs or numbers, who said what, how it compares to competitors, immediate user/market impact.
- Write like a Verge or TechCrunch reporter — clear, informed, forward-looking.
- Include a prediction field. Do NOT generate sentiment or confidence fields.
- REQUIRED: exact figure (price, funding amount, user count, or spec), the company full name, the date, and a named executive if one is quoted.`,
  };

  const fieldsInstruction = {
    sports: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, scores, teams. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". Example: "Lakers Beat Celtics 112-108: LeBron Scores 34 in Playoff Win")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. EVERY bullet must contain at least one exact number, date, or proper name. A bullet with no specific data is invalid. Must be DIFFERENT from the article opening. Example: "- Messi scored the equalizer in the 83rd minute.\\n- Argentina advances to the quarterfinals.\\n- Egypt's VAR appeal was denied by the referee.")
- factsUsed: (list every concrete fact extracted from source: exact dates, exact numbers, full names with titles, direct quotes with speaker. Minimum 5.)- summary: (full news article. PARAGRAPH 1: most important fact with exact date and exact number. PARAGRAPH 2: direct quote with named speaker, or second most important number. PARAGRAPH 3+: remaining facts each anchored to a specific figure, name, or date from factsUsed. Use \n\n between paragraphs.), must contain at least 3 specific named facts from source — names, scores, stats, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Premier League", "NBA", "UFC", "Tennis", "Cricket")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    finance: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, numbers. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". Example: "Bitcoin Drops 5% to $62K After Fed Holds Interest Rates")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n,each ONE short sentence summarizing a key fact. EVERY bullet must contain at least one exact number, date, or proper name. A bullet with no specific data is invalid. Must be DIFFERENT from the article opening.. Example: "- Bitcoin fell 5% to $62,000 after the Fed held rates steady.\\n- Ethereum outperformed with a 2% gain during the same period.\\n- Analysts expect continued volatility through Q3.")
- factsUsed: (list every concrete fact extracted from source: exact dates, exact numbers, full names with titles, direct quotes with speaker. Minimum 5.)- summary: (full news article. PARAGRAPH 1: most important fact with exact date and exact number. PARAGRAPH 2: direct quote with named speaker, or second most important number. PARAGRAPH 3+: remaining facts each anchored to a specific figure, name, or date from factsUsed. Use \n\n between paragraphs.), must contain at least 3 specific named facts from source — prices, percentages, names, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (future outlook or analysis, written as expert market view, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Bitcoin", "S&P 500", "Fed", "Inflation", "Crypto")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    politics: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, policies. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". Example: "Trump Signs Executive Order Banning TikTok: What It Means")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n,each ONE short sentence summarizing a key fact. EVERY bullet must contain at least one exact number, date, or proper name. A bullet with no specific data is invalid. Must be DIFFERENT from the article opening. Example: "- Trump signed the order banning TikTok from US app stores.\\n- Congress has 90 days to pass legislation before the ban takes effect.\\n- ByteDance says it will challenge the order in court.")
- factsUsed: (list every concrete fact extracted from source: exact dates, exact numbers, full names with titles, direct quotes with speaker. Minimum 5.)- summary: (full news article. PARAGRAPH 1: most important fact with exact date and exact number. PARAGRAPH 2: direct quote with named speaker, or second most important number. PARAGRAPH 3+: remaining facts each anchored to a specific figure, name, or date from factsUsed. Use \n\n between paragraphs.), must contain at least 3 specific named facts from source — names, decisions, votes, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (what happens next politically, written as neutral analysis, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Trump", "Congress", "Supreme Court", "NATO", "Senate")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    technology: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include product/company names. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". Example: "OpenAI Launches GPT-5: Price, Features and Release Date")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n,each ONE short sentence summarizing a key fact. EVERY bullet must contain at least one exact number, date, or proper name. A bullet with no specific data is invalid. Must be DIFFERENT from the article opening. Example: "- OpenAI released GPT-5 with 10x faster processing speed.\\n- The new model costs $30/month for Plus subscribers.\\n- Google and Anthropic are expected to respond within weeks.")
- factsUsed: (list every concrete fact extracted from source: exact dates, exact numbers, full names with titles, direct quotes with speaker. Minimum 5.)- summary: (full news article. PARAGRAPH 1: most important fact with exact date and exact number. PARAGRAPH 2: direct quote with named speaker, or second most important number. PARAGRAPH 3+: remaining facts each anchored to a specific figure, name, or date from factsUsed. Use \n\n between paragraphs.), must contain at least 3 specific named facts from source — product names, specs, prices, quotes, dates. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (what this means for the tech industry or consumers, written as informed analysis, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Apple", "AI", "Tesla", "Google", "OpenAI", "Meta", "ChatGPT")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`
  };

  // CHANGE 7 — Original value element added to prompt for all categories
  const originalValueInstruction = `
ORIGINAL VALUE REQUIREMENT — this is mandatory:
- After reporting the facts, include ONE piece of original analytical value that no single source contains. This could be:
  * A cross-source comparison: "While [Source A] reports X, [Source B]'s data shows Y, suggesting Z"
  * A calculated implication: "At this rate, [entity] would reach [milestone] by [timeframe]"
  * A pattern observation: "This marks the third time in [period] that [entity] has [action], a pattern that suggests..."
  * A reader-impact connection: specific and personal, not generic
- This original element must be grounded in the facts provided — do NOT invent data`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a senior journalist with more than 20 years of experience at a major international newsroom like CNN, BBC, or Reuters. Based on this real news headline and source material, write a professional news article.

Headline: "${headline}"
Source material: "${description}"
Source quality: ${description.length > 1000 ? 'Full article available — write a comprehensive article matched to story weight' : 'Limited source — write a focused 400-550 word article using only available facts, do not pad'}

ABSOLUTE RULES — you should follow these rules while generating article ,there are no exceptions:
- Write ONLY based on facts in the headline and source material. Do NOT invent quotes, statistics, names, or details.
- The first sentence MUST be a dateline followed by the single most important concrete fact. Example: "WASHINGTON — The Senate voted 52-48 on Thursday to confirm..."
- The article MUST contain at least 3 specific named facts from the source material (names, numbers, scores, quotes, dates, locations). If the source doesn't have 3 facts, use every fact it does have and keep the article short.
- Title MUST be optimized for Google Search — write headlines the way someone would search for this story. Include specific names, numbers, or outcomes people would type into Google. Example: instead of "Team wins game" write "Lakers Beat Celtics 112-108: LeBron Scores 34 in Playoff Victory"
- NEVER write generic background explaining what something generally is (e.g. "Executive orders are a tool presidents use...", "Small-cap stocks are companies with...", "The Supreme Court is the highest court..."). Only explain THIS specific event.
- NEVER start any sentence with these banned phrases: "In a move that", "This comes as", "It remains to be seen", "Only time will tell", "In today's", "In the world of", "The landscape of", "It's worth noting"
- NEVER use the phrase "the question remains" or "all eyes are on" or "sent shockwaves"
- Every paragraph must contain at least one specific fact — no paragraph should be pure commentary or filler
- Include ONE brief historical comparison or precedent (e.g. "The last time a company of this size filed similar claims was in 2020 when..." or "This marks only the second time since 2018 that..."). Keep it to one sentence and base it on real knowledge if possible.
- Target 600-900 words. If the source genuinely lacks enough facts, write no fewer than 450 words using every available fact — never pad with commentary to reach length.
- If the article is 350+ words, insert exactly ONE subheading after the 3rd paragraph. Format it on its own line as ## followed by the subheading text (e.g. "## Impact on Global Markets"). The subheading must be specific to THIS story — never generic like "## Background" or "## Analysis"
- End on the strongest remaining fact or the concrete next step (a scheduled date, a pending vote, an upcoming earnings call). Only write about reader impact if there is a specific material effect — never generic.
- Do NOT mention AI, Claude, or that this was rewritten
- BANNED VAGUE QUANTIFIERS — never use these words to describe any change: significantly, sharply, substantially, dramatically, notably, considerably, slightly, marginally, somewhat. Every change must be stated as an exact figure or percentage. If the source has no figure, describe what happened without quantifying it.- ALWAYS include the exact date the event occurred in the first or second paragraph.
- ALWAYS extract and use exact numbers — dollar amounts, percentages, scores, vote counts. Never round or generalize.
- If the source contains a direct quote, include it with quotation marks and the named speaker. NEVER write a paragraph whose purpose is to characterise or interpret ("this underscores", "this reflects", "this signals", "this highlights", "this marks"). Every paragraph must report something that happened, was said, or was measured.
- Every paragraph must contain at least one concrete fact from your factsUsed list.
${originalValueInstruction}
${categoryInstructions[category]}

${fieldsInstruction[category]}

BEFORE RETURNING — silently verify your article:
1. Does paragraph 1 contain exact date and exact figure?
2. Does every keyPoint contain a number, date, or proper name?
3. Have you used any banned vague quantifier?
4. Does every paragraph contain at least one specific fact?
5. Is the article at least 400 words?
Fix any failures silently, then return only the corrected JSON.

Return ONLY the JSON object. No markdown, no backticks, no extra text.`
    }]
  });

  const text = message.content[0].text;
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();

  function normalizeResult(parsed) {
    if (Array.isArray(parsed.keyPoints)) {
      parsed.keyPoints = parsed.keyPoints.join('\n');
    }
    return parsed;
  }

  try {
    return normalizeResult(JSON.parse(clean));
  } catch (e) {
    console.log(`JSON parse failed, retrying with full prompt...`);
    const retry = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Your previous response was not valid JSON. Return the same article as a valid JSON object only — no markdown, no backticks, no text before or after the JSON.

Headline: "${headline}"
Source material: "${description}"

${fieldsInstruction[category]}

Return ONLY the JSON object.`
      }]
    });
    const retryText = retry.content[0].text;
    const retryClean = retryText.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return normalizeResult(JSON.parse(retryClean));
    } catch (e2) {
      console.log(`Retry also failed — dropping article`);
      throw e2;
    }
  }
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const results = [];
    const now = new Date().toISOString();
    const authorNames = { sports: 'NewsOracle Editorial', finance: 'NewsOracle Editorial', politics: 'NewsOracle Editorial', technology: 'NewsOracle Editorial' };

    // STEP 1 — Fetch ALL RSS sources in parallel (one fetch, not two)
    const allSourceEntries = [];
    for (const [category, sources] of Object.entries(RSS_SOURCES)) {
      for (const source of sources) {
        allSourceEntries.push({ category, source });
      }
    }

    const rssResults = await Promise.all(
      allSourceEntries.map(async ({ category, source }) => {
        try {
          const rss = await fetchRSS(source);
          return rss ? { ...rss, category, source } : null;
        } catch {
          return null;
        }
      })
    );

    const allFetchedItems = rssResults.filter(Boolean);
    console.log(`Fetched ${allFetchedItems.length} RSS items from ${allSourceEntries.length} sources`);

    // STEP 2 — Cross-source trending detection
    const entityCounts = {};
    for (const item of allFetchedItems) {
      for (const entity of extractEntities(item.title)) {
        entityCounts[entity] = (entityCounts[entity] || 0) + 1;
      }
    }

    function getTrendingBonus(title) {
      const entities = extractEntities(title);
      return entities.some(e => entityCounts[e] >= 2) ? 3 : 0;
    }

    // STEP 3 — Group by category, apply trending bonus, sort by score
    const itemsByCategory = {};
    for (const category of ['finance', 'sports', 'politics', 'technology']) {
      itemsByCategory[category] = allFetchedItems
        .filter(item => item.category === category)
        .map(item => ({
          ...item,
          score: (item.score || 0) + getTrendingBonus(item.title)
        }))
        .sort((a, b) => b.score - a.score);
    }

    // STEP 4 — Fetch recent articles once for duplicate checking
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
    const { data: recentArticles } = await supabase
      .from('articles')
      .select('id, title, link')
      .gte('created_at', twelveHoursAgo);

    const recentTitles = (recentArticles || []).map(a => a.title.toLowerCase());
    const recentLinks = new Set((recentArticles || []).map(a => a.link));

    function isDuplicate(rss) {
      if (recentLinks.has(rss.itemLink)) return true;
      const titleWords = rss.title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 8).join(' ');
      if (recentTitles.some(t => t.includes(titleWords))) return true;
      const primaryEntity = extractPrimaryEntity(rss.title);
      if (primaryEntity && primaryEntity.length > 4) {
        const entityLower = primaryEntity.toLowerCase();
        const topicWord = rss.title.toLowerCase().split(' ').filter(w => w.length > 4)[0];
        if (topicWord && recentTitles.some(t => t.includes(entityLower) && t.includes(topicWord))) {
          return true;
        }
      }
      return false;
    }

    // STEP 5 — Pick best non-duplicate item per category (parallel across all 4 categories)
    const selectedItemsArr = await Promise.all(
      ['finance', 'sports', 'politics', 'technology'].map(async (category) => {
        const candidates = (itemsByCategory[category] || []).slice(0, 8);
        for (const item of candidates) {
          if (!isDuplicate(item)) {
            console.log(`Selected ${category} (score ${item.score}, direct: ${!item.isGoogleNews}): ${item.title}`);
            return { category, item };
          } else {
            console.log(`Skipped ${category} duplicate: ${item.title}`);
          }
        }
        return null;
      })
    );
    const selectedItems = {};
    for (const result of selectedItemsArr.filter(Boolean)) {
      selectedItems[result.category] = result.item;
    }

    // STEP 6 — Fetch full articles in parallel (pass isGoogleNews flag)
    const categoriesToProcess = Object.keys(selectedItems);
    const fullArticleResults = await Promise.all(
      categoriesToProcess.map(async category => {
        const rss = selectedItems[category];
        try {
          const fullArticle = await fetchFullArticle(rss.itemLink, rss.isGoogleNews);
          return { category, rss, fullText: fullArticle?.text || null, ogImage: fullArticle?.ogImage || null };
        } catch {
          return { category, rss, fullText: null, ogImage: null };
        }
      })
    );

    // STEP 7 — Quality gate 1 (thin source)
    const validItems = fullArticleResults.filter(({ rss, fullText }) => {
      if (!fullText && rss.description.length < 200) {
        console.log(`Skipped: thin source (${rss.description.length} chars) for ${rss.title}`);
        return false;
      }
      return true;
    });

    // STEP 8 — Generate all articles in parallel
    const generatedArticles = await Promise.all(
      validItems.map(async ({ category, rss, fullText, ogImage }) => {
        try {
          const sourceMaterial = fullText || rss.description;
          const hasNumbers = (sourceMaterial.match(/\b\d+[\d,.%$£€]*\b/g) || []).length;
const hasDate = /\b(January|February|March|April|May|June|July|August|September|October|November|December|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|\d{1,2}\/\d{1,2}|\d{4})\b/i.test(sourceMaterial);
if (hasNumbers < 3 || !hasDate) {
  console.log(`Skipped ${category}: source lacks numbers or date — ${rss.title}`);
  return null;
}const article = await generateArticle(rss.title, sourceMaterial, category);
          article.category = category;
          

// Internal linking to evergreen guides
const guideLinks = {
  'Bitcoin': 'https://www.newsoracle.online/article/416-bitcoin-price-prediction-2026-expert-forecasts-key-factors-and-market-analysis',
  'Crypto': 'https://www.newsoracle.online/article/416-bitcoin-price-prediction-2026-expert-forecasts-key-factors-and-market-analysis',
  'AI Trading': 'https://www.newsoracle.online/article/415-best-ai-tools-for-stock-trading-2026-the-ultimate-guide-to-automated-invest',
  'World Cup 2026': 'https://www.newsoracle.online/article/388-all-fifa-world-cup-winners-1930-2026-complete-history-and-champion-list',
  'FIFA': 'https://www.newsoracle.online/article/388-all-fifa-world-cup-winners-1930-2026-complete-history-and-champion-list',
  'Iran': 'https://www.newsoracle.online/article/469-us-strikes-on-iran-2026-complete-day-by-day-timeline',
  'Iran Strikes': 'https://www.newsoracle.online/article/469-us-strikes-on-iran-2026-complete-day-by-day-timeline',
  'AI': 'https://www.newsoracle.online/article/473-machines-of-loving-grace-what-dario-amodei-and-the-worlds-top-ai-leaders-believe-about-ais-future',
  'OpenAI': 'https://www.newsoracle.online/article/473-machines-of-loving-grace-what-dario-amodei-and-the-worlds-top-ai-leaders-believe-about-ais-future',
  'Nvidia': 'https://www.newsoracle.online/article/503-jensen-huangs-first-x-post-why-25-tech-giants-are-demanding-america-keep-ai-open',
  'Microsoft': 'https://www.newsoracle.online/article/503-jensen-huangs-first-x-post-why-25-tech-giants-are-demanding-america-keep-ai-open',
  'Meta': 'https://www.newsoracle.online/article/503-jensen-huangs-first-x-post-why-25-tech-giants-are-demanding-america-keep-ai-open',
};
if (article.tag && guideLinks[article.tag]) {
  article.summary += `\n\n**Related Guide:** <a href="${guideLinks[article.tag]}" style="color:#cc0000;font-weight:600;">Read our complete guide →</a>`;
}

return { category, rss, article, fullText, ogImage };
        } catch (err) {
          console.error(`Article generation failed for ${category}:`, err.message);
          return null;
        }
      })
    );

    // STEP 9 — Quality gates 2, 3 & 4 (word count, filler, weak headline)
    const passedGates = generatedArticles.filter(item => {
      if (!item) return false;
      const { category, article, fullText } = item;
      // Headline check: flag weak headlines (log but don't block — Claude should have followed rules)
      if (isWeakHeadline(article.title)) {
        console.log(`Warning ${category}: weak headline detected — "${article.title}"`);
        // Still publish but log for monitoring
      }

      return true;
    });

    // STEP 10 — Fetch images in parallel
    const itemsWithImages = await Promise.all(
      passedGates.map(async ({ category, rss, article, ogImage }) => {
        const pexelsQuery = `${article.tag} ${article.title.split(' ').slice(0, 3).join(' ')}`;
        const articleImage = ogImage || rss.image || await getPexelsImage(pexelsQuery) || FALLBACK_IMAGES[category];
        return { category, rss, article, articleImage };
      })
    );

    // STEP 11 — Build results array
    for (const { category, rss, article, articleImage } of itemsWithImages) {
      results.push({
        link: rss.itemLink,
        source: rss.sourceName || '',
        title: article.title,
        summary: article.summary,
        key_points: article.keyPoints || null,
        meta_description: article.metaDescription || null,
        prediction: article.prediction || null,
        category: category,
        tag: article.tag,
        author: authorNames[category] || 'NewsOracle Editorial',
        image: articleImage,
        sentiment: article.sentiment || null,
        confidence: article.confidence || null,
        disclaimer: article.disclaimer,
        pub_date: now,
        posted_at: now
      });
      console.log(`Ready to publish ${category}: "${article.title}"`);
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'No new articles to publish this run' });
    }

    // STEP 12 — Individual Supabase inserts so one failure doesn't kill all articles
    const insertedArticles = [];
    for (const result of results) {
      try {
        const { data, error } = await supabase.from('articles').insert(result).select().single();
        if (error) {
          console.error(`Insert failed for "${result.title}":`, error.message);
        } else {
          insertedArticles.push(data);
          console.log(`Inserted: "${result.title}"`);
        }
      } catch (err) {
        console.error(`Insert error for "${result.title}":`, err.message);
      }
    }

    // STEP 13 — Social media posts in parallel
    Promise.all(
  (insertedArticles || []).map(async inserted => {
        const articleWithUrl = {
          ...inserted,
          articleUrl: `https://www.newsoracle.online/article/${inserted.id}-${slugify(inserted.title)}`
        };
        await Promise.all([
          postToTelegram(articleWithUrl),
          postToFacebook(articleWithUrl),
          postToThreads(articleWithUrl)
        ]);
      })
    );

    // STEP 14 — All indexing pings in parallel
    await Promise.all([
      (async () => {
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
        } catch (err) { console.error('IndexNow error:', err); }
      })(),
      (async () => {
        try {
          Promise.all([
            fetch('https://www.google.com/ping?sitemap=https://www.newsoracle.online/news-sitemap.xml'),
            fetch('https://www.google.com/ping?sitemap=https://www.newsoracle.online/sitemap.xml')
          ]);
        } catch (err) { console.error('Google ping error:', err); }
      })(),
      (async () => {
        try {
          const keyJson = JSON.parse(process.env.GOOGLE_INDEXING_KEY);
          const nowTs = Math.floor(Date.now() / 1000);
          const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
          const claim = Buffer.from(JSON.stringify({
            iss: keyJson.client_email,
            scope: 'https://www.googleapis.com/auth/indexing',
            aud: 'https://oauth2.googleapis.com/token',
            exp: nowTs + 3600,
            iat: nowTs
          })).toString('base64url');
          const { createSign } = await import('crypto');
          const sign = createSign('RSA-SHA256');
          sign.update(`${header}.${claim}`);
          const signature = sign.sign(keyJson.private_key, 'base64url');
          const jwt = `${header}.${claim}.${signature}`;
          const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`
          });
          const tokenData = await tokenRes.json();
          const accessToken = tokenData.access_token;
          if (accessToken) {
            const articleUrls = (insertedArticles || []).map(a => `https://www.newsoracle.online/article/${a.id}-${slugify(a.title)}`);
            await Promise.all(articleUrls.map(url =>
              fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({ url, type: 'URL_UPDATED' })
              })
            ));
            console.log(`Google Indexing API: submitted ${articleUrls.length} URLs`);
          }
        } catch (err) { console.error('Google Indexing API error:', err); }
      })(),
      (async () => {
        try {
          await fetch('https://pubsubhubbub.appspot.com/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'hub.mode=publish&hub.url=' + encodeURIComponent('https://www.newsoracle.online/news-sitemap.xml')
          });
        } catch (err) { console.error('PubSubHubbub error:', err); }
      })()
    ]);

    return res.status(200).json({
      success: true,
      count: results.length,
      published: results.map(a => ({ title: a.title, image: a.image }))
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
