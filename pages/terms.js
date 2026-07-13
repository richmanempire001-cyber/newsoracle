import Head from "next/head";
import Link from "next/link";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — NewsOracle</title>
        <meta name="description" content="NewsOracle Terms of Service — the rules and guidelines for using our news platform." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/terms" />
      </Head>
      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", justifyContent: "space-between" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <span>Sports · Finance · Markets · Analysis</span>
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
              { label: "Politics", href: "/category/politics" },{ label: "Technology", href: "/category/technology" },
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
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>Terms of Service</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Last updated: June 19, 2026</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>1. Acceptance of Terms</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>By accessing and using NewsOracle, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>2. Use of Content</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>All content on NewsOracle is for informational purposes only. You may not reproduce, distribute, or commercially exploit any content without our written permission.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>3. Disclaimer</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>NewsOracle provides news and analysis for informational purposes only. Nothing on this website constitutes financial, legal, or betting advice. Always consult a qualified professional before making financial decisions.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>4. Accuracy of Information</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>While we strive to provide accurate and up-to-date information, we make no warranties about the completeness or accuracy of content on our website.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>5. Third Party Links</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>Our website may contain links to third party websites. We are not responsible for the content or privacy practices of those sites.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>6. Limitation of Liability</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>NewsOracle shall not be liable for any damages arising from your use of our website or reliance on any content published here.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>7. Changes to Terms</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We reserve the right to modify these terms at any time. Continued use of our website after changes constitutes acceptance of the new terms.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>8. Contact</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>For questions about these terms, contact us at: <strong>news.oracle@outlook.com</strong></p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link><Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link><Link href="/editorial-guidelines" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Editorial Guidelines</Link>
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
