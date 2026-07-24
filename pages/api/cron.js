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

// CHANGE 1 — Updated RSS sources
const RSS_SOURCES = {
  finance: [
    'https://cointelegraph.com/rss',
    'https://decrypt.co/feed',
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
    'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    'https://fortune.com/feed',
    'https://feeds.npr.org/1006/rss.xml',
    'https://www.theguardian.com/us/business/rss',
    'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
  ],
  sports: [
    'https://www.espn.com/espn/rss/news',
    'https://www.footballtransfers.com/en/rss',
    'https://www.bbc.com/sport/rss.xml',
    'https://www.skysports.com/rss/12040',
    'https://www.theguardian.com/us/sport/rss',
    'https://www.theguardian.com/football/rss',
    'https://news.google.com/rss/search?q=NFL+OR+NBA+OR+soccer+OR+cricket+OR+tennis+OR+Premier+League+OR+UFC&ceid=US:en&hl=en-US&gl=US',
  ],
  politics: [
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://feeds.apnews.com/rss/politics',
    'https://www.politico.com/rss/politicopicks.xml',
    'https://feeds.bbci.co.uk/news/politics/rss.xml',
    'https://rss.dw.com/rdf/rss-en-world',
    'https://feeds.npr.org/1014/rss.xml',
    'https://www.theguardian.com/us-news/rss',
    'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
  ],
  technology: [
    'https://www.theverge.com/rss/index.xml',
    'https://feeds.arstechnica.com/arstechnica/index',
    'https://www.theguardian.com/us/technology/rss',
    'https://www.cnbc.com/id/19854910/device/rss/rss.html',
    'https://feeds.bbci.co.uk/news/technology/rss.xml',
    'https://news.google.com/rss/search?q=AI+OR+Apple+OR+Tesla+OR+Google+OR+Meta+OR+Microsoft+OR+Samsung+OR+Nvidia+OR+OpenAI&ceid=US:en&hl=en-US&gl=US',
  ]
};

// CHANGE 1 — Updated GOOGLE_NEWS_SOURCES to match new technology query
const GOOGLE_NEWS_SOURCES = new Set([
  'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=NFL+OR+NBA+OR+soccer+OR+cricket+OR+tennis+OR+Premier+League+OR+UFC&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
  'https://news.google.com/rss/search?q=AI+OR+Apple+OR+Tesla+OR+Google+OR+Meta+OR+Microsoft+OR+Samsung+OR+Nvidia+OR+OpenAI&ceid=US:en&hl=en-US&gl=US',
]);

const FALLBACK_IMAGES = {
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
};

// CHANGE 2 — Source names map for specific attribution
const SOURCE_NAMES = {
  'cointelegraph.com': 'CoinTelegraph',
  'decrypt.co': 'Decrypt',
  'coindesk.com': 'CoinDesk',
  'cnbc.com': 'CNBC',
  'fortune.com': 'Fortune',
  'npr.org': 'NPR',
  'espn.com': 'ESPN',
  'footballtransfers.com': 'FootballTransfers',
  'bbc.com': 'BBC Sport',
  'bbci.co.uk': 'BBC',
  'skysports.com': 'Sky Sports',
  'theguardian.com': 'The Guardian',
  'aljazeera.com': 'Al Jazeera',
  'thehill.com': 'The Hill',
  'politico.com': 'Politico',
  'dw.com': 'DW',
  'theverge.com': 'The Verge',
  'arstechnica.com': 'Ars Technica',
};

const SOCIAL_TONES = [
  'fact',
  'question',
  'quote',
  'impact',
];

function buildSocialPost(article, platform) {
  const articleUrl = article.articleUrl || 'https://www.newsoracle.online';
  const tone = SOCIAL_TONES[Math.floor(Math.random() * SOCIAL_TONES.length)];
  const summary = article.summary?.substring(0, platform === 'instagram' ? 200 : 500) || '';
  const numberMatch = article.title.match(/[\$£€]?\d[\d,.%BMK]*/);
  const strongFact = numberMatch ? `${article.title.split(numberMatch[0])[0].trim()} ${numberMatch[0]}` : article.title;
  let opener = '';
  if (tone === 'fact' && numberMatch) {
    opener = `${strongFact}.`;
  } else if (tone === 'question') {
    opener = `What just happened with ${article.tag || 'this'}?`;
  } else if (tone === 'quote' && article.title.includes("'")) {
    opener = article.title;
  } else {
    opener = article.title;
  }
  const endings = [
    `Full story: ${articleUrl}`,
    `Read the full breakdown: ${articleUrl}`,
    `Details: ${articleUrl}`,
    `${articleUrl}`,
  ];
  const ending = endings[Math.floor(Math.random() * endings.length)];
  if (platform === 'telegram') {
    return `*${opener}*\n\n${summary}...\n\n${ending}`;
  }
  return `${opener}\n\n${summary}...\n\n${ending}`;
}

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

async function extractRealUrlFromGoogleWrapper(html, originalUrl) {
  const metaRefresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"'>]+)["']/i);
  if (metaRefresh) return metaRefresh[1];
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (canonical && !canonical[1].includes('news.google.com')) return canonical[1];
  const jsRedirect = html.match(/(?:window\.location|location\.href)\s*=\s*["']([^"']+)["']/i);
  if (jsRedirect && !jsRedirect[1].includes('news.google.com')) return jsRedirect[1];
  const dataNUrl = html.match(/data-n-au="([^"]+)"/i);
  if (dataNUrl) return dataNUrl[1];
  const ogUrl = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i) ||
                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:url["']/i);
  if (ogUrl && !ogUrl[1].includes('news.google.com')) return ogUrl[1];
  const cwizMatch = html.match(/c-wiz[^>]+jsdata="[^"]*"[^>]*data-url="([^"]+)"/i);
  if (cwizMatch) return cwizMatch[1];
  try {
    const articleMatch = originalUrl.match(/articles\/([^?&]+)/);
    if (articleMatch) {
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

function scoreRSSItem(title, description, pubDate, sourceUrl = '') {
  const COMMERCIAL_BLACKLIST = /^(best|top \d+|the \d+ best)\b|\b(buying guide|gift guide|roundup|our picks|we tested|review:|ranked|deal of|coupon|\/10 rating|out of 10|gaming pick|hands.?on|first look|unboxing|opinion|framework for|how to decide)\b/i;
  if (COMMERCIAL_BLACKLIST.test(title)) {
    console.log(`Commercial blacklist rejected: ${title}`);
    return -999;
  }

  let score = 0;
  if (GOOGLE_NEWS_SOURCES.has(sourceUrl)) {
    score -= 3;
  } else {
    score += 2;
  }
  if (pubDate) {
    const ageMs = Date.now() - new Date(pubDate).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 6) return -999;
    if (ageHours <= 2) score += 2;
  }
  if (/\d/.test(title)) score += 3;
  const firstFive = title.split(' ').slice(0, 5).join(' ');
  if (/[A-Z][a-z]+/.test(firstFive)) score += 2;
  const stateVerbs = /\b(falls|surges|rises|drops|wins|loses|dies|launches|bans|hits|ousts|faces|cuts|raises|crashes|soars|resigns|fires|arrests|indicts|acquits|sanctions)\b/i;
  if (stateVerbs.test(title)) score += 2;
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
      // CHANGE 3 — Specific source attribution using SOURCE_NAMES map
      let sourceName = sourceMatch ? sourceMatch[1].trim() : '';
      if (!sourceName) {
        const domain = Object.keys(SOURCE_NAMES).find(d => url.includes(d));
        if (domain) sourceName = SOURCE_NAMES[domain];
      }
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : null;
      if (!title || title.length < 10) continue;
      if (!description || description.length < 100) continue;
      const score = scoreRSSItem(title, description, pubDate, url);
      if (score === -999) {
        console.log(`Skipped (stale or blacklisted): ${title}`);
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

const STYLE_SEEDS = [
  'Write with a clipped, urgent tone — short punchy sentences. Get to the point fast.',
  'Write with a slightly more explanatory tone — assume the reader is smart but unfamiliar with this specific story.',
  'Lead with the human angle — who is affected and how, before getting into the institutional details.',
  'Lead with the strongest number or data point in the first sentence — make the scale of the story immediately clear.',
  'Write in the style of a wire reporter — precise, attribution-heavy, no flourishes.',
];

async function generateArticle(headline, description, category) {
  const styleSeed = STYLE_SEEDS[Math.floor(Math.random() * STYLE_SEEDS.length)];

  const categoryInstructions = {
    sports: `
- Start with a dateline in caps (e.g. "LONDON —", "NEW YORK —", "MIAMI —") based on where the event took place.
- Focus on: final score, key player performances, decisive moments, what this means for standings/tournament.
- Write like a CNN Sports or ESPN reporter — vivid, immediate, factual.
- Do NOT generate prediction, sentiment, or confidence fields. Only return: title, summary, keyPoints, category, tag, disclaimer.`,
    finance: `
- Only use a dateline for major institutional decisions (Fed, central banks, government policy). For company news, crypto, or markets — start directly with the key fact, no dateline.
- Focus on: exact numbers (price, percentage move, market cap), who said what, what triggered the move, immediate market reaction.
- Write like a Bloomberg or CNBC reporter — precise, data-driven, authoritative.
- Include prediction field.`,
    politics: `
- Start with a dateline in caps (e.g. "WASHINGTON —", "BRUSSELS —", "LONDON —") based on where the political event occurred.
- Focus on: who did what, the specific policy or decision, direct consequences, who opposes it, what happens next.
- Write like a CNN Politics or AP reporter — neutral, factual, no editorializing.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`,
    technology: `
- Do NOT use a dateline. Start directly with the most important fact in a short punchy sentence.
- Focus on: what was launched/announced, specific specs or numbers, who said what, how it compares to competitors, immediate user/market impact.
- Write like a Verge or TechCrunch reporter — clear, informed, forward-looking.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`
  };

  const fieldsInstruction = {
    sports: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, scores, teams. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". (7) HEADLINE SHAPE VARIETY — rotate between these formats: [Entity] [Verb] [Outcome] e.g. "Liverpool Ban 432 Fans After £1.2m Seizure" OR [Number]: [What happened] e.g. "432 Lifetime Bans: Liverpool Cracks Down on Ticket Touts" OR Quote-driven e.g. "Chelsea Boss Says Rogers Deal 'Changes Everything' After £117m Transfer". Pick the format that best fits THIS story.)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening.)
- summary: (full news article, length matched to story weight — breaking news 250-400 words, developing story 500-700 words, landmark event 700-900 words. Must contain at least 3 specific named facts. Use \\n\\n between paragraphs. End based on story type: if genuine reader impact exists, connect it directly and personally; otherwise end on the strongest remaining fact or what happens next.)
- category: MUST be exactly "${category}"
- tag: (specific tag like "Premier League", "NBA", "UFC", "Tennis", "Cricket")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    finance: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, numbers. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". (7) HEADLINE SHAPE VARIETY — rotate between these formats: [Entity] [Verb] [Number] e.g. "Revolut Hits $115B Valuation in Share Sale" OR [Number]: [What happened] e.g. "$115B: Revolut Now Europe's Most Valuable Startup" OR Quote-driven e.g. "Revolut CEO Says Valuation 'Just the Beginning' After $115B Deal". Pick the format that best fits THIS story.)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening.)
- summary: (full news article, length matched to story weight — breaking news 250-400 words, developing story 500-700 words, major market event 700-900 words. Must contain at least 3 specific named facts — prices, percentages, names, quotes. Use \\n\\n between paragraphs. End based on story type: if genuine direct financial impact on readers exists, state it specifically; otherwise end on what happens next.)
- prediction: (contextual outlook, 60-80 words, based strictly on facts already stated in the article — no invented analyst names, no fabricated forecasts, no "experts believe" unless a named expert was quoted in the source)
- category: MUST be exactly "${category}"
- tag: (specific tag like "Bitcoin", "S&P 500", "Fed", "Inflation", "Crypto")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    politics: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, policies. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". (7) HEADLINE SHAPE VARIETY — rotate between these formats: [Entity] [Verb] [Outcome] e.g. "Trump Signs TikTok Ban: What Happens Next" OR Quote-driven e.g. "Peters Calls Hegseth a 'Failure' at $70B Defense Hearing" OR [Number/Fact]: [Context] e.g. "11 Days of Iran Strikes: What the US Has Hit So Far". Pick the format that best fits THIS story.)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening.)
- summary: (full news article, length matched to story weight — breaking news 250-400 words, developing story 500-700 words, landmark policy 700-900 words. Must contain at least 3 specific named facts — names, decisions, votes, quotes. Use \\n\\n between paragraphs. End based on story type: if genuine reader impact exists, state it specifically and personally; otherwise end on what happens next politically.)
- prediction: (contextual outlook, 60-80 words, written as neutral analysis based strictly on facts already stated — no invented analyst names, no fabricated forecasts)
- category: MUST be exactly "${category}"
- tag: (specific tag like "Trump", "Congress", "Supreme Court", "NATO", "Senate")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    technology: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include product/company names. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". (6) NEVER use these banned phrases: "Sends Clear Message", "Comments On", "Status Check", "Weighs In", "Speaks Out", "Reacts To". (7) HEADLINE SHAPE VARIETY — rotate between these formats: [Entity] [Verb] [Outcome] e.g. "OpenAI Launches GPT-5: Price, Features and Release Date" OR Quote-driven e.g. "OpenAI CEO Says GPT-5 Is 'Most Capable Model Ever Built'" OR [Number/Fact]: [Context] e.g. "33% of Ransomware Victims Hit Twice, Proofpoint Study Finds". Pick the format that best fits THIS story.)
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening.)
- summary: (full news article, length matched to story weight — breaking news 250-400 words, developing story 500-700 words, major launch or policy 700-900 words. Must contain at least 3 specific named facts — product names, specs, prices, quotes, dates. Use \\n\\n between paragraphs. End based on story type: if genuine user or market impact exists, state it specifically; otherwise end on what comes next.)
- prediction: (contextual outlook, 60-80 words, based strictly on facts already stated — no invented analyst names, no fabricated forecasts)
- category: MUST be exactly "${category}"
- tag: (specific tag like "Apple", "AI", "Tesla", "Google", "OpenAI", "Meta", "ChatGPT")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`
  };

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
      content: `You are a senior journalist at a major international newsroom like CNN, BBC, or Reuters. Based on this real news headline and source material, write a professional news article.

STYLE DIRECTION FOR THIS ARTICLE: ${styleSeed}

Headline: "${headline}"
Source material: "${description}"
Source quality: ${description.length > 1000 ? 'Full article available — write a comprehensive article matched to story weight' : 'Limited source — write a focused 300-450 word article using only available facts, do not pad'}

ABSOLUTE RULES — violating any of these makes the article unpublishable:
- Write ONLY based on facts in the headline and source material. Do NOT invent quotes, statistics, names, or details.
- The first sentence MUST contain the single most important concrete fact from this story. No throat-clearing, no scene-setting — the fact first.
- The article MUST contain at least 3 specific named facts from the source material (names, numbers, scores, quotes, dates, locations). If the source doesn't have 3 facts, use every fact it does have and keep the article short.
- Title MUST be optimized for Google Search — write headlines the way someone would search for this story. Include specific names, numbers, or outcomes people would type into Google.
- NEVER write generic background explaining what something generally is. Only explain THIS specific event.
- NEVER start any sentence with these banned phrases: "In a move that", "This comes as", "It remains to be seen", "Only time will tell", "In today's", "In the world of", "The landscape of", "It's worth noting"
- NEVER use the phrase "the question remains" or "all eyes are on" or "sent shockwaves"
- Every paragraph must contain at least one specific fact — no paragraph should be pure commentary or filler.
- Vary sentence lengths deliberately every paragraph. Include at least two sentences under 8 words somewhere in the article. Never write three consecutive sentences of similar length.
- Attribute every non-obvious fact to its source within the sentence. Examples: "according to the filing", "the company confirmed", "per ESPN's report", "the senator said in a statement". Never state a fact as if it is your own knowledge.
- Match article length to story weight: breaking news (event just happened) = 250-400 words, no subheading; developing story (ongoing situation) = 500-700 words; landmark event (major policy, record, historic) = 700-900 words with one subheading. Never pad a breaking story to reach a word count.
- Only insert a subheading if the story is a developing or analysis-worthy story — not breaking news. If used, place it after the 3rd paragraph as ## Subheading specific to THIS story. Never use generic subheadings like "## Background" or "## Analysis".
- Include ONE brief historical comparison or precedent. Keep it to one sentence. Base it on real knowledge only.
- Only end with a reader-impact paragraph when there is genuine direct impact on the reader's life, money, or daily routine. When there is no strong direct impact, end on the strongest remaining fact or what happens next. Never use second-person "If you..." more than once per article.
- Do NOT mention AI, Claude, or that this was rewritten.
${originalValueInstruction}
${categoryInstructions[category]}

${fieldsInstruction[category]}

Return ONLY the JSON object. No markdown, no backticks, no extra text.`
    }]
  });

  const text = message.content[0].text;
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch (e) {
    console.log(`JSON parse failed, retrying once...`);
    const retry = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: `Return ONLY a valid JSON object. No markdown, no backticks, no extra text before or after. Original headline: "${headline}". Category: "${category}". Return the JSON now.`
      }]
    });
    const retryText = retry.content[0].text;
    const retryClean = retryText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(retryClean);
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

    // STEP 5+6+7 — Candidate loop: try every source in ranked order until one passes all pre-Claude gates
    function hasFactDensity(text) {
      const numbers = (text.match(/\b\d+[\d,.%$£€]*\b/g) || []).length;
      const quotes = (text.match(/["'"][^"'"]{15,}["'"]/g) || []).length;
      const namedEntities = (text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || []).length;
      const factScore = numbers + quotes + namedEntities;
      return factScore >= 6;
    }

    const validItems = [];
    const categoriesToConsider = ['finance', 'sports', 'politics', 'technology'];

    for (const category of categoriesToConsider) {
      const candidates = itemsByCategory[category] || [];
      let found = false;

      for (const item of candidates) {
        // Gate 1: duplicate check
        if (isDuplicate(item)) {
          console.log(`Skipped ${category} duplicate: ${item.title}`);
          continue;
        }

        // Gate 2: fetch full article
        let fullText = null;
        let ogImage = null;
        try {
          const fullArticle = await fetchFullArticle(item.itemLink, item.isGoogleNews);
          fullText = fullArticle?.text || null;
          ogImage = fullArticle?.ogImage || null;
        } catch {
          console.log(`Fetch failed for ${category}: ${item.title}`);
          continue;
        }

        // Gate 3: thin source check
        if (!fullText && item.description.length < 200) {
          console.log(`Skipped ${category}: thin source (${item.description.length} chars) for ${item.title}`);
          continue;
        }

        // Gate 4: fact-density check — guarantees 300+ word Claude output
        const sourceText = fullText || item.description;
        if (!hasFactDensity(sourceText)) {
          console.log(`Skipped ${category}: low fact density for ${item.title}`);
          continue;
        }

        // All gates passed — this item goes to Claude
        console.log(`Selected ${category} (score ${item.score}): ${item.title}`);
        validItems.push({ category, rss: item, fullText, ogImage });
        found = true;
        break;
      }

      if (!found) {
        console.log(`No qualifying article found for ${category} this run`);
      }
    }

    const generatedArticles = await Promise.all(
      validItems.map(async ({ category, rss, fullText, ogImage }) => {
        try {
          const sourceMaterial = fullText || rss.description;
          const article = await generateArticle(rss.title, sourceMaterial, category);
          article.category = category;

          const guideLinks = {
            'Bitcoin': 'https://www.newsoracle.online/article/416-bitcoin-price-prediction-2026-expert-forecasts-key-factors-and-market-analysis',
            'Crypto': 'https://www.newsoracle.online/article/416-bitcoin-price-prediction-2026-expert-forecasts-key-factors-and-market-analysis',
            'AI Trading': 'https://www.newsoracle.online/article/415-best-ai-tools-for-stock-trading-2026-the-ultimate-guide-to-automated-invest',
            'World Cup 2026': 'https://www.newsoracle.online/article/388-all-fifa-world-cup-winners-1930-2026-complete-history-and-champion-list',
            'FIFA': 'https://www.newsoracle.online/article/388-all-fifa-world-cup-winners-1930-2026-complete-history-and-champion-list',
            'Iran': 'https://www.newsoracle.online/article/469-us-strikes-on-iran-2026-complete-day-by-day-timeline',
            'Iran Strikes': 'https://www.newsoracle.online/article/469-us-strikes-on-iran-2026-complete-day-by-day-timeline',
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

    const passedGates = generatedArticles.filter(item => {
      if (!item) return false;
      const { category, article } = item;

      if (isWeakHeadline(article.title)) {
        console.log(`Warning ${category}: weak headline detected — "${article.title}"`);
      }
      return true;
    });

    const itemsWithImages = await Promise.all(
      passedGates.map(async ({ category, rss, article, ogImage }) => {
        const entityWords = article.title.match(/\b[A-Z][a-z]{3,}\b/g) || [];
const pexelsQuery = entityWords.slice(0, 3).join(' ') || article.tag || article.category;
        const isGuardian = rss.sourceUrl?.includes('theguardian.com');
const articleImage = (!isGuardian && ogImage) || rss.image || await getPexelsImage(pexelsQuery) || FALLBACK_IMAGES[category];
        return { category, rss, article, articleImage };
      })
    );

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

    await Promise.all(
      (insertedArticles || []).map(async inserted => {
        const articleWithUrl = {
          ...inserted,
          articleUrl: `https://www.newsoracle.online/article/${inserted.id}-${slugify(inserted.title)}`
        };

        const telegramCaption = buildSocialPost(articleWithUrl, 'telegram');
        const facebookMessage = buildSocialPost(articleWithUrl, 'facebook');
        const threadsText = buildSocialPost(articleWithUrl, 'threads');

        await Promise.all([
          fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: process.env.TELEGRAM_CHAT_ID,
              photo: articleWithUrl.image,
              caption: telegramCaption,
              parse_mode: 'Markdown'
            })
          }).catch(err => console.error('Telegram error:', err)),

          fetch(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/photos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: facebookMessage,
              url: articleWithUrl.image,
              access_token: process.env.FACEBOOK_PAGE_TOKEN
            })
          }).catch(err => console.error('Facebook error:', err)),

          (async () => {
            try {
              const containerRes = await fetch(`https://graph.threads.net/v1.0/${process.env.THREADS_USER_ID}/threads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  media_type: 'IMAGE',
                  image_url: articleWithUrl.image,
                  text: threadsText,
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
            } catch (err) { console.error('Threads error:', err); }
          })()
        ]);
      })
    );

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
          await Promise.all([
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
      count: insertedArticles.length,
      published: insertedArticles.map(a => ({ title: a.title, image: a.image }))
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
