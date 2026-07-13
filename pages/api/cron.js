import Anthropic from '@anthropic-ai/sdk';
import { slugify } from '../../lib/slugify';
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
}async function postToTelegram(article) {
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
}async function postToThreads(article) {
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

const RSS_SOURCES = {
  finance: [
    'https://news.google.com/rss/search?q=bitcoin+OR+crypto+OR+stocks+OR+nasdaq+OR+S%26P500+OR+inflation+OR+Fed&ceid=US:en&hl=en-US&gl=US',
    'https://cointelegraph.com/rss',
    'https://decrypt.co/feed',
    'https://www.coindesk.com/arc/outboundfeeds/rss/',
  ],
  sports: [
    'https://news.google.com/rss/search?q=NFL+OR+NBA+OR+soccer+OR+cricket+OR+tennis+OR+Premier+League+OR+UFC&ceid=US:en&hl=en-US&gl=US',
    'https://www.espn.com/espn/rss/news',
    'https://www.footballtransfers.com/en/rss',
  ],
  politics: [
    'https://news.google.com/rss/search?q=Trump+OR+Congress+OR+White+House+OR+elections+OR+Supreme+Court+OR+Senate&ceid=US:en&hl=en-US&gl=US',
    'https://www.aljazeera.com/xml/rss/all.xml',
    'https://thehill.com/feed',
    'https://www.politico.com/rss/politicopicks.xml',
  ],
  technology: [
    'https://news.google.com/rss/search?q=AI+OR+Apple+OR+Tesla+OR+Google+OR+Meta+OR+OpenAI+OR+ChatGPT&ceid=US:en&hl=en-US&gl=US',
    'https://www.theverge.com/rss/index.xml',
    'https://techcrunch.com/feed/',
  ]
};
const FALLBACK_IMAGES = {
  finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
};async function getPexelsImage(query) {
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

    const text = paragraphs.slice(0, 20).join(' ').substring(0, 5000);

    // Extract OG image from source article
    const ogMatch = result.html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
                    result.html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const ogImage = ogMatch ? (ogMatch[1] || ogMatch[2] || null) : null;

    return text.length > 150 ? { text, ogImage } : null;
  } catch {
    return null;
  }
}

function scoreRSSItem(title, description, pubDate) {
  let score = 0;

  // Recency scoring
  if (pubDate) {
    const ageMs = Date.now() - new Date(pubDate).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    if (ageHours > 6) return -999; // hard cutoff — disqualify immediately
    if (ageHours <= 2) score += 2; // recency bonus
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

      const score = scoreRSSItem(title, description, pubDate);
      if (score === -999) {
        console.log(`Skipped (stale >6hr): ${title}`);
        continue;
      }

      candidates.push({ title, description, image, sourceUrl: url, originalTitle: title, itemLink: itemLink || title, sourceName, pubDate, score });
    }

    if (candidates.length === 0) return null;

    // Return highest scoring candidate
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    console.log(`Best item (score ${best.score}): ${best.title}`);
    return best;

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
- Do NOT generate prediction, sentiment, or confidence fields. Only return: title, summary, keyPoints, category, tag, disclaimer.`,
    finance: `
- Start with a dateline in caps (e.g. "NEW YORK —", "WASHINGTON —", "LONDON —") based on the market or institution involved.
- Focus on: exact numbers (price, percentage move, market cap), who said what, what triggered the move, immediate market reaction.
- Write like a Bloomberg or CNBC reporter — precise, data-driven, authoritative.
- Include prediction, sentiment, and confidence fields.`,
    politics: `
- Start with a dateline in caps (e.g. "WASHINGTON —", "BRUSSELS —", "LONDON —") based on where the political event occurred.
- Focus on: who did what, the specific policy or decision, direct consequences, who opposes it, what happens next.
- Write like a CNN Politics or AP reporter — neutral, factual, no editorializing.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`,
    technology: `
- Start with a dateline in caps (e.g. "SAN FRANCISCO —", "CUPERTINO —", "SEATTLE —") based on where the company or event is located.
- Focus on: what was launched/announced, specific specs or numbers, who said what, how it compares to competitors, immediate user/market impact.
- Write like a Verge or TechCrunch reporter — clear, informed, forward-looking.
- Include a prediction field. Do NOT generate sentiment or confidence fields.`
  };

  const fieldsInstruction = {
    sports: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, scores, teams. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". Example: "Lakers Beat Celtics 112-108: LeBron Scores 34 in Playoff Win")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening. Example: "- Messi scored the equalizer in the 83rd minute.\\n- Argentina advances to the quarterfinals.\\n- Egypt's VAR appeal was denied by the referee.")
- summary: (full news article, 600-900 words, must contain at least 3 specific named facts from source — names, scores, stats, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Premier League", "NBA", "UFC", "Tennis", "Cricket")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    finance: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, numbers. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". Example: "Bitcoin Drops 5% to $62K After Fed Holds Interest Rates")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening. Example: "- Bitcoin fell 5% to $62,000 after the Fed held rates steady.\\n- Ethereum outperformed with a 2% gain during the same period.\\n- Analysts expect continued volatility through Q3.")
- summary: (full news article, 600-900 words, must contain at least 3 specific named facts from source — prices, percentages, names, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (future outlook or analysis, written as expert market view, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Bitcoin", "S&P 500", "Fed", "Inflation", "Crypto")
- sentiment: (either "positive", "negative", or "neutral")
- confidence: (number between 60-95)
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    politics: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include names, policies. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". Example: "Trump Signs Executive Order Banning TikTok: What It Means")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening. Example: "- Trump signed the order banning TikTok from US app stores.\\n- Congress has 90 days to pass legislation before the ban takes effect.\\n- ByteDance says it will challenge the order in court.")
- summary: (full news article, 600-900 words, must contain at least 3 specific named facts from source — names, decisions, votes, quotes. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (what happens next politically, written as neutral analysis, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Trump", "Congress", "Supreme Court", "NATO", "Senate")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`,
    technology: `Return ONLY a JSON object with these fields:
- title: (SEO-optimized headline, max 12 words, HARD LIMIT 100 characters. Write it the way someone would SEARCH for this story on Google. Include product/company names. HEADLINE RULES — all must apply: (1) Put the most recognizable entity in the first 5 words. (2) Include a specific number if the story has one — "Falls 8%" beats "Falls Sharply". (3) Use a change-of-state verb where possible: Falls, Surges, Wins, Loses, Dies, Launches, Bans, Hits, Ousts, Faces, Cuts, Raises, Resigns, Fires. (4) For public figures with health or age context, include age: "84-Year-Old Senator Says..." style. (5) Never start with vague openers like "New Report Shows", "Sources Say", "Report:", "Watch:", "Here's Why". Example: "OpenAI Launches GPT-5: Price, Features and Release Date")
- metaDescription: (SEO meta description, exactly 1 sentence, 140-155 characters, summarising the key fact — do NOT truncate mid-word)
- keyPoints: (exactly 3 bullet points separated by \\n, each ONE short sentence summarizing a key fact. Must be DIFFERENT from the article opening. Example: "- OpenAI released GPT-5 with 10x faster processing speed.\\n- The new model costs $30/month for Plus subscribers.\\n- Google and Anthropic are expected to respond within weeks.")
- summary: (full news article, 600-900 words, must contain at least 3 specific named facts from source — product names, specs, prices, quotes, dates. Start with dateline. Use \\n\\n between paragraphs. End with a "why this matters" paragraph.)
- prediction: (what this means for the tech industry or consumers, written as informed analysis, 60-80 words)
- category: MUST be exactly "${category}" — do not change this under any circumstances regardless of article content
- tag: (specific tag like "Apple", "AI", "Tesla", "Google", "OpenAI", "Meta", "ChatGPT")
- disclaimer: ("This article is for informational purposes only. Content is based on publicly available news sources.")`
  };

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `You are a senior journalist at a major international newsroom like CNN, BBC, or Reuters. Based on this real news headline and source material, write a professional news article.

Headline: "${headline}"
Source material: "${description}"
Source quality: ${description.length > 1000 ? 'Full article available — write a comprehensive 600-900 word article' : 'Limited source — write a focused 400-500 word article using only available facts, do not pad'}

ABSOLUTE RULES — violating any of these makes the article unpublishable:
- Write ONLY based on facts in the headline and source material. Do NOT invent quotes, statistics, names, or details.
- The first sentence MUST be a dateline followed by the single most important concrete fact. Example: "WASHINGTON — The Senate voted 52-48 on Thursday to confirm..."
- The article MUST contain at least 3 specific named facts from the source material (names, numbers, scores, quotes, dates, locations). If the source doesn't have 3 facts, use every fact it does have and keep the article short.
- Title MUST be optimized for Google Search — write headlines the way someone would search for this story. Include specific names, numbers, or outcomes people would type into Google. Example: instead of "Team wins game" write "Lakers Beat Celtics 112-108: LeBron Scores 34 in Playoff Victory"
- NEVER write generic background explaining what something generally is (e.g. "Executive orders are a tool presidents use...", "Small-cap stocks are companies with...", "The Supreme Court is the highest court..."). Only explain THIS specific event.
- NEVER start any sentence with these banned phrases: "In a move that", "This comes as", "It remains to be seen", "Only time will tell", "In today's", "In the world of", "The landscape of", "It's worth noting"
- NEVER use the phrase "the question remains" or "all eyes are on" or "sent shockwaves"
- Every paragraph must contain at least one specific fact — no paragraph should be pure commentary or filler
- Include ONE brief historical comparison or precedent (e.g. "The last time a company of this size filed similar claims was in 2020 when..." or "This marks only the second time since 2018 that..."). Keep it to one sentence and base it on real knowledge if possible.
- Match article length to available facts. If the source material is thin, write 400 words. Do NOT pad with filler to reach a word count.
- If the article is 350+ words, insert exactly ONE subheading after the 3rd paragraph. Format it on its own line as ## followed by the subheading text (e.g. "## Impact on Global Markets"). The subheading must be specific to THIS story — never generic like "## Background" or "## Analysis"
- End with a brief "why this matters" paragraph — connect it directly to the READER. Not "This sets a precedent for the industry" but "If you hold Bitcoin, this ruling could directly affect your portfolio" or "If you follow the Premier League, this transfer changes the title race." Make it personal and specific.
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
    const results = [];
    const now = new Date().toISOString();
    const authorNames = { sports: 'Sports Desk', finance: 'Markets Desk', politics: 'Politics Desk', technology: 'Tech Desk' };

    // Cross-source trending detection — fetch all sources first, find entities appearing in 2+ feeds
    const allFetchedItems = [];
    for (const category of ['finance', 'sports', 'politics', 'technology']) {
      for (const source of RSS_SOURCES[category]) {
        try {
          const rss = await fetchRSS(source);
          if (rss) allFetchedItems.push({ ...rss, category, source });
        } catch {}
      }
    }

    // Extract named entities (capitalized words 4+ chars) from each title
    function extractEntities(title) {
      return title.match(/\b[A-Z][a-z]{3,}\b/g) || [];
    }

    // Count how many feeds mention each entity
    const entityCounts = {};
    for (const item of allFetchedItems) {
      for (const entity of extractEntities(item.title)) {
        entityCounts[entity] = (entityCounts[entity] || 0) + 1;
      }
    }

    // Build trending bonus map — entity appears in 2+ feeds = trending
    function getTrendingBonus(title) {
      const entities = extractEntities(title);
      return entities.some(e => entityCounts[e] >= 2) ? 3 : 0;
    }

    for (const category of ['finance', 'sports', 'politics', 'technology']) {
      try {
        // Shuffle sources so we don't always try the same one first
        const sources = [...RSS_SOURCES[category]].sort(() => Math.random() - 0.5);
        let published = false;

        for (const source of sources) {
          if (published) break;

          const rss = await fetchRSS(source);
          if (!rss) continue;

          // Apply trending bonus from cross-source detection
          rss.score = (rss.score || 0) + getTrendingBonus(rss.title);
          if (getTrendingBonus(rss.title) > 0) {
            console.log(`Trending bonus applied to: ${rss.title}`);
          }

          // Duplicate detection
          const titleWords = rss.title.toLowerCase().split(' ').filter(w => w.length > 3).slice(0, 5).join('%');
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .or(`link.eq.${rss.itemLink},title.ilike.%${titleWords}%`)
            .limit(1);
          if (existing && existing.length > 0) {
            console.log(`Skipped ${category} (${source}): duplicate`);
            continue;
          }

          const fullArticle = await fetchFullArticle(rss.itemLink);
          const fullText = fullArticle?.text || null;
          const ogImage = fullArticle?.ogImage || null;
          const sourceMaterial = fullText || rss.description;

          // QUALITY GATE 1: thin source
          if (!fullText && rss.description.length < 200) {
            console.log(`Skipped ${category} (${source}): thin source (${rss.description.length} chars)`);
            continue;
          }

          const article = await generateArticle(rss.title, sourceMaterial, category);

          // Force correct category regardless of what Claude returned
          article.category = category;

          // QUALITY GATE 2: article too short
          const wordCount = article.summary?.trim().split(/\s+/).length || 0;
          if (wordCount < 300) {
            console.log(`Skipped ${category} (${source}): too short (${wordCount} words)`);
            continue;
          }

          // QUALITY GATE 3: filler detected
          if (!fullText && wordCount > 700) {
            console.log(`Skipped ${category} (${source}): filler detected (${wordCount} words)`);
            continue;
          }

          const pexelsQuery = `${article.tag} ${article.title.split(' ').slice(0, 3).join(' ')}`;
          const articleImage = ogImage || rss.image || await getPexelsImage(pexelsQuery) || FALLBACK_IMAGES[category];

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

          published = true;
          console.log(`Published ${category}: "${article.title}" from ${source}`);
        }

        if (!published) {
          console.log(`No article published for ${category} this run — all sources failed gates`);
        }

      } catch (categoryErr) {
        console.error(`Error processing ${category}:`, categoryErr.message);
        // Continue to next category — don't let one failure kill the run
      }
    }

    if (results.length === 0) {
      return res.status(200).json({ message: 'No new articles to publish this run' });
    }

const { data: insertedArticles, error } = await supabase.from('articles').insert(results).select();
if (error) throw error;

// Post to social media with actual article URLs
for (const inserted of (insertedArticles || [])) {
  const articleWithUrl = {
    ...inserted,
    articleUrl: `https://www.newsoracle.online/article/${inserted.id}-${slugify(inserted.title)}`
  };
  await Promise.all([
    postToTelegram(articleWithUrl),
    postToFacebook(articleWithUrl),
    postToThreads(articleWithUrl)
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

// Google Sitemap Ping — tell Google sitemap has been updated
try {
  await fetch('https://www.google.com/ping?sitemap=https://www.newsoracle.online/news-sitemap.xml');
  await fetch('https://www.google.com/ping?sitemap=https://www.newsoracle.online/sitemap.xml');
} catch (err) {
  console.error('Google ping error:', err);
}

// Google Indexing API — instantly notify Google to index new articles
try {
  const keyJson = JSON.parse(process.env.GOOGLE_INDEXING_KEY);
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: keyJson.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
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
    for (const url of articleUrls) {
      await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ url, type: 'URL_UPDATED' })
      });
    }
    console.log(`Google Indexing API: submitted ${articleUrls.length} URLs`);
  }
} catch (err) {
  console.error('Google Indexing API error:', err);
}

// PubSubHubbub — real-time notification to Google
try {
  await fetch('https://pubsubhubbub.appspot.com/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'hub.mode=publish&hub.url=' + encodeURIComponent('https://www.newsoracle.online/news-sitemap.xml')
  });
} catch (err) {
  console.error('PubSubHubbub error:', err);
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
