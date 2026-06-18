import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";

const RSS_SOURCES = [
  { name: "ESPN",          url: "https://www.espn.com/espn/rss/news",               category: "Sports",  tag: "ESPN" },
  { name: "BBC Sport",     url: "https://feeds.bbci.co.uk/sport/rss.xml",           category: "Sports",  tag: "BBC Sport" },
  { name: "Sky Sports",    url: "https://www.skysports.com/rss/12040",              category: "Sports",  tag: "Sky Sports" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/news/rssindex",          category: "Markets", tag: "Yahoo Finance" },
  { name: "CoinDesk",      url: "https://www.coindesk.com/arc/outboundfeeds/rss/",  category: "Crypto",  tag: "CoinDesk" },
  { name: "Reuters",       url: "https://feeds.reuters.com/reuters/businessNews",   category: "Markets", tag: "Reuters" },
  { name: "CoinTelegraph", url: "https://cointelegraph.com/rss",                    category: "Crypto",  tag: "CoinTelegraph" },
];

const DISCLAIMERS = {
  Sports:  "The analysis and forecasts presented here are based on statistical data and expert assessment. They are intended for informational purposes only and do not constitute a guarantee of outcome.",
  Markets: "The information and analysis on this page are provided for informational purposes only and do not constitute financial, investment, or trading advice. Past performance is not indicative of future results. Always consult a qualified financial adviser before making investment decisions.",
  Crypto:  "Cryptocurrency markets are highly volatile. The analysis presented is for informational purposes only and does not constitute financial advice. You should not invest more than you can afford to lose. Always conduct your own research.",
};

const CORS = "https://api.allorigins.win/get?url=";

function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function parseFeed(xml, source) {
  try {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    return Array.from(doc.querySelectorAll("item")).slice(0, 6).map(item => ({
      id: (item.querySelector("guid")?.textContent || item.querySelector("link")?.textContent || "") + source.name,
      title: item.querySelector("title")?.textContent?.replace(/<!\[CDATA\[|\]\]>/g, "").trim() || "Untitled",
      description: item.querySelector("description")?.textContent?.replace(/<[^>]+>/g, "").replace(/<!\[CDATA\[|\]\]>/g, "").slice(0, 400).trim() || "",
      link: item.querySelector("link")?.textContent || "#",
      pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
      source: source.name, tag: source.tag, category: source.category,
    }));
  } catch { return []; }
}

function Ticker({ posts }) {
  const items = posts.length > 0 ? posts.map(p => `${p.tag.toUpperCase()}: ${p.title}`) : ["NEWSORACLE — Live sports and financial analysis", "Markets coverage across stocks, crypto and forex", "Sports predictions and match previews updated throughout the day"];
  const text = items.join("   ·   ");
  return (
    <div style={{ background: "#CC0000", overflow: "hidden", height: 34, display: "flex", alignItems: "center" }}>
      <div style={{ background: "#900", color: "#fff", fontSize: 11, fontWeight: 800, padding: "0 14px", whiteSpace: "nowrap", height: "100%", display: "flex", alignItems: "center", letterSpacing: "0.08em", flexShrink: 0 }}>LIVE</div>
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div style={{ display: "inline-flex", animation: "ticker 50s linear infinite", whiteSpace: "nowrap" }}>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 500, padding: "0 40px" }}>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</span>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ post, size = "normal" }) {
  const [open, setOpen] = useState(false);
  const catColor = post.category === "Sports" ? "#1a56db" : post.category === "Crypto" ? "#b45309" : "#166534";

  if (size === "hero") return (
    <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 28, marginBottom: 28 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <span style={{ background: catColor, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", letterSpacing: "0.08em" }}>{post.category.toUpperCase()}</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{post.tag}</span>
        <span style={{ color: "#d1d5db", fontSize: 12 }}>·</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{formatDate(post.pubDate)}</span>
      </div>
      <h2 onClick={() => setOpen(!open)} style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: "#111827", margin: "0 0 12px", lineHeight: 1.3, cursor: "pointer" }}>{post.title}</h2>
      <p style={{ color: "#374151", fontSize: 16, lineHeight: 1.7, margin: "0 0 14px", fontFamily: "Georgia, serif" }}>{post.summary || post.description}</p>
      {open && post.prediction && (
        <div style={{ borderLeft: "3px solid #1a56db", paddingLeft: 16, margin: "16px 0" }}>
          <div style={{ color: "#1a56db", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 6 }}>ANALYSIS & OUTLOOK</div>
          <p style={{ color: "#111827", fontSize: 15, lineHeight: 1.7, margin: "0 0 10px", fontFamily: "Georgia, serif" }}>{post.prediction}</p>
          <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>{post.disclaimer}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <a href={post.link} target="_blank" rel="noreferrer" style={{ color: "#1a56db", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Read full story →</a>
        {post.prediction && <button onClick={() => setOpen(!open)} style={{ background: "none", border: "1px solid #d1d5db", color: "#374151", fontSize: 12, padding: "5px 12px", cursor: "pointer" }}>{open ? "Hide analysis" : "View analysis"}</button>}
        {post.confidence && <span style={{ color: "#6b7280", fontSize: 12 }}>Confidence: <strong style={{ color: "#111" }}>{post.confidence}%</strong></span>}
      </div>
    </div>
  );

  if (size === "small") return (
    <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: "1px solid #f3f4f6" }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
        <span style={{ background: catColor, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px" }}>{post.category.toUpperCase()}</span>
        <span style={{ color: "#9ca3af", fontSize: 11 }}>{timeAgo(post.postedAt || post.pubDate)}</span>
      </div>
      <h4 onClick={() => setOpen(!open)} style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 6px", lineHeight: 1.4, cursor: "pointer" }}>{post.title}</h4>
      {open && post.prediction && (
        <div style={{ borderLeft: "2px solid #e5e7eb", paddingLeft: 10, margin: "8px 0" }}>
          <p style={{ color: "#374151", fontSize: 12, lineHeight: 1.6, margin: "0 0 6px" }}>{post.prediction}</p>
          <p style={{ color: "#9ca3af", fontSize: 11, fontStyle: "italic", margin: 0 }}>{post.disclaimer}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        <a href={post.link} target="_blank" rel="noreferrer" style={{ color: "#1a56db", fontSize: 12, textDecoration: "none" }}>Read →</a>
        {post.prediction && <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#6b7280", fontSize: 11, cursor: "pointer", padding: 0 }}>{open ? "Hide" : "Analysis"}</button>}
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
        <span style={{ background: catColor, color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px" }}>{post.category.toUpperCase()}</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{post.tag}</span>
        <span style={{ color: "#d1d5db" }}>·</span>
        <span style={{ color: "#6b7280", fontSize: 12 }}>{timeAgo(post.postedAt || post.pubDate)}</span>
      </div>
      <h3 onClick={() => setOpen(!open)} style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 8px", lineHeight: 1.4, cursor: "pointer" }}>{post.title}</h3>
      <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6, margin: "0 0 10px" }}>{post.summary || post.description.slice(0, 180)}</p>
      {open && post.prediction && (
        <div style={{ background: "#f8fafc", borderLeft: "3px solid #1a56db", padding: 14, margin: "10px 0" }}>
          <div style={{ color: "#1a56db", fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 6 }}>ANALYSIS & OUTLOOK</div>
          <p style={{ color: "#1e293b", fontSize: 14, lineHeight: 1.7, margin: "0 0 10px" }}>{post.prediction}</p>
          {post.confidence && <div style={{ color: "#475569", fontSize: 12, marginBottom: 8 }}>Confidence score: <strong>{post.confidence}%</strong></div>}
          <p style={{ color: "#94a3b8", fontSize: 11, fontStyle: "italic", margin: 0 }}>{post.disclaimer}</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <a href={post.link} target="_blank" rel="noreferrer" style={{ color: "#1a56db", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>Read full story →</a>
        {post.prediction && <button onClick={() => setOpen(!open)} style={{ background: "none", border: "1px solid #d1d5db", color: "#374151", fontSize: 12, padding: "4px 10px", cursor: "pointer" }}>{open ? "Close" : "View analysis"}</button>}
      </div>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen]         = useState("setup");
  const [apiKey, setApiKey]         = useState("");
  const [apiInput, setApiInput]     = useState("");
  const [keyError, setKeyError]     = useState("");
  const [articles, setArticles]     = useState([]);
  const [posts, setPosts]           = useState([]);
  const [fetching, setFetching]     = useState(false);
  const [processing, setProcessing] = useState(null);
  const [autoMode, setAutoMode]     = useState(false);
  const [error, setError]           = useState("");
  const [activeTab, setActiveTab]   = useState("All");
  const [siteTab, setSiteTab]       = useState("All");
  const [log, setLog]               = useState([]);
  const autoRef = useRef(false);

  const addLog = msg => setLog(p => [`${new Date().toLocaleTimeString()} — ${msg}`, ...p].slice(0, 30));

  const handleKey = () => {
    if (apiInput.startsWith("sk-ant-")) { setApiKey(apiInput); setScreen("dashboard"); setKeyError(""); }
    else setKeyError("Invalid key — must start with sk-ant-");
  };

  const fetchAll = useCallback(async () => {
    setFetching(true); setError("");
    addLog("Fetching from all sources...");
    try {
      const results = await Promise.allSettled(RSS_SOURCES.map(async s => {
        const r = await fetch(`${CORS}${encodeURIComponent(s.url)}`);
        const j = await r.json();
        return parseFeed(j.contents, s);
      }));
      const items = results.flatMap(r => r.status === "fulfilled" ? r.value : []);
      setArticles(items);
      addLog(`Fetched ${items.length} articles`);
    } catch { setError("Could not fetch news."); }
    setFetching(false);
  }, []);

  const processArticle = useCallback(async (article) => {
    setProcessing(article.id);
    addLog(`Processing: ${article.title.slice(0, 50)}...`);
    try {
      const isSports = article.category === "Sports";
      const prompt = `You are a senior editor at a leading news publication. Write a professional news analysis for the following article.

Title: ${article.title}
Content: ${article.description}
Category: ${article.category}

Return ONLY a JSON object with these exact fields, no markdown:
{
  "summary": "3 clear, factual sentences summarising the story in journalistic style. Third person, active voice.",
  "prediction": "${isSports ? "2 sentences analysing likely outcomes based on current form and context." : "2 sentences of forward-looking market analysis with specific factors."}",
  "confidence": <integer 55-92>,
  "sentiment": "${isSports ? "home_win OR away_win OR draw OR bullish OR bearish" : "bullish OR bearish OR neutral"}"
}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content[0].text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      setPosts(p => [{ id: article.id, title: article.title, summary: parsed.summary, prediction: parsed.prediction, confidence: parsed.confidence, sentiment: parsed.sentiment, source: article.source, tag: article.tag, category: article.category, link: article.link, pubDate: article.pubDate, postedAt: new Date().toISOString(), disclaimer: DISCLAIMERS[article.category] || DISCLAIMERS.Markets }, ...p]);
      addLog(`Published: ${article.title.slice(0, 45)}`);
    } catch (e) { setError("Error: " + e.message); addLog("Error: " + e.message); }
    setProcessing(null);
  }, [apiKey]);

  const postAll = useCallback(async () => {
    const unposted = articles.filter(a => !posts.find(p => p.id === a.id));
    for (const a of unposted) await processArticle(a);
  }, [articles, posts, processArticle]);

  useEffect(() => { autoRef.current = autoMode; }, [autoMode]);
  useEffect(() => { if (autoMode) { fetchAll(); const i = setInterval(fetchAll, 30*60*1000); return () => clearInterval(i); } }, [autoMode]);
  useEffect(() => { if (autoMode && articles.length > 0) postAll(); }, [articles]);

  const tabs = ["All", "Sports", "Markets", "Crypto"];
  const filteredSite = posts.filter(p => siteTab === "All" ? true : p.category === siteTab);
  const filteredDash = posts.filter(p => activeTab === "All" ? true : p.category === activeTab);

  // SETUP
  if (screen === "setup") return (
    <>
      <Head><title>NewsOracle — Enter Newsroom</title></Head>
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 700, color: "#111827", letterSpacing: "-1px", marginBottom: 4 }}>NewsOracle</div>
            <div style={{ width: 40, height: 3, background: "#CC0000", margin: "0 auto 12px" }} />
            <p style={{ color: "#6b7280", fontSize: 15 }}>Sports · Markets · Analysis</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 4, padding: 32, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <label style={{ color: "#374151", fontSize: 13, fontWeight: 600 }}>API Key</label>
            <input type="password" value={apiInput} onChange={e => setApiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleKey()} placeholder="sk-ant-api03-..."
              style={{ width: "100%", marginTop: 8, padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: 3, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#111" }} />
            {keyError && <p style={{ color: "#CC0000", fontSize: 12, marginTop: 6 }}>{keyError}</p>}
            <button onClick={handleKey} style={{ width: "100%", marginTop: 16, padding: "12px", background: "#111827", border: "none", borderRadius: 3, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Enter Newsroom</button>
            <p style={{ color: "#9ca3af", fontSize: 12, textAlign: "center", marginTop: 14, marginBottom: 0 }}>Key stays in your browser — never transmitted</p>
          </div>
        </div>
      </div>
    </>
  );

  // PUBLIC SITE
  if (screen === "site") return (
    <>
      <Head><title>NewsOracle — Sports & Finance News</title></Head>
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div style={{ background: "#111827", padding: "0 32px", height: 36, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#9ca3af", fontSize: 12 }}>{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          <div style={{ display: "flex", gap: 16 }}>{["Sports", "Markets", "Crypto", "Analysis"].map(l => <span key={l} style={{ color: "#9ca3af", fontSize: 12, cursor: "pointer" }}>{l}</span>)}</div>
        </div>
        <div style={{ borderBottom: "3px solid #111827", padding: "20px 32px 16px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", borderBottom: "1px solid #e5e7eb", paddingBottom: 16, marginBottom: 16 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 52, fontWeight: 700, color: "#111827", letterSpacing: "-2px", lineHeight: 1 }}>NewsOracle</div>
              <div style={{ color: "#6b7280", fontSize: 13, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 6 }}>Sports · Markets · Crypto · Analysis</div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
              {tabs.map(t => <button key={t} onClick={() => setSiteTab(t)} style={{ background: siteTab === t ? "#111827" : "transparent", color: siteTab === t ? "#fff" : "#374151", border: "none", padding: "6px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t}</button>)}
              <button onClick={() => setScreen("dashboard")} style={{ background: "#CC0000", color: "#fff", border: "none", padding: "6px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginLeft: 8 }}>Newsroom</button>
            </div>
          </div>
        </div>
        <Ticker posts={posts} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px" }}>
          {filteredSite.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#9ca3af", marginBottom: 12 }}>No stories published yet</div>
              <button onClick={() => setScreen("dashboard")} style={{ marginTop: 16, background: "#111827", color: "#fff", border: "none", padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Go to Newsroom</button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48 }}>
              <div>
                {filteredSite[0] && <ArticleCard post={filteredSite[0]} size="hero" />}
                {filteredSite.slice(1, 5).map(p => <ArticleCard key={p.id} post={p} />)}
              </div>
              <div style={{ borderLeft: "1px solid #e5e7eb", paddingLeft: 32 }}>
                <div style={{ borderBottom: "2px solid #111827", paddingBottom: 8, marginBottom: 16 }}><span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700 }}>Latest</span></div>
                {filteredSite.slice(0, 8).map(p => <ArticleCard key={p.id} post={p} size="small" />)}
                <div style={{ borderTop: "2px solid #111827", paddingTop: 16, marginTop: 8 }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>At a Glance</div>
                  {[["Stories Published", posts.length], ["Sports", posts.filter(p=>p.category==="Sports").length], ["Markets", posts.filter(p=>p.category==="Markets").length], ["Crypto", posts.filter(p=>p.category==="Crypto").length]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                      <span style={{ color: "#374151", fontSize: 13 }}>{l}</span>
                      <span style={{ color: "#111827", fontWeight: 700, fontSize: 13 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <footer style={{ borderTop: "3px solid #111827", background: "#111827", padding: "32px", marginTop: 48 }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 24, color: "#fff", marginBottom: 8 }}>NewsOracle</div>
            <p style={{ color: "#6b7280", fontSize: 12, maxWidth: 700, lineHeight: 1.6, margin: 0 }}>All analysis and forward-looking statements on NewsOracle are provided for informational purposes only. They do not constitute financial, investment, or betting advice. © {new Date().getFullYear()} NewsOracle. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );

  // DASHBOARD
  return (
    <>
      <Head><title>NewsOracle — Newsroom</title></Head>
      <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
        <div style={{ background: "#111827", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, borderBottom: "3px solid #CC0000" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "Georgia, serif", color: "#fff", fontWeight: 700, fontSize: 20 }}>NewsOracle</span>
            <span style={{ color: "#6b7280", fontSize: 13 }}>/ Newsroom</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setScreen("site")} style={{ background: "transparent", border: "1px solid #374151", color: "#d1d5db", padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>View Site ({posts.length})</button>
            <div onClick={() => setAutoMode(!autoMode)} style={{ display: "flex", alignItems: "center", gap: 8, background: autoMode ? "#064e3b" : "#1f2937", border: `1px solid ${autoMode ? "#10b981" : "#374151"}`, padding: "7px 16px", cursor: "pointer" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: autoMode ? "#10b981" : "#4b5563" }} />
              <span style={{ color: autoMode ? "#10b981" : "#9ca3af", fontSize: 13, fontWeight: 600 }}>{autoMode ? "AUTO: ON" : "AUTO: OFF"}</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
              {[["Fetched", articles.length, "#1a56db"], ["Published", posts.length, "#166534"], ["Sports", posts.filter(p=>p.category==="Sports").length, "#1a56db"], ["Markets", posts.filter(p=>p.category!=="Sports").length, "#b45309"]].map(([l,v,c]) => (
                <div key={l} style={{ background: "#fff", border: "1px solid #e5e7eb", padding: "14px 16px", borderTop: `3px solid ${c}` }}>
                  <div style={{ color: "#6b7280", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</div>
                  <div style={{ color: "#111827", fontSize: 24, fontWeight: 800, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8, borderBottom: "2px solid #111827", paddingBottom: 8 }}>Fetch News</div>
              <p style={{ color: "#6b7280", fontSize: 13, margin: "10px 0 14px" }}>Sources: ESPN · BBC Sport · Sky Sports · Yahoo Finance · Reuters · CoinDesk · CoinTelegraph</p>
              {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: 10, marginBottom: 12 }}><p style={{ color: "#CC0000", fontSize: 13, margin: 0 }}>{error}</p></div>}
              <button onClick={fetchAll} disabled={fetching} style={{ width: "100%", padding: "11px", background: fetching ? "#f3f4f6" : "#111827", border: "none", color: fetching ? "#9ca3af" : "#fff", fontSize: 14, fontWeight: 600, cursor: fetching ? "not-allowed" : "pointer" }}>{fetching ? "Fetching…" : "Fetch Latest Stories"}</button>
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb" }}>
              <div style={{ padding: "14px 20px", borderBottom: "2px solid #111827", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700 }}>Articles</span>
                {articles.length > 0 && <button onClick={postAll} disabled={!!processing} style={{ background: "#CC0000", border: "none", color: "#fff", fontSize: 12, fontWeight: 700, padding: "6px 14px", cursor: processing ? "not-allowed" : "pointer" }}>{processing ? "Publishing…" : `Publish All (${articles.filter(a => !posts.find(p => p.id === a.id)).length})`}</button>}
              </div>
              {articles.length === 0 ? <div style={{ padding: "48px 20px", textAlign: "center", color: "#9ca3af" }}><p style={{ fontFamily: "Georgia, serif", fontSize: 18, marginBottom: 8 }}>No articles yet</p><p style={{ fontSize: 13, margin: 0 }}>Click Fetch Latest Stories above</p></div> : (
                <div style={{ maxHeight: 440, overflowY: "auto" }}>
                  {articles.map(article => {
                    const isPosted = posts.find(p => p.id === article.id);
                    const isProcessing = processing === article.id;
                    const catColor = article.category === "Sports" ? "#1a56db" : article.category === "Crypto" ? "#b45309" : "#166534";
                    return (
                      <div key={article.id} style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", gap: 12, alignItems: "flex-start", background: isPosted ? "#f0fdf4" : "#fff" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                            <span style={{ background: catColor, color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px" }}>{article.category.toUpperCase()}</span>
                            <span style={{ color: "#9ca3af", fontSize: 11 }}>{article.tag}</span>
                          </div>
                          <p style={{ color: "#111827", fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.4 }}>{article.title}</p>
                        </div>
                        <button onClick={() => processArticle(article)} disabled={!!isPosted || isProcessing} style={{ flexShrink: 0, padding: "6px 12px", border: "none", fontSize: 11, fontWeight: 700, cursor: isPosted ? "default" : "pointer", background: isPosted ? "#dcfce7" : isProcessing ? "#f3f4f6" : "#111827", color: isPosted ? "#166534" : isProcessing ? "#9ca3af" : "#fff" }}>
                          {isPosted ? "✓ Live" : isProcessing ? "Writing…" : "Publish"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #111827" }}>
              {tabs.map(t => <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? "#111827" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: "1px solid #e5e7eb", borderBottom: "none", padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t}</button>)}
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderTop: "none", maxHeight: 460, overflowY: "auto" }}>
              {filteredDash.length === 0 ? <div style={{ padding: "48px 20px", textAlign: "center", color: "#9ca3af" }}><p style={{ fontFamily: "Georgia, serif", fontSize: 18, marginBottom: 8 }}>Nothing published yet</p></div> :
                filteredDash.map(post => (
                  <div key={post.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                      <span style={{ background: post.category === "Sports" ? "#1a56db" : post.category === "Crypto" ? "#b45309" : "#166534", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 6px" }}>{post.category.toUpperCase()}</span>
                      <span style={{ color: "#9ca3af", fontSize: 11 }}>{post.tag}</span>
                      <span style={{ color: "#9ca3af", fontSize: 11 }}>· {timeAgo(post.postedAt)}</span>
                      {post.sentiment && <span style={{ color: post.sentiment === "bullish" || post.sentiment === "home_win" ? "#166534" : post.sentiment === "bearish" ? "#CC0000" : "#374151", fontSize: 10, fontWeight: 700, marginLeft: "auto", textTransform: "uppercase" }}>{post.sentiment.replace("_", " ")}</span>}
                    </div>
                    <p style={{ fontFamily: "Georgia, serif", color: "#111827", fontSize: 14, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.4 }}>{post.title}</p>
                    <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px", lineHeight: 1.5 }}>{post.summary?.slice(0, 120)}…</p>
                    {post.confidence && <span style={{ color: "#6b7280", fontSize: 11 }}>Confidence: <strong style={{ color: "#111" }}>{post.confidence}%</strong></span>}
                  </div>
                ))
              }
            </div>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", marginTop: 20, padding: 20 }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, borderBottom: "2px solid #111827", paddingBottom: 8, marginBottom: 14 }}>Auto Mode</div>
              <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>When enabled, fetches and publishes new stories automatically every 30 minutes — around the clock.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[["30 min", "refresh"], ["7 sources", "feeds"], ["24/7", "auto"]].map(([v,l]) => (
                  <div key={l} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ color: "#111827", fontWeight: 800, fontSize: 16 }}>{v}</div>
                    <div style={{ color: "#9ca3af", fontSize: 11 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#111827", marginTop: 16, padding: 16 }}>
              <div style={{ color: "#9ca3af", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10, textTransform: "uppercase" }}>Activity Log</div>
              <div style={{ maxHeight: 140, overflowY: "auto" }}>
                {log.length === 0 ? <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>No activity yet</p> : log.map((l, i) => <p key={i} style={{ color: i === 0 ? "#10b981" : "#6b7280", fontSize: 12, margin: "0 0 4px", fontFamily: "monospace" }}>{l}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
