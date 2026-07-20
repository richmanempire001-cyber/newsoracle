import Head from "next/head";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../lib/slugify";

function getImage(article) {
  if (article.image && !article.image.includes('source.unsplash')) return article.image;
  const keywords = {
    finance: "1611974789855-9c2a0a7236a3",
    sports: "1461896836934-ffe607ba8211",
    crypto: "1579621970563-ebec7560ff3e",
    markets: "1444653614773-995cb1ef9efa",
    technology: "1518770660439-4636190af475",
    politics: "1529107386315-e1a2ed48a620",
  };
  const key = keywords[article.category] || keywords.finance;
  return `https://images.unsplash.com/photo-${key}?w=1200&q=80`;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getReadTime(summary) {
  const words = summary?.trim().split(/\s+/).length || 0;
  return Math.ceil(words / 200);
}

const CATEGORY_COLORS = {
  finance: "#0052cc",
  sports: "#cc0000",
  politics: "#2e7d32",
  technology: "#111111",
};

export default function Home({ articles, categoryFeatured, evergreenArticles, tickerHeadlines, sidebarGuides }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselFading, setCarouselFading] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerFading, setTickerFading] = useState(false);

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (categoryFeatured.length <= 1) return;
    const interval = setInterval(() => {
      setCarouselFading(true);
      setTimeout(() => {
        setCarouselIndex(i => (i + 1) % categoryFeatured.length);
        setCarouselFading(false);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, [categoryFeatured.length]);

  useEffect(() => {
    if (tickerHeadlines.length <= 1) return;
    const interval = setInterval(() => {
      setTickerFading(true);
      setTimeout(() => {
        setTickerIndex(i => (i + 1) % tickerHeadlines.length);
        setTickerFading(false);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerHeadlines.length]);

  const goToSlide = useCallback((index) => {
    setCarouselFading(true);
    setTimeout(() => {
      setCarouselIndex(index);
      setCarouselFading(false);
    }, 400);
  }, []);

  const categories = ["all", "sports", "finance", "politics", "technology"];
  const currentFeatured = categoryFeatured[carouselIndex];
  const currentTicker = tickerHeadlines[tickerIndex];

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === "all" || a.category === activeCategory;
    const matchSearch = !searchQuery || a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <Head>
        <title>NewsOracle — Breaking News in Sports, Finance, Politics & Technology</title>
        <meta name="description" content="Breaking news updated every 2 hours. Expert coverage of sports, finance, cryptocurrency, politics and technology from NewsOracle." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://www.newsoracle.online" />
        <meta property="og:title" content="NewsOracle — Breaking News in Sports, Finance, Politics & Technology" />
        <meta property="og:description" content="Breaking news updated every 2 hours." />
        <meta property="og:url" content="https://www.newsoracle.online" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "NewsOracle",
          "url": "https://www.newsoracle.online",
          "description": "Breaking news in Sports, Finance, Politics and Technology",
          "potentialAction": { "@type": "SearchAction", "target": "https://www.newsoracle.online/?q={search_term_string}", "query-input": "required name=search_term_string" },
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://www.newsoracle.online", "logo": { "@type": "ImageObject", "url": "https://www.newsoracle.online/favicon.ico" } }
        })}} />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "stretch", height: "34px" }}>
            <div style={{ display: "flex", alignItems: "center", paddingRight: "16px", borderRight: "1px solid rgba(255,255,255,0.3)", flexShrink: 0, fontSize: "11px", color: "rgba(255,255,255,0.85)" }}>
              {new Date().toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              {currentTime ? ` · ${currentTime} GMT` : ''}
            </div>
            <div style={{ display: "flex", alignItems: "center", flex: 1, overflow: "hidden", padding: "0 16px" }}>
              <span style={{ background: "#fff", color: "#cc0000", padding: "2px 8px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", flexShrink: 0, marginRight: "12px" }}>BREAKING</span>
              <div style={{ overflow: "hidden", flex: 1 }}>
                {currentTicker && (
                  <Link href={articlePath(currentTicker)} style={{ textDecoration: "none" }}>
                    <span style={{ fontSize: "12px", color: "#fff", fontWeight: "500", opacity: tickerFading ? 0 : 1, transition: "opacity 0.3s ease", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {currentTicker.title}
                    </span>
                  </Link>
                )}
              </div>
            </div>
            <div className="top-bar-right" style={{ display: "flex", alignItems: "center", gap: "16px", paddingLeft: "16px", borderLeft: "1px solid rgba(255,255,255,0.3)", flexShrink: 0 }}>
              <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "11px", fontWeight: "600" }}>Telegram</a>
              <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "11px", fontWeight: "600" }}>Facebook</a>
              <a href="https://twitter.com/NewsOracle" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "none", fontSize: "11px", fontWeight: "600" }}>Twitter</a>
            </div>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "14px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
            <nav style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <Link href="/category/sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/category/finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/category/politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
              <Link href="/category/technology" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Technology</Link>
              <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Guides</Link>
            </nav>
            <div style={{ flexShrink: 0 }}>
              <input type="text" placeholder="Search news..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "8px 12px", border: "1px solid #ddd", fontSize: "13px", outline: "none", width: "180px" }} />
            </div>
          </div>
        </header>

        <style>{`
          @media (max-width: 768px) {
            nav { display: none !important; }
            header h1 { font-size: 28px !important; }
            .top-bar-right { display: none !important; }
            .articles-grid { grid-template-columns: 1fr !important; }
            .guides-grid { grid-template-columns: 1fr !important; }
            .main-layout { grid-template-columns: 1fr !important; }
            .carousel-title { font-size: 22px !important; }
            .sticky-sidebar { position: static !important; }
          }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          .article-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: all 0.2s; }
          .guide-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: all 0.2s; }
          .dot-btn { transition: all 0.3s ease; }
          .cat-tab:hover { opacity: 0.85; }
          .social-btn:hover { opacity: 0.85; transform: translateY(-1px); transition: all 0.15s; }
          .guide-link:hover p { color: #cc0000 !important; transition: color 0.15s; }
        `}</style>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>

          {/* Rotating Hero Carousel */}
          {currentFeatured && (
            <div style={{ position: "relative", marginBottom: "32px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
              <Link href={articlePath(currentFeatured)} style={{ textDecoration: "none" }}>
                <div style={{ position: "relative", cursor: "pointer" }}>
                  <img src={getImage(currentFeatured)} alt={currentFeatured.title} style={{ width: "100%", height: "500px", objectFit: "cover", display: "block", opacity: carouselFading ? 0 : 1, transition: "opacity 0.4s ease" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.92))", padding: "80px 32px 52px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                      <span style={{ background: CATEGORY_COLORS[currentFeatured.category] || "#cc0000", color: "#fff", padding: "4px 14px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", opacity: carouselFading ? 0 : 1, transition: "opacity 0.4s ease" }}>{currentFeatured.category}</span>
                      <span style={{ background: "#cc0000", color: "#fff", padding: "4px 14px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", animation: "pulse 2s infinite" }}>BREAKING</span>
                    </div>
                    <h2 className="carousel-title" style={{ fontSize: "34px", fontWeight: "900", color: "#fff", margin: "0 0 14px", lineHeight: "1.2", maxWidth: "820px", letterSpacing: "-0.5px", opacity: carouselFading ? 0 : 1, transition: "opacity 0.4s ease" }}>{currentFeatured.title}</h2>
                    <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "15px", margin: "0 0 16px", lineHeight: "1.6", maxWidth: "700px", opacity: carouselFading ? 0 : 1, transition: "opacity 0.4s ease" }}>
                      {currentFeatured.summary?.split('\n\n')[0]?.replace(/^[A-Z\s]+ — /, '')?.substring(0, 180)}...
                    </p>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", opacity: carouselFading ? 0 : 1, transition: "opacity 0.4s ease" }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{timeAgo(currentFeatured.created_at)}</span>
                      <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>{getReadTime(currentFeatured.summary)} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
              <div style={{ position: "absolute", bottom: "16px", right: "20px", display: "flex", gap: "6px", alignItems: "center" }}>
                {categoryFeatured.map((item, i) => (
                  <button key={i} className="dot-btn" onClick={(e) => { e.preventDefault(); goToSlide(i); }} style={{ width: i === carouselIndex ? "28px" : "8px", height: "8px", borderRadius: "4px", background: i === carouselIndex ? (CATEGORY_COLORS[item.category] || "#cc0000") : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", padding: 0 }} />
                ))}
              </div>
              <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "6px" }}>
                {categoryFeatured.map((item, i) => (
                  <button key={i} className="cat-tab" onClick={(e) => { e.preventDefault(); goToSlide(i); }} style={{ padding: "4px 12px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", background: i === carouselIndex ? (CATEGORY_COLORS[item.category] || "#cc0000") : "rgba(0,0,0,0.55)", color: "#fff", transition: "all 0.2s" }}>{item.category}</button>
                ))}
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "8px 20px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap", background: activeCategory === cat ? (cat === "all" ? "#111" : CATEGORY_COLORS[cat] || "#cc0000") : "#fff", color: activeCategory === cat ? "#fff" : "#555", borderBottom: activeCategory === cat ? "none" : "2px solid #eee", transition: "all 0.15s" }}>
                {cat === "all" ? "All News" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className="main-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px", alignItems: "start" }}>

            {/* Articles Grid */}
            <div>
              {filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#999" }}>
                  <p style={{ fontSize: "18px" }}>No articles found.</p>
                </div>
              ) : (
                <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                  {filtered.map(article => (
                    <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                      <div className="article-card" style={{ background: "#fff", cursor: "pointer", height: "100%", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                        <div style={{ position: "relative" }}>
                          <img src={getImage(article)} alt={article.title} loading="lazy" style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                          <span style={{ position: "absolute", top: "12px", left: "12px", background: CATEGORY_COLORS[article.category] || "#cc0000", color: "#fff", padding: "3px 10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{article.category}</span>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.45", margin: "0 0 10px", color: "#111" }}>{article.title}</h3>
                          <p style={{ color: "#777", fontSize: "13px", lineHeight: "1.55", margin: "0 0 12px" }}>
                            {article.summary?.split('\n\n')[0]?.replace(/^[A-Z\s]+ — /, '')?.substring(0, 110)}...
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                            <span style={{ fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</span>
                            <span style={{ fontSize: "11px", color: "#bbb" }}>{getReadTime(article.summary)} min read</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Guides Section below articles */}
              {evergreenArticles?.length > 0 && (
                <div style={{ marginTop: "48px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "3px solid #111", paddingBottom: "10px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111", margin: 0 }}>📚 Guides & Resources</h2>
                    <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>View all guides →</Link>
                  </div>
                  <div className="guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {evergreenArticles.map(guide => (
                      <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }}>
                        <div className="guide-card" style={{ background: "#fff", borderTop: "3px solid #111", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                          <img src={guide.image || getImage(guide)} alt={guide.title} loading="lazy" style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }} />
                          <div style={{ padding: "14px" }}>
                            <span style={{ background: "#111", color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>GUIDE</span>
                            <p style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: "700", color: "#111", lineHeight: "1.4" }}>{guide.title}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Sidebar */}
            <aside>
              <div className="sticky-sidebar" style={{ position: "sticky", top: "20px" }}>

                {/* Latest News */}
                <div style={{ background: "#fff", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>Latest News</h3>
                  {articles.slice(0, 8).map(article => (
                    <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                        <img loading="lazy" src={getImage(article)} alt={article.title} style={{ width: "70px", height: "52px", objectFit: "cover", flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: "9px", color: CATEGORY_COLORS[article.category] || "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{article.category}</span>
                          <p style={{ margin: "3px 0 0", fontSize: "12px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{article.title}</p>
                          <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#bbb" }}>{timeAgo(article.created_at)}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* NEW — Guides Widget (auto-updates with every new guide published) */}
                {sidebarGuides?.length > 0 && (
                  <div style={{ background: "#fff", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", borderTop: "3px solid #111" }}>
                    <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #111" }}>📚 Guides</h3>
                    {sidebarGuides.map(guide => (
                      <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }} className="guide-link">
                        <div style={{ marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                          <span style={{ fontSize: "9px", color: CATEGORY_COLORS[guide.category] || "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{guide.category}</span>
                          <p style={{ margin: "3px 0 4px", fontSize: "12px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{guide.title}</p>
                          <span style={{ fontSize: "10px", color: "#666", fontWeight: "600" }}>Read guide →</span>
                        </div>
                      </Link>
                    ))}
                    <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "12px", fontWeight: "700" }}>View all guides →</Link>
                  </div>
                )}

                {/* NEW — Follow Us Widget */}
                <div style={{ background: "#fff", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>Follow NewsOracle</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0088cc", color: "#fff", padding: "10px 14px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                      <span style={{ fontSize: "16px" }}>✈️</span> Telegram
                    </a>
                    <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#1877f2", color: "#fff", padding: "10px 14px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                      <span style={{ fontSize: "16px" }}>📘</span> Facebook
                    </a>
                    <a href="https://twitter.com/NewsOracle" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#000", color: "#fff", padding: "10px 14px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                      <span style={{ fontSize: "16px" }}>🐦</span> Twitter / X
                    </a>
                    <a href="https://www.linkedin.com/in/news-oracle-a7543b423/" target="_blank" rel="noopener noreferrer" className="social-btn" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#0052cc", color: "#fff", padding: "10px 14px", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>
                      <span style={{ fontSize: "16px" }}>💼</span> LinkedIn
                    </a>
                  </div>
                </div>

                {/* Browse */}
                <div style={{ background: "#fff", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>Browse</h3>
                  {['sports', 'finance', 'politics', 'technology'].map(cat => (
                    <Link key={cat} href={`/category/${cat}`} style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#333", textTransform: "capitalize" }}>{cat}</span>
                        <span style={{ width: "8px", height: "8px", background: CATEGORY_COLORS[cat], display: "inline-block", borderRadius: "50%" }} />
                      </div>
                    </Link>
                  ))}
                </div>

              </div>
            </aside>

          </div>
        </main>

        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
              <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "13px", textDecoration: "none", background: "#0088cc", padding: "8px 16px" }}>Telegram</a>
              <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "13px", textDecoration: "none", background: "#1877f2", padding: "8px 16px" }}>Facebook</a>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              <Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link>
              <Link href="/editorial-guidelines" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Editorial Guidelines</Link>
              <Link href="/privacy-policy" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Terms of Service</Link>
              <Link href="/guides" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Guides</Link>
            </div>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900", textAlign: "center" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h2>
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>&copy; 2026 NewsOracle. All Rights Reserved. All content is for informational purposes only.</p>
          </div>
        </footer>

      </div>
    </>
  );
}

export async function getServerSideProps() {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const categoryFeatured = [];
  for (const cat of ['sports', 'finance', 'politics', 'technology']) {
    const { data } = await supabaseServer
      .from("articles")
      .select("id, title, summary, image, category, tag, created_at, views")
      .eq("category", cat)
      .or("evergreen.eq.false,evergreen.is.null")
      .order("created_at", { ascending: false })
      .limit(1);
    if (data?.[0]) categoryFeatured.push(data[0]);
  }

  const { data: articles } = await supabaseServer
    .from("articles")
    .select("id, title, summary, image, category, tag, created_at, views")
    .or("evergreen.eq.false,evergreen.is.null")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data: evergreenArticles } = await supabaseServer
    .from("articles")
    .select("id, title, summary, image, category, tag, created_at")
    .eq("evergreen", true)
    .order("created_at", { ascending: false })
    .limit(6);

  // NEW — fetch ALL guides for sidebar (auto-updates with every new guide)
  const { data: sidebarGuides } = await supabaseServer
    .from("articles")
    .select("id, title, category, tag")
    .eq("evergreen", true)
    .order("created_at", { ascending: false });

  const tickerHeadlines = (articles || []).slice(0, 10);

  return {
    props: {
      articles: articles || [],
      categoryFeatured,
      evergreenArticles: evergreenArticles || [],
      tickerHeadlines,
      sidebarGuides: sidebarGuides || [],
    },
  };
}
