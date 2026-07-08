import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found — NewsOracle</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", background: "#f4f4f4", minHeight: "100vh" }}>

        {/* Top Bar */}
        <div style={{ background: "#cc0000", color: "#fff", padding: "6px 0", fontSize: "12px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
            <span>{new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: "#fff", borderBottom: "3px solid #cc0000" }}>
          <div style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <h1 style={{ fontSize: "36px", fontWeight: "900", margin: 0, color: "#111", letterSpacing: "-1px" }}>
                  NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
                </h1>
              </Link>
            </div>
          </div>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", gap: "0" }}>
            {[
              { label: "Sports", href: "/category/sports" },
              { label: "Finance", href: "/category/finance" },
              { label: "Politics", href: "/category/politics" },
            ].map(item => (
              <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                <div style={{ padding: "14px 24px", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "#333" }}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>
        </header>

        {/* 404 Content */}
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
          <div style={{ fontSize: "96px", fontWeight: "900", color: "#cc0000", marginBottom: "16px", lineHeight: "1" }}>404</div>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#111", margin: "0 0 12px" }}>Page Not Found</h2>
          <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6", margin: "0 0 40px" }}>
            The page you're looking for doesn't exist or may have been moved. Try one of the links below.
          </p>

          <Link href="/" style={{ background: "#cc0000", color: "#fff", padding: "14px 40px", fontSize: "14px", fontWeight: "700", textDecoration: "none", display: "inline-block", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "40px" }}>
            Back to Homepage
          </Link>

          <div style={{ marginTop: "40px", borderTop: "1px solid #ddd", paddingTop: "32px" }}>
            <p style={{ fontSize: "13px", color: "#999", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "700", marginBottom: "20px" }}>Or browse by section</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
              {[
                { label: "🏆 Sports", href: "/category/sports", color: "#cc0000" },
                { label: "💰 Finance", href: "/category/finance", color: "#0052cc" },
                { label: "🏛️ Politics", href: "/category/politics", color: "#2e7d32" },
              ].map(item => (
                <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
                  <div style={{ padding: "16px 32px", background: "#fff", border: `2px solid ${item.color}`, color: item.color, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: "#111", color: "#999", padding: "40px 20px", marginTop: "40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#fff", margin: "0 0 10px", fontSize: "24px", fontWeight: "900" }}>
              NEWS<span style={{ color: "#cc0000" }}>ORACLE</span>
            </h2>
            <p style={{ margin: 0, fontSize: "12px" }}>
              © 2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
