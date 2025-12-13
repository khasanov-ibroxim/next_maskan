// app/sitemap.ts
import { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

// ✅ Force dynamic rendering for sitemap
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function fetchProperties(lang: string) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
        const response = await fetch(`${apiUrl}/api/public/properties?lang=${lang}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            console.error(`❌ Failed to fetch properties for ${lang}:`, response.statusText);
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error(`❌ getProperties error for ${lang}:`, error);
        return [];
    }
}

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
        {
            url: `${baseUrl}/${locale}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: Object.fromEntries(
                    i18n.locales.map(lang => [lang, `${baseUrl}/${lang}/about`])
                ),
            },
        },
        {
            url: `${baseUrl}/${locale}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
            alternates: {
                languages: Object.fromEntries(
                    i18n.locales.map(lang => [lang, `${baseUrl}/${lang}/contact`])
                ),
            },
        },
    ]);

    // ✅ Dynamic property pages for each language
    const propertyPages: MetadataRoute.Sitemap = [];

    // Fetch properties for one language only (uz) to avoid multiple API calls
    // Properties have the same IDs across all languages
    try {
        const properties = await fetchProperties('uz');

        properties.forEach((property: any) => {
            propertyPages.push({
                url: `${baseUrl}/uz/object/${property.id}`,
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
        console.error('Error generating property sitemap:', error);
    }

    return [...staticPages, ...propertyPages];
}