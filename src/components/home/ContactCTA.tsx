// jela-website/src/components/home/ContactCTA.tsx

import Link from 'next/link'

export default function ContactCTA() {
  return (
    <section className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Ready for Your Custom Design?
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl mb-8 leading-relaxed opacity-90">
            Every tattoo tells a story. Let's create yours together. 
            Whether you have a clear vision or need creative guidance, 
            I'm here to bring your ideas to life with artistic excellence 
            and technical precision.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200 shadow-lg"
            >
              Get In Touch
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 bg-background text-foreground font-nav font-semibold rounded-md hover:bg-background/90 hover:scale-102 transition-all duration-200"
            >
              View Portfolio
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-background/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-semibold mb-1">Location</p>
                <p className="opacity-80">Belgrade, Serbia</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Contact</p>
                <p className="opacity-80">+381 61 584 9416</p>
              </div>
              <div>
                <p className="font-semibold mb-1">Hours</p>
                <p className="opacity-80">10:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}