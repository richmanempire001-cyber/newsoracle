import Head from "next/head";
import Link from "next/link";

export default function EditorialGuidelines() {
  return (
    <>
      <Head>
        <title>Editorial Guidelines — NewsOracle</title>
        <meta name="description" content="NewsOracle editorial guidelines — our standards for accuracy, sourcing, fact-checking, and responsible journalism." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/editorial-guidelines" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Editorial Guidelines — NewsOracle",
          "description": "NewsOracle editorial standards for accuracy, sourcing, and responsible journalism.",
          "url": "https://www.newsoracle.online/editorial-guidelines",
          "publisher": {
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

        <div style={{ maxWidth: "860px", margin: "40px auto", padding: "0 20px" }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: "24px" }}>
            <Link href="/" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Home</Link>
            <span style={{ color: "#999", margin: "0 8px" }}>›</span>
            <span style={{ color: "#666", fontSize: "13px" }}>Editorial Guidelines</span>
          </div>

          <div style={{ background: "#fff", padding: "40px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px", color: "#111" }}>Editorial Guidelines</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Last updated: July 2026</p>

            <div style={{ borderLeft: "4px solid #cc0000", paddingLeft: "20px", marginBottom: "32px" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: 0 }}>
                NewsOracle is committed to delivering accurate, fair, and timely news. These guidelines govern every piece of content published on our platform and reflect our commitment to responsible journalism.
              </p>
            </div>

            {/* Mission */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>Our Editorial Mission</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
              NewsOracle exists to give every reader fast, accurate access to the news stories that matter — without paywalls, without political bias, and without compromise on quality. We cover Sports, Finance, Politics and Technology with the same rigour we expect from the world's leading news organisations.
            </p>

            {/* Independence */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>Editorial Independence</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
              NewsOracle's editorial decisions are made entirely independently of commercial, advertising, or third-party interests. No advertiser, sponsor, or external party influences which stories we cover, how we cover them, or what conclusions we draw. Our Editor in Chief, Sourav, has final authority over all editorial decisions.
            </p>

            {/* Sourcing */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 16px" }}>Source Standards</h2>
            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {[
                { title: "Verified sources only", desc: "Every NewsOracle article is based on reporting from established, reputable news organisations including AP, Reuters, ESPN, Bloomberg, CNN, BBC, The Verge, TechCrunch, Al Jazeera, Politico and The Hill. We do not publish articles based on unverified social media posts, anonymous tips, or single unconfirmed sources." },
                { title: "Primary source priority", desc: "Where possible we source directly from official statements, court filings, government documents, company announcements, and first-hand reporting. We attribute all claims to their original source." },
                { title: "Multiple source verification", desc: "For significant claims, we seek corroboration from at least two independent sources before publication. If a significant claim cannot be verified, we do not publish it." },
                { title: "Transparent attribution", desc: "Every article clearly states the source of its reporting. When our coverage is based on wire service reporting, we attribute this explicitly within the article." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ padding: "16px 20px", background: "#f8f9fa", borderLeft: "3px solid #cc0000" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{title}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Accuracy */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 16px" }}>Accuracy Standards</h2>
            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {[
                { title: "Facts only", desc: "NewsOracle articles contain only information that can be verified from the source material. We never invent quotes, statistics, names, or details. Every named fact must appear in our source material." },
                { title: "No speculation presented as fact", desc: "We clearly distinguish between confirmed facts and analysis or prediction. Market outlooks and political predictions are labelled as analysis, not reporting." },
                { title: "Numbers and statistics", desc: "All numbers, statistics, prices, percentages, and financial figures are sourced directly from official reports, market data, or established financial news organisations. We never estimate or approximate." },
                { title: "Quotes", desc: "All direct quotes in NewsOracle articles are attributed to named individuals and sourced from official statements, court documents, or established news reporting. We do not paraphrase quotes as direct quotes." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ padding: "16px 20px", background: "#f8f9fa", borderLeft: "3px solid #0052cc" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{title}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Impartiality */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>Impartiality and Fairness</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "16px" }}>
              NewsOracle does not take political sides. Our politics coverage presents facts, decisions, and consequences without editorial bias toward any political party, ideology, or candidate. We apply the same scrutiny to all public figures regardless of political affiliation.
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
              For financial coverage, our market outlooks and sentiment indicators are editorial analysis only and do not constitute investment advice. We are not affiliated with any financial institution, broker, or investment platform.
            </p>

            {/* Publishing Standards */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 16px" }}>Publishing Standards</h2>
            <div style={{ display: "grid", gap: "12px", marginBottom: "32px" }}>
              {[
                { title: "Timeliness", desc: "NewsOracle monitors global news sources continuously and publishes breaking news as quickly as possible after verification. We publish up to 32 articles per day across our four coverage areas." },
                { title: "Article structure", desc: "Every NewsOracle article begins with a dateline identifying the location of the story, followed by the most important concrete fact. Articles are structured to give readers the essential information in the first paragraph." },
                { title: "Headlines", desc: "NewsOracle headlines accurately reflect the content of the article. We do not use clickbait, exaggeration, or misleading headlines. Headlines are written to help readers quickly understand what happened." },
                { title: "Categories", desc: "Articles are categorised as Sports, Finance, Politics, or Technology based on their primary subject matter. Misclassified articles are corrected promptly." },
              ].map(({ title, desc }) => (
                <div key={title} style={{ padding: "16px 20px", background: "#f8f9fa", borderLeft: "3px solid #2e7d32" }}>
                  <p style={{ margin: "0 0 6px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{title}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Corrections */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>Corrections and Updates</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "16px" }}>
              When errors are identified in published articles, we correct them promptly and transparently. A correction note is added to the affected article explaining what was changed and why.
            </p>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
              To report an error, email us at <a href="mailto:news.oracle@outlook.com" style={{ color: "#cc0000", textDecoration: "none" }}>news.oracle@outlook.com</a>. We aim to respond within 24 hours. Read our full <Link href="/corrections" style={{ color: "#cc0000", textDecoration: "none" }}>Corrections Policy</Link>.
            </p>

            {/* Advertising */}
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111", margin: "0 0 12px" }}>Advertising and Sponsorship</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "32px" }}>
              NewsOracle is supported by advertising through Google AdSense. Advertising content is clearly separated from editorial content. Advertisers have no influence over editorial decisions, story selection, or article content. Sponsored content, if published, will be clearly labelled as such.
            </p>

            {/* Contact */}
            <div style={{ background: "#f8f9fa", padding: "24px", borderLeft: "4px solid #cc0000" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111", margin: "0 0 8px" }}>Editorial Contact</h3>
              <p style={{ fontSize: "14px", color: "#444", lineHeight: "1.6", margin: "0 0 8px" }}>
                For editorial inquiries, corrections, or to report a concern about our coverage:
              </p>
              <a href="mailto:news.oracle@outlook.com" style={{ fontSize: "14px", color: "#cc0000", textDecoration: "none", fontWeight: "600" }}>
                news.oracle@outlook.com
              </a>
              <p style={{ fontSize: "13px", color: "#999", margin: "8px 0 0" }}>Editor in Chief: Sourav — NewsOracle, Toronto, Canada</p>
            </div>

          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              <Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link>
              <Link href="/editorial-guidelines" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Editorial Guidelines</Link>
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
