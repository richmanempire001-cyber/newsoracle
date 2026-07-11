import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../lib/slugify";

const CATEGORIES = [
  { key: "sports", label: "Sports News", color: "#cc0000" },
  { key: "finance", label: "Finance & Markets", color: "#0052cc" },
  { key: "politics", label: "Politics", color: "#2e7d32" },
  { key: "technology", label: "Technology", color: "#7b1fa2" },
];

export default function SitemapHtml({ articlesByCategory }) {
  return (
    <>
      <Head>
        <title>Site Map — NewsOracle</title>
        <meta name="description" content="Browse all NewsOracle articles by category. Find the latest sports, finance, technology and politics news." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/sitemap-html" />
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

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px" }}>
            <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <span style={{ color: "#666", fontSize: "13px" }}>Site Map</span>
          </div>

          <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111", margin: "0 0 8px" }}>Site Map</h2>
          <p style={{ fontSize: "15px", color: "#666", margin: "0 0 40px" }}>Browse all NewsOracle content organized by section.</p>

          {/* Static Pages */}
          <div style={{ background: "#fff", padding: "32px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 20px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
              Main Pages
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {[
                { href: "/", label: "Homepage" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/corrections", label: "Corrections Policy" },
                { href: "/editorial-guidelines", label: "Editorial Guidelines" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/terms", label: "Terms of Service" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "10px 16px", background: "#f8f9fa", fontSize: "14px", color: "#333", fontWeight: "500" }}>
                    {label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Category Pages */}
          <div style={{ background: "#fff", padding: "32px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 20px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
              News Sections
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {CATEGORIES.map(({ key, label, color }) => (
                <Link key={key} href={`/category/${key}`} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "10px 16px", background: "#f8f9fa", fontSize: "14px", color: color, fontWeight: "700", borderLeft: `3px solid ${color}` }}>
                    {label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Author Pages */}
          <div style={{ background: "#fff", padding: "32px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 20px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
              Editorial Desks
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
              {[
                { href: "/author/sports-desk", label: "Sports Desk" },
                { href: "/author/markets-desk", label: "Markets Desk" },
                { href: "/author/politics-desk", label: "Politics Desk" },
                { href: "/author/tech-desk", label: "Tech Desk" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "10px 16px", background: "#f8f9fa", fontSize: "14px", color: "#333", fontWeight: "500" }}>
                    {label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Articles by Category */}
          {CATEGORIES.map(({ key, label, color }) => (
            <div key={key} style={{ background: "#fff", padding: "32px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "10px", borderBottom: `2px solid ${color}` }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: color, margin: 0 }}>
                  {label} — Latest Articles
                </h3>
                <Link href={`/category/${key}`} style={{ fontSize: "12px", color: color, textDecoration: "none", fontWeight: "600" }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: "grid", gap: "8px" }}>
                {(articlesByCategory[key] || []).map(article => (
                  <Link key={article.id} href={articlePath(article)} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#f8f9fa", fontSize: "13px" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0f0f0"}
                      onMouseLeave={e => e.currentTarget.style.background = "#f8f9fa"}
                    >
                      <span style={{ color: "#333", fontWeight: "500" }}>{article.title}</span>
                      <span style={{ color: "#999", fontSize: "11px", flexShrink: 0, marginLeft: "16px" }}>
                        {new Date(article.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

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

export async function getServerSideProps() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const articlesByCategory = {};
  await Promise.all(
    ["sports", "finance", "politics", "technology"].map(async (cat) => {
      const { data } = await supabase
        .from("articles")
        .select("id, title, created_at, category")
        .eq("category", cat)
        .order("created_at", { ascending: false })
        .limit(50);
      articlesByCategory[cat] = data || [];
    })
  );

  return { props: { articlesByCategory } };
}
