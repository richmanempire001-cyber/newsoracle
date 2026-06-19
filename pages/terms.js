import Head from "next/head";
import Link from "next/link";

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — NewsOracle</title>
      </Head>
      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>
        
        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000", padding: "16px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111" }}>
                NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
              </h1>
            </Link>
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
            <p style={{ lineHeight: "1.8", color: "#444" }}>For questions about these terms, contact us at: <strong>contact@newsoracle.online</strong></p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "30px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "12px" }}>© 2026 NewsOracle. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
