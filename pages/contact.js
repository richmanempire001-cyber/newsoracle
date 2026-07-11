import Head from "next/head";
import Link from "next/link";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us — NewsOracle</title>
        <meta name="description" content="Get in touch with the NewsOracle editorial team. Send us news tips, feedback, or enquiries." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/contact" />
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
                <Link href="/contact" style={{ color: "#cc0000", textDecoration: "none", fontSize: "13px", fontWeight: "600" }}>Contact</Link><Link href="/corrections" style={{ color: "#999", textDecoration: "none", fontSize: "13px" }}>Corrections</Link>
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
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>Contact Us</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Get in touch with the NewsOracle team</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 16px" }}>Get In Touch</h2>
                <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "24px" }}>
                  Have a news tip, feedback, or enquiry? We would love to hear from you.
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>Email</p>
                  <a href="mailto:news.oracle@outlook.com" style={{ margin: 0, color: "#cc0000", textDecoration: "none" }}>news.oracle@outlook.com</a>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>Website</p>
                  <a href="https://www.newsoracle.online" style={{ margin: 0, color: "#cc0000", textDecoration: "none" }}>www.newsoracle.online</a>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>Response Time</p>
                  <p style={{ margin: 0, color: "#444" }}>Within 24-48 hours</p>
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 16px" }}>Categories</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {["General Enquiries", "News Tips", "Advertising", "Technical Support", "Press & Media"].map(cat => (
                    <div key={cat} style={{ padding: "12px 16px", background: "#f8f8f8", borderLeft: "3px solid #cc0000", fontSize: "14px", color: "#444" }}>
                      {cat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ marginTop: "32px", padding: "24px", background: "#f8f8f8" }}>
              <p style={{ margin: 0, color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                <strong>Note:</strong> NewsOracle is a digital news platform. All content is for informational purposes only and does not constitute financial or betting advice. For urgent news tips, please email us directly.
              </p>
            </div>
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
