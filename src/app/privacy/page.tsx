'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Head from 'next/head';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  const router = useRouter();

  // Optional: You can add an animation or analytics here on mount
  useEffect(() => {
    // Example: log page view
    console.log('Privacy Policy page viewed');
  }, []);

  return (
    <>
      <Head>
        <title>Privacy Policy | Yee FM</title>
        <meta name="description" content="Yee FM's privacy policy detailing how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://www.yeefm.com/privacy-policy" />
      </Head>

      {/* Simple Header */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(5px)',
        padding: '15px 20px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '5px',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
          onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
          aria-label="Go back"
        >
          ←
        </button>
        <h1 style={{
          margin: '0 auto',
          fontSize: '18px',
          fontWeight: '500',
          color: '#333',
        }}>
          Privacy Policy
        </h1>
      </header>

      {/* Main Content */}
      <div style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        minHeight: '100vh',
        paddingTop: '80px', // Account for fixed header
        paddingBottom: '60px',
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '20px',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#1976d2', marginBottom: '10px' }}>Privacy Policy</h1>
            <p style={{ color: '#666', fontStyle: 'italic' }}>Last updated: August 17, 2024</p>
          </div>

          <section style={{ marginBottom: '30px' }}>
            <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
            <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the Free Privacy Policy Generator.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Interpretation and Definitions</h2>

            <h3>Interpretation</h3>
            <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

            <h3>Definitions</h3>
            <p>For the purposes of this Privacy Policy:</p>

            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Affiliate</strong> means an entity that controls, is controlled by or is under common control with a party, where &quot;control&quot; means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</li>
              <li><strong>Application</strong> refers to yee fm, the software program provided by the Company.</li>
              <li><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Yee technologies, Kampala.</li>
              <li><strong>Cookies</strong> are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</li>
              <li><strong>Country</strong> refers to: Uganda</li>
              <li><strong>Device</strong> means any device that can access the Service such as a computer, a cellphone or a digital tablet.</li>
              <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service</strong> refers to the Application or the Website or both.</li>
              <li><strong>Service Provider</strong> means any natural or legal person who processes the data on behalf of the Company.</li>
              <li><strong>Usage Data</strong> refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself.</li>
              <li><strong>Website</strong> refers to yee fm, accessible from <a href="https://www.yeefm.com/" style={{ color: '#1976d2' }}>https://www.yeefm.com/</a></li>
              <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Collecting and Using Your Personal Data</h2>

            <h3>Types of Data Collected</h3>

            <h4>Personal Data</h4>
            <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address</li>
              <li>Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>Usage Data is collected automatically when using the Service.</p>
            <p>Usage Data may include information such as Your Device&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
            <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
            <p>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>

            <h3>Tracking Technologies and Cookies</h3>
            <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Cookies or Browser Cookies.</strong> A cookie is a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</li>
              <li><strong>Web Beacons.</strong> Certain sections of our Service and our emails may contain small electronic files known as web beacons that permit the Company to count users who have visited those pages or opened an email.</li>
            </ul>
            <p>Cookies can be &quot;Persistent&quot; or &quot;Session&quot; Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser.</p>

            <p>We use both Session and Persistent Cookies for the purposes set out below:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>Necessary / Essential Cookies</strong> (Session Cookies) - Essential to provide You with services available through the Website</li>
              <li><strong>Cookies Policy / Notice Acceptance Cookies</strong> (Persistent Cookies) - Identify if users have accepted cookie use</li>
              <li><strong>Functionality Cookies</strong> (Persistent Cookies) - Remember choices You make when using the Website</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Use of Your Personal Data</h2>
            <p>The Company may use Personal Data for the following purposes:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>To provide and maintain our Service</li>
              <li>To manage Your Account</li>
              <li>For contract performance</li>
              <li>To contact You</li>
              <li>To provide news, special offers and general information</li>
              <li>To manage Your requests</li>
              <li>For business transfers</li>
              <li>For other purposes like data analysis and service improvement</li>
            </ul>

            <p>We may share Your personal information in these situations:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>With Service Providers</li>
              <li>For business transfers</li>
              <li>With Affiliates</li>
              <li>With business partners</li>
              <li>With other users in public areas</li>
              <li>With Your consent</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Retention of Your Personal Data</h2>
            <p>The Company will retain Your Personal Data only as long as necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to comply with legal obligations, resolve disputes, and enforce our policies.</p>
            <p>Usage Data is generally retained for shorter periods, except when used to strengthen security or improve functionality.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Transfer of Your Personal Data</h2>
            <p>Your information may be transferred to — and maintained on — computers located outside of Your jurisdiction where data protection laws may differ. Your consent to this Privacy Policy represents Your agreement to that transfer.</p>
            <p>The Company will ensure Your data is treated securely according to this Privacy Policy.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Delete Your Personal Data</h2>
            <p>You have the right to delete or request assistance in deleting Personal Data We have collected about You.</p>
            <p>You may update or delete Your information through Your Account settings or by contacting Us. Note that We may need to retain certain information when required by law.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Disclosure of Your Personal Data</h2>
            <h3>Business Transactions</h3>
            <p>If the Company is involved in a merger or asset sale, Your Personal Data may be transferred. We will provide notice before transfer.</p>

            <h3>Law enforcement</h3>
            <p>Under certain circumstances, the Company may disclose Your Data if required by law.</p>

            <h3>Other legal requirements</h3>
            <p>The Company may disclose Your Data to:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Comply with legal obligations</li>
              <li>Protect Company rights or property</li>
              <li>Prevent wrongdoing related to the Service</li>
              <li>Protect user or public safety</li>
              <li>Protect against legal liability</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Security of Your Personal Data</h2>
            <p>While We strive to protect Your Personal Data, no transmission method over the Internet is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Children&apos;s Privacy</h2>
            <p>Our Service does not address anyone under 13. We do not knowingly collect personal information from children under 13. If You are a parent and aware Your child has provided Us with data, please contact Us.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Links to Other Websites</h2>
            <p>Our Service may contain links to third-party websites not operated by Us. We have no control over and assume no responsibility for their content or practices.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Changes to this Privacy Policy</h2>
            <p>We may update Our Privacy Policy periodically. We will notify You of changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
            <p>You are advised to review this Privacy Policy periodically for changes.</p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, contact us:</p>
            <p>By email: <a href="mailto:team@yeefm.com" style={{ color: '#1976d2' }}>team@yeefm.com</a></p>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;