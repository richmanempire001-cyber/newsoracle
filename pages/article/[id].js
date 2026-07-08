import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { slugify, articlePath, articleUrl } from "../../lib/slugify";

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

function getReadTime(text) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.ceil(words / 200);
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

function cleanMetaDescription(summary) {
  if (!summary) return "";
  const firstPara = summary.split('\n\n')[0] || summary;
  const clean = firstPara.replace(/^[A-Z\s]+ — /, '');
  if (clean.length <= 160) return clean;
  const truncated = clean.substring(0, 157);
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

export default function ArticlePage({ article, related, crossCategoryArticles }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 600);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return (
    <>
      <Head>
        <title>Article Not Found — NewsOracle</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
          </div>
        </header>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "72px", fontWeight: "900", color: "#cc0000", marginBottom: "16px" }}>404</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Article Not Found</h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", margin: "0 0 32px" }}>
            The article you're looking for may have been moved or is no longer available.
          </p>
          <Link href="/" style={{ background: "#cc0000", color: "#fff", padding: "12px 32px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-block", textTransform: "uppercase", letterSpacing: "1px" }}>
            Back to Homepage
          </Link>
        </div>
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900" }}>
              NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
            </h2>
            <p style={{ margin: 0, fontSize: "12px" }}>© 2026 NewsOracle. All content is for informational purposes only.</p>
          </div>
        </footer>
      </div>
    </>
  );

  const paragraphs = article.summary?.split('\n\n') || [];
  const metaDesc = article.meta_description || cleanMetaDescription(article.summary);
  const canonicalUrl = articleUrl(article);
  const imageUrl = getImage(article);
  const wordCount = article.summary?.trim().split(/\s+/).length || 0;

  const readNextArticles = related.slice(0, 2);
  const sidebarArticles = related.slice(0, 3);

  return (
    <>
      <Head>
        <title>{article.title} — NewsOracle</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:section" content={article.category} />
        {article.tag && <meta property="article:tag" content={article.tag} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={imageUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": article.title,
          "description": metaDesc,
          "image": imageUrl,
          "url": canonicalUrl,
          "wordCount": wordCount,
          "articleSection": article.category,
          "keywords": article.tag || article.category,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": canonicalUrl
          },
          "datePublished": article.created_at,
          "dateModified": article.created_at,
          "author": {
            "@type": "Organization",
            "name": article.author || "NewsOracle Editorial",
            "url": "https://www.newsoracle.online/about"
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
            { "@type": "ListItem", "position": 2, "name": article.category?.charAt(0).toUpperCase() + article.category?.slice(1), "item": `https://www.newsoracle.online/?cat=${article.category}` },
            { "@type": "ListItem", "position": 3, "name": article.title }
          ]
        })}} />
      </Head>

      {/* Reading Progress Bar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: `${scrollProgress}%`, height: "3px", background: "#cc0000", zIndex: 9999, transition: "width 0.1s" }} />

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="top-bar-right">Sports · Finance · Markets · Analysis</span>
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
            .article-box { padding: 16px !important; }
            .article-layout { grid-template-columns: 1fr !important; }
            .top-bar-right { display: none !important; }
          }
        `}</style>

        {/* Article Content */}
        <div className="article-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>

          {/* Main Article */}
          <article className="article-box" style={{ background: "#fff", padding: "40px" }}>

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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "14px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", marginBottom: "28px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>By <strong>{article.author || 'NewsOracle Editorial'}</strong></span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                {new Date(article.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                {new Date(article.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} GMT
              </span>
              <span style={{ fontSize: "13px", color: "#999" }}>
                📖 {getReadTime(article.summary)} min read
              </span>
              <span style={{ fontSize: "13px", color: "#cc0000", fontWeight: "600" }}>
                Updated {timeAgo(article.created_at)}
              </span>
            </div>

            {/* Source Attribution */}
            {article.source && (
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>
                  Based on reporting from <strong>{article.source}</strong>
                </span>
              </div>
            )}

            {/* Hero Image */}
            <img
              src={imageUrl}
              alt={article.title}
              style={{ width: "100%", height: "420px", objectFit: "cover", marginBottom: "28px", display: "block" }}
            />

            {/* Key Points Box */}
            <div style={{ background: "#fff8f8", border: "1px solid #ffcccc", borderLeft: "4px solid #cc0000", padding: "20px 24px", marginBottom: "28px" }}>
              <h3 style={{ color: "#cc0000", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px" }}>🔴 Key Points</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {paragraphs.slice(0, 3).map((para, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", marginBottom: "12px" }}>
                    {para}
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Body with Read Next after 2nd paragraph */}
            <div style={{ fontSize: "17px", lineHeight: "1.85", color: "#333", fontFamily: "Georgia, serif" }}>
              {paragraphs.slice(3).map((para, i) => {
                const isWhy = para.toLowerCase().startsWith('why this matters') || para.toLowerCase().startsWith('why it matters');
                const bodyParagraphs = paragraphs.slice(3);

                const elements = [];
                const isSubheading = para.startsWith('## ');

                if (isSubheading) {
                  elements.push(
                    <h2 key={i} style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "32px 0 16px", lineHeight: "1.3", fontFamily: "Arial, sans-serif" }}>
                      {para.replace(/^## /, '')}
                    </h2>
                  );
                } else if (isWhy) {
                  elements.push(
                    <div key={i} style={{ background: "#f0f7ff", borderLeft: "4px solid #1565c0", padding: "16px 20px", margin: "28px 0", borderRadius: "2px" }}>
                      <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.8", color: "#1a1a1a", fontStyle: "italic", fontFamily: "Georgia, serif" }}>{para}</p>
                    </div>
                  );
                } else {
                  elements.push(<p key={i} style={{ marginTop: 0, marginBottom: "20px" }}>{para}</p>);
                }

                // Insert "Read Next" block after the 2nd body paragraph
                if (i === 1 && readNextArticles.length >= 2) {
                  elements.push(
                    <div key="read-next" style={{ background: "#f8f9fa", border: "1px solid #eee", padding: "20px", margin: "28px 0" }}>
                      <h4 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 16px" }}>Read Next</h4>
                      {readNextArticles.map(rel => (
                        <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                          <div style={{ display: "flex", gap: "12px", marginBottom: "12px", cursor: "pointer" }}>
                            <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "80px", height: "56px", objectFit: "cover", flexShrink: 0 }} />
                            <div>
                              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{rel.title}</p>
                              <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{timeAgo(rel.created_at)}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  );
                }

                return elements;
              })}
            </div>

            {/* Market Outlook Box — finance only */}
            {article.category === 'finance' && article.prediction && (
              <div style={{ background: "#f8f9fa", borderLeft: "4px solid #cc0000", padding: "24px", margin: "32px 0" }}>
                <h3 style={{ color: "#cc0000", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px" }}>
                  Market Outlook
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: "0 0 16px", fontFamily: "Georgia, serif" }}>
                  {article.prediction}
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "4px" }}>
                  {article.sentiment && (
                    <span style={{ display: "inline-block", background: article.sentiment === "positive" ? "#e8f5e9" : article.sentiment === "negative" ? "#ffebee" : "#f5f5f5", color: article.sentiment === "positive" ? "#2e7d32" : article.sentiment === "negative" ? "#c62828" : "#666", padding: "6px 16px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", borderRadius: "2px" }}>
                      Sentiment: {article.sentiment}
                    </span>
                  )}
                  {article.confidence && (
                    <span style={{ display: "inline-block", background: "#e3f2fd", color: "#1565c0", padding: "6px 16px", fontSize: "12px", fontWeight: "600", borderRadius: "2px" }}>
                      Analyst Confidence: {article.confidence}%
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* What Happens Next — politics only */}
            {article.category === 'politics' && article.prediction && (
              <div style={{ background: "#f8f9fa", borderLeft: "4px solid #2e7d32", padding: "24px", margin: "32px 0" }}>
                <h3 style={{ color: "#2e7d32", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px" }}>
                  What Happens Next
                </h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: 0, fontFamily: "Georgia, serif" }}>
                  {article.prediction}
                </p>
              </div>
            )}

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
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#000", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>𝕏 Twitter</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#1877f2", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>Facebook</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>WhatsApp</a>
                <button onClick={() => window.print()} style={{ background: "#666", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer", display: "inline-block" }}>🖨 Print</button>
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
                <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{article.author || 'NewsOracle Editorial'}</p>
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                  {article.category === 'sports' && 'The NewsOracle Sports Desk covers breaking sports news from the NFL, NBA, Premier League, UFC, tennis, cricket and major global sporting events with live updates and post-match analysis.'}
                  {article.category === 'finance' && 'The NewsOracle Markets Desk covers stock markets, cryptocurrency, economic policy and breaking financial news from Wall Street and global exchanges with data-driven analysis and market outlook.'}
                  {article.category === 'politics' && 'The NewsOracle Politics Desk covers US politics, Congress, the White House, Supreme Court, global elections and international relations with neutral, fact-based reporting.'}
                  {!['sports', 'finance', 'politics'].includes(article.category) && 'NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, crypto and politics. Our editorial team monitors global news sources around the clock.'}
                </p>
              </div>
            </div>

            {/* More from NewsOracle — cross-category articles */}
            {crossCategoryArticles.length > 0 && (
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #eee" }}>
                <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 16px" }}>More from NewsOracle</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {crossCategoryArticles.map(rel => (
                    <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                      <div style={{ cursor: "pointer" }}>
                        <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "100%", height: "120px", objectFit: "cover", display: "block", marginBottom: "8px" }} />
                        <span style={{ fontSize: "10px", color: "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{rel.category}</span>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{rel.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* Sidebar */}
          <aside>
            <div style={{ background: "#fff", padding: "24px", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: "2px solid #cc0000" }}>
                Related Stories
              </h3>
              {sidebarArticles.map(rel => (
                <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                    <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "80px", height: "60px", objectFit: "cover", flexShrink: 0 }} />
                    <div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4" }}>{rel.title}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#999" }}>{new Date(rel.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ position: "fixed", bottom: "30px", right: "30px", width: "48px", height: "48px", background: "#cc0000", color: "#fff", border: "none", borderRadius: "50%", fontSize: "20px", fontWeight: "900", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ↑
          </button>
        )}

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

export async function getServerSideProps({ params, res }) {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  // Extract numeric ID from slug URL (e.g. "153-argentina-beats-cape-verde" → 153)
  const rawId = params.id;
  const numericId = parseInt(rawId.split('-')[0], 10);

  if (isNaN(numericId)) {
    return { notFound: true };
  }

  const { data: article } = await supabaseServer
    .from("articles")
    .select("*")
    .eq("id", numericId)
    .single();

  if (!article) {
    return { notFound: true };
  }

  // 301 redirect old numeric-only URLs to slug URLs
  const expectedSlug = `${article.id}-${slugify(article.title)}`;
  if (rawId !== expectedSlug) {
    return {
      redirect: {
        destination: `/article/${expectedSlug}`,
        permanent: true,
      },
    };
  }

  // Fetch 3 related articles from the same category
  const { data: related } = await supabaseServer
    .from("articles")
    .select("*")
    .eq("category", article.category)
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch 3 articles from OTHER categories for cross-linking
  const { data: crossCategory } = await supabaseServer
    .from("articles")
    .select("*")
    .neq("category", article.category)
    .neq("id", article.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return {
    props: {
      article,
      related: related || [],
      crossCategoryArticles: crossCategory || [],
    },
  };
}
