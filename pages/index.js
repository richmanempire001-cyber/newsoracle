import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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
  };
  const key = keywords[article.category] || keywords.finance;
  return `https://images.unsplash.com/photo-${key}?w=800&q=80`;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function Home({ initialArticles, featuredSports, featuredFinance, featuredPolitics }) {
  const [articles, setArticles] = useState(initialArticles || []);
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(20);
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const accepted = localStorage.getItem('cookieAccepted');
    if (accepted) setCookieAccepted(true);
  }, []);

  function acceptCookies() {
    localStorage.setItem('cookieAccepted', 'true');
    setCookieAccepted(true);
  }

  const categoryFiltered = filter === "all" ? articles : articles.filter(a => a.category === filter);
  const filtered = searchQuery.trim()
    ? categoryFiltered.filter(a =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tag?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categoryFiltered;
  const visibleArticles = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  return (
    <>
      <Head>
        <title>NewsOracle — Sports, Finance & Politics News</title>
        <meta name="description" content="NewsOracle delivers the latest sports, finance, crypto and politics news with in-depth analysis and market predictions. Updated around the clock." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="NewsOracle — Sports, Finance & Politics News" />
        <meta property="og:description" content="Latest sports, finance, crypto and politics news with expert analysis and market predictions. Updated around the clock." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80" />
        <meta property="og:url" content="https://www.newsoracle.online" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NewsOracle — Sports, Finance & Politics News" />
        <meta name="twitter:description" content="Latest sports, finance and politics news with expert analysis and market predictions." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80" />
        <link rel="canonical" href="https://www.newsoracle.online" />
        <meta name="msvalidate.01" content="4FDF3AAFAD2785FF5FD15E9D2AF5EC67" />
      </Head>

      <div style={{ fontFamily: "'Arial', sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Breaking News Ticker */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "8px 0", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ background: "#fff", color: "#cc0000", fontWeight: "900", fontSize: "11px", padding: "4px 12px", whiteSpace: "nowrap", marginRight: "16px", letterSpacing: "1px" }}>
              BREAKING
            </span>
            <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
              <span style={{ display: "inline-block", animation: "ticker 30s linear infinite", fontSize: "13px", fontWeight: "500" }}>
                {articles.slice(0, 5).map((a) => (
                  <span key={a.id}>
                    <Link href={`/article/${a.id}`} style={{ color: "#fff", textDecoration: "none" }}>
                      {a.title}
                    </Link>
                    <span style={{ margin: "0 32px", opacity: 0.5 }}>●</span>
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes ticker {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100%); }
          }
          @media (max-width: 600px) {
            .desktop-nav { display: none !important; }
            .header-inner { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
            .logo h1 { font-size: 28px !important; }
            .logo p { font-size: 9px !important; }
            .mobile-filters { display: flex !important; }
            .top-bar-right { display: none !important; }
            .featured-grid { grid-template-columns: 1fr !important; }
          }
          .mobile-filters { display: none; gap: 6px; flex-wrap: wrap; }
        `}</style>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="top-bar-right">Sports · Finance · Markets · Politics · Analysis</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div className="header-inner" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="logo">
                <h1 style={{ fontSize: "42px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                  NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
                </h1>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#999", letterSpacing: "3px", textTransform: "uppercase" }}>
                  Sports · Finance · Politics · Intelligence
                </p>
              </div>
              <nav className="desktop-nav" style={{ display: "flex", gap: "4px" }}>
                <div style={{ display: "flex", gap: "20px", marginRight: "20px" }}>
                  <Link href="/about" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>About</Link>
                  <Link href="/contact" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Contact</Link>
                </div>
                {["all", "sports", "finance", "politics"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setFilter(cat); setVisible(20); }}
                    style={{
                      padding: "8px 18px",
                      background: filter === cat ? "#cc0000" : "transparent",
                      color: filter === cat ? "#fff" : "#333",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
              <div className="mobile-filters">
                {["all", "sports", "finance", "politics"].map(cat => (
                  <button key={cat} onClick={() => { setFilter(cat); setVisible(20); }} style={{ padding: "6px 14px", background: filter === cat ? "#cc0000" : "transparent", color: filter === cat ? "#fff" : "#333", border: "1px solid #ddd", cursor: "pointer", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            {/* Search Bar */}
            <div style={{ marginTop: "16px" }}>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setVisible(20); }}
                style={{
                  width: "100%",
                  maxWidth: "400px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  border: "1px solid #ddd",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>
          {articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>No articles yet. Check back soon.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>No articles found for "{searchQuery}".</p>
            </div>
          ) : (
            <>
              {/* Featured Stories — 3 cards, one per category */}
              {filter === "all" && !searchQuery.trim() && (
                <>
                  <div style={{ marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", color: "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>Top Stories</span>
                  </div>
                  <div className="featured-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "40px" }}>
                    {[featuredSports, featuredFinance, featuredPolitics].filter(Boolean).map(article => (
                      <Link key={article.id} href={`/article/${article.id}`} style={{ textDecoration: "none" }}>
                        <div style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", height: "100%" }}>
                          <div style={{ position: "relative", overflow: "hidden" }}>
                            <img
                              src={getImage(article)}
                              alt={article.title}
                              style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }}
                            />
                            <span style={{ position: "absolute", top: "12px", left: "12px", background: "#cc0000", color: "#fff", padding: "3px 10px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                              {article.category}
                            </span>
                          </div>
                          <div style={{ padding: "16px" }}>
                            <h2 style={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.3", margin: "0 0 10px", color: "#111" }}>
                              {article.title}
                            </h2>
                            <p style={{ color: "#666", fontSize: "13px", lineHeight: "1.5", margin: "0 0 12px" }}>
                              {article.summary?.substring(0, 100)}...
                            </p>
                            <span style={{ fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ borderBottom: "2px solid #cc0000", marginBottom: "24px", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>Latest News</span>
                  </div>
                </>
              )}

              {/* Article Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {visibleArticles.map(article => (
                  <Link key={article.id} href={`/article/${article.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "#fff", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        <img
                          src={getImage(article)}
                          alt={article.title}
                          style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                        />
                        <span style={{ position: "absolute", top: "10px", left: "10px", background: article.category === "finance" ? "#0052cc" : "#cc0000", color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                          {article.tag || article.category}
                        </span>
                      </div>
                      <div style={{ padding: "16px" }}>
                        <h3 style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 10px", color: "#111" }}>
                          {article.title}
                        </h3>
                        <p style={{ color: "#777", fontSize: "13px", lineHeight: "1.5", margin: "0 0 12px" }}>
                          {article.summary?.substring(0, 100)}...
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                          <span style={{ fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</span>
                          <span style={{ fontSize: "11px", color: "#cc0000", fontWeight: "600" }}>Read more →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <button
                    onClick={() => setVisible(v => v + 20)}
                    style={{ background: "#cc0000", color: "#fff", border: "none", padding: "14px 40px", fontSize: "14px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Cookie Banner */}
        {!cookieAccepted && (
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", color: "#fff", padding: "16px 20px", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#ccc", maxWidth: "700px" }}>
              We use cookies to improve your experience and show relevant ads. By continuing to use NewsOracle, you agree to our{" "}
              <Link href="/privacy-policy" style={{ color: "#cc0000" }}>Privacy Policy</Link>{" "}and{" "}
              <Link href="/terms" style={{ color: "#cc0000" }}>Terms of Service</Link>.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={acceptCookies} style={{ background: "#cc0000", color: "#fff", border: "none", padding: "10px 24px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                Accept All
              </button>
              <button onClick={acceptCookies} style={{ background: "transparent", color: "#999", border: "1px solid #555", padding: "10px 24px", fontSize: "13px", cursor: "pointer" }}>
                Accept Necessary
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "24px", fontWeight: "900" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h2>
              <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
                <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "13px", textDecoration: "none", background: "#0088cc", padding: "8px 16px" }}>Telegram</a>
                <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", fontSize: "13px", textDecoration: "none", background: "#1877f2", padding: "8px 16px" }}>Facebook</a>
              </div>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Sports</span>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Finance</span>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Markets</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              <Link href="/privacy-policy" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Terms of Service</Link>
            </div>
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>
              © 2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.
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

  const { data } = await supabaseServer
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  const articles = data || [];

  const featuredSports = articles.find(a => a.category === "sports") || null;
  const featuredFinance = articles.find(a => a.category === "finance") || null;
  const featuredPolitics = articles.find(a => a.category === "politics") || null;

  return {
    props: {
      initialArticles: articles,
      featuredSports,
      featuredFinance,
      featuredPolitics,
    },
  };
}
