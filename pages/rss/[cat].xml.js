import { createClient } from '@supabase/supabase-js';
import { slugify } from '../../lib/slugify';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const VALID_CATEGORIES = ['sports', 'finance', 'politics', 'technology'];

const CATEGORY_TITLES = {
  sports: 'NewsOracle Sports — Breaking Sports News',
  finance: 'NewsOracle Finance — Markets & Crypto News',
  politics: 'NewsOracle Politics — US & Global Political News',
  technology: 'NewsOracle Technology — AI, Apple, Tesla & Tech News'
};

const CATEGORY_DESCRIPTIONS = {
  sports: 'Breaking sports news from the NFL, NBA, Premier League, UFC, tennis, cricket and all major global sporting events.',
  finance: 'Stock market updates, cryptocurrency news, economic analysis and breaking financial reports covering Wall Street, Bitcoin, S&P 500 and global markets.',
  politics: 'US and global political news covering Congress, the White House, Supreme Court, elections and international relations.',
  technology: 'Breaking technology news covering AI, Apple, Google, Tesla, Meta, OpenAI, product launches and innovations shaping the future.'
};

function escapeXml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function generateCategoryRSS(articles, category) {
  const title = CATEGORY_TITLES[category];
  const description = CATEGORY_DESCRIPTIONS[category];
  const categoryUrl = `https://www.newsoracle.online/category/${category}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${categoryUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <url>https://www.newsoracle.online/favicon.ico</url>
      <title>${escapeXml(title)}</title>
      <link>${categoryUrl}</link>
    </image>
    ${articles.map(article => {
      const slug = `${article.id}-${slugify(article.title)}`;
      const url = `https://www.newsoracle.online/article/${slug}`;
      const description = (article.summary || '').substring(0, 300).replace(/\n/g, ' ');
      const pubDate = new Date(article.created_at).toUTCString();
      const imageTag = article.image ? `
      <media:content url="${escapeXml(article.image)}" medium="image"/>
      <enclosure url="${escapeXml(article.image)}" type="image/jpeg" length="0"/>` : '';

      // Tag enrichment — category + article tag for Pinterest discoverability
      const tagLine = article.tag && article.tag !== category
        ? `<category>${escapeXml(article.category)}</category>
      <category>${escapeXml(article.tag)}</category>`
        : `<category>${escapeXml(article.category)}</category>`;

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${tagLine}${imageTag}
    </item>`;
    }).join('')}
  </channel>
</rss>`;
}

export async function getServerSideProps({ params, res }) {
  const category = params.cat.replace('.xml', '');

  if (!VALID_CATEGORIES.includes(category)) {
    res.statusCode = 404;
    res.end('Not found');
    return { props: {} };
  }

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, summary, image, category, tag, created_at')
    .eq('category', category)
    .order('created_at', { ascending: false })
    .limit(50);

  const rss = generateCategoryRSS(articles || [], category);

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=1800');
  res.write(rss);
  res.end();

  return { props: {} };
}

export default function CategoryRSS() {}
