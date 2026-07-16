// jela-website/src/components/referral/ShareLink.tsx

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function ShareLink({ url }: { url: string }) {
  const t = useTranslations('referralStatus')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (e.g. very old browser) - the link is visible below anyway
    }
  }

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ url })
      } catch {
        // user cancelled the share sheet
      }
    } else {
      copy()
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={share}
          className="px-6 py-3 bg-accent text-white font-nav font-semibold rounded-md hover:bg-accent/90 transition-all duration-200"
        >
          {t('shareButton')}
        </button>
        <button
          onClick={copy}
          className="px-6 py-3 border-2 border-border font-nav font-semibold rounded-md hover:border-accent transition-all duration-200"
        >
          {copied ? t('copied') : t('copyLink')}
        </button>
      </div>
      <p className="text-xs text-foreground/50 mt-3 break-all">{url}</p>
    </div>
  )
}
