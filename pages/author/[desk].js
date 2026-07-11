import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../../lib/slugify";

const DESK_CONFIG = {
  "sports-desk": {
    name: "Sports Desk",
    category: "sports",
    color: "#cc0000",
    icon: "S",
    title: "NewsOracle Sports Desk",
    bio: "The NewsOracle Sports Desk covers breaking sports news from the NFL, NBA, Premier League, UFC, tennis, cricket, Formula 1 and all major global sporting events. Our sports team monitors live scores, match results, transfer news and athlete stories around the clock to deliver fast, accurate sports journalism.",
    covers: ["NFL", "NBA", "Premier League", "UFC", "Tennis", "Cricket", "Formula 1", "World Cup", "Olympics"],
  },
  "markets-desk": {
    name: "Markets Desk",
    category: "finance",
    color: "#0052cc",
    icon: "M",
    title: "NewsOracle Markets Desk",
    bio: "The NewsOracle Markets Desk covers stock markets, cryptocurrency, economic policy and breaking financial news from Wall Street and global exchanges. Our financial team tracks Bitcoin, the S&P 500, Federal Reserve decisions, inflation data, and corporate earnings with data-driven analysis and market outlook.",
    covers: ["Bitcoin", "S&P 500", "Federal Reserve", "Cryptocurrency", "Inflation", "Stocks", "ETFs", "Earnings"],
  },
  "politics-desk": {
    name: "Politics Desk",
    category: "politics",
    color: "#2e7d32",
    icon: "P",
    title: "NewsOracle Politics Desk",
    bio: "The NewsOracle Politics Desk covers US politics, Congress, the White House, Supreme Court, global elections and international relations with neutral, fact-based reporting. Our political team monitors legislative developments, executive actions, judicial rulings and geopolitical events that shape policy and governance worldwide.",
    covers: ["US Congress", "White House", "Supreme Court", "Elections", "Senate", "NATO", "UN", "International Relations"],
  },
  "tech-desk": {
    name: "Tech Desk",
    category: "technology",
    color: "#7b1fa2",
    icon: "T",
    title: "NewsOracle Tech Desk",
    bio: "The NewsOracle Tech Desk covers breaking technology news including artificial intelligence, Apple, Google, Tesla, Meta, OpenAI, product launches, cybersecurity and the innovations shaping the future. Our technology team tracks the latest developments from Silicon Valley and global tech hubs.",
    covers: ["Artificial Intelligence", "Apple", "Google", "OpenAI", "Tesla", "Meta", "ChatGPT", "Cybersecurity", "Startups"],
  },
};

function getImage(article) {
  if (article.image && !article.image.includes('source.unsplash')) return article.image;
  const keywords = {
    finance: "1611974789855-9c2a0a7236a3",
    sports: "1461896836934-ffe607ba8211",
    politics: "1529107386315-e1a2ed48a620",
    technology: "1518770660439-4636190af475",
  };
  const key = keywords[article.category] || keywords.finance;
  return `https://images.unsplash.com/photo-${key}?w=800&q=80`;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AuthorPage({ desk, config, articles, totalCount }) {
  if (!config) return null;

  return (
    <>
      <Head>
        <title>{config.title} — NewsOracle</title>
        <meta name="description" content={`${config.bio.substring(0, 155)}`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.newsoracle.online/author/${desk}`} />
        <meta property="og:title" content={`${config.title} — NewsOracle`} />
        <meta property="og:description" content={config.bio.substring(0, 155)} />
        <meta property="og:url" content={`https://www.newsoracle.online/author/${desk}`} />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": config.name,
          "url": `https://www.newsoracle.online/author/${desk}`,
          "description": config.bio,
          "memberOf": {
            "@type": "Organization",
            "name": "NewsOracle",
            "url": "https://www.newsoracle.online"
          }
        })}} />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Sports · Finance · Markets · Analysis</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000" }}>
          <div style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <h1 style={{ fontSize: "42px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                    NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
                  </h1>
                </Link>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#999", letterSpacing: "3px", textTransform: "uppercase" }}>
                  Sports · Finance · Politics · Intelligence
                </p>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <Link href="/about" style={{ color: "#666", textDecoration: "none", fontSize: "13px" }}>About</Link>
                <Link href="/contact" style={{ color: "#666", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex" }}>
            {["sports","finance","politics","technology"].map(cat => (
              <Link key={cat} href={`/category/${cat}`} style={{ textDecoration: "none" }}>
                <div style={{ padding: "14px 24px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#333", borderBottom: "3px solid transparent" }}>
                  {cat}
                </div>
              </Link>
            ))}
          </div>
        </header>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px" }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px" }}>
            <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <span style={{ color: "#666", fontSize: "13px" }}>{config.name}</span>
          </div>

          {/* Author Header */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px" }}>
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "80px", height: "80px", background: config.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "32px" }}>{config.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <h2 style={{ fontSize: "28px", fontWeight: "900", color: "#111", margin: 0 }}>{config.name}</h2>
                  <span style={{ background: config.color, color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {totalCount} articles published
                  </span>
                </div>
                <p style={{ margin: "0 0 16px", fontSize: "13px", color: config.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  NewsOracle Editorial Team
                </p>
                <p style={{ margin: "0 0 20px", fontSize: "15px", color: "#444", lineHeight: "1.8" }}>
                  {config.bio}
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {config.covers.map(topic => (
                    <span key={topic} style={{ background: "#f0f0f0", color: "#555", padding: "4px 10px", fontSize: "11px", fontWeight: "600" }}>
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: config.color, fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px" }}>
              Latest from {config.name}
            </span>
            <Link href={`/category/${config.category}`} style={{ fontSize: "12px", color: config.color, textDecoration: "none", fontWeight: "600" }}>
              View all {config.category} →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {articles.map(article => (
              <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
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
                    {article.tag && (
                      <span style={{ position: "absolute", top: "10px", left: "10px", background: config.color, color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                        {article.tag}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 10px", color: "#111" }}>
                      {article.title}
                    </h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "10px" }}>
                      <span style={{ fontSize: "11px", color: "#999" }}>{timeAgo(article.created_at)}</span>
                      <span style={{ fontSize: "11px", color: config.color, fontWeight: "600" }}>Read more →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              <Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link>
              <Link href="/editorial-guidelines" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Editorial Guidelines</Link>
              <Link href="/privacy-policy" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Terms of Service</Link>
            </div>
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.</p>
          </div>
        </footer>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const desk = params.desk;

  if (!DESK_CONFIG[desk]) {
    return { notFound: true };
  }

  const config = DESK_CONFIG[desk];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data: articles, count } = await supabase
    .from("articles")
    .select("id, title, created_at, category, tag, image", { count: "exact" })
    .eq("category", config.category)
    .order("created_at", { ascending: false })
    .limit(30);

  return {
    props: {
      desk,
      config,
      articles: articles || [],
      totalCount: count || 0,
    },
  };
}
