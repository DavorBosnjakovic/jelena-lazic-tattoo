'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

function FlagEN() {
  return (
    <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm block" aria-hidden="true">
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
    <svg viewBox="0 0 24 16" className="w-6 h-4 rounded-sm block" aria-hidden="true">
      <rect width="24" height="16" fill="#fff" />
      <rect width="24" height="5.333" y="0" fill="#C6363C" />
      <rect width="24" height="5.333" y="5.333" fill="#0C4076" />
    </svg>
  )
}

const FLAGS: Record<string, () => JSX.Element> = { en: FlagEN, sr: FlagSR }

export default function LocaleSwitcher() {
  const t = useTranslations('localeSwitcher')
  const activeLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={t('label')}>
      {routing.locales.map((locale) => {
        const Flag = FLAGS[locale]
        const isActive = locale === activeLocale
        return (
          <button
            key={locale}
            type="button"
            onClick={() => router.replace(pathname, { locale })}
            aria-label={t(locale)}
            aria-current={isActive ? 'true' : undefined}
            title={t(locale)}
            className={`rounded-sm ring-1 transition-all duration-200 ${
              isActive
                ? 'ring-accent opacity-100 scale-105'
                : 'ring-border opacity-50 hover:opacity-100'
            }`}
          >
            <Flag />
          </button>
        )
      })}
    </div>
  )
}
