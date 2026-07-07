import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../../lib/slugify";

const CATEGORY_CONFIG = {
  sports: {
    title: "Sports News",
    description: "Breaking sports news, live scores, match analysis and highlights from the NFL, NBA, Premier League, UFC, tennis, cricket and all major global sporting events.",
    color: "#cc0000",
    icon: "🏆",
    keywords: "sports news, live scores, NFL, NBA, Premier League, UFC, tennis, cricket",
  },
  finance: {
    title: "Finance & Markets",
    description: "Stock market updates, cryptocurrency news, economic analysis and breaking financial reports covering Wall Street, Bitcoin, S&P 500, Fed decisions and global markets.",
    color: "#0052cc",
    icon: "💰",
    keywords: "finance news, stock market, cryptocurrency, Bitcoin, S&P 500, Wall Street, Fed",
  },
  politics: {
    title: "Politics",
    description: "US and global political news covering Congress, the White House, Supreme Court, elections, international relations and policy decisions that shape the world.",
    color: "#2e7d32",
    icon: "🏛️",
    keywords: "politics news, US politics, Congress, White House, Supreme Court, elections, Senate",
  },
};

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

function getReadTime(text) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.ceil(words / 200);
}

export default function CategoryPage({ category, config, articles, heroArticle, editorsPicks, trending }) {
  const [visible, setVisible] = useState(12);

  const remaining = articles.filter(a => a.id !== heroArticle?.id);
  const visibleArticles = remaining.slice(0, visible);
  const hasMore = remaining.length > visible;

  return (
    <>
      <Head>
        <title>{config.title} — NewsOracle</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.newsoracle.online/category/${category}`} />
        <meta property="og:title" content={`${config.title} — NewsOracle`} />
        <meta property="og:description" content={config.description} />
        <meta property="og:url" content={`https://www.newsoracle.online/category/${category}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta property="og:image" content={heroArticle ? getImage(heroArticle) : "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${config.title} — NewsOracle`} />
        <meta name="twitter:description" content={config.description} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${config.title} — NewsOracle`,
          "description": config.description,
          "url": `https://www.newsoracle.online/category/${category}`,
          "isPartOf": {
            "@type": "WebSite",
            "name": "NewsOracle",
            "url": "https://www.newsoracle.online"
          },
          "publisher": {
            "@type": "Organization",
            "name": "NewsOracle",
            "url": "https://www.newsoracle.online",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.newsoracle.online/favicon.ico"
            }
          }
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.newsoracle.online" },
            { "@type": "ListItem", "position": 2, "name": config.title, "item": `https://www.newsoracle.online/category/${category}` }
          ]
        })}} />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: config.color, color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="top-bar-right">{config.title} · NewsOracle</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: `3px solid ${config.color}`, padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
            <nav className="desktop-nav" style={{ display: "flex", gap: "4px" }}>
              {["sports", "finance", "politics"].map(cat => (
                <Link
                  key={cat}
                  href={`/category/${cat}`}
                  style={{
                    padding: "8px 18px",
                    background: category === cat ? config.color : "transparent",
                    color: category === cat ? "#fff" : "#333",
                    border: "1px solid #ddd",
                    fontSize: "13px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    textDecoration: "none",
                  }}
                >
                  {cat}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <style>{`
          @media (max-width: 600px) {
            .desktop-nav { display: none !important; }
            header h1 { font-size: 28px !important; }
            .top-bar-right { display: none !important; }
            .hero-grid { grid-template-columns: 1fr !important; }
            .content-grid { grid-template-columns: 1fr !important; }
            .hero-image { height: 240px !important; }
            .hero-title { font-size: 24px !important; }
          }
        `}</style>

        {/* Breadcrumb */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px 20px 0" }}>
          <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
          <span style={{ color: "#999", margin: "0 8px" }}>›</span>
          <span style={{ color: "#666", fontSize: "13px", fontWeight: "600", textTransform: "capitalize" }}>{config.title}</span>
        </div>

        {/* Category Header */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "32px" }}>{config.icon}</span>
            <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111", margin: 0 }}>{config.title}</h2>
          </div>
          <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", margin: "0 0 24px", maxWidth: "700px" }}>
            {config.description}
          </p>
          <div style={{ borderBottom: `3px solid ${config.color}`, marginBottom: "24px" }} />
        </div>

        {/* Hero Article */}
        {heroArticle && (
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 32px" }}>
            <Link href={articlePath(heroArticle)} style={{ textDecoration: "none" }}>
              <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "0", background: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.08)", cursor: "pointer", overflow: "hidden" }}>
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={getImage(heroArticle)}
                    alt={heroArticle.title}
                    className="hero-image"
                    style={{ width: "100%", height: "360px", objectFit: "cover", display: "block" }}
                  />
                  <span style={{ position: "absolute", top: "16px", left: "16px", background: config.color, color: "#fff", padding: "4px 14px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                    {heroArticle.tag || category}
                  </span>
                </div>
                <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span style={{ fontSize: "11px", color: config.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "12px" }}>
                    Lead Story
                  </span>
                  <h3 className="hero-title" style={{ fontSize: "28px", fontWeight: "900", lineHeight: "1.2", margin: "0 0 16px", color: "#111" }}>
                    {heroArticle.title}
                  </h3>
                  <p style={{ fontSize: "15px", color: "#555", lineHeight: "1.7", margin: "0 0 20px" }}>
                    {heroArticle.summary?.substring(0, 200)}...
                  </p>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "#999" }}>By <strong style={{ color: "#666" }}>{heroArticle.author || 'NewsOracle Editorial'}</strong></span>
                    <span style={{ fontSize: "12px", color: "#999" }}>{timeAgo(heroArticle.created_at)}</span>
                    <span style={{ fontSize: "12px", color: "#999" }}>📖 {getReadTime(heroArticle.summary)} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Main Content + Sidebar */}
        <div className="content-grid" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 40px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>

          {/* Article Grid */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", color: config.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>Latest {config.title}</span>
              <span style={{ fontSize: "12px", color: "#999" }}>{articles.length} articles</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
              {visibleArticles.map(article => (
                <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "transform 0.2s", height: "100%" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        loading="lazy"
                        src={getImage(article)}
                        alt={article.title}
                        style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }}
                      />
                      <span style={{ position: "absolute", top: "10px", left: "10px", background: config.color, color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                        {article.tag || category}
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
                        <span style={{ fontSize: "11px", color: config.color, fontWeight: "600" }}>Read more →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                  onClick={() => setVisible(v => v + 12)}
                  style={{ background: config.color, color: "#fff", border: "none", padding: "14px 40px", fontSize: "14px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", textTransform: "uppercase" }}
                >
                  Load More {config.title}
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            {/* Trending */}
            <div style={{ background: "#fff", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: `2px solid ${config.color}` }}>
                🔥 Trending in {config.title}
              </h3>
              {trending.map((article, idx) => (
                <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "24px", fontWeight: "900", color: config.color, lineHeight: "1", flexShrink: 0, width: "28px" }}>
                      {idx + 1}
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{article.title}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Editor's Picks */}
            {editorsPicks.length > 0 && (
              <div style={{ background: "#fff", padding: "24px", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: `2px solid ${config.color}` }}>
                  ✨ Editor's Picks
                </h3>
                {editorsPicks.map(article => (
                  <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                    <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                      <img loading="lazy" src={getImage(article)} alt={article.title} style={{ width: "100%", height: "140px", objectFit: "cover", marginBottom: "10px", display: "block" }} />
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#111", lineHeight: "1.4" }}>{article.title}</p>
                      <p style={{ margin: "6px 0 0", fontSize: "12px", color: "#777", lineHeight: "1.5" }}>{article.summary?.substring(0, 80)}...</p>
                      <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            

            {/* Other Sections */}
            <div style={{ background: "#fff", padding: "24px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #ddd" }}>
                Other Sections
              </h3>
              {Object.entries(CATEGORY_CONFIG).filter(([cat]) => cat !== category).map(([cat, cfg]) => (
                <Link key={cat} href={`/category/${cat}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                    <span style={{ fontSize: "24px" }}>{cfg.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#111" }}>{cfg.title}</p>
                      <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#999" }}>Latest coverage →</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

        </div>

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
                <Link href="/category/sports" style={{ color: "#999", fontSize: "13px", textDecoration: "none" }}>Sports</Link>
                <Link href="/category/finance" style={{ color: "#999", fontSize: "13px", textDecoration: "none" }}>Finance</Link>
                <Link href="/category/politics" style={{ color: "#999", fontSize: "13px", textDecoration: "none" }}>Politics</Link>
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

export async function getServerSideProps({ params }) {
  const category = params.cat;

  if (!CATEGORY_CONFIG[category]) {
    return { notFound: true };
  }

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  // Main articles — latest 30
  const { data: articles } = await supabaseServer
    .from("articles")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false })
    .limit(30);

  const allArticles = articles || [];

  // Hero = most recent article
  const heroArticle = allArticles[0] || null;

  // Trending = articles 1-5 (most recent after hero)
  const trending = allArticles.slice(1, 6);

  // Editor's Picks = articles 6-8 (slightly older but still recent)
  const editorsPicks = allArticles.slice(6, 9);

  return {
    props: {
      category,
      config: CATEGORY_CONFIG[category],
      articles: allArticles,
      heroArticle,
      editorsPicks,
      trending,
    },
  };
}
