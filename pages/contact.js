import Head from "next/head";
import Link from "next/link";

export default function Contact() {
  return (
    <>
      <Head>
        <title>Contact Us — NewsOracle</title>
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
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>Contact Us</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Get in touch with the NewsOracle team</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "0 0 16px" }}>Get In Touch</h2>
                <p style={{ lineHeight: "1.8", color: "#444", marginBottom: "24px" }}>
                  Have a news tip, feedback, or enquiry? We'd love to hear from you.
                </p>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>📧 Email</p>
                  <p style={{ margin: 0, color: "#cc0000" }}>news.oracle.official@gmail.com</p>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>🌐 Website</p>
                  <p style={{ margin: 0, color: "#cc0000" }}>www.newsoracle.online</p>
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#111" }}>⏰ Response Time</p>
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

            <div style={{ marginTop: "32px", padding: "24px", background: "#f8f8f8", borderRadius: "4px" }}>
              <p style={{ margin: 0, color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                <strong>Note:</strong> NewsOracle is a digital news platform. All content is for informational purposes only and does not constitute financial or betting advice. For urgent news tips, please email us directly.
              </p>
            </div>
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
