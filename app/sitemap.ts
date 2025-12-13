// ===========================
// app/sitemap.ts
// ===========================
import { MetadataRoute } from 'next';
import { getProperties } from '@/lib/api';
import { i18n } from '@/i18n-config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';

    // ✅ Static pages for each language
    const staticPages: MetadataRoute.Sitemap = i18n.locales.flatMap(locale => [
        {
            url: `${baseUrl}/${locale}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
            alternates: {
                languages: Object.fromEntries(
                    i18n.locales.map(lang => [lang, `${baseUrl}/${lang}`])
                ),
            },
        },
    ]);

    // ✅ Dynamic property pages for each language
    const propertyPages: MetadataRoute.Sitemap = [];

    for (const locale of i18n.locales) {
        try {
            const properties = await getProperties({ lang: locale });

            properties.forEach(property => {
                propertyPages.push({
                    url: `${baseUrl}/${locale}/object/${property.id}`,
                    lastModified: new Date(property.createdAt),
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                    alternates: {
                        languages: Object.fromEntries(
                            i18n.locales.map(lang => [
                                lang,
                                `${baseUrl}/${lang}/object/${property.id}`
                            ])
                        ),
                    },
                });
            });
        } catch (error) {
            console.error(`Error generating sitemap for ${locale}:`, error);
        }
    }

    return [...staticPages, ...propertyPages];
}

