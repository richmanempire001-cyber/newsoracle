import { createClient } from '@supabase/supabase-js';
import { slugify } from '../lib/slugify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateRSS(articles) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>NewsOracle — Sports, Finance, Technology &amp; Politics News</title>
    <link>https://www.newsoracle.online</link>
    <description>Breaking news in Sports, Finance, Technology and Politics. Updated around the clock.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>https://www.newsoracle.online/favicon.ico</url>
      <title>NewsOracle</title>
      <link>https://www.newsoracle.online</link>
    </image>
    ${articles.map(article => {
      const slug = `${article.id}-${slugify(article.title)}`;
      const url = `https://www.newsoracle.online/article/${slug}`;
      const description = (article.summary || '').substring(0, 300).replace(/\n/g, ' ');
      const pubDate = new Date(article.created_at).toUTCString();
      const imageTag = article.image ? `
      <media:content url="${escapeXml(article.image)}" medium="image"/>
      <enclosure url="${escapeXml(article.image)}" type="image/jpeg" length="0"/>` : '';
      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(article.category)}</category>${imageTag}
    </item>`;
    }).join('')}
  </channel>
</rss>`;
}

export async function getServerSideProps({ res }) {
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, summary, image, category, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  const rss = generateRSS(articles || []);
  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
  res.write(rss);
  res.end();
  return { props: {} };
}

export default function RSS() {}
