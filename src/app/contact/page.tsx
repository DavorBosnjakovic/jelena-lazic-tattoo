// jela-website/src/app/contact/page.tsx

import ContactForm from '@/components/contact/ContactForm'
// TEMPORARILY COMMENTED OUT - Google Map import - UNCOMMENT WHEN ADDRESS IS CONFIRMED
// import GoogleMap from '@/components/contact/GoogleMap'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Contact - Jelena Lazić | Book Your Custom Tattoo',
  description: 'Get in touch with Jelena Lazić to discuss your custom tattoo design. Located in Belgrade, Serbia. Consultations available.',
}

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/jelena_lazic_tattoo',
    icon: 'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/social-icons/instagram.png'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/jelenalazictattoo',
    icon: 'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/social-icons/facebook.png'
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/@jelenalazictattoo',
    icon: 'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/social-icons/tiktok.png'
  },
  {
    name: 'WhatsApp',
    url: 'https://wa.me/381615849416',
    icon: 'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/social-icons/whatsapp.png'
  },
  {
    name: 'Telegram',
    url: 'https://t.me/+381615849416',
    icon: 'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/social-icons/telegram.png'
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
            Ready to bring your tattoo vision to life? Send me a message and lets create something beautiful together.
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-16">
          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Send a Message</h2>
            <ContactForm />
            
            {/* Social Icons Below Form */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-center text-foreground/70 mb-4">
                Or connect with me on social media
              </p>
              <div className="flex gap-4 justify-center">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-10 h-10 transition-transform duration-300 hover:scale-110"
                    aria-label={social.name}
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      fill
                      className="object-contain"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-heading font-bold mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              {/* TEMPORARILY COMMENTED OUT - Studio Location Card - UNCOMMENT WHEN ADDRESS IS CONFIRMED
              <a 
                href="#map"
                className="block p-6 bg-foreground/5 rounded-lg border border-border hover:border-accent transition-colors duration-200 cursor-pointer"
              >
                <h3 className="text-xl font-heading font-semibold mb-2 text-accent">Studio Location</h3>
                <p className="text-foreground/90 font-body">
                  <br />Belgrade, Serbia
                </p>
                <p className="text-sm text-accent/70 mt-2">Click to view map ↓</p>
              </a>
              END OF COMMENTED SECTION */}

              <div className="p-6 bg-foreground/5 rounded-lg border border-border">
                <h3 className="text-xl font-heading font-semibold mb-2 text-accent">Phone / WhatsApp / Telegram</h3>
                <a href="tel:+381615849416" className="text-foreground/90 font-body hover:text-accent transition-colors duration-200">
                  +381 61 584 9416
                </a>
                <p className="text-sm text-foreground/60 mt-2">Messages only (no voice calls)</p>
              </div>

              <div className="p-6 bg-foreground/5 rounded-lg border border-border">
                <h3 className="text-xl font-heading font-semibold mb-2 text-accent">Email</h3>
                <a href="mailto:jelenalazictattoo@gmail.com" className="text-foreground/90 font-body hover:text-accent transition-colors duration-200 break-all">
                  jelenalazictattoo@gmail.com
                </a>
              </div>

              <div className="p-6 bg-foreground/5 rounded-lg border border-border">
                <h3 className="text-xl font-heading font-semibold mb-2 text-accent">Working Hours</h3>
                <p className="text-foreground/90 font-body">10:00 - 17:00</p>
                <p className="text-sm text-foreground/60 mt-2">By appointment only</p>
              </div>
            </div>
          </div>
        </div>

        {/* TEMPORARILY COMMENTED OUT - Map Section - UNCOMMENT WHEN ADDRESS IS CONFIRMED
        <div id="map" className="max-w-6xl mx-auto scroll-mt-24">
          <h2 className="text-3xl font-heading font-bold mb-6 text-center">Find Me</h2>
          <GoogleMap />
        </div>
        END OF COMMENTED SECTION */}
      </div>
    </div>
  )
}