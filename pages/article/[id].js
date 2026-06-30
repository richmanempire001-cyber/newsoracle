import { useRouter } from "next/router";
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
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf43e?w=1200&q=80",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=1200&q=80",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80",
  ],
  sports: [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
    "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&q=80",
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&q=80",
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
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
  return `https://images.unsplash.com/photo-${key}?w=1200&q=80`;
}

export default function ArticlePage({ ogData }) {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  async function fetchArticle() {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();
    setArticle(data);

    if (data) {
      const { data: rel } = await supabase
        .from("articles")
        .select("*")
        .eq("category", data.category)
        .neq("id", id)
        .order("created_at", { ascending: false })
        .limit(3);
      setRelated(rel || []);
    }
    setLoading(false);
  }

  if (loading) return (
    <>
      <Head>
        <title>{ogData?.title || "NewsOracle"} — NewsOracle</title>
        <meta name="description" content={ogData?.summary || ""} />
        <meta property="og:title" content={ogData?.title || "NewsOracle"} />
        <meta property="og:description" content={ogData?.summary || ""} />
        <meta property="og:image" content={ogData?.image || ""} />
        <meta property="og:url" content={ogData?.url || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData?.title || "NewsOracle"} />
        <meta name="twitter:description" content={ogData?.summary || ""} />
        <meta name="twitter:image" content={ogData?.image || ""} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": ogData?.title || "",
          "description": ogData?.summary || "",
          "image": ogData?.image || "",
          "url": ogData?.url || "",
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://newsoracle.online" }
        })}} />
      </Head>
      <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "100px", background: "#f4f4f4", minHeight: "100vh" }}>
        <p style={{ color: "#666", fontSize: "18px" }}>Loading...</p>
      </div>
    </>
  );

  if (!article) return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "100px" }}>
      <p>Article not found.</p>
      <Link href="/" style={{ color: "#cc0000" }}>← Back to Home</Link>
    </div>
  );

  return (
    <>
      <Head>
        <title>{ogData?.title || "NewsOracle"} — NewsOracle</title>
        <meta name="description" content={ogData?.summary || ""} />
        <meta property="og:title" content={ogData?.title || "NewsOracle"} />
        <meta property="og:description" content={ogData?.summary || ""} />
        <meta property="og:image" content={ogData?.image || ""} />
        <meta property="og:url" content={ogData?.url || ""} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogData?.title || "NewsOracle"} />
        <meta name="twitter:description" content={ogData?.summary || ""} />
        <meta name="twitter:image" content={ogData?.image || ""} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": ogData?.title || "",
          "description": ogData?.summary || "",
          "image": ogData?.image || "",
          "url": ogData?.url || "",
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://newsoracle.online" }
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
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
              <Link href="/?cat=sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/?cat=finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/?cat=politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
            </nav>
          </div>
        </header>
        <style>{`
          @media (max-width: 600px) {
            nav { display: none !important; }
            header h1 { font-size: 28px !important; }
          }
        `}</style>

        {/* Article Content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "min(100%, 1fr)", gap: "32px" }}>

          {/* Main Article */}
          <article style={{ background: "#fff", padding: "40px" }}>

            {/* Breadcrumb */}
            <div style={{ marginBottom: "20px" }}>
              <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
              <span style={{ color: "#999", margin: "0 8px" }}>›</span>
              <span style={{ color: "#999", fontSize: "13px", textTransform: "capitalize" }}>{article.category}</span>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
              <span style={{ background: "#cc0000", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                {article.category}
              </span>
              {article.tag && (
                <span style={{ background: "#f0f0f0", color: "#555", padding: "4px 12px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>
                  {article.tag}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "34px", fontWeight: "900", lineHeight: "1.2", margin: "0 0 20px", color: "#111" }}>
              {article.title}
            </h1>

            {/* Meta */}
            <div style={{ display: "flex", gap: "20px", padding: "14px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", marginBottom: "28px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>By <strong>NewsOracle Editorial</strong></span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                {new Date(article.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                {new Date(article.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} GMT
              </span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                📖 {Math.ceil((article.summary?.length || 500) / 200)} min read
              </span>
            </div>

            {/* Hero Image */}
            <img
              src={getImage(article)}
              alt={article.title}
              style={{ width: "100%", height: "420px", objectFit: "cover", marginBottom: "28px", display: "block" }}
            />

            {/* Key Points Box */}
            <div style={{ background: "#fff8f8", border: "1px solid #ffcccc", borderLeft: "4px solid #cc0000", padding: "20px 24px", marginBottom: "28px" }}>
              <h3 style={{ color: "#cc0000", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px" }}>🔴 Key Points</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {article.summary?.split('\n\n').slice(0, 3).map((para, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", marginBottom: "12px" }}>
                    {para}
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Body */}
            <div style={{ fontSize: "17px", lineHeight: "1.85", color: "#333", fontFamily: "Georgia, serif" }}>
              {article.summary?.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginTop: 0, marginBottom: "20px" }}>{para}</p>
              ))}
            </div>

            {/* Market Outlook Box */}
            <div style={{ background: "#f8f9fa", borderLeft: "4px solid #cc0000", padding: "24px", margin: "32px 0" }}>
              <h3 style={{ color: "#cc0000", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px" }}>
                Market Outlook
              </h3>
              <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: "0 0 16px", fontFamily: "Georgia, serif" }}>
                {article.prediction}
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ background: article.sentiment === "positive" ? "#e8f5e9" : article.sentiment === "negative" ? "#ffebee" : "#f5f5f5", color: article.sentiment === "positive" ? "#2e7d32" : article.sentiment === "negative" ? "#c62828" : "#666", padding: "5px 14px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase" }}>
                  {article.sentiment}
                </span>
                <span style={{ background: "#e3f2fd", color: "#1565c0", padding: "5px 14px", fontSize: "12px", fontWeight: "600" }}>
                  Analyst Confidence: {article.confidence}%
                </span>
              </div>
            </div>

            {/* Sources */}
            <div style={{ padding: "12px 0", borderTop: "1px solid #eee", marginTop: "24px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#999", lineHeight: "1.6" }}>
                📰 <strong>Sources:</strong> {article.source ? `Based on reporting from ${article.source} and other international news sources.` : 'Based on reporting from international news sources via Google News and leading global publications.'}
              </p>
            </div>

            {/* Share Buttons */}
            <div style={{ margin: "32px 0", paddingTop: "24px", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "12px" }}>Share this article</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent('https://newsoracle.online/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#000", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>𝕏 Twitter</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://newsoracle.online/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#1877f2", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>Facebook</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' https://newsoracle.online/article/' + article.id)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>WhatsApp</a>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#fffbf0", border: "1px solid #ffe082", padding: "16px", marginTop: "32px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#888", lineHeight: "1.6" }}>
                <strong>Disclaimer:</strong> {article.disclaimer}
              </p>
            </div>

            {/* Author Bio */}
            <div style={{ background: "#f8f9fa", border: "1px solid #eee", padding: "20px", marginTop: "32px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", background: "#cc0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>N</span>
              </div>
              <div>
                <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#111" }}>NewsOracle Editorial</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>NewsOracle is an AI-powered news platform delivering breaking news and analysis in sports, finance, crypto and politics. Our automated system monitors global news sources around the clock and publishes professionally written articles with market insights and predictions.</p>
              </div>
            </div>

          </article>

          {/* Sidebar */}
          <aside>
            <div style={{ background: "#fff", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
                Related Stories
              </h3>
              {related.map(rel => (
                <Link key={rel.id} href={`/article/${rel.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                    <img src={getImage(rel)} alt={rel.title} style={{ width: "80px", height: "60px", objectFit: "cover", flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{rel.title}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{new Date(rel.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Ad placeholder */}
            <div style={{ background: "#f9f9f9", border: "1px dashed #ddd", padding: "40px 20px", textAlign: "center", color: "#bbb", fontSize: "13px" }}>
              Advertisement
            </div>
          </aside>

        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900" }}>
              NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
            </h2>
            <p style={{ margin: 0, fontSize: "12px" }}>
              © 2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data: article } = await supabaseServer
    .from("articles")
    .select("*")
    .eq("id", params.id)
    .single();

  return {
    props: {
      ogData: article ? {
        title: article.title || "",
        summary: article.summary?.substring(0, 200) || "",
        image: article.image || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
        url: `https://newsoracle.online/article/${article.id}`,
      } : null,
    },
  };
}
