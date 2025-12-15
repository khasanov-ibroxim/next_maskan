// components/Analytics.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        ym?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-B3NW7JFEDN';
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || '105857815';

// ✅ Google Analytics pageview
export const pageview = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', GA_ID, {
            page_path: url,
        });
    }
};

// ✅ Yandex Metrika pageview
export const ymPageview = (url: string) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(YM_ID, 'hit', url);
    }
};

// ✅ Google Analytics event
export const event = ({ action, category, label, value }: {
    action: string;
    category: string;
    label?: string;
    value?: number;
}) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// ✅ Yandex Metrika goal
export const ymGoal = (target: string, params?: any) => {
    if (typeof window !== 'undefined' && (window as any).ym) {
        (window as any).ym(YM_ID, 'reachGoal', target, params);
    }
};

export function Analytics() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

            // Track pageview on route change
            pageview(url);
            ymPageview(url);
        }
    }, [pathname, searchParams]);

    // Don't load analytics in development
    if (process.env.NODE_ENV !== 'production') {
        return null;
    }

    return (
        <>
            {/* Google Analytics */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />

            {/* Yandex Metrika */}
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

            ym(${YM_ID}, 'init', {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              ecommerce: 'dataLayer'
            });
          `,
                }}
            />
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${YM_ID}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
}