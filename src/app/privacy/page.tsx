// jela-website/src/app/privacy/page.tsx

export const metadata = {
  title: 'Privacy Policy - Jelena Lazić Tattoo',
  description: 'Privacy policy for Jelena Lazić Tattoo website. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-foreground/70">
            Last updated: October 24, 2025
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto prose prose-lg prose-headings:font-heading prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-p:text-foreground/90 prose-p:font-body prose-ul:font-body prose-a:text-accent hover:prose-a:text-accent/80">
          
          <section className="mb-12">
            <h2>Introduction</h2>
            <p>
              Welcome to Jelena Lazić Tattoo ("we," "our," or "us"). We respect your privacy 
              and are committed to protecting your personal data. This privacy policy explains 
              how we collect, use, and protect your information when you visit our website 
              jelenalazictattoo.com (the "Site").
            </p>
          </section>

          <section className="mb-12">
            <h2>Information We Collect</h2>
            
            <h3>Information You Provide</h3>
            <p>We collect information you voluntarily provide when you:</p>
            <ul>
              <li>Fill out our contact form (name, email, phone number, message)</li>
              <li>Subscribe to our newsletter (email address)</li>
              <li>Communicate with us via email or social media</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our Site, we automatically collect certain information including:</p>
            <ul>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website</li>
            </ul>

            <h3>Cookies and Tracking Technologies</h3>
            <p>
              We use Google Analytics 4 to understand how visitors use our Site. This service 
              uses cookies to collect anonymous usage data. You can opt out of Google Analytics 
              by installing the Google Analytics Opt-out Browser Add-on.
            </p>
          </section>

          <section className="mb-12">
            <h2>How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li>
                <strong>Contact Form:</strong> To respond to your inquiries and provide information 
                about our tattoo services
              </li>
              <li>
                <strong>Newsletter:</strong> To send occasional updates about new work, studio news, 
                and special events (you can unsubscribe at any time)
              </li>
              <li>
                <strong>Analytics:</strong> To understand how visitors use our Site and improve 
                user experience
              </li>
              <li>
                <strong>Legal Compliance:</strong> To comply with applicable laws and regulations
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Data Storage and Security</h2>
            <p>
              Your personal information is stored securely using Supabase (database) and processed 
              through Resend (email service). We implement appropriate technical and organizational 
              measures to protect your data against unauthorized access, alteration, disclosure, 
              or destruction.
            </p>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% 
              secure. While we strive to protect your personal data, we cannot guarantee its 
              absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2>Third-Party Services</h2>
            <p>We use the following third-party services that may collect your data:</p>
            <ul>
              <li>
                <strong>Supabase:</strong> Database and storage service for contact submissions 
                and newsletter subscribers
              </li>
              <li>
                <strong>Resend:</strong> Email delivery service for contact form responses and 
                newsletter emails
              </li>
              <li>
                <strong>Google Analytics 4:</strong> Website analytics and usage tracking
              </li>
              <li>
                <strong>Vercel/Netlify:</strong> Website hosting and content delivery
              </li>
              <li>
                <strong>Google Maps:</strong> Embedded map showing studio location
              </li>
            </ul>
            <p>
              These services have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section className="mb-12">
            <h2>Your Rights (GDPR Compliance)</h2>
            <p>If you are located in the European Economic Area (EEA), you have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Request limitation of data processing</li>
              <li><strong>Portability:</strong> Request transfer of your data to another service</li>
              <li><strong>Objection:</strong> Object to processing of your data</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (for newsletter)</li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at jelenalazictattoo@gmail.com
            </p>
          </section>

          <section className="mb-12">
            <h2>Data Retention</h2>
            <p>We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required by law.</p>
            <ul>
              <li><strong>Contact Form Submissions:</strong> Retained indefinitely for business records</li>
              <li><strong>Newsletter Subscriptions:</strong> Retained until you unsubscribe</li>
              <li><strong>Analytics Data:</strong> Retained according to Google Analytics retention settings (typically 14-26 months)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Children's Privacy</h2>
            <p>
              Our Site is not intended for children under 16 years of age. We do not knowingly 
              collect personal information from children. If you believe we have collected 
              information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2>International Data Transfers</h2>
            <p>
              Your data may be transferred to and processed in countries outside of Serbia, 
              including the United States where our service providers are located. These countries 
              may have different data protection laws than your country. We ensure appropriate 
              safeguards are in place to protect your data.
            </p>
          </section>

          <section className="mb-12">
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" 
              date. You are advised to review this policy periodically for any changes.
            </p>
          </section>

          <section className="mb-12">
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your rights, 
              please contact us:
            </p>
            <ul className="list-none pl-0">
              <li><strong>Email:</strong> jelenalazictattoo@gmail.com</li>
              <li><strong>Phone:</strong> +381 61 584 9416</li>
              <li><strong>Address:</strong> Hoću Guze 100, Belgrade, Serbia</li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  )
}