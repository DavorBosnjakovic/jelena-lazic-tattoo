import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // English at `/`, Serbian (Latin) at `/sr`
  locales: ['en', 'sr'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})
