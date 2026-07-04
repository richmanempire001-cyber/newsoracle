import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.newsoracle.online</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/terms</loc>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
  ${articles.map(article => `
  <url>
    <loc>https://www.newsoracle.online/article/${article.id}</loc>
    <lastmod>${new Date(article.created_at).toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at')
    .order('created_at', { ascending: false });

  const sitemap = generateSiteMap(articles || []);
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {}
