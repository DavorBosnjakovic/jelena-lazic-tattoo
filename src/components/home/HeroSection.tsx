// jela-website/src/components/home/HeroSection.tsx

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const heroImages = [
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero1.png',
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero2.png',
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero3.png',
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero4.png',
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero5.png',
  'https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/hero-images/hero6.png',
]

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

export default function HeroSection() {
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-[70vh] md:h-[95vh] overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Desktop: 6 slika */}
        <div className="hidden md:grid md:grid-cols-6 gap-0 h-full w-full max-w-[1140px]">
          {heroImages.map((src, index) => (
            <div
              key={index}
              className="relative w-full h-full animate-fadeIn"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1s',
                animationFillMode: 'both',
              }}
            >
              <Image
                src={src}
                alt={`Tattoo work ${index + 1}`}
                fill
                className="object-cover"
                priority={index < 3}
                sizes="190px"
              />
            </div>
          ))}
        </div>

        {/* Mobile: 4 slike */}
        <div className="grid md:hidden grid-cols-4 gap-0 h-full w-full">
          {heroImages.slice(0, 4).map((src, index) => (
            <div
              key={index}
              className="relative w-full h-full animate-fadeIn"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationDuration: '1s',
                animationFillMode: 'both',
              }}
            >
              <Image
                src={src}
                alt={`Tattoo work ${index + 1}`}
                fill
                className="object-cover"
                priority={index < 2}
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Light mode gradient */}
      <div 
        className="absolute inset-0 dark:hidden animate-fadeIn" 
        style={{
          animationDelay: '0.3s',
          animationDuration: '1s',
          animationFillMode: 'both',
          background: 'linear-gradient(90deg, rgba(250, 250, 250, 0) 0%, rgba(250, 250, 250, 0.05) 15%, rgba(250, 250, 250, 0.3) 40%, rgba(250, 250, 250, 0.7) 65%, rgba(250, 250, 250, 0.95) 85%, rgba(250, 250, 250, 0.99) 100%)'
        }}
      />

      {/* Dark mode gradient */}
      <div 
        className="absolute inset-0 hidden dark:block animate-fadeIn" 
        style={{
          animationDelay: '0.3s',
          animationDuration: '1s',
          animationFillMode: 'both',
          background: 'linear-gradient(90deg, rgba(10, 10, 10, 0) 0%, rgba(10, 10, 10, 0.05) 15%, rgba(10, 10, 10, 0.3) 40%, rgba(10, 10, 10, 0.7) 65%, rgba(10, 10, 10, 0.95) 85%, rgba(10, 10, 10, 0.99) 100%)'
        }}
      />

      {/* Logo - Desktop: CENTER + 550px right, Mobile/Tablet: centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-[280px] md:w-[400px] lg:w-[500px] xl:w-[550px] h-auto animate-fadeIn md:ml-[550px]"
          style={{
            animationDelay: '0.75s',
            animationDuration: '0.5s',
            animationFillMode: 'both',
            filter: 'drop-shadow(2px 2px 12px rgba(0,0,0,0.7))',
          }}
        >
          <Image
            src="https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/logos/logo-light-mode.png"
            alt="Jelena Lazić Tattoo"
            width={550}
            height={220}
            className="w-full h-auto dark:hidden"
            priority
          />
          <Image
            src="https://exwuyunznlrgscchbnef.supabase.co/storage/v1/object/public/logos/logo-dark-mode.png"
            alt="Jelena Lazić Tattoo"
            width={550}
            height={220}
            className="w-full h-auto hidden dark:block"
            priority
          />
        </div>
      </div>

      {/* Social Icons - Mobile: centered, Desktop: bottom left */}
      <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
        <div className="w-full max-w-[1140px] relative">
          <div 
            className="absolute bottom-20 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0 md:bottom-24 flex gap-4 animate-fadeIn pointer-events-auto"
            style={{
              animationDelay: '1s',
              animationDuration: '0.5s',
              animationFillMode: 'both',
            }}
          >
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 hover:scale-110"
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

      {/* Bottom gradient peek */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}