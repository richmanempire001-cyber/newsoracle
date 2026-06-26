import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function generateNewsSiteMap(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${articles.map(article => `
  <url>
    <loc>https://www.newsoracle.online/article/${article.id}</loc>
    <news:news>
      <news:publication>
        <news:name>NewsOracle</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.created_at).toISOString()}</news:publication_date>
      <news:title>${article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>`).join('')}
</urlset>`;
}

export async function getServerSideProps({ res }) {
  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

  const { data: articles } = await supabase
    .from('articles')
    .select('id, created_at, title')
    .gte('created_at', twoDaysAgo.toISOString())
    .order('created_at', { ascending: false });

  const sitemap = generateNewsSiteMap(articles || []);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function NewsSitemap() {}
