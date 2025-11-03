// jela-website/src/app/terms/page.tsx

export const metadata = {
  title: 'Terms & Conditions - Jelena Lazić Tattoo',
  description: 'Terms and conditions for using the Jelena Lazić Tattoo website and services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Terms & Conditions
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
              Welcome to Jelena Lazić Tattoo. By accessing and using our website 
              jelenalazictattoo.com (the "Site"), you agree to be bound by these Terms and 
              Conditions ("Terms"). If you do not agree with any part of these Terms, please 
              do not use our Site.
            </p>
          </section>

          <section className="mb-12">
            <h2>Use of Website</h2>
            
            <h3>Permitted Use</h3>
            <p>You may use our Site for the following purposes:</p>
            <ul>
              <li>Viewing our tattoo portfolio</li>
              <li>Learning about our services and artist background</li>
              <li>Contacting us about tattoo inquiries</li>
              <li>Subscribing to our newsletter</li>
            </ul>

            <h3>Prohibited Use</h3>
            <p>You may not use our Site to:</p>
            <ul>
              <li>Violate any applicable laws or regulations</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, copy, or download content without permission</li>
              <li>Impersonate any person or entity</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Use automated systems (bots, scrapers) without authorization</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Intellectual Property Rights</h2>
            
            <h3>Portfolio Images and Content</h3>
            <p>
              All tattoo designs, photographs, artwork, and other content displayed on this Site 
              are the intellectual property of Jelena Lazić and are protected by copyright laws. 
              This includes:
            </p>
            <ul>
              <li>Original tattoo designs and photographs</li>
              <li>Logo and branding materials</li>
              <li>Text content and descriptions</li>
              <li>Website design and layout</li>
            </ul>

            <h3>Usage Restrictions</h3>
            <p>
              You may not reproduce, distribute, modify, create derivative works from, publicly 
              display, or commercially exploit any content from this Site without explicit written 
              permission from Jelena Lazić.
            </p>

            <h3>Personal Use Exception</h3>
            <p>
              You may view and print content from the Site for personal, non-commercial reference 
              purposes only, provided you maintain all copyright and proprietary notices.
            </p>
          </section>

          <section className="mb-12">
            <h2>Tattoo Services</h2>
            
            <h3>Consultations and Bookings</h3>
            <p>
              Contact through our website does not guarantee availability or booking confirmation. 
              All tattoo appointments must be confirmed directly with Jelena Lazić.
            </p>

            <h3>Custom Designs</h3>
            <p>
              Custom tattoo designs created for clients are for the client's personal use only. 
              The artist retains the right to photograph completed work and use images for 
              portfolio and promotional purposes, unless otherwise agreed in writing.
            </p>

            <h3>Pricing and Payments</h3>
            <p>
              Pricing for tattoo services is determined on a case-by-case basis during consultation. 
              Deposits may be required to secure appointments. All payment terms will be communicated 
              directly during the booking process.
            </p>
          </section>

          <section className="mb-12">
            <h2>Online Store (Future)</h2>
            <p>
              When the online store becomes available, additional terms will apply to purchases:
            </p>
            
            <h3>Digital Products</h3>
            <ul>
              <li>Exclusive designs are sold once and removed from the store</li>
              <li>Classic designs may be purchased by multiple customers</li>
              <li>Digital downloads are for personal use only</li>
              <li>No commercial reproduction or resale permitted</li>
            </ul>

            <h3>Physical Products</h3>
            <ul>
              <li>Shipping terms and costs will be clearly stated</li>
              <li>Returns and refunds subject to individual product policies</li>
              <li>Quality guarantees and defect resolution procedures will be provided</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>User-Generated Content</h2>
            <p>
              If you submit content to us (through contact forms, email, or social media):
            </p>
            <ul>
              <li>You grant us permission to use your submission to respond to your inquiry</li>
              <li>You warrant that your content does not violate any third-party rights</li>
              <li>You are responsible for the accuracy of information you provide</li>
              <li>We reserve the right to remove any inappropriate content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Third-Party Links</h2>
            <p>
              Our Site may contain links to third-party websites and services (social media, maps, etc.). 
              We are not responsible for:
            </p>
            <ul>
              <li>The content or practices of linked websites</li>
              <li>Privacy policies of third-party services</li>
              <li>Any damages or losses from your use of third-party sites</li>
            </ul>
            <p>
              We encourage you to review the terms and privacy policies of any third-party sites you visit.
            </p>
          </section>

          <section className="mb-12">
            <h2>Disclaimers and Limitation of Liability</h2>
            
            <h3>Website Availability</h3>
            <p>
              We strive to keep our Site available and up-to-date, but we do not guarantee:
            </p>
            <ul>
              <li>Continuous, uninterrupted access to the Site</li>
              <li>That the Site will be error-free or secure</li>
              <li>That defects will be corrected promptly</li>
              <li>Accuracy, completeness, or timeliness of content</li>
            </ul>

            <h3>Limitation of Liability</h3>
            <p>
              To the fullest extent permitted by law, Jelena Lazić shall not be liable for any 
              indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul>
              <li>Your use or inability to use the Site</li>
              <li>Any errors or omissions in content</li>
              <li>Unauthorized access to our servers or your data</li>
              <li>Interruption or cessation of the Site</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Jelena Lazić from any claims, damages, 
              losses, liabilities, and expenses (including legal fees) arising from:
            </p>
            <ul>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Your use or misuse of the Site</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective 
              immediately upon posting to the Site. Your continued use of the Site after changes 
              constitutes acceptance of the modified Terms.
            </p>
            <p>
              We recommend reviewing these Terms periodically to stay informed of any updates.
            </p>
          </section>

          <section className="mb-12">
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Serbia. 
              Any disputes arising from these Terms or your use of the Site shall be subject to 
              the exclusive jurisdiction of the courts of Belgrade, Serbia.
            </p>
          </section>

          <section className="mb-12">
            <h2>Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable, the remaining 
              provisions shall continue in full force and effect.
            </p>
          </section>

          <section className="mb-12">
            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <ul className="list-none pl-0">
              <li><strong>Email:</strong> jelenalazictattoo@gmail.com</li>
              <li><strong>Phone:</strong> +381 61 584 9416</li>
              <li><strong>Address:</strong> Hoću Guze 100, Belgrade, Serbia</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2>Acknowledgment</h2>
            <p>
              By using our Site, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms & Conditions, as well as our Privacy Policy.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}