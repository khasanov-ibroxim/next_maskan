import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import Script from "next/script";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    display: 'swap',
    variable: '--font-inter',
});

// ✅ Root metadata for SEO
export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz'),
    title: {
        default: 'Maskan Lux - Ko\'chmas Mulk Toshkentda',
        template: '%s | Maskan Lux',
    },
    description: 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari. Kvartira sotish va ijaraga berish. Qulay narxlar, professional xizmat.',
    keywords: [
        'kvartira',
        'uy',
        'ko\'chmas mulk',
        'Toshkent',
        'maskan',
        'sotish',
        'ijara',
        'real estate',
        'Yunusobod',
        'Arenda',
        'sotiladi',
    ],
    authors: [{ name: 'Maskan Lux', url: 'https://maskanlux.uz' }],
    creator: 'Maskan Lux',
    publisher: 'Maskan Lux',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'uz_UZ',
        alternateLocale: ['ru_RU', 'en_US'],
        url: 'https://maskanlux.uz',
        title: 'Maskan Lux - Ko\'chmas Mulk Toshkentda',
        description: 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari',
        siteName: 'Maskan Lux',
        images: [
            {
                url: '/bg.png',
                width: 1200,
                height: 630,
                alt: 'Maskan Lux',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Maskan Lux - Ko\'chmas Mulk Toshkentda',
        description: 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari',
        images: ['/bg.png'],
        creator: '@maskanlux',
    },
    verification: {
        google: 'w_k9mrs2NS3AeIO0p1czTkyoAmn2DPz_isx1RQajqCY',
        yandex: '1d7d7bec5299f783',
    },
    alternates: {
        canonical: '/',
        languages: {
            'uz': '/uz',
            'ru': '/ru',
            'en': '/en',
            'uz-Cyrl': '/uz-cy',
        },
    },
    category: 'Real Estate',
};

// ✅ Viewport configuration
export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#10b981',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz" className={inter.variable} suppressHydrationWarning>
        <head>
            {/* ✅ Preconnect to external domains */}
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000'}/>
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000'}/>

            {/* ✅ Favicon */}
            <link rel="icon" href="/logo.png" sizes="any"/>
            <link rel="icon" type="image/png" href="/logo.png" sizes="32x32"/>
            <link rel="icon" type="image/png" href="/logo.png" sizes="16x16"/>
            <link rel="apple-touch-icon" href="/logo.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="google-adsense-account" content="ca-pub-9101620582451955"/>
            {/* ✅ Google Analytics - WORKING */}
            <Script
                strategy="afterInteractive"
                src="https://www.googletagmanager.com/gtag/js?id=G-B3NW7JFEDN"
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                      window.dataLayer = window.dataLayer || [];
                      function gtag(){dataLayer.push(arguments);}
                      gtag('js', new Date());
                      gtag('config', 'G-B3NW7JFEDN', {
                        page_path: window.location.pathname,
                      });
                    `,
                }}
            />

            {/* ✅ Yandex Metrika - COMPLETE VERSION */}
            <Script
                id="yandex-metrika"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                      (function(m,e,t,r,i,k,a){
                        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                        m[i].l=1*new Date();
                        for (var j = 0; j < document.scripts.length; j++) {
                          if (document.scripts[j].src === r) { return; }
                        }
                        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

                      ym(105857815, 'init', {
                        clickmap: true,
                        trackLinks: true,
                        accurateTrackBounce: true,
                        webvisor: true,
                        ecommerce: 'dataLayer'
                      });
                    `,
                }}
            />
        </head>
        <body className={`${inter.className} bg-slate-50 min-h-screen antialiased`} suppressHydrationWarning>

        {/* ✅ Yandex Metrika noscript - REQUIRED */}
        <noscript>
            <div>
                <img
                    src="https://mc.yandex.ru/watch/105857815"
                    style={{ position: 'absolute', left: '-9999px' }}
                    alt=""
                />
            </div>
        </noscript>

        {/* ✅ Skip to main content for accessibility */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-lg"
        >
            Skip to main content
        </a>

        <div id="main-content">
            {children}
        </div>

        {/* ✅ Organization Schema */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: 'Maskan Lux',
                    url: 'https://maskanlux.uz',
                    logo: 'https://maskanlux.uz/logo.png',
                    contactPoint: {
                        '@type': 'ContactPoint',
                        telephone: '+998 97 085 06 04',
                        contactType: 'Customer Service',
                        availableLanguage: ['uz', 'ru', 'en'],
                    },
                    sameAs: [
                        'https://t.me/Khasanov_ibroxim',
                        'https://www.instagram.com/_maskan_lux',
                    ],
                    address: {
                        '@type': 'PostalAddress',
                        addressCountry: 'UZ',
                        addressRegion: 'Toshkent',
                        addressLocality: 'Toshkent',
                    },
                }),
            }}
        />

        {/* ✅ WebSite Schema */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Maskan Lux',
                    url: 'https://maskanlux.uz',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: {
                            '@type': 'EntryPoint',
                            urlTemplate: 'https://maskanlux.uz/uz?location={search_term_string}',
                        },
                        'query-input': 'required name=search_term_string',
                    },
                }),
            }}
        />
        </body>
        </html>
    );
}