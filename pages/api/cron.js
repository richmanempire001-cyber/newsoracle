export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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

  try {
    const allArticles = [];
    for (const source of RSS_SOURCES) {
      try {
        const r = await fetch(source.url);
        const xml = await r.text();
        const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);
        for (const match of matches) {
          const item = match[1];
          const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/)?.[1]?.trim();
          const link = item.match(/<link[^>]*>(.*?)<\/link>/)?.[1]?.trim();
          const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();
          const description = item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.replace(/<[^>]+>/g, "").slice(0, 400).trim();
          if (title && link) allArticles.push({ title, link, pubDate: pubDate || new Date().toISOString(), description: description || "", category: source.category, tag: source.tag });
        }
      } catch { continue; }
    }

    const existingRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles?select=link&order=posted_at.desc&limit=100`, {
      headers: { "apikey": process.env.SUPABASE_KEY, "Authorization": `Bearer ${process.env.SUPABASE_KEY}` }
    });
    const existing = await existingRes.json();
    const existingLinks = new Set(Array.isArray(existing) ? existing.map(a => a.link) : []);
    const newArticles = allArticles.filter(a => !existingLinks.has(a.link)).slice(0, 8);

    let published = 0;
    for (const article of newArticles) {
      try {
        const isSports = article.category === "Sports";
        const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 800,
            messages: [{ role: "user", content: `You are a senior news editor. Analyze this article and return ONLY valid JSON with no markdown:\n{\n"summary":"3 factual sentences",\n"prediction":"${isSports ? "2 sentences on likely outcomes" : "2 sentences market analysis"}",\n"confidence":75,\n"sentiment":"${isSports ? "bullish" : "neutral"}"\n}\n\nTitle: ${article.title}\nContent: ${article.description}` }]
          })
        });
        const claudeData = await claudeRes.json();
        if (claudeData.error) continue;
        const parsed = JSON.parse(claudeData.content[0].text.replace(/```json|```/g, "").trim());
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/articles`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": process.env.SUPABASE_KEY, "Authorization": `Bearer ${process.env.SUPABASE_KEY}`, "Prefer": "return=minimal" },
          body: JSON.stringify({ title: article.title, summary: parsed.summary, prediction: parsed.prediction, confidence: parsed.confidence, sentiment: parsed.sentiment, category: article.category, tag: article.tag, link: article.link, pub_date: article.pubDate, posted_at: new Date().toISOString(), disclaimer: DISCLAIMERS[article.category] || DISCLAIMERS.Markets })
        });
        published++;
      } catch { continue; }
    }
    return res.status(200).json({ success: true, published, total: newArticles.length });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
