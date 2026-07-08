import Head from "next/head";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — NewsOracle</title>
        <meta name="description" content="NewsOracle Privacy Policy — how we collect, use, and protect your information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/privacy-policy" />
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
              { label: "Politics", href: "/category/politics" },
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
            <p style={{ lineHeight: "1.8", color: "#444" }}>If you have questions about this Privacy Policy, please contact us at: <strong>news.oracle@outlook.com</strong></p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "16px", flexWrap: "wrap" }}>
              <Link href="/about" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>About Us</Link>
              <Link href="/contact" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Contact</Link>
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
