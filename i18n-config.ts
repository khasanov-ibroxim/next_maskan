// i18n-config.ts - FIXED: Default is now Russian
export const i18n = {
  defaultLocale: 'ru', // ✅ Russian as default
  locales: ['ru', 'uz', 'en', 'uz-cy'], // ✅ Russian first in list
} as const;

export type Locale = (typeof i18n)['locales'][number];