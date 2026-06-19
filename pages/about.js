import Head from "next/head";
import Link from "next/link";

export default function About() {
  return (
    <>
      <Head>
        <title>About Us — NewsOracle</title>
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
            <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>About NewsOracle</h1>
            <p style={{ color: "#999", fontSize: "14px", marginBottom: "32px" }}>Your trusted source for sports, finance and politics news</p>

            <p style={{ lineHeight: "1.8", color: "#444", fontSize: "16px" }}>
              NewsOracle is a digital news platform dedicated to delivering the latest and most important stories in sports, finance, and world politics. Our mission is to keep you informed with accurate, timely, and professional journalism.
            </p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>Our Mission</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We believe everyone deserves access to high quality news and analysis. NewsOracle aggregates and presents the most important stories from around the world, helping you stay ahead of the curve in sports, markets, and global affairs.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>What We Cover</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>
              <strong>Sports:</strong> From Premier League football to NBA basketball, cricket, tennis, boxing and more — we cover the biggest stories in global sport.<br /><br />
              <strong>Finance:</strong> Stock markets, cryptocurrency, commodities, and economic analysis to help you understand the forces shaping the global economy.<br /><br />
              <strong>Politics:</strong> Breaking political news, international relations, elections, and policy developments from around the world.
            </p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>Our Standards</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>All content on NewsOracle is produced to the highest journalistic standards. We are committed to accuracy, fairness, and transparency in everything we publish.</p>

            <h2 style={{ fontSize: "20px", fontWeight: "700", margin: "24px 0 12px" }}>Contact Us</h2>
            <p style={{ lineHeight: "1.8", color: "#444" }}>We welcome feedback, tips, and enquiries. Reach us at: <strong>contact@newsoracle.online</strong></p>
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
