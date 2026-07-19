import Head from "next/head";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { articlePath } from "../../lib/slugify";

const CATEGORY_CONFIG = {
  sports: { title: "Sports Guides", description: "Complete guides covering the NFL, NBA, Premier League, World Cup, UFC, tennis, cricket and all major global sporting events.", color: "#cc0000", icon: "🏆" },
  finance: { title: "Finance & Markets Guides", description: "In-depth guides covering Bitcoin, cryptocurrency, stock markets, Fed policy, inflation and personal finance.", color: "#0052cc", icon: "💰" },
  politics: { title: "Politics Guides", description: "Complete explainers covering US politics, Congress, the Supreme Court, elections and international relations.", color: "#2e7d32", icon: "🏛" },
  technology: { title: "Technology Guides", description: "In-depth guides covering AI tools, Apple, Google, Tesla, Meta, OpenAI and the innovations shaping the future.", color: "#7b1fa2", icon: "💻" },
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

export default function CategoryGuides({ category, config, guides }) {
  return (
    <>
      <Head>
        <title>{config.title} — NewsOracle</title>
        <meta name="description" content={config.description} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={`https://www.newsoracle.online/guides/${category}`} />
        <meta property="og:title" content={`${config.title} — NewsOracle`} />
        <meta property="og:description" content={config.description} />
        <meta property="og:url" content={`https://www.newsoracle.online/guides/${category}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `${config.title} — NewsOracle`,
          "description": config.description,
          "url": `https://www.newsoracle.online/guides/${category}`,
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://www.newsoracle.online" }
        })}} />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        <div style={{ background: config.color, color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span>{config.title} · NewsOracle</span>
          </div>
        </div>

        <header style={{ background: "#fff", borderBottom: `3px solid ${config.color}`, padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
              <Link href="/category/sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/category/finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/category/politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
              <Link href="/category/technology" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Technology</Link>
              <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "13px", fontWeight: "700", textTransform: "uppercase" }}>Guides</Link>
            </nav>
          </div>
        </header>

        <style>{`@media (max-width: 600px) { nav { display: none !important; } header h1 { font-size: 28px !important; } .guides-grid { grid-template-columns: 1fr !important; } }`}</style>

        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

          <div style={{ marginBottom: "8px" }}>
            <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <Link href="/guides" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Guides</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <span style={{ color: "#666", fontSize: "13px", fontWeight: "600" }}>{config.title}</span>
          </div>

          <div style={{ marginBottom: "40px", marginTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ fontSize: "32px" }}>{config.icon}</span>
              <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#111", margin: 0 }}>{config.title}</h2>
            </div>
            <p style={{ fontSize: "15px", color: "#666", lineHeight: "1.6", maxWidth: "700px", margin: "0 0 24px" }}>{config.description}</p>
            <div style={{ borderBottom: `3px solid ${config.color}` }} />
          </div>

          {guides.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px", color: "#999" }}>
              <p style={{ fontSize: "18px" }}>No guides in this category yet. Check back soon.</p>
              <Link href="/guides" style={{ color: "#2e7d32", textDecoration: "none", fontSize: "14px", fontWeight: "600" }}>Browse all guides →</Link>
            </div>
          ) : (
            <div className="guides-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {guides.map(guide => (
                <Link key={guide.id} href={articlePath(guide)} style={{ textDecoration: "none" }}>
                  <div style={{ background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", cursor: "pointer", borderTop: `3px solid ${config.color}`, height: "100%" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <img src={getImage(guide)} alt={guide.title} style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ background: config.color, color: "#fff", padding: "3px 8px", fontSize: "10px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>GUIDE</span>
                        {guide.tag && <span style={{ background: "#f0f0f0", color: "#555", padding: "3px 8px", fontSize: "10px", fontWeight: "600", textTransform: "uppercase" }}>{guide.tag}</span>}
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.4", margin: "0 0 10px", color: "#111" }}>{guide.title}</h3>
                      <p style={{ color: "#777", fontSize: "13px", lineHeight: "1.5", margin: "0 0 16px" }}>{guide.summary?.substring(0, 120)}...</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: "12px" }}>
                        <span style={{ fontSize: "11px", color: "#999" }}>Updated regularly</span>
                        <span style={{ fontSize: "11px", color: config.color, fontWeight: "600" }}>Read guide →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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

export async function getServerSideProps({ params }) {
  const category = params.cat;
  if (!CATEGORY_CONFIG[category]) return { notFound: true };

  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data } = await supabaseServer
    .from("articles")
    .select("id, title, summary, image, category, tag, created_at")
    .eq("evergreen", true)
    .eq("category", category)
    .order("created_at", { ascending: false });

  return {
    props: {
      category,
      config: CATEGORY_CONFIG[category],
      guides: data || [],
    },
  };
}
