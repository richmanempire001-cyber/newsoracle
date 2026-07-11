import Head from "next/head";
import Link from "next/link";

export default function Corrections() {
  return (
    <>
      <Head>
        <title>Corrections Policy — NewsOracle</title>
        <meta name="description" content="NewsOracle is committed to accuracy. Read our corrections policy and learn how to report errors in our reporting." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/corrections" />
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
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", gap: "0" }}>
            {[
              { label: "Sports", href: "/category/sports" },
              { label: "Finance", href: "/category/finance" },
              { label: "Politics", href: "/category/politics" },
              { label: "Technology", href: "/category/technology" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{ padding: "14px 24px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#333", borderBottom: "3px solid transparent" }}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </header>

        <div style={{ maxWidth: "860px", margin: "40px auto", padding: "0 20px" }}>
          <div style={{ background: "#fff", padding: "40px" }}>

            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px", color: "#111" }}>Corrections Policy</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Last updated: July 8, 2026</p>

            <div style={{ borderLeft: "4px solid #cc0000", paddingLeft: "20px", marginBottom: "32px" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: "#444", margin: 0 }}>
                NewsOracle is committed to accurate, fair, and transparent reporting. When we make mistakes, we correct them promptly and openly.
              </p>
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Our Commitment to Accuracy</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "24px" }}>
              Every article published on NewsOracle is based on verified source material from established news outlets. Our editorial team reviews all content before publication to ensure factual accuracy. Despite our best efforts, errors can occasionally occur. When they do, we correct them as quickly as possible.
            </p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>How We Handle Corrections</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "24px" }}>
              When an error is identified — whether by our team or reported by a reader — we follow this process:
            </p>
            <div style={{ display: "grid", gap: "12px", marginBottom: "24px" }}>
              {[
                { step: "01", title: "Review", desc: "We investigate the reported error by checking the original source material and verifying the facts in question." },
                { step: "02", title: "Correct", desc: "If an error is confirmed, we correct the article within 24 hours. Factual errors are fixed immediately without delay." },
                { step: "03", title: "Note", desc: "A correction note is added to the article clearly stating what was changed and why, so readers are always informed." },
                { step: "04", title: "Acknowledge", desc: "We respond to the reader who reported the error to thank them and confirm the correction has been made." },
              ].map(({ step, title, desc }) => (
                <div key={step} style={{ display: "flex", gap: "16px", padding: "16px", background: "#f8f9fa", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "20px", fontWeight: "900", color: "#cc0000", flexShrink: 0, minWidth: "32px" }}>{step}</span>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "#111" }}>{title}</p>
                    <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Report an Error</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", marginBottom: "20px" }}>
              If you believe you have found an error in any of our articles, we want to hear from you. Please email us with the following information:
            </p>
            <div style={{ background: "#f8f9fa", padding: "20px", marginBottom: "24px", borderLeft: "3px solid #cc0000" }}>
              <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
                {[
                  "The URL of the article containing the error",
                  "A description of the error you found",
                  "The correct information with a source if available",
                  "Your name and contact email (optional)"
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: "14px", color: "#444", lineHeight: "1.8", marginBottom: "4px" }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", gap: "16px", alignItems: "center", padding: "20px", background: "#f8f9fa", marginBottom: "32px" }}>
              <div style={{ width: "48px", height: "48px", background: "#cc0000", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>N</span>
              </div>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: "700", color: "#111" }}>Corrections Team — NewsOracle</p>
                <a href="mailto:news.oracle@outlook.com" style={{ fontSize: "14px", color: "#cc0000", textDecoration: "none", fontWeight: "600" }}>
                  news.oracle@outlook.com
                </a>
                <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#999" }}>We aim to respond within 24 hours</p>
              </div>
            </div>

            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Editorial Independence</h2>
            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#444", margin: 0 }}>
              Our corrections process is independent of any commercial or advertiser interests. Errors are corrected based solely on factual accuracy, regardless of the subject matter or individuals involved. NewsOracle maintains full editorial independence in all matters of accuracy and corrections.
            </p>

          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
              <Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link>
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
