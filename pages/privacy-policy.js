import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — NewsOracle</title>
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
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>Privacy Policy</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Last updated: June 19, 2026</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>1. Information We Collect</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We collect information you provide directly to us, such as when you contact us. We also automatically collect certain information when you visit our website, including your IP address, browser type, and pages visited.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>2. How We Use Your Information</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We use the information we collect to provide and improve our services, analyze how our website is used, and comply with legal obligations.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>3. Cookies</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We use cookies to enhance your browsing experience. Cookies are small files stored on your device. You can control cookies through your browser settings. We use Google Analytics and advertising cookies to improve our service and show relevant advertisements.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>4. Third Party Services</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We use Google Analytics to analyze website traffic and Google AdSense to display advertisements. These services may collect information about your visits to our website and other websites.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>5. Data Retention</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We retain your information for as long as necessary to provide our services and comply with legal obligations.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>6. Your Rights</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>You have the right to access, correct, or delete your personal information. You may also opt out of certain data collection by adjusting your browser settings or contacting us directly.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>7. Contact Us</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>If you have questions about this Privacy Policy, please contact us at: <strong>contact@newsoracle.online</strong></p>
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
