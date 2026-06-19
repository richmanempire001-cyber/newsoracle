import { useEffect, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error) setArticles(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>NewsOracle — AI Sports & Finance Predictions</title>
        <meta name="description" content="AI-powered sports and finance news with predictions" />
      </Head>

      <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "1100px", margin: "0 auto", padding: "20px" }}>
        
        {/* Header */}
        <div style={{ textAlign: "center", padding: "40px 0 20px", borderBottom: "2px solid #000" }}>
          <h1 style={{ fontSize: "42px", fontWeight: "900", margin: 0 }}>⚡ NewsOracle</h1>
          <p style={{ color: "#666", fontSize: "16px" }}>AI-Powered Sports & Finance Predictions — Updated Every 30 Minutes</p>
        </div>

        {/* Articles */}
        <div style={{ marginTop: "30px" }}>
          {loading ? (
            <p style={{ textAlign: "center", color: "#666" }}>Loading articles...</p>
          ) : articles.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>No articles yet. Check back soon!</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {articles.map((article) => (
                <div key={article.id} style={{ border: "1px solid #e0e0e0", borderRadius: "12px", padding: "20px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  
                  {/* Category Badge */}
                  <span style={{ background: article.category === "finance" ? "#0070f3" : "#00a86b", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                    {article.category}
                  </span>

                  {/* Title */}
                  <h2 style={{ fontSize: "18px", fontWeight: "700", margin: "12px 0 8px", lineHeight: "1.4" }}>
                    {article.title}
                  </h2>

                  {/* Summary */}
                  <p style={{ color: "#444", fontSize: "14px", lineHeight: "1.6", margin: "0 0 12px" }}>
                    {article.summary}
                  </p>

                  {/* Prediction */}
                  <div style={{ background: "#f8f9fa", borderLeft: "4px solid #0070f3", padding: "10px 14px", borderRadius: "4px", margin: "12px 0" }}>
                    <p style={{ margin: 0, fontSize: "13px", color: "#333" }}>
                      <strong>🔮 Prediction:</strong> {article.prediction}
                    </p>
                  </div>

                  {/* Confidence & Sentiment */}
                  <div style={{ display: "flex", gap: "10px", margin: "12px 0" }}>
                    <span style={{ background: "#e8f5e9", color: "#2e7d32", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                      Confidence: {article.confidence}%
                    </span>
                    <span style={{ background: "#e3f2fd", color: "#1565c0", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                      {article.sentiment}
                    </span>
                  </div>

                  {/* Disclaimer */}
                  <p style={{ color: "#999", fontSize: "11px", margin: "12px 0 0", fontStyle: "italic" }}>
                    {article.disclaimer}
                  </p>

                  {/* Time */}
                  <p style={{ color: "#bbb", fontSize: "11px", margin: "8px 0 0" }}>
                    {new Date(article.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "40px 0", borderTop: "1px solid #e0e0e0", marginTop: "40px", color: "#999", fontSize: "13px" }}>
          <p>© 2026 NewsOracle — AI predictions for informational purposes only</p>
        </div>
      </div>
    </>
  );
}
