import { createClient } from '@supabase/supabase-js';
import { slugify } from '../lib/slugify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.newsoracle.online</loc>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/category/sports</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/category/finance</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.newsoracle.online/category/politics</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
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
  ${articles.map(article => {
    const slug = `${article.id}-${slugify(article.title)}`;
    const imageTag = article.image ? `
    <image:image>
      <image:loc>${escapeXml(article.image)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>` : '';
    return `
  <url>
    <loc>https://www.newsoracle.online/article/${slug}</loc>
    <lastmod>${new Date(article.created_at).toISOString()}</lastmod>
    <changefreq>never</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>`;
  }).join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, title, image')
    .order('created_at', { ascending: false });

  const sitemap = generateSiteMap(articles || []);
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function Sitemap() {}
