'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

function FlagEN() {
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-[13px] rounded-[2px] block" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0,0 24,16 M24,0 0,16" stroke="#fff" strokeWidth="3.2" />
      <path d="M0,0 24,16 M24,0 0,16" stroke="#C8102E" strokeWidth="1.9" />
      <path d="M12,0 V16 M0,8 H24" stroke="#fff" strokeWidth="5.3" />
      <path d="M12,0 V16 M0,8 H24" stroke="#C8102E" strokeWidth="3.2" />
    </svg>
  )
}

function FlagSR() {
  return (
    <svg viewBox="0 0 24 16" className="w-5 h-[13px] rounded-[2px] block" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.333" y="0" fill="#C6363C" />
      <rect width="24" height="5.333" y="5.333" fill="#0C4076" />
    </svg>
  )
}

// Two languages, so this is a switch rather than a row of buttons: English on
// the left, Serbian on the right.
export default function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher')
  const activeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const serbian = activeLocale === 'sr'

  return (
    <label className="switch" title={t(serbian ? 'sr' : 'en')}>
      <input
        type="checkbox"
        checked={serbian}
        onChange={() => router.replace(pathname, { locale: serbian ? 'en' : 'sr' })}
        aria-label={t(serbian ? 'en' : 'sr')}
      />
      <span className="slider">
        {/* The knob carries the language that is on, so it travels with it. */}
        <span className="slider-btn">
          <span className="texture" />
          <span className="switch-face">{serbian ? <FlagSR /> : <FlagEN />}</span>
          <span className="texture" />
        </span>
      </span>
    </label>
  )
}
