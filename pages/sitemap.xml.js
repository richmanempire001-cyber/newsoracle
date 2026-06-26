import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://newsoracle.online</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://newsoracle.online/about</loc>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://newsoracle.online/contact</loc>
    <priority>0.5</priority>
  </url>
  ${articles.map(article => `
  <url>
    <loc>https://newsoracle.online/article/${article.id}</loc>
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
