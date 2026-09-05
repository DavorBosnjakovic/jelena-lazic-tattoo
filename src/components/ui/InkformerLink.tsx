// jela-website/src/components/ui/InkformerLink.tsx

import { useTranslations } from 'next-intl'
import SocialIcon from '@/components/ui/SocialIcon'

export const INKFORMER_URL = 'https://inkformer.com/artist/jelenalazictattoo'

// Inkformer's own red. The mark keeps it instead of taking the page colour,
// so it reads as the platform's badge and not as one more site icon.
export const INKFORMER_RED = '#CC0000'

// A quiet line pointing at her Inkformer profile. It sits under the buttons
// in the closing blocks, so the pages that have no row of social icons still
// carry the link.
export default function InkformerLink({ className = '' }: { className?: string }) {
  const t = useTranslations('inkformer')

  return (
    <a
      href={INKFORMER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center gap-2.5 text-sm font-body text-foreground/65 hover:text-foreground transition-colors duration-200 ${className}`}
    >
      <SocialIcon
        icon="/social/inkformer.svg"
        name="Inkformer"
        color={INKFORMER_RED}
        className="w-[13px] h-5"
      />
      {t('link')}
    </a>
  )
}
