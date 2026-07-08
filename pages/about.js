import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About NewsOracle — Breaking News Platform</title>
        <meta name="description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, crypto and politics. Updated around the clock, every single day." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/about" />
        <meta property="og:title" content="About NewsOracle — Breaking News Platform" />
        <meta property="og:description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, crypto and politics." />
        <meta property="og:url" content="https://www.newsoracle.online/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About NewsOracle — Breaking News Platform" />
        <meta name="twitter:description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, crypto and politics." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "NewsOracle",
          "url": "https://www.newsoracle.online",
          "logo": {
            "@type": "ImageObject",
            "url": "https://www.newsoracle.online/favicon.ico"
          },
          "description": "Digital news platform delivering breaking news and analysis in sports, finance, crypto and politics.",
          "email": "news.oracle@outlook.com",
          "sameAs": [
            "https://t.me/NewsOracleOfficial",
            "https://www.facebook.com/profile.php?id=61591337781640"
          ]
        })}} />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span className="top-bar-right">Sports · Finance · Markets · Analysis</span>
          </div>
        </div>

        {/* Header — CNN Two-Row Style */}
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
              <div className="utility-nav" style={{ display: "flex", gap: "20px" }}>
                <Link href="/about" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>About</Link>
                <Link href="/contact" style={{ color: "#666", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              </div>
            </div>
          </div>
          <div className="category-nav-row" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", gap: "0" }}>
            {[
              { label: "Sports", href: "/category/sports" },
              { label: "Finance", href: "/category/finance" },
              { label: "Politics", href: "/category/politics" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{ padding: "14px 24px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#333", borderBottom: "3px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#cc0000"; e.currentTarget.style.borderBottomColor = "#cc0000"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#333"; e.currentTarget.style.borderBottomColor = "transparent"; }}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </header>

        <style>{`
          @media (max-width: 600px) {
            .utility-nav { display: none !important; }
            .category-nav-row { overflow-x: auto; }
            header h1 { font-size: 28px !important; }
            .about-grid { grid-template-columns: 1fr !important; }
            .about-box { padding: 24px !important; }
            .top-bar-right { display: none !important; }
          }
        `}</style>

        {/* Hero Banner */}
        <div style={{ background: "linear-gradient(135deg, #111 0%, #333 100%)", color: "#fff", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ display: "inline-block", background: "#cc0000", color: "#fff", padding: "4px 16px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "20px" }}>
              About Us
            </div>
            <h2 style={{ fontSize: "42px", fontWeight: "900", margin: "0 0 16px", letterSpacing: "-1px", lineHeight: "1.1" }}>
              NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
            </h2>
            <p style={{ fontSize: "18px", color: "#ccc", lineHeight: "1.7", margin: "0 0 32px" }}>
              The world's news. Delivered fast. Updated around the clock. Every single day.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
              {[["📡", "Live Updates"], ["🌎", "Worldwide Sources"], ["✅", "Verified Reporting"], ["🏆", "Top Stories"]].map(([num, label]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "32px", fontWeight: "900", color: "#cc0000" }}>{num}</div>
                  <div style={{ fontSize: "12px", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>

          {/* Mission Statement */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px", borderLeft: "4px solid #cc0000" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#111", margin: "0 0 16px" }}>Our Mission</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: "0 0 16px" }}>
              NewsOracle was built on a simple belief: everyone deserves access to fast, accurate, and readable news — without paywalls, without bias, and without the noise.
            </p>
            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: 0 }}>
              We combine the speed of modern publishing technology with the discipline of professional journalism to deliver breaking news in Sports, Finance, and Politics — updated continuously, every single day.
            </p>
          </div>

          {/* How It Works */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#111", margin: "0 0 24px" }}>How NewsOracle Works</h2>
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
              {[
                { step: "01", title: "Monitor", desc: "Our editorial system continuously monitors hundreds of trusted global news sources — including AP, Reuters, ESPN, Bloomberg and more — through real-time news feeds." },
                { step: "02", title: "Analyse", desc: "Every story is fetched from its original source, read in full, and processed by our newsroom system to extract the most important facts, context, and implications." },
                { step: "03", title: "Publish", desc: "Our editorial system crafts every story in professional journalism style — with a concrete opening, clear structure, and a 'why this matters' closing — then publishes it instantly." },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ padding: "24px", background: "#f8f9fa", borderTop: "3px solid #cc0000" }}>
                  <div style={{ fontSize: "32px", fontWeight: "900", color: "#cc0000", marginBottom: "8px" }}>{step}</div>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 10px" }}>{title}</h3>
                  <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.7", margin: 0 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Standards */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#111", margin: "0 0 16px" }}>Editorial Standards</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: "0 0 20px" }}>
              NewsOracle is committed to accuracy, transparency, and responsible journalism. Here is how we maintain editorial quality:
            </p>
            <div style={{ display: "grid", gap: "12px" }}>
              {[
                { icon: "✅", title: "Source Verification", desc: "Every article is based on content from established, reputable news sources. We never publish articles without a verifiable source." },
                { icon: "✅", title: "Original Writing", desc: "Every story is rewritten from scratch in our own words. We never copy or reproduce original articles — we summarise, analyse, and add context." },
                { icon: "✅", title: "Fact-Based Reporting", desc: "Our editorial standards require that every claim in our articles must be supported by verified source material. We never invent facts, quotes, or statistics." },
                { icon: "✅", title: "Transparent Publishing", desc: "NewsOracle articles are produced by our dedicated editorial team, monitored for quality and accuracy before going live." },
                { icon: "✅", title: "Market Analysis Disclaimer", desc: "All market outlooks, predictions, and confidence scores are for informational purposes only. They do not constitute financial or investment advice." },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: "16px", padding: "16px", background: "#f8f9fa", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coverage Areas */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#111", margin: "0 0 24px" }}>What We Cover</h2>
            <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {[
                { cat: "Sports", color: "#cc0000", icon: "🏆", desc: "NFL, NBA, Premier League, UFC, Tennis, Cricket, Formula 1 and all major global sporting events — live updates and post-match analysis.", href: "/category/sports" },
                { cat: "Finance", color: "#0052cc", icon: "💰", desc: "Stock markets, cryptocurrency, Bitcoin, S&P 500, Fed decisions, inflation data, and breaking financial news from Wall Street and beyond.", href: "/category/finance" },
                { cat: "Politics", color: "#2e7d32", icon: "🏛️", desc: "US politics, Congress, White House, Supreme Court, global elections, international relations and policy decisions that shape the world.", href: "/category/politics" },
              ].map(({ cat, color, icon, desc, href }) => (
                <Link key={cat} href={href} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "28px", background: "#f8f9fa", borderBottom: \`4px solid \${color}\`, textAlign: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
                    <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>{cat}</h3>
                    <p style={{ fontSize: "13px", color: "#666", lineHeight: "1.7", margin: 0 }}>{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div style={{ background: "#111", padding: "40px", marginBottom: "24px", textAlign: "center" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#fff", margin: "0 0 12px" }}>Follow NewsOracle</h2>
            <p style={{ fontSize: "14px", color: "#999", margin: "0 0 24px" }}>Get breaking news delivered instantly to your favourite platform</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" style={{ background: "#0088cc", color: "#fff", padding: "12px 28px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                📱 Telegram
              </a>
              <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" style={{ background: "#1877f2", color: "#fff", padding: "12px 28px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                👍 Facebook
              </a>
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: "#fff", padding: "40px", marginBottom: "24px" }} className="about-box">
            <h2 style={{ fontSize: "22px", fontWeight: "900", color: "#111", margin: "0 0 16px" }}>Contact Us</h2>
            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: "0 0 20px" }}>
              Have a question, feedback, or a news tip? We would love to hear from you.
            </p>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "20px", background: "#f8f9fa", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", background: "#cc0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>N</span>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "#111" }}>NewsOracle Editorial Team</p>
                <a href="mailto:news.oracle@outlook.com" style={{ fontSize: "14px", color: "#cc0000", textDecoration: "none", fontWeight: "600" }}>
                  news.oracle@outlook.com
                </a>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background: "#fffbf0", border: "1px solid #ffe082", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#111", margin: "0 0 10px" }}>⚠️ Disclaimer</h3>
            <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: "1.7" }}>
              All content published on NewsOracle is for informational purposes only. Articles are professionally written based on publicly available news sources. NewsOracle does not constitute financial, legal, or investment advice. Market outlooks and predictions are editorial opinions only. Always consult a qualified professional before making financial decisions.
            </p>
          </div>

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
