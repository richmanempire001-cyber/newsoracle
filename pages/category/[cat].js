import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { slugify, articlePath, articleUrl } from "../../lib/slugify";

const CATEGORY_CONFIG = {
  sports: {
    title: "Sports",
    description: "Breaking sports news from the NFL, NBA, Premier League, UFC, tennis, cricket and all major global sporting events.",
    color: "#cc0000",
    icon: "🏆",
    keywords: "sports news, NFL, NBA, Premier League, UFC, tennis, cricket, World Cup"
  },
  finance: {
    title: "Finance",
    description: "Stock market updates, cryptocurrency news, economic analysis and breaking financial reports covering Wall Street, Bitcoin and global markets.",
    color: "#0052cc",
    icon: "💰",
    keywords: "finance news, Bitcoin, stocks, cryptocurrency, markets, Wall Street, Fed, inflation"
  },
  politics: {
    title: "Politics",
    description: "US and global political news covering Congress, the White House, Supreme Court, elections and international relations.",
    color: "#2e7d32",
    icon: "🏛",
    keywords: "politics news, US politics, Congress, White House, Supreme Court, elections, Trump"
  },
  technology: {
    title: "Technology",
    description: "Breaking technology news covering AI, Apple, Google, Tesla, Meta, OpenAI, product launches and the innovations shaping the future.",
    color: "#111111",
    icon: "💻",
    keywords: "technology news, AI, Apple, Google, Tesla, Meta, OpenAI, ChatGPT, startups"
  }
};

function getImage(article) {
  if (article.image && !article.image.includes('source.unsplash')) return article.image;
  const keywords = {
    finance: "1611974789855-9c2a0a7236a3",
    sports: "1461896836934-ffe607ba8211",
    politics: "1529107386315-e1a2ed48a620",
    technology: "1518770660439-4636190af475",
  };
  return `https://images.unsplash.com/photo-${keywords[article.category] || keywords.finance}?w=800&q=80`;
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

export default function CategoryPage({ category, config, articles, featuredArticle, totalCount }) {
  if (!config) return null;

  return (
    <>
      <Head>
        <title>{`${config.title} News — NewsOracle`}</title>
        <meta name="description" content={config.description} />
        <meta name="keywords" content={config.keywords} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`https://www.newsoracle.online/category/${category}`} />
        <meta property="og:title" content={`${config.title} News — NewsOracle`} />
        <meta property="og:description" content={config.description} />
        <meta property="og:url" content={`https://www.newsoracle.online/category/${category}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${config.title} News — NewsOracle`,
          "description": config.description,
          "url": `https://www.newsoracle.online/category/${category}`,
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://www.newsoracle.online" }
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
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
              {['sports', 'finance', 'politics', 'technology'].map(cat => (
                <Link key={cat} href={`/category/${cat}`} style={{
                  color: cat === category ? config.color : "#333",
                  textDecoration: "none", fontSize: "13px", fontWeight: "700", textTransform: "uppercase",
                  borderBottom: cat === category ? `2px solid ${config.color}` : "none",
                  paddingBottom: "2px"
                }}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Link>
              ))}
              <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Guides</Link>
            </nav>
          </div>
        </header>

        <style>{`
          @media (max-width: 600px) {
            nav { display: none !important; }
            header h1 { font-size: 28px !important; }
            .top-bar-right { display: none !important; }
            .cat-grid { grid-template-columns: 1fr !important; }
            .cat-layout { grid-template-columns: 1fr !important; }
          }
          .cat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); transition: all 0.2s; }
        `}</style>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: "20px" }}>
            <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <span style={{ color: "#666", fontSize: "13px", fontWeight: "600" }}>{config.title}</span>
          </div>

          {/* Category Header */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px" }}>{config.icon}</span>
              <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111", margin: 0, letterSpacing: "-1px" }}>{config.title}</h2>
            </div>
            <p style={{ fontSize: "14px", color: "#777", lineHeight: "1.6", maxWidth: "700px", margin: "0 0 20px" }}>{config.description}</p>
            <div style={{ borderBottom: `3px solid ${config.color}` }} />
          </div>

          <div className="cat-layout" style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "32px" }}>

            <div>
              {/* Featured */}
              {featuredArticle && (
                <Link href={articlePath(featuredArticle)} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", marginBottom: "28px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"}
                  >
                    <img src={getImage(featuredArticle)} alt={featuredArticle.title} style={{ width: "100%", height: "360px", objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "24px" }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ background: config.color, color: "#fff", padding: "3px 10px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>LEAD STORY</span>
                        {featuredArticle.tag && <span style={{ background: "#f0f0f0", color: "#555", padding: "3px 10px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase" }}>{featuredArticle.tag}</span>}
                      </div>
                      <h2 style={{ fontSize: "26px", fontWeight: "900", color: "#111", margin: "0 0 12px", lineHeight: "1.3", letterSpacing: "-0.5px" }}>{featuredArticle.title}</h2>
                      <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.65", margin: "0 0 16px" }}>
                        {featuredArticle.summary?.split('\n\n')[0]?.replace(/^[A-Z\s]+ — /, '')?.substring(0, 220)}...
                      </p>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center", fontSize: "12px", color: "#999" }}>
                        <span>By <strong style={{ color: "#555" }}>{featuredArticle.author}</strong></span>
                        <span>·</span>
                        <span>{timeAgo(featuredArticle.created_at)}</span>
                        <span>·</span>
                        <span>{getReadTime(featuredArticle.summary)} min read</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Articles Count */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: config.color }}>Latest {config.title}</span>
                <span style={{ fontSize: "12px", color: "#999" }}>{totalCount} articles</span>
              </div>

              {/* Articles Grid */}
              <div className="cat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                {articles.map(article => (
                  <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                    <div className="cat-card" style={{ background: "#fff", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                      <img loading="lazy" src={getImage(article)} alt={article.title} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                      <div style={{ padding: "16px" }}>
                        {article.tag && <span style={{ fontSize: "9px", color: config.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{article.tag}</span>}
                        <h3 style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.4", margin: "6px 0 8px", color: "#111", letterSpacing: "-0.2px" }}>{article.title}</h3>
                        <p style={{ color: "#777", fontSize: "12px", lineHeight: "1.55", margin: "0 0 12px" }}>
                          {article.summary?.split('\n\n')[0]?.replace(/^[A-Z\s]+ — /, '')?.substring(0, 100)}...
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f5f5f5", paddingTop: "10px", fontSize: "11px", color: "#bbb" }}>
                          <span>{timeAgo(article.created_at)}</span>
                          <span>{getReadTime(article.summary)} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside>
              <div style={{ background: "#fff", padding: "20px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: `2px solid ${config.color}` }}>Trending {config.title}</h3>
                {articles.slice(0, 6).map((article, i) => (
                  <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                      <span style={{ fontSize: "24px", fontWeight: "900", color: "#eee", flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <p style={{ margin: 0, fontSize: "12px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{article.title}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "10px", color: "#bbb" }}>{timeAgo(article.created_at)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div style={{ background: "#fff", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>Other Categories</h3>
                {Object.entries(CATEGORY_CONFIG).filter(([cat]) => cat !== category).map(([cat, conf]) => (
                  <Link key={cat} href={`/category/${cat}`} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>{conf.icon} {conf.title}</span>
                      <span style={{ width: "8px", height: "8px", background: conf.color, display: "inline-block", borderRadius: "50%" }} />
                    </div>
                  </Link>
                ))}
                <Link href="/guides" style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", cursor: "pointer" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>📚 Guides</span>
                    <span style={{ width: "8px", height: "8px", background: "#111", display: "inline-block", borderRadius: "50%" }} />
                  </div>
                </Link>
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
            </div>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900", textAlign: "center" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h2>
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>2026 NewsOracle. All content is for informational purposes only.</p>
          </div>
        </footer>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const category = params.cat;
  if (!CATEGORY_CONFIG[category]) return { notFound: true };

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data: allArticles, count } = await supabaseServer
    .from("articles")
    .select("*", { count: "exact" })
    .eq("category", category)
    .or("evergreen.eq.false,evergreen.is.null")
    .order("created_at", { ascending: false })
    .limit(31);

  const articles = allArticles || [];
  const featuredArticle = articles[0] || null;
  const restArticles = articles.slice(1);

  return {
    props: {
      category,
      config: CATEGORY_CONFIG[category],
      articles: restArticles,
      featuredArticle,
      totalCount: count || articles.length,
    },
  };
}
