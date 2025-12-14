// lib/dictionary.ts
import { Locale } from '@/i18n-config';

// ✅ Type-safe dictionary loader
const dictionaries = {
  uz: () => import('@/dictionaries/uz.json').then((module) => module.default),
  ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  'uz-cy': () => import('@/dictionaries/uz-cy.json').then((module) => module.default),
} as const;

export const getDictionary = async (locale: Locale) => {
  try {
    // ✅ Validate locale exists
    if (!dictionaries[locale]) {
      console.warn(`Dictionary for locale "${locale}" not found, falling back to "uz"`);
      return dictionaries.uz();
    }

    return await dictionaries[locale]();
  } catch (error) {
    console.error(`Error loading dictionary for locale "${locale}":`, error);

    // ✅ Fallback to default locale
    try {
      return await dictionaries.uz();
    } catch (fallbackError) {
      console.error('Failed to load fallback dictionary:', fallbackError);

      // ✅ Return minimal dictionary to prevent crashes
      return {
        nav: {
          home: 'Bosh sahifa',
          about: 'Biz haqimizda',
          contact: 'Aloqa',
        },
        home: {
          title: 'Ko\'chmas mulk',
          no_results: 'Natijalar topilmadi',
          clear_filter: 'Filterni tozalash',
        },
        details: {
          back: 'Orqaga',
          features: 'Xususiyatlar',
          rooms: 'Xonalar',
          area: 'Maydon',
          floor: 'Qavat',
          renovation: 'Ta\'mir',
          buildingType: 'Bino turi',
          location: 'Joylashuv',
          balcony: 'Balkon',
          torets: 'Parking',
          description: 'Ta\'rif',
          verified: 'Tekshirilgan',
        },
        contact: {
          title: 'Aloqa',
          form: {
            name: 'Ism',
            phone: 'Telefon',
            message: 'Xabar',
            message_placeholder: 'Xabaringizni yozing...',
            submit: 'Yuborish',
          },
        },
        about_page: {
          title: 'Biz haqimizda',
          subtitle: 'Professional xizmat',
          story_title: 'Bizning hikoyamiz',
          story_desc: 'Maskan Lux - ko\'chmas mulk sohasida ishonchli hamkor',
          stats: {
            years: 'Yillar',
            clients: 'Mijozlar',
            objects: 'Ob\'ektlar',
            agents: 'Agentlar',
          },
          values: {
            title: 'Qadriyatlarimiz',
            v1_title: 'Ishonch',
            v1_desc: 'Mijozlarimizga ishonch',
            v2_title: 'Tezkorlik',
            v2_desc: 'Tez va sifatli xizmat',
            v3_title: 'Professionallik',
            v3_desc: 'Yuqori malakali xodimlar',
            protect: "Yuridik himoya",
            sertfc: "Sifat kafolati"
          },
        },
        contact_page: {
          title: 'Aloqa',
          subtitle: 'Biz bilan bog\'laning',
          info_title: 'Aloqa ma\'lumotlari',
          address_label: 'Manzil',
          address_value: 'Toshkent, O\'zbekiston',
          phone_label: 'Telefon',
          email_label: 'Email',
          working_hours_label: 'Ish vaqti',
          working_hours_value: 'Dush-Juma: 9:00-18:00',
        },
      };
    }
  }
};

// ✅ Export type for dictionary
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;