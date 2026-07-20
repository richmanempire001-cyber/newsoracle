import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — NewsOracle</title>
        <meta name="description" content="NewsOracle Privacy Policy — how we collect, use, and protect your information." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.newsoracle.online/privacy-policy" />
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

        <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 20px' }}>

          <div style={{ marginBottom: '24px' }}>
            <Link href="/" style={{ color: '#cc0000', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Home</Link>
            <span style={{ color: '#999', margin: '0 8px' }}>›</span>
            <span style={{ color: '#666', fontSize: '13px' }}>Privacy Policy</span>
          </div>

          <div style={{ background: '#fff', padding: '40px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>

            <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#111', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Privacy Policy</h1>
            <p style={{ fontSize: '13px', color: '#999', margin: '0 0 32px' }}>Last updated: July 19, 2026 · Effective date: June 2026</p>

            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#444', margin: '0 0 32px' }}>
              NewsOracle ("we", "our", or "us"), operated from Toronto, Ontario, Canada, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit <strong>www.newsoracle.online</strong>. Please read this policy carefully. If you disagree with its terms, please discontinue use of the site.
            </p>

            {[
              {
                title: '1. Information We Collect',
                content: [
                  {
                    subtitle: 'Information collected automatically',
                    text: 'When you visit NewsOracle, we automatically collect certain information about your device, including your IP address, browser type, operating system, referring URLs, and pages visited. This information is used to analyse trends, administer the site, and improve user experience.'
                  },
                  {
                    subtitle: 'Cookies and tracking technologies',
                    text: 'We use cookies — small text files stored on your device — to enhance your browsing experience. Cookies help us remember your preferences, analyse site traffic, and serve relevant advertisements. You can control cookie settings through your browser. Disabling cookies may affect some site functionality. Users may manage cookie preferences through their browser settings or through a cookie consent banner where available.'
                  },
                  {
                    subtitle: 'Information you provide',
                    text: 'We collect information you voluntarily provide when contacting us via email, including your name and email address. We do not collect payment information or require account registration to access our content.'
                  }
                ]
              },
              {
                title: '2. How We Use Your Information',
                content: [
                  {
                    text: 'We use the information we collect to: operate and maintain our website; analyse usage patterns and improve our content and services; serve relevant advertisements through third-party advertising partners; comply with legal obligations; and respond to your enquiries and feedback.'
                  },
                  {
                    subtitle: 'Legal basis for processing (GDPR)',
                    text: 'We process personal data based on legitimate interests (improving our service and delivering relevant content), consent where required by applicable law, legal obligations, or contractual necessity.'
                  }
                ]
              },
              {
                title: '3. Advertising',
                content: [
                  {
                    text: 'NewsOracle may use Google AdSense to display advertisements. If enabled, Google may use cookies and web beacons to serve personalised ads based on your prior visits to our website and other websites on the internet.'
                  },
                  {
                    text: 'You may opt out of personalised advertising by visiting Google\'s Ads Settings at https://www.google.com/settings/ads. Alternatively, you can opt out of third-party vendor use of cookies for personalised advertising by visiting www.aboutads.info.'
                  },
                  {
                    text: 'Google\'s use of advertising cookies is governed by the Google Privacy Policy available at https://policies.google.com/privacy.'
                  }
                ]
              },
              {
                title: '4. Analytics',
                content: [
                  {
                    text: 'We may use analytics services, including Google Analytics, to understand how visitors use our website. These services may collect information such as how often users visit, what pages they visit, and what other sites they used prior to visiting ours. We use this information solely to improve our content and user experience.'
                  }
                ]
              },
              {
                title: '5. Third-Party Links',
                content: [
                  {
                    text: 'Our website contains links to third-party websites including our news sources. We are not responsible for the privacy practices or content of those sites. We encourage you to review the privacy policies of any third-party sites you visit.'
                  }
                ]
              },
              {
                title: '6. Data Retention',
                content: [
                  {
                    text: 'We retain automatically collected information such as server logs for up to 12 months. Information you provide by email is retained only as long as necessary to respond to your enquiry. We do not sell your personal information as defined under applicable privacy laws.'
                  }
                ]
              },
              {
                title: '7. Data Security',
                content: [
                  {
                    text: 'We implement reasonable technical and organisational measures to protect your information against unauthorised access, disclosure, alteration, or destruction. However, no internet transmission is completely secure. We cannot guarantee the absolute security of information transmitted to or from our site.'
                  }
                ]
              },
              {
                title: '8. Your Rights (GDPR)',
                content: [
                  {
                    text: 'If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR). These include the right to: access the personal data we hold about you; request correction of inaccurate data; request deletion of your data; object to processing of your data; and request restriction of processing. To exercise any of these rights, please contact us at news.oracle@outlook.com. We will respond to your request within 30 days.'
                  }
                ]
              },
              {
                title: '9. California Privacy Rights (CCPA)',
                content: [
                  {
                    text: 'If you are a California resident, you have the right to know what personal information we collect about you, request deletion of your personal information, and opt out of the sale of your personal information. We do not sell your personal information as defined under applicable privacy laws. To exercise your rights, contact us at news.oracle@outlook.com.'
                  }
                ]
              },
              {
                title: '10. Children\'s Privacy',
                content: [
                  {
                    text: 'NewsOracle is not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at news.oracle@outlook.com and we will delete that information promptly.'
                  }
                ]
              },
              {
                title: '11. Changes to This Policy',
                content: [
                  {
                    text: 'We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last updated" date at the top of this page. Your continued use of the site after any changes constitutes your acceptance of the updated policy.'
                  }
                ]
              },
              {
                title: '12. Contact Us',
                content: [
                  {
                    text: 'If you have questions or concerns about this Privacy Policy, please contact us:'
                  }
                ]
              }
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: i < 11 ? '1px solid #f0f0f0' : 'none' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111', margin: '0 0 16px' }}>{section.title}</h2>
                {section.content.map((item, j) => (
                  <div key={j} style={{ marginBottom: '12px' }}>
                    {item.subtitle && <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#333', margin: '0 0 8px' }}>{item.subtitle}</h3>}
                    <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#555', margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            ))}

            <div style={{ background: '#f8f9fa', padding: '20px', borderLeft: '4px solid #cc0000' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#111' }}>NewsOracle</p>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#555' }}>Toronto, Ontario, Canada</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>Email: <a href="mailto:news.oracle@outlook.com" style={{ color: '#cc0000', textDecoration: 'none' }}>news.oracle@outlook.com</a></p>
            </div>

            <p style={{ fontSize: '13px', color: '#999', margin: '24px 0 0', textAlign: 'center' }}>
              &copy; 2026 NewsOracle. All Rights Reserved.
            </p>

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
