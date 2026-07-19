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
    technology: "1518770660439-4636190af475",
    politics: "1529107386315-e1a2ed48a620",
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

function formatViews(views) {
  if (!views || views < 1) return null;
  if (views < 1000) return `${views} views`;
  if (views < 10000) return `${(views / 1000).toFixed(1)}K views`;
  if (views < 1000000) return `${Math.floor(views / 1000)}K views`;
  return `${(views / 1000000).toFixed(1)}M views`;
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

function buildFaqSchema(article, paragraphs) {
  const faqItems = [];
  const firstPara = paragraphs[0] || '';
  const cleanFirst = firstPara.replace(/^[A-Z\s]+ — /, '');
  if (cleanFirst.length > 30) {
    faqItems.push({ "@type": "Question", "name": `What happened with ${article.tag || article.category}?`, "acceptedAnswer": { "@type": "Answer", "text": cleanFirst } });
  }
  const whyPara = paragraphs.find(p => p.toLowerCase().startsWith('why this matters') || p.toLowerCase().startsWith('why it matters'));
  if (whyPara) {
    faqItems.push({ "@type": "Question", "name": "Why does this matter?", "acceptedAnswer": { "@type": "Answer", "text": whyPara } });
  }
  if (article.prediction) {
    faqItems.push({ "@type": "Question", "name": "What happens next?", "acceptedAnswer": { "@type": "Answer", "text": article.prediction } });
  }
  if (faqItems.length === 0) return null;
  return { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faqItems };
}

const CATEGORY_COLORS = {
  finance: "#0052cc",
  sports: "#cc0000",
  politics: "#2e7d32",
  technology: "#111111",
};

// Parse a paragraph for special formatting patterns
function renderParagraph(para, i, accentColor) {
  // Tool info labels: **Best for:** / **Pricing:** / **Limitation:**
  if (/^\*\*(Best for|Pricing|Limitation|Target markets|Coverage|Supported markets):\*\*/.test(para)) {
    const labelMatch = para.match(/^\*\*([^*]+):\*\*\s*(.*)/s);
    if (labelMatch) {
      const label = labelMatch[1];
      const content = labelMatch[2].replace(/\*\*([^*]+)\*\*/g, '$1');
      const labelConfig = {
        'Best for': { bg: '#e8f5e9', color: '#2e7d32', icon: '✅' },
        'Pricing': { bg: '#e3f2fd', color: '#0052cc', icon: '💰' },
        'Limitation': { bg: '#fff8e1', color: '#e65100', icon: '⚠️' },
        'Target markets': { bg: '#f3e5f5', color: '#7b1fa2', icon: '🎯' },
        'Coverage': { bg: '#f3e5f5', color: '#7b1fa2', icon: '📊' },
        'Supported markets': { bg: '#f3e5f5', color: '#7b1fa2', icon: '🌍' },
      };
      const cfg = labelConfig[label] || { bg: '#f5f5f5', color: '#333', icon: '•' };
      return (
        <div key={`label-${i}`} style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: cfg.bg, padding: "10px 14px", marginBottom: "8px", borderRadius: "4px" }}>
          <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>{cfg.icon}</span>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: cfg.color, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "Arial, sans-serif" }}>{label}: </span>
            <span style={{ fontSize: "14px", color: "#333", fontFamily: "Georgia, serif", lineHeight: "1.6" }}>{content}</span>
          </div>
        </div>
      );
    }
  }

  // FAQ questions: **Question?** followed by answer
  if (/^\*\*[^*]+\?\*\*$/.test(para.trim())) {
    const question = para.replace(/\*\*/g, '');
    return (
      <div key={`faq-q-${i}`} style={{ borderTop: "1px solid #eee", paddingTop: "16px", marginTop: "8px", marginBottom: "4px" }}>
        <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#111", fontFamily: "Arial, sans-serif", lineHeight: "1.4" }}>
          <span style={{ color: accentColor, marginRight: "8px" }}>Q</span>{question}
        </p>
      </div>
    );
  }

  // Why this matters
  if (para.toLowerCase().startsWith('why this matters') || para.toLowerCase().startsWith('why it matters')) {
    const formatted = para.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return (
      <div key={`why-${i}`} style={{ background: "#f0f7ff", borderLeft: "4px solid #1565c0", padding: "16px 20px", margin: "28px 0", borderRadius: "2px" }}>
        <p style={{ margin: 0, fontSize: "16px", lineHeight: "1.8", color: "#1a1a1a", fontStyle: "italic", fontFamily: "Georgia, serif" }} dangerouslySetInnerHTML={{ __html: formatted }} />
      </div>
    );
  }

  // Bottom line / conclusion
  if (para.toLowerCase().startsWith('## the bottom line') || para.toLowerCase().startsWith('## conclusion') || para.toLowerCase().startsWith('## verdict')) {
    const title = para.replace(/^## /, '');
    return (
      <div key={`bottom-${i}`} style={{ background: "#111", color: "#fff", padding: "4px 16px", margin: "32px 0 16px", display: "inline-block" }}>
        <h2 style={{ margin: 0, fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#fff", fontFamily: "Arial, sans-serif" }}>{title}</h2>
      </div>
    );
  }

  // Regular subheading ##
  if (para.startsWith('## ')) {
    const heading = para.replace(/^## /, '');
    return (
      <div key={`h-${i}`} style={{ margin: "36px 0 20px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 8px", lineHeight: "1.3", fontFamily: "Arial, sans-serif", letterSpacing: "-0.3px" }}>{heading}</h2>
        <div style={{ width: "40px", height: "3px", background: accentColor }} />
      </div>
    );
  }

  // Tool header: **Number. Tool Name — Tagline**
  if (/^\*\*\d+\.\s/.test(para) && para.endsWith('**')) {
    const content = para.replace(/\*\*/g, '');
    const dashIndex = content.indexOf(' — ');
    const toolName = dashIndex > -1 ? content.substring(0, dashIndex) : content;
    const tagline = dashIndex > -1 ? content.substring(dashIndex + 3) : '';
    return (
      <div key={`tool-${i}`} style={{ background: "#f8f9fa", borderLeft: `4px solid ${accentColor}`, padding: "14px 18px", margin: "28px 0 12px", borderRadius: "2px" }}>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#111", fontFamily: "Arial, sans-serif", lineHeight: "1.3" }}>{toolName}</h3>
        {tagline && <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#666", fontFamily: "Arial, sans-serif" }}>{tagline}</p>}
      </div>
    );
  }

  // Regular paragraph with inline bold/italic
  const formatted = para
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return (
    <p key={`p-${i}`} style={{ marginTop: 0, marginBottom: "20px", fontSize: "17px", lineHeight: "1.85", color: "#333", fontFamily: "Georgia, serif" }}
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}

export default function ArticlePage({ article, related, crossCategoryArticles }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [views, setViews] = useState(article?.views || 0);

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

  useEffect(() => {
    if (!article?.id) return;
    const key = `viewed_${article.id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    fetch('/api/view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: article.id })
    }).then(() => setViews(v => v + 1)).catch(() => {});
  }, [article?.id]);

  if (!article) return (
    <>
      <Head><title>Article Not Found — NewsOracle</title><meta name="robots" content="noindex" /></Head>
      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}><span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
        </div>
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <Link href="/" style={{ textDecoration: "none" }}><h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h1></Link>
          </div>
        </header>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "72px", fontWeight: "900", color: "#cc0000", marginBottom: "16px" }}>404</div>
          <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Article Not Found</h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", margin: "0 0 32px" }}>The article you are looking for may have been moved or is no longer available.</p>
          <Link href="/" style={{ background: "#cc0000", color: "#fff", padding: "12px 32px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-block", textTransform: "uppercase", letterSpacing: "1px" }}>Back to Homepage</Link>
        </div>
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h2>
            <p style={{ margin: 0, fontSize: "12px" }}>2026 NewsOracle. All content is for informational purposes only.</p>
          </div>
        </footer>
      </div>
    </>
  );

  const isEvergreen = article.evergreen === true || article.evergreen === 't';
  const categoryColor = CATEGORY_COLORS[article.category] || "#cc0000";
  const accentColor = isEvergreen ? "#2e7d32" : categoryColor;
  const paragraphs = article.summary?.split('\n\n') || [];
  const metaDesc = article.meta_description || cleanMetaDescription(article.summary);
  const canonicalUrl = articleUrl(article);
  const imageUrl = getImage(article);
  const wordCount = article.summary?.trim().split(/\s+/).length || 0;
  const faqSchema = buildFaqSchema(article, paragraphs);
  const isBreaking = !isEvergreen && (new Date() - new Date(article.created_at)) < 7200000;
  const bodyParagraphs = isEvergreen ? paragraphs : paragraphs.slice(3);
  const readNextArticles = related.slice(0, 2);
  const sidebarArticles = related.slice(0, 3);
  const viewsFormatted = formatViews(views);

  return (
    <>
      <Head>
        <title>{`${article.title} — NewsOracle`}</title>
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
        <meta name="robots" content="max-image-preview:large" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": isEvergreen ? "Article" : "NewsArticle",
          "headline": article.title,
          "description": metaDesc,
          "image": imageUrl,
          "url": canonicalUrl,
          "wordCount": wordCount,
          "articleSection": article.category,
          "keywords": article.tag || article.category,
          "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
          "datePublished": article.created_at,
          "dateModified": article.created_at,
          "author": { "@type": "Organization", "name": article.author || "NewsOracle Editorial", "url": "https://www.newsoracle.online/about" },
          "publisher": { "@type": "Organization", "name": "NewsOracle", "url": "https://www.newsoracle.online", "logo": { "@type": "ImageObject", "url": "https://www.newsoracle.online/favicon.ico" } }
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.newsoracle.online" },
            { "@type": "ListItem", "position": 2, "name": isEvergreen ? "Guides" : article.category?.charAt(0).toUpperCase() + article.category?.slice(1), "item": isEvergreen ? `https://www.newsoracle.online/guides/${article.category}` : `https://www.newsoracle.online/category/${article.category}` },
            { "@type": "ListItem", "position": 3, "name": article.title }
          ]
        })}} />
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      </Head>

      <div style={{ position: "fixed", top: 0, left: 0, width: `${scrollProgress}%`, height: "3px", background: accentColor, zIndex: 9999, transition: "width 0.1s" }} />

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        <div style={{ background: accentColor, color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="top-bar-right">Sports · Finance · Markets · Analysis</span>
          </div>
        </div>

        <header style={{ background: "#fff", borderBottom: `3px solid ${accentColor}`, padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>NEWS<span style={{ color: "#cc0000" }}>ORACLE</span></h1>
            </Link>
            <nav style={{ display: "flex", gap: "20px" }}>
              <Link href="/category/sports" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Sports</Link>
              <Link href="/category/finance" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Finance</Link>
              <Link href="/category/politics" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Politics</Link>
              <Link href="/category/technology" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Technology</Link>
              <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600", textTransform: "uppercase" }}>Guides</Link>
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
            .cross-category-grid { grid-template-columns: 1fr !important; }
          }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        `}</style>

        <div className="article-layout" style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px", display: "grid", gridTemplateColumns: "1fr 320px", gap: "32px" }}>

          <article className="article-box" style={{ background: "#fff", padding: "40px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>

            {/* Breadcrumb */}
            <div style={{ marginBottom: "20px" }}>
              <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
              <span style={{ color: "#999", margin: "0 8px" }}>›</span>
              {isEvergreen ? (
                <>
                  <Link href="/guides" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Guides</Link>
                  <span style={{ color: "#999", margin: "0 8px" }}>›</span>
                  <Link href={`/guides/${article.category}`} style={{ color: "#999", textDecoration: "none", fontSize: "13px", textTransform: "capitalize" }}>{article.category}</Link>
                </>
              ) : (
                <Link href={`/category/${article.category}`} style={{ color: "#999", textDecoration: "none", fontSize: "13px", textTransform: "capitalize" }}>{article.category}</Link>
              )}
            </div>

            {/* Tags */}
            <div style={{ marginBottom: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {isEvergreen && <span style={{ background: "#111", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>GUIDE</span>}
              {isBreaking && <span style={{ background: "#ff0000", color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", animation: "pulse 2s infinite" }}>BREAKING</span>}
              <span style={{ background: accentColor, color: "#fff", padding: "4px 12px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{article.category}</span>
              {article.tag && <span style={{ background: "#f0f0f0", color: "#555", padding: "4px 12px", fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>{article.tag}</span>}
            </div>

            {/* Title */}
            <h1 style={{ fontSize: "34px", fontWeight: "900", lineHeight: "1.2", margin: "0 0 20px", color: "#111", letterSpacing: "-0.5px" }}>{article.title}</h1>

            {/* Meta */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "14px 0", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", marginBottom: "28px" }}>
              <span style={{ fontSize: "13px", color: "#666" }}>By <strong>{article.author || 'NewsOracle Editorial'}</strong></span>
              {isEvergreen ? (
                <span style={{ fontSize: "13px", color: "#2e7d32", fontWeight: "600" }}>Updated regularly</span>
              ) : (
                <>
                  <span style={{ fontSize: "13px", color: "#999" }}>{new Date(article.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
                  <span style={{ fontSize: "13px", color: "#999" }}>{new Date(article.created_at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} GMT</span>
                  <span style={{ fontSize: "13px", color: accentColor, fontWeight: "600" }}>Updated {timeAgo(article.created_at)}</span>
                </>
              )}
              <span style={{ fontSize: "13px", color: "#999" }}>{getReadTime(article.summary)} min read</span>
              {viewsFormatted && <span style={{ fontSize: "13px", color: "#999" }}>👁 {viewsFormatted}</span>}
            </div>

            {!isEvergreen && article.source && (
              <div style={{ marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>Based on reporting from <strong>{article.source}</strong></span>
              </div>
            )}

            {/* Hero Image */}
            <img src={imageUrl} alt={article.title} style={{ width: "100%", height: "420px", objectFit: "cover", marginBottom: "28px", display: "block" }} />

            {/* Key Points */}
            <div style={{ background: isEvergreen ? "#f1f8e9" : "#fafafa", border: `1px solid ${isEvergreen ? "#c5e1a5" : "#eee"}`, borderLeft: `4px solid ${accentColor}`, padding: "20px 24px", marginBottom: "32px" }}>
              <h3 style={{ color: accentColor, fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>Key Points</h3>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {(article.key_points ? article.key_points.split('\n').filter(p => p.trim()) : paragraphs.slice(0, 3)).map((point, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#333", lineHeight: "1.7", marginBottom: "10px", fontFamily: "Georgia, serif" }}>
                    {point.replace(/^[-•]\s*/, '').trim()}
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Body */}
            <div>
              {bodyParagraphs.map((para, i) => {
                const elements = [];
                elements.push(renderParagraph(para, i, accentColor));

                if (!isEvergreen && i === 3 && related.length > 0) {
                  const contextArticle = related[0];
                  elements.push(
                    <p key="context-link" style={{ marginTop: 0, marginBottom: "20px", fontSize: "17px", lineHeight: "1.85", color: "#333", fontFamily: "Georgia, serif" }}>
                      <strong>Related coverage:</strong>{' '}
                      <Link href={articlePath(contextArticle)} style={{ color: accentColor, textDecoration: "none", fontWeight: "600" }}>{contextArticle.title}</Link>
                    </p>
                  );
                }

                if (!isEvergreen && i === 1 && readNextArticles.length >= 2) {
                  elements.push(
                    <div key="read-next" style={{ background: "#f8f9fa", border: "1px solid #eee", padding: "20px", margin: "28px 0" }}>
                      <h4 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: accentColor, margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>Read Next</h4>
                      {readNextArticles.map(rel => (
                        <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                          <div style={{ display: "flex", gap: "12px", marginBottom: "12px", cursor: "pointer" }}>
                            <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "80px", height: "56px", objectFit: "cover", flexShrink: 0 }} />
                            <div>
                              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600", color: "#111", lineHeight: "1.4", fontFamily: "Arial, sans-serif" }}>{rel.title}</p>
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

            {/* Prediction boxes */}
            {!isEvergreen && article.category === 'finance' && article.prediction && (
              <div style={{ background: "#f8f9fa", borderLeft: `4px solid ${categoryColor}`, padding: "24px", margin: "32px 0" }}>
                <h3 style={{ color: categoryColor, fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px", fontFamily: "Arial, sans-serif" }}>Market Outlook</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: "0 0 16px", fontFamily: "Georgia, serif" }}>{article.prediction}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                  {article.sentiment && <span style={{ display: "inline-block", background: article.sentiment === "positive" ? "#e8f5e9" : article.sentiment === "negative" ? "#ffebee" : "#f5f5f5", color: article.sentiment === "positive" ? "#2e7d32" : article.sentiment === "negative" ? "#c62828" : "#666", padding: "6px 16px", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", borderRadius: "2px" }}>Sentiment: {article.sentiment}</span>}
                  {article.confidence && <span style={{ display: "inline-block", background: "#e3f2fd", color: "#1565c0", padding: "6px 16px", fontSize: "12px", fontWeight: "600", borderRadius: "2px" }}>Analyst Confidence: {article.confidence}%</span>}
                </div>
              </div>
            )}
            {!isEvergreen && article.category === 'politics' && article.prediction && (
              <div style={{ background: "#f8f9fa", borderLeft: "4px solid #2e7d32", padding: "24px", margin: "32px 0" }}>
                <h3 style={{ color: "#2e7d32", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px", fontFamily: "Arial, sans-serif" }}>What Happens Next</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: 0, fontFamily: "Georgia, serif" }}>{article.prediction}</p>
              </div>
            )}
            {!isEvergreen && article.category === 'technology' && article.prediction && (
              <div style={{ background: "#f8f9fa", borderLeft: "4px solid #111", padding: "24px", margin: "32px 0" }}>
                <h3 style={{ color: "#111", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 12px", fontFamily: "Arial, sans-serif" }}>What This Means</h3>
                <p style={{ fontSize: "16px", lineHeight: "1.7", color: "#333", margin: 0, fontFamily: "Georgia, serif" }}>{article.prediction}</p>
              </div>
            )}

            {/* Sources */}
            <div style={{ padding: "12px 0", borderTop: "1px solid #eee", marginTop: "24px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#999", lineHeight: "1.6" }}>
                <strong>Sources:</strong> {article.source ? `Based on reporting from ${article.source} and other international news sources.` : 'Based on reporting from international news sources via Google News and leading global publications.'}
              </p>
            </div>

            {/* Share */}
            <div style={{ margin: "32px 0", paddingTop: "24px", borderTop: "1px solid #eee" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#666", marginBottom: "12px", fontFamily: "Arial, sans-serif" }}>Share this article</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#000", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>X Twitter</a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#1877f2", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>Facebook</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + canonicalUrl)}`} target="_blank" rel="noopener noreferrer" style={{ background: "#25d366", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-block" }}>WhatsApp</a>
                <button onClick={() => window.print()} style={{ background: "#666", color: "#fff", padding: "10px 20px", fontSize: "13px", fontWeight: "600", border: "none", cursor: "pointer" }}>Print</button>
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{ background: "#fffbf0", border: "1px solid #ffe082", padding: "16px", marginTop: "32px" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#888", lineHeight: "1.6" }}><strong>Disclaimer:</strong> {article.disclaimer}</p>
            </div>

            {/* Author */}
            <div style={{ background: "#f8f9fa", border: "1px solid #eee", padding: "20px", marginTop: "32px", display: "flex", gap: "16px", alignItems: "flex-start" }}>
              <div style={{ width: "48px", height: "48px", background: "#cc0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>N</span>
              </div>
              <div>
                <Link href={`/author/${(article.author || 'NewsOracle Editorial').toLowerCase().replace(/\s+/g, '-')}`} style={{ textDecoration: "none" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#cc0000" }}>{article.author || 'NewsOracle Editorial'}</p>
                </Link>
                <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
                  {article.category === 'sports' && 'The NewsOracle Sports Desk covers breaking sports news from the NFL, NBA, Premier League, UFC, tennis, cricket and major global sporting events.'}
                  {article.category === 'finance' && 'The NewsOracle Markets Desk covers stock markets, cryptocurrency, economic policy and breaking financial news from Wall Street and global exchanges.'}
                  {article.category === 'politics' && 'The NewsOracle Politics Desk covers US politics, Congress, the White House, Supreme Court, global elections and international relations.'}
                  {article.category === 'technology' && 'The NewsOracle Tech Desk covers breaking technology news including AI, Apple, Google, Tesla, Meta, OpenAI and product launches.'}
                  {!['sports', 'finance', 'politics', 'technology'].includes(article.category) && 'NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, crypto and politics.'}
                </p>
              </div>
            </div>

            {/* More from NewsOracle */}
            {crossCategoryArticles.length > 0 && (
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid #eee" }}>
                <h3 style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", color: "#cc0000", margin: "0 0 16px", fontFamily: "Arial, sans-serif" }}>More from NewsOracle</h3>
                <div className="cross-category-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                  {crossCategoryArticles.map(rel => (
                    <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                      <div style={{ cursor: "pointer" }}>
                        <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "100%", height: "120px", objectFit: "cover", display: "block", marginBottom: "8px" }} />
                        <span style={{ fontSize: "10px", color: CATEGORY_COLORS[rel.category] || "#cc0000", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>{rel.category}</span>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4", fontFamily: "Arial, sans-serif" }}>{rel.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </article>

          {/* Sidebar */}
          <aside>
            <div style={{ position: "sticky", top: "20px" }}>
              {isEvergreen && (
                <div style={{ background: "#f1f8e9", border: "1px solid #c5e1a5", borderLeft: "4px solid #2e7d32", padding: "20px", marginBottom: "20px" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#2e7d32", margin: "0 0 8px", fontFamily: "Arial, sans-serif" }}>Evergreen Guide</h3>
                  <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#555", lineHeight: "1.5" }}>This guide is regularly updated and covers the complete topic in depth.</p>
                  <Link href="/guides" style={{ color: "#333", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Browse all guides</Link>
                </div>
              )}
              <div style={{ background: "#fff", padding: "24px", marginBottom: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <h3 style={{ fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1.5px", color: "#111", margin: "0 0 16px", paddingBottom: "10px", borderBottom: `2px solid ${accentColor}`, fontFamily: "Arial, sans-serif" }}>Related Stories</h3>
                {sidebarArticles.map(rel => (
                  <Link key={rel.id} href={articlePath(rel)} style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #f5f5f5", cursor: "pointer" }}>
                      <img loading="lazy" src={getImage(rel)} alt={rel.title} style={{ width: "80px", height: "60px", objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111", lineHeight: "1.4", fontFamily: "Arial, sans-serif" }}>{rel.title}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "11px", color: "#bbb" }}>{new Date(rel.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

        </div>

        {showBackToTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ position: "fixed", bottom: "30px", right: "30px", width: "48px", height: "48px", background: accentColor, color: "#fff", border: "none", borderRadius: "50%", fontSize: "20px", fontWeight: "900", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>↑</button>
        )}

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
            <p style={{ margin: 0, fontSize: "12px", textAlign: "center" }}>2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.</p>
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

  const rawId = params.id;
  const numericId = parseInt(rawId.split('-')[0], 10);
  if (isNaN(numericId)) return { notFound: true };

  const { data: article } = await supabaseServer.from("articles").select("*").eq("id", numericId).single();
  if (!article) return { notFound: true };

  const expectedSlug = `${article.id}-${slugify(article.title)}`;
  if (rawId !== expectedSlug) {
    return { redirect: { destination: `/article/${expectedSlug}`, permanent: true } };
  }

  const { data: related } = await supabaseServer.from("articles").select("*").eq("category", article.category).or("evergreen.eq.false,evergreen.is.null").neq("id", article.id).order("created_at", { ascending: false }).limit(3);
  const { data: crossCategory } = await supabaseServer.from("articles").select("*").neq("category", article.category).neq("id", article.id).or("evergreen.eq.false,evergreen.is.null").order("created_at", { ascending: false }).limit(3);

  return {
    props: {
      article,
      related: related || [],
      crossCategoryArticles: crossCategory || [],
    },
  };
}
