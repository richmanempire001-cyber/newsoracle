import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../../lib/slugify";

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

const CATEGORY_CONFIG = {
  sports: { title: "Sports Guides", icon: "🏆", color: "#cc0000" },
  finance: { title: "Finance Guides", icon: "💰", color: "#0052cc" },
  politics: { title: "Politics Guides", icon: "🏛", color: "#2e7d32" },
  technology: { title: "Technology Guides", icon: "💻", color: "#7b1fa2" },
};

export default function GuidesHub({ guides }) {
  const byCategory = {};
  for (const cat of ['sports', 'finance', 'politics', 'technology']) {
    byCategory[cat] = guides.filter(g => g.category === cat);
  }

  return (
    <>
      <Head>
        <title>Guides & Resources — NewsOracle</title>
        <meta name="description" content="In-depth guides, explainers and evergreen resources covering Sports, Finance, Politics and Technology. In-depth guide by the NewsOracle editorial team." />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href="https://www.newsoracle.online/guides" />
        <meta property="og:title" content="Guides & Resources — NewsOracle" />
        <meta property="og:description" content="In-depth guides and evergreen resources covering Sports, Finance, Politics and Technology." />
        <meta property="og:url" content="https://www.newsoracle.online/guides" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        <div style={{ background: "#2e7d32", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Guides & Evergreen Resources</span>
          </div>
        </div>

        <header style={{ background: "#fff", borderBottom: "3px solid #2e7d32", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
              <Link href="/category/sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/category/finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/category/politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
              <Link href="/category/technology" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Technology</Link>
              <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", borderBottom: "2px solid #2e7d32" }}>Guides</Link>
            </nav>
          </div>
        </header>

        <style>{`@media (max-width: 600px) { nav { display: none !important; } header h1 { font-size: 28px !important; } .guides-grid { grid-template-columns: 1fr !important; } }`}</style>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

          <div style={{ marginBottom: "40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "32px" }}>📚</span>
              <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111", margin: 0 }}>Guides & Resources</h2>
            </div>
            <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", maxWidth: "700px", margin: "0 0 8px" }}>
              In-depth guides, complete histories and evergreen explainers covering Sports, Finance, Politics and Technology. Unlike news articles, these guides are updated regularly and remain useful indefinitely.
            </p>
            <div style={{ borderBottom: "3px solid #2e7d32", marginTop: "24px" }} />
          </div>

          {guides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>No guides published yet. Check back soon.</p>
            </div>
          ) : (
            <>
              {['sports', 'finance', 'politics', 'technology'].map(cat => {
                const catGuides = byCategory[cat];
                if (catGuides.length === 0) return null;
                const config = CATEGORY_CONFIG[cat];
                return (
                  <div key={cat} style={{ marginBottom: "48px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "24px" }}>{config.icon}</span>
                        <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111", margin: 0 }}>{config.title}</h3>
                      </div>
                      <Link href={`/guides/${cat}`} style={{ color: config.color, textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>View all {config.title} →</Link>
                    </div>
                    <div className="guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                      {catGuides.slice(0, 3).map(guide => (
                        <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }}>
                          <div style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", borderTop: `3px solid ${config.color}`, height: "100%" }}
                            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                          >
                            <img src={getImage(guide)} alt={guide.title} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
                            <div style={{ padding: "16px" }}>
                              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                                <span style={{ background: config.color, color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>GUIDE</span>
                                <span style={{ background: "#f0f0f0", color: "#555", padding: "3px 8px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase" }}>{guide.tag || cat}</span>
                              </div>
                              <h4 style={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 8px", color: "#111" }}>{guide.title}</h4>
                              <p style={{ color: "#777", fontSize: "13px", lineHeight: "1.5", margin: "0 0 12px" }}>{guide.summary?.substring(0, 100)}...</p>
                              <span style={{ fontSize: "11px", color: config.color, fontWeight: "600" }}>Read guide →</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </main>

        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
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

export async function getServerSideProps() {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data } = await supabaseServer
    .from("articles")
    .select("id, title, summary, image, category, tag, created_at")
    .eq("evergreen", true)
    .order("created_at", { ascending: false });

  return { props: { guides: data || [] } };
}
