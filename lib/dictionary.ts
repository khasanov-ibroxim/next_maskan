import 'server-only';
import type { Locale } from '@/i18n-config';

const dictionaries = {
  uz: () => import('@/dictionaries/uz.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  'uz-cy': () => import('@/dictionaries/uz-cy.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();