import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

const IMAGES = {
  finance: [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    "https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&q=80",
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=800&q=80",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80",
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    "https://images.unsplash.com/photo-1540747913346-19212a4b423f?w=800&q=80",
    "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
  ],
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

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setArticles(data);
    setLoading(false);
  }

  const filtered = filter === "all" ? articles : articles.filter(a => a.category === filter);
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <>
      <Head>
        <title>NewsOracle — Sports & Finance News</title>
        <meta name="description" content="Latest sports and finance news, analysis and market insights" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={{ fontFamily: "'Arial', sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Sports · Finance · Markets · Politics · Analysis</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h1 style={{ fontSize: "42px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                  NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
                </h1>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#999", letterSpacing: "3px", textTransform: "uppercase" }}>
                  Sports · Finance · Politics · Intelligence
                </p>
              </div>
              <nav style={{ display: "flex", gap: "4px" }}>
                {["all", "sports", "finance", "politics"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
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
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 20px" }}>

          {loading ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>Loading latest news...</p>
            </div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>No articles yet. Check back soon.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <Link href={`/article/${featured.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", background: "#fff", marginBottom: "24px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                    <div style={{ position: "relative", overflow: "hidden" }}>
                      <img
                        src={getImage(featured)}
                        alt={featured.title}
                        style={{ width: "100%", height: "380px", objectFit: "cover", display: "block" }}
                      />
                      <span style={{ position: "absolute", top: "16px", left: "16px", background: "#cc0000", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>
                        {featured.category}
                      </span>
                    </div>
                    <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ fontSize: "11px", color: "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                        Top Story
                      </span>
                      <h2 style={{ fontSize: "28px", fontWeight: "900", lineHeight: "1.2", margin: "12px 0 16px", color: "#111" }}>
                        {featured.title}
                      </h2>
                      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", margin: "0 0 20px" }}>
                        {featured.summary?.substring(0, 180)}...
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "12px", color: "#999" }}>{timeAgo(featured.created_at)}</span>
                        <span style={{ background: featured.sentiment === "positive" ? "#e8f5e9" : featured.sentiment === "negative" ? "#ffebee" : "#f5f5f5", color: featured.sentiment === "positive" ? "#2e7d32" : featured.sentiment === "negative" ? "#c62828" : "#666", padding: "3px 10px", fontSize: "11px", fontWeight: "600", borderRadius: "3px", textTransform: "uppercase" }}>
                          {featured.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Article Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                {rest.map(article => (
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
            </>
          )}
        </main>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", paddingBottom: "20px", marginBottom: "20px" }}>
              <h2 style={{ color: "#fff", margin: 0, fontSize: "24px", fontWeight: "900" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h2>
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Sports</span>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Finance</span>
                <span style={{ fontSize: "13px", cursor: "pointer" }}>Markets</span>
              </div>
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
