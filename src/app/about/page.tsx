// jela-website/src/app/about/page.tsx

import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'About Me - Jelena Lazić | Academic Painter & Tattoo Artist',
  description: 'Learn about Jelena Lazić, academic painter and professional tattoo artist in Belgrade. Combining artistic excellence with tattooing since 2013.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4">
            About Me
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="mb-16 flex justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/artist-images/1.jpg"
                alt="Jelena Lazić - Tattoo Artist"
                width={300}
                height={200}
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="space-y-8 mb-16">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                An academic painter, I graduated from the Faculty of Applied Arts, 
                Department of Mural Painting. After successful mural projects, I 
                participated in numerous group exhibitions, exploring the boundaries 
                of visual expression through various mediums.
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                Since 2013, I have been working as a tattoo artist, combining my 
                artistic skills with this unique medium. My tattoos often reflect 
                influences from my painting style—bringing the same attention to 
                composition, color theory, and narrative that I developed in my 
                fine art practice.
              </p>

              <p className="text-lg md:text-xl leading-relaxed text-foreground/90 font-body">
                I currently live and work in Belgrade, where I continue to develop 
                my artistic expression. Each tattoo is approached as a unique 
                artistic collaboration, combining technical mastery with creative 
                vision to create lasting works of art on skin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">Education</h3>
              <p className="text-foreground/90 font-body leading-relaxed">
                Faculty of Applied Arts, Department of Mural Painting. 
                Academic training in traditional and contemporary art techniques, 
                with focus on large-scale visual composition.
              </p>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">Experience</h3>
              <p className="text-foreground/90 font-body leading-relaxed">
                Professional tattoo artist since 2013. Extensive portfolio of 
                custom designs, from realistic portraits to abstract compositions. 
                Participated in numerous art exhibitions and collaborative projects.
              </p>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">Specialties</h3>
              <ul className="space-y-2 text-foreground/90 font-body">
                <li>• Custom Realistic Tattoos</li>
                <li>• Black & Grey Work</li>
                <li>• Color Compositions</li>
                <li>• Fine Line Details</li>
                <li>• Artistic Concept Development</li>
              </ul>
            </div>

            <div className="p-8 bg-foreground/5 rounded-xl border border-border">
              <h3 className="text-2xl font-heading font-bold mb-4 text-accent">Location & Hours</h3>
              <div className="space-y-2 text-foreground/90 font-body">
                <p>
                  <span className="font-semibold">Studio:</span><br />
                  Hoću Guze 100<br />
                  Belgrade, Serbia
                </p>
                <p>
                  <span className="font-semibold">Hours:</span><br />
                  10:00 - 17:00
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-12 px-8 bg-accent/5 rounded-xl border border-accent/20">
            <h3 className="text-3xl font-heading font-bold mb-4">Lets Create Something Beautiful</h3>
            <p className="text-lg text-foreground/80 mb-6 font-body">Ready to start your custom tattoo journey?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="px-8 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 hover:scale-102 transition-all duration-200">
                Get In Touch
              </Link>
              <Link href="/portfolio" className="px-8 py-3 bg-foreground text-background font-nav font-semibold rounded-md hover:bg-foreground/90 hover:scale-102 transition-all duration-200">
                View Portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}