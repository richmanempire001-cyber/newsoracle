import { createClient } from '@supabase/supabase-js';
import { slugify } from '../lib/slugify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateNewsSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${articles.map(article => {
    const slug = `${article.id}-${slugify(article.title)}`;
    const keywordsTag = article.tag ? `
      <news:keywords>${escapeXml(article.tag)}</news:keywords>` : '';
    const imageTag = article.image ? `
    <image:image>
      <image:loc>${escapeXml(article.image)}</image:loc>
      <image:title>${escapeXml(article.title)}</image:title>
    </image:image>` : '';
    return `
  <url>
    <loc>https://www.newsoracle.online/article/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>NewsOracle</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.created_at).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>${keywordsTag}
    </news:news>${imageTag}
  </url>`;
  }).join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, title, tag, image')
    .gte('created_at', twoDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  const sitemap = generateNewsSiteMap(articles || []);
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();
  return { props: {} };
}

export default function NewsSitemap() {}
