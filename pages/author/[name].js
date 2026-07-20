import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { articlePath } from '../../lib/slugify';

function getImage(article) {
  if (article.image && !article.image.includes('source.unsplash')) return article.image;
  const keywords = {
    finance: "1611974789855-9c2a0a7236a3",
    sports: "1461896836934-ffe607ba8211",
    politics: "1529107386315-e1a2ed48a620",
    technology: "1518770660439-4636190af475",
  };
  return `https://images.unsplash.com/photo-${keywords[article.category] || keywords.finance}?w=800&q=80`;
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function AuthorPage({ articles, totalCount }) {
  return (
    <>
      <Head>
        <title>NewsOracle Editorial Team — About Our Journalists</title>
        <meta name="description" content="NewsOracle Editorial Team covers breaking news in Sports, Finance, Politics and Technology. Editor in Chief: Sourav, based in Toronto, Canada." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/author/newsoracle-editorial" />
        <meta property="og:title" content="NewsOracle Editorial Team" />
        <meta property="og:description" content="NewsOracle Editorial Team covers breaking news in Sports, Finance, Politics and Technology." />
        <meta property="og:url" content="https://www.newsoracle.online/author/newsoracle-editorial" />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="NewsOracle" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Sourav",
          "jobTitle": "Founder & Editor in Chief",
          "worksFor": {
            "@type": "NewsMediaOrganization",
            "name": "NewsOracle",
            "url": "https://www.newsoracle.online"
          },
          "email": "news.oracle@outlook.com",
          "url": "https://www.newsoracle.online/author/newsoracle-editorial",
          "sameAs": "https://www.linkedin.com/in/news-oracle-a7543b423/",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Toronto",
            "addressRegion": "Ontario",
            "addressCountry": "Canada"
          }
        })}} />
      </Head>

      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f4f4', minHeight: '100vh' }}>

        <div style={{ background: '#cc0000', color: '#fff', padding: '6px 0', fontSize: '12px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>Sports · Finance · Politics · Technology</span>
          </div>
        </div>

        <header style={{ background: '#fff', borderBottom: '3px solid #cc0000', padding: '16px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '900', margin: 0, color: '#111', letterSpacing: '-1px' }}>
                NEWS<span style={{ color: '#cc0000' }}>ORACLE</span>
              </h1>
            </Link>
            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/category/sports" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Sports</Link>
              <Link href="/category/finance" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Finance</Link>
              <Link href="/category/politics" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Politics</Link>
              <Link href="/category/technology" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Technology</Link>
              <Link href="/guides" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Guides</Link>
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Home</Link>
            <span style={{ color: '#999', margin: '0 8px' }}>›</span>
            <span style={{ color: '#666', fontSize: '13px' }}>Editorial Team</span>
          </div>

          {/* Author Profile */}
          <div style={{ background: '#fff', padding: '40px', marginBottom: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

              {/* Avatar */}
              <div style={{ width: '100px', height: '100px', background: '#cc0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontWeight: '900', fontSize: '40px' }}>N</span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111', margin: '0 0 4px', letterSpacing: '-0.5px' }}>NewsOracle Editorial Team</h1>
                <p style={{ fontSize: '14px', color: '#cc0000', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 16px' }}>Editor in Chief: Sourav · Founded June 2026 · Toronto, Canada</p>

                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', margin: '0 0 20px' }}>
                  NewsOracle is a digital news publication founded in Toronto, Canada in June 2026. Our editorial team monitors trusted global news sources daily — including AP, Reuters, ESPN, Bloomberg and BBC — to deliver breaking news in Sports, Finance, Politics and Technology. Every story is read, verified and written by our editorial team before publication.
                </p>

                <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#555', margin: '0 0 24px' }}>
                  NewsOracle is led by Sourav, Founder and Editor in Chief, who oversees all editorial decisions, content quality standards, and the strategic direction of the publication. All published articles are reviewed for accuracy and attribution before going live.
                </p>

                {/* Stats */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#cc0000' }}>{totalCount}+</div>
                    <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Articles Published</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#cc0000' }}>4</div>
                    <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Categories</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: '900', color: '#cc0000' }}>2026</div>
                    <div style={{ fontSize: '12px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>Founded</div>
                  </div>
                </div>

                {/* Links */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="mailto:news.oracle@outlook.com" style={{ background: '#cc0000', color: '#fff', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    news.oracle@outlook.com
                  </a>
                  <a href="https://www.linkedin.com/in/news-oracle-a7543b423/" target="_blank" rel="noopener noreferrer" style={{ background: '#0052cc', color: '#fff', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    LinkedIn
                  </a>
                  <Link href="/about" style={{ background: '#f0f0f0', color: '#333', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    About NewsOracle
                  </Link>
                  <Link href="/editorial-guidelines" style={{ background: '#f0f0f0', color: '#333', padding: '8px 16px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>
                    Editorial Guidelines
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Editorial Standards */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>Our Editorial Standards</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              {[
                { icon: '✅', title: 'Source Verification', desc: 'Every article is based on content from established, reputable news sources including AP, Reuters, ESPN, Bloomberg and BBC.' },
                { icon: '✅', title: 'Original Writing', desc: 'Every story is written from scratch in our own words. We never copy or reproduce original articles verbatim.' },
                { icon: '✅', title: 'Fact-Based Reporting', desc: 'Every claim in our articles is supported by verified source material. We never invent facts, quotes, or statistics.' },
                { icon: '✅', title: 'Corrections Policy', desc: 'We correct errors within 24 hours and add a correction note to any article that required a factual update.' },
                { icon: '✅', title: 'No Political Bias', desc: 'NewsOracle does not endorse any political party, candidate, or ideology. Our political coverage is factual and balanced.' },
                { icon: '✅', title: 'Editorial Independence', desc: 'Our editorial decisions are made independently. Advertisers have no influence over our editorial content.' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', gap: '12px', padding: '16px', background: '#f8f9fa', borderRadius: '2px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{item.title}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Articles */}
          <div style={{ background: '#fff', padding: '32px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#111', margin: '0 0 20px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>
              Latest Articles — {totalCount} Published
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              {articles.map(article => (
                <Link key={article.id} href={articlePath(article)} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', gap: '12px', cursor: 'pointer', padding: '12px', background: '#f8f9fa' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8f9fa'}
                  >
                    <img loading="lazy" src={getImage(article)} alt={article.title} style={{ width: '80px', height: '60px', objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '9px', color: '#cc0000', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{article.category}</span>
                      <p style={{ margin: '3px 0 0', fontSize: '13px', fontWeight: '600', color: '#111', lineHeight: '1.4' }}>{article.title}</p>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#bbb' }}>{timeAgo(article.created_at)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </main>

        <footer style={{ background: '#111', color: '#999', padding: '40px 20px', marginTop: '40px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <Link href="/about" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>About Us</Link>
              <Link href="/contact" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Contact</Link>
              <Link href="/corrections" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Corrections</Link>
              <Link href="/editorial-guidelines" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Editorial Guidelines</Link>
              <Link href="/privacy-policy" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Privacy Policy</Link>
              <Link href="/terms" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Terms of Service</Link>
              <Link href="/guides" style={{ color: '#999', textDecoration: 'none', fontSize: '13px' }}>Guides</Link>
            </div>
            <h2 style={{ color: '#fff', margin: '0 0 10px', fontSize: '24px', fontWeight: '900', textAlign: 'center' }}>
              NEWS<span style={{ color: '#cc0000' }}>ORACLE</span>
            </h2>
            <p style={{ margin: 0, fontSize: '12px', textAlign: 'center' }}>
              &copy; 2026 NewsOracle. All Rights Reserved. All content is for informational purposes only.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );

  const { data: articles, count } = await supabaseServer
    .from('articles')
    .select('id, title, image, category, created_at', { count: 'exact' })
    .or('evergreen.eq.false,evergreen.is.null')
    .order('created_at', { ascending: false })
    .limit(20);

  return {
    props: {
      articles: articles || [],
      totalCount: count || 0,
    }
  };
}
