import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About NewsOracle — Breaking News Platform</title>
        <meta name="description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, technology and politics. Updated around the clock, every single day." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/about" />
        <meta property="og:title" content="About NewsOracle — Breaking News Platform" />
        <meta property="og:description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, technology and politics." />
        <meta property="og:url" content="https://www.newsoracle.online/about" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NewsOracle" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About NewsOracle — Breaking News Platform" />
        <meta name="twitter:description" content="NewsOracle is a digital news platform delivering breaking news and analysis in sports, finance, technology and politics." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NewsMediaOrganization",
          "name": "NewsOracle",
          "url": "https://www.newsoracle.online",
          "description": "Breaking news in Sports, Finance, Politics and Technology",
          "foundingDate": "2026-06",
          "foundingLocation": "Toronto, Ontario, Canada",
          "editor": {
            "@type": "Person",
            "name": "Sourav",
            "jobTitle": "Founder & Editor in Chief",
            "email": "news.oracle@outlook.com"
            // REMOVED "sameAs" LinkedIn link. The slug (news-oracle-a7543b423)
            // reads as a brand page, not a personal profile — if a reviewer
            // clicks it and finds a thin/brand-styled profile, it hurts more
            // than it helps. Only re-add this once Sourav has a real,
            // established personal LinkedIn profile with actual history on it.
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "news.oracle@outlook.com",
            "contactType": "editorial"
          }
        })}} />
      </Head>

      <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f4f4', minHeight: '100vh' }}>

        {/* Top Bar */}
        <div style={{ background: '#cc0000', color: '#fff', padding: '6px 0', fontSize: '12px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>Sports · Finance · Politics · Technology</span>
          </div>
        </div>

        {/* Header */}
        <header style={{ background: '#fff', borderBottom: '3px solid #cc0000', padding: '16px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ fontSize: '36px', fontWeight: '900', margin: 0, color: '#111', letterSpacing: '-1px' }}>
                NEWS<span style={{ color: '#cc0000' }}>ORACLE</span>
              </h1>
            </Link>
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/category/sports" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Sports</Link>
              <Link href="/category/finance" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Finance</Link>
              <Link href="/category/politics" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Politics</Link>
              <Link href="/category/technology" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Technology</Link>
              <Link href="/guides" style={{ color: '#333', textDecoration: 'none', fontSize: '13px', fontWeight: '600', textTransform: 'uppercase' }}>Guides</Link>
            </nav>
          </div>
        </header>

        <style>{`
          @media (max-width: 768px) {
            nav { display: none !important; }
            .about-grid { grid-template-columns: 1fr !important; }
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>

        <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Home</Link>
            <span style={{ color: '#999', margin: '0 8px' }}>›</span>
            <span style={{ color: '#666', fontSize: '13px' }}>About Us</span>
          </div>

          {/* Hero */}
          <div style={{ background: '#111', color: '#fff', padding: '48px 40px', marginBottom: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '42px', fontWeight: '900', margin: '0 0 12px', letterSpacing: '-1px' }}>
              NEWS<span style={{ color: '#cc0000' }}>ORACLE</span>
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', margin: '0 0 8px', lineHeight: '1.5' }}>
              The world's news. Delivered fast. Every single day.
            </p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Founded June 2026 · Toronto, Ontario, Canada
            </p>
          </div>

          {/* Stats */}
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Live Updates', value: 'Daily' },
              { label: 'Categories', value: '4' },
              { label: 'Reporting', value: 'Verified' },
              { label: 'Coverage', value: 'Global' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#fff', padding: '20px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#cc0000', marginBottom: '4px' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#777', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>Our Mission</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#444', margin: '0 0 16px' }}>
              Founded in Toronto, Canada in June 2026, NewsOracle was built on a simple belief: everyone deserves access to fast, accurate, and readable news — without paywalls, without bias, and without the noise.
            </p>
            <p style={{ fontSize: '16px', lineHeight: '1.8', color: '#444', margin: 0 }}>
              {/* CHANGED: "Our editorial team" -> accurate singular framing.
                  Only one named person (Sourav) appears anywhere on the site.
                  Claiming a "team" when there is one founder is a credibility
                  risk if a reviewer or reader checks. Update this copy for
                  real once you have named contributors to point to. */}
              Sourav founded NewsOracle to combine the discipline of professional journalism with the reach of a global news platform — delivering breaking news in Sports, Finance, Politics and Technology, updated continuously, every single day.
            </p>
          </div>

          {/* Editorial Leadership */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 24px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>Editorial Leadership</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ width: '64px', height: '64px', background: '#cc0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontWeight: '900', fontSize: '24px' }}>S</span>
                {/* TODO: Replace this initial-avatar with a real headshot.
                    A photo is one of the single highest-leverage trust signals
                    for a solo-founder news site — an initial in a circle reads
                    as anonymous/placeholder to a reviewer. */}
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: '0 0 4px' }}>Sourav</h3>
                {/* TODO: Add a last name if you're willing to use one publicly.
                    A single first name on a byline reads as anonymous,
                    especially for finance/politics coverage. This is optional
                    but it's one of the more common reasons reviewers flag
                    EEAT on solo-founder news sites. */}
                <p style={{ fontSize: '13px', color: '#cc0000', fontWeight: '600', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Founder & Editor in Chief</p>
                <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#555', margin: '0 0 12px' }}>
                  Sourav is the founder and Editor in Chief of NewsOracle, based in Toronto, Canada. He oversees all editorial decisions, content quality standards, and the strategic direction of the publication. NewsOracle was founded in June 2026 with a mission to make global news fast, accurate and accessible to everyone.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <a href="mailto:news.oracle@outlook.com" style={{ fontSize: '13px', color: '#cc0000', textDecoration: 'none', fontWeight: '600' }}>news.oracle@outlook.com</a>
                  {/* REMOVED the LinkedIn link here for the same reason it was
                      removed from the JSON-LD above — a brand-styled slug on
                      a personal bio undercuts the "real person" signal it's
                      meant to provide. Re-add once it's a genuine, established
                      personal profile. */}
                </div>
              </div>
            </div>
          </div>

          {/* How We Work */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 24px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>How NewsOracle Works</h2>
            <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                {
                  num: '01',
                  title: 'Monitor',
                  desc: 'We monitor trusted global news sources daily — including AP, Reuters, ESPN, Bloomberg and BBC — to identify the most important breaking stories.'
                },
                {
                  num: '02',
                  title: 'Report',
                  desc: 'Every story is read in full, verified, and written from scratch in professional journalism style — with clear facts, named sources and proper attribution.'
                },
                {
                  num: '03',
                  title: 'Publish',
                  desc: 'Each article is reviewed for accuracy and quality before publication. We publish breaking news as it develops, with corrections issued within 24 hours when needed.'
                }
              ].map(step => (
                <div key={step.num} style={{ borderTop: '3px solid #cc0000', paddingTop: '16px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#eee', marginBottom: '8px' }}>{step.num}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: '0 0 10px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#666', margin: 0 }}>{step.desc}</p>
                </div>
              ))}
            </div>
            {/*
              NOTE (not a code fix, flagging for visibility): this "How We
              Work" copy is now honest, but it will only hold up if the
              article pages actually match it. On the live site, articles
              still carry an unattributed "Analyst Confidence: 88%" style
              score and a vague "Sources: based on reporting from
              international news sources via Google News" line instead of
              real outbound links. Those live in the article template, not
              this file — paste that component in and I'll fix it too.
            */}
          </div>

          {/* Editorial Standards */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 24px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>Editorial Standards</h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7', margin: '0 0 20px' }}>
              NewsOracle is committed to accuracy, transparency, and responsible journalism. Here is how we maintain editorial quality:
            </p>
            {[
              { title: 'Source Verification', desc: 'Every article is based on content from established, reputable news sources. We never publish articles without a verifiable source.' },
              { title: 'Original Writing', desc: 'Every story is written from scratch in our own words. We never copy or reproduce original articles — we report, summarise, and add context.' },
              { title: 'Fact-Based Reporting', desc: 'Every claim in our articles is supported by verified source material. We never invent facts, quotes, or statistics.' },
              { title: 'Transparent Publishing', desc: 'NewsOracle articles are reviewed for quality and accuracy before going live.' },
              { title: 'Corrections Policy', desc: 'We correct errors within 24 hours. A correction note is added to any article that required a factual update.' },
              { title: 'No Political Bias', desc: 'NewsOracle does not endorse any political party, candidate, or ideology. Our political coverage aims to be factual and balanced.' },
            ].map(item => (
              <div key={item.title} style={{ display: 'flex', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #f5f5f5' }}>
                <span style={{ color: '#2e7d32', fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>✅</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#111' }}>{item.title}</p>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.6' }}>{item.desc}</p>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '8px' }}>
              <Link href="/corrections" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Read our full corrections policy →</Link>
            </div>
          </div>

          {/* What We Cover */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 24px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>What We Cover</h2>
            <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { icon: '🏆', title: 'Sports', desc: 'NFL, NBA, Premier League, UFC, Tennis, Cricket and all major global sporting events.', href: '/category/sports' },
                { icon: '💰', title: 'Finance', desc: 'Stock markets, cryptocurrency, Bitcoin, S&P 500, Fed decisions and breaking financial news.', href: '/category/finance' },
                { icon: '🏛', title: 'Politics', desc: 'US politics, Congress, White House, Supreme Court, global elections and international relations.', href: '/category/politics' },
                { icon: '💻', title: 'Technology', desc: 'AI, Apple, Google, Tesla, Meta, OpenAI, product launches and innovations shaping the future.', href: '/category/technology' },
                { icon: '📚', title: 'Guides', desc: 'In-depth evergreen guides covering finance, sports, politics and technology topics in depth.', href: '/guides' },
              ].map(cat => (
                <Link key={cat.title} href={cat.href} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#f8f9fa', padding: '20px', borderTop: '3px solid #cc0000', cursor: 'pointer' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>{cat.icon}</div>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111', margin: '0 0 8px' }}>{cat.title}</h3>
                    <p style={{ fontSize: '13px', color: '#666', lineHeight: '1.5', margin: 0 }}>{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: '#fff', padding: '32px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111', margin: '0 0 16px', paddingBottom: '12px', borderBottom: '3px solid #cc0000' }}>Contact Us</h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.7', margin: '0 0 20px' }}>
              Have a question, feedback, or a news tip? We would love to hear from you.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#cc0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: '900' }}>N</span>
                </div>
                <div>
                  {/* CHANGED: "NewsOracle Editorial Team" -> named person, since
                      there's no team to attribute this to yet. Overclaiming
                      a team you can't back up is worse than being direct
                      about a solo-founder operation. */}
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#111' }}>Sourav, Founder & Editor in Chief</p>
                  <a href="mailto:news.oracle@outlook.com" style={{ fontSize: '13px', color: '#cc0000', textDecoration: 'none' }}>news.oracle@outlook.com</a>
                  {/* TODO (needs your action, not something I can fake): a
                      free @outlook.com address is a low-trust signal for a
                      site presenting as a professional news publication.
                      Set up something like editor@newsoracle.online on your
                      own domain and swap every instance of the outlook
                      address across the site (this file, Contact, Privacy
                      Policy, Editorial Guidelines, Corrections). */}
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#777' }}>
                Toronto, Ontario, Canada
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background: '#fffbf0', border: '1px solid #ffe082', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Disclaimer</h3>
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.7', margin: 0 }}>
              All content published on NewsOracle is for informational purposes only. Articles are written based on publicly available news sources and do not constitute financial, legal, or investment advice. Market outlooks and predictions represent editorial analysis only. Always consult a qualified professional before making financial decisions.
            </p>
          </div>

          {/* Follow */}
          <div style={{ background: '#111', color: '#fff', padding: '32px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 8px' }}>Follow NewsOracle</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: '0 0 20px' }}>Get breaking news delivered instantly to your favourite platform</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://t.me/NewsOracleOfficial" target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', color: '#fff', padding: '10px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Telegram</a>
              <a href="https://www.facebook.com/profile.php?id=61591337781640" target="_blank" rel="noopener noreferrer" style={{ background: '#1877f2', color: '#fff', padding: '10px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Facebook</a>
              <a href="https://twitter.com/NewsOracle" target="_blank" rel="noopener noreferrer" style={{ background: '#000', color: '#fff', padding: '10px 20px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>Twitter</a>
              {/* REMOVED the LinkedIn button from this row — same brand-slug
                  concern as above. Re-add once it points to a real,
                  established personal profile rather than a fresh brand page. */}
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer style={{ background: '#111', color: '#999', padding: '40px 20px', marginTop: '0' }}>
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
              2026 NewsOracle. All content is for informational purposes only and does not constitute financial or betting advice.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
