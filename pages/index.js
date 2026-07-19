import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { slugify, articlePath, articleUrl } from "../lib/slugify";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

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

function formatViews(views) {
  if (!views || views < 1) return "0 views";
  if (views < 1000) return `${views} views`;
  if (views < 1000000) return `${Math.floor(views / 1000)}K views`;
  return `${(views / 1000000).toFixed(1)}M views`;
}

const CATEGORY_COLORS = {
  finance: "#0052cc",
  sports: "#cc0000",
  politics: "#2e7d32",
  technology: "#7b1fa2",
};

export default function Home({ articles, featuredArticle, evergreenArticles }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const categories = ["all", "sports", "finance", "politics", "technology"];

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
        <meta property="og:description" content="Breaking news updated every 2 hours. Expert coverage of sports, finance, cryptocurrency, politics and technology." />
        <meta property="og:url" content="https://www.newsoracle.online" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta property="og:image" content="https://www.newsoracle.online/favicon.ico" />
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
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}{currentTime ? ` · ${currentTime} GMT` : ''}</span>
            <span className="top-bar-right">Breaking News · Updated Every 2 Hours</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px", alignItems: "center" }}>
              <Link href="/category/sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/category/finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/category/politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
              <Link href="/category/technology" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Technology</Link>
              <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Guides</Link>
            </nav>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: "8px 12px", border: "1px solid #ddd", fontSize: "13px", outline: "none", width: "180px" }}
              />
            </div>
          </div>
        </header>

        <style>{`
          @media (max-width: 768px) {
            nav { display: none !important; }
            header h1 { font-size: 28px !important; }
            .top-bar-right { display: none !important; }
            .featured-grid { grid-template-columns: 1fr !important; }
            .articles-grid { grid-template-columns: 1fr !important; }
            .guides-grid { grid-template-columns: 1fr !important; }
            .main-layout { grid-template-columns: 1fr !important; }
          }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
          .article-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
          .guide-card:hover { transform: translateY(-2px); transition: transform 0.2s; }
        `}</style>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>

          {/* Featured Article */}
          {featuredArticle && (
            <Link href={articlePath(featuredArticle)} style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", marginBottom: "32px", cursor: "pointer", overflow: "hidden" }}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = "scale(1.02)"}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = "scale(1)"}
              >
                <img
                  src={getImage(featuredArticle)}
                  alt={featuredArticle.title}
                  style={{ width: "100%", height: "480px", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "60px 32px 32px" }}>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ background: "#cc0000", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", animation: "pulse 2s infinite" }}>BREAKING</span>
                    <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>{featuredArticle.category}</span>
                  </div>
                  <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#fff", margin: "0 0 12px", lineHeight: "1.2", maxWidth: "800px" }}>{featuredArticle.title}</h2>
                  <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", margin: "0 0 12px", lineHeight: "1.5", maxWidth: "700px" }}>
                    {featuredArticle.summary?.split('\n\n')[0]?.substring(0, 180)}...
                  </p>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{timeAgo(featuredArticle.created_at)}</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{formatViews(featuredArticle.views)}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Category Filter */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "24px", overflowX: "auto", paddingBottom: "4px" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  background: activeCategory === cat ? (cat === "all" ? "#111" : CATEGORY_COLORS[cat] || "#cc0000") : "#fff",
                  color: activeCategory === cat ? "#fff" : "#555",
                  borderBottom: activeCategory === cat ? "none" : "2px solid #eee",
                }}
              >
                {cat === "all" ? "All News" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Main Layout */}
          <div className="main-layout" style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>

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
                      <div className="article-card" style={{ background: "#fff", cursor: "pointer", height: "100%" }}>
                        <div style={{ position: "relative" }}>
                          <img
                            src={getImage(article)}
                            alt={article.title}
                            loading="lazy"
                            style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                          />
                          <span style={{
                            position: "absolute", top: "12px", left: "12px",
                            background: CATEGORY_COLORS[article.category] || "#cc0000",
                            color: "#fff", padding: "3px 10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px"
                          }}>{article.category}</span>
                        </div>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 10px", color: "#111" }}>{article.title}</h3>
                          <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5", margin: "0 0 12px" }}>
                            {article.summary?.split('\n\n')[0]?.substring(0, 120)}...
                          </p>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                            <span style={{ fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</span>
                            <span style={{ fontSize: "11px", color: "#999" }}>{formatViews(article.views)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Guides Section */}
              {evergreenArticles?.length > 0 && (
                <div style={{ marginTop: "48px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", borderBottom: "3px solid #2e7d32", paddingBottom: "10px" }}>
                    <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#111", margin: 0 }}>📚 Guides & Resources</h2>
                    <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>View all guides →</Link>
                  </div>
                  <div className="guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                    {evergreenArticles.map(guide => (
                      <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }}>
                        <div className="guide-card" style={{ background: "#fff", borderTop: "3px solid #2e7d32", cursor: "pointer" }}>
                          <img
                            src={guide.image || getImage(guide)}
                            alt={guide.title}
                            loading="lazy"
                            style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }}
                          />
                          <div style={{ padding: "14px" }}>
                            <span style={{ background: "#2e7d32", color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>GUIDE</span>
                            <p style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: "700", color: "#111", lineHeight: "1.4" }}>{guide.title}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside>
              {/* Latest News */}
              <div style={{ background: "#fff", padding: "20px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
                  Latest News
                </h3>
                {articles.slice(0, 8).map(article => (
                  <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                      <img loading="lazy" src={getImage(article)} alt={article.title} style={{ width: "70px", height: "52px", objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: "9px", color: CATEGORY_COLORS[article.category] || "#cc0000", fontWeight: "700", textTransform: "uppercase" }}>{article.category}</span>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{article.title}</p>
                        <p style={{ margin: "3px 0 0", fontSize: "10px", color: "#999" }}>{timeAgo(article.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Guides Sidebar */}
              {evergreenArticles?.length > 0 && (
                <div style={{ background: "#f1f8e9", border: "1px solid #c5e1a5", padding: "20px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#2e7d32", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #2e7d32" }}>
                    📚 Guides
                  </h3>
                  {evergreenArticles.slice(0, 3).map(guide => (
                    <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }}>
                      <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid #c5e1a5", cursor: "pointer" }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{guide.title}</p>
                        <span style={{ fontSize: "10px", color: "#2e7d32", fontWeight: "600" }}>Read guide →</span>
                      </div>
                    </Link>
                  ))}
                  <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>View all guides →</Link>
                </div>
              )}

              {/* Category Links */}
              <div style={{ background: "#fff", padding: "20px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>Browse by Category</h3>
                {['sports', 'finance', 'politics', 'technology'].map(cat => (
                  <Link key={cat} href={`/category/${cat}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#333", textTransform: "capitalize" }}>{cat}</span>
                      <span style={{ background: CATEGORY_COLORS[cat], color: "#fff", padding: "2px 8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase" }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </aside>

          </div>
        </main>

        {/* Footer */}
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
              <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Guides</Link>
            </div>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900", textAlign: "center" }}>
              NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
            </h2>
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>
              2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.
            </p>
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

  // Bug 2 fix — use .or() to handle both false and NULL for existing articles
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

  const allArticles = articles || [];
  const featuredArticle = allArticles[0] || null;
  const restArticles = allArticles.slice(1);

  return {
    props: {
      articles: restArticles,
      featuredArticle,
      evergreenArticles: evergreenArticles || [],
    },
  };
}
