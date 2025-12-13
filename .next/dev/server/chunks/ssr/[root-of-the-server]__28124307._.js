module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/[lang]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[lang]/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/[lang]/loading.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[lang]/loading.tsx [app-rsc] (ecmascript)"));
}),
"[project]/lib/api.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// lib/api.ts - Optimized with caching and request deduplication
__turbopack_context__.s([
    "clearCache",
    ()=>clearCache,
    "formatDate",
    ()=>formatDate,
    "getLocations",
    ()=>getLocations,
    "getProperties",
    ()=>getProperties,
    "getPropertyById",
    ()=>getPropertyById,
    "getPropertyImages",
    ()=>getPropertyImages,
    "getStats",
    ()=>getStats
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
// ✅ In-memory cache for reducing duplicate requests
const cache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds
// ✅ Pending requests map for deduplication
const pendingRequests = new Map();
/**
 * Generic fetch with caching and deduplication
 */ async function cachedFetch(url, options = {}, cacheTTL = CACHE_TTL) {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    // ✅ Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTTL) {
        console.log('💾 Using cached data for:', url);
        return cached.data;
    }
    // ✅ Check if request is already pending (deduplication)
    if (pendingRequests.has(cacheKey)) {
        console.log('🔄 Reusing pending request for:', url);
        return pendingRequests.get(cacheKey);
    }
    // ✅ Make new request
    const requestPromise = (async ()=>{
        try {
            console.log('🌐 Fetching:', url);
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // ✅ Cache the result
            cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });
            return data;
        } catch (error) {
            console.error('❌ Fetch error:', error);
            throw error;
        } finally{
            // ✅ Remove from pending
            pendingRequests.delete(cacheKey);
        }
    })();
    // ✅ Add to pending
    pendingRequests.set(cacheKey, requestPromise);
    return requestPromise;
}
async function getProperties(params) {
    try {
        const queryParams = new URLSearchParams();
        queryParams.append('lang', params.lang);
        if (params.rooms) queryParams.append('rooms', params.rooms);
        if (params.location) queryParams.append('location', params.location);
        if (params.type) queryParams.append('type', params.type);
        const url = `${API_BASE_URL}/api/public/properties?${queryParams.toString()}`;
        const result = await cachedFetch(url, {
            next: {
                revalidate: 60
            }
        });
        if (!result.success || !result.data) {
            throw new Error(result.error || 'Failed to fetch properties');
        }
        console.log(`✅ Fetched ${result.count} properties`);
        return result.data;
    } catch (error) {
        console.error('❌ Error fetching properties:', error);
        return [];
    }
}
async function getPropertyById(id, lang) {
    try {
        const url = `${API_BASE_URL}/api/public/properties/${id}?lang=${lang}`;
        const result = await cachedFetch(url, {
            next: {
                revalidate: 60
            }
        });
        if (!result.success || !result.data) {
            return null;
        }
        console.log('✅ Fetched property:', result.data.id);
        return result.data;
    } catch (error) {
        console.error('❌ Error fetching property:', error);
        return null;
    }
}
async function getLocations() {
    try {
        const url = `${API_BASE_URL}/api/public/locations`;
        const result = await cachedFetch(url, {
            next: {
                revalidate: 300
            }
        }, 300 * 1000 // 5 minutes cache
        );
        if (!result.success || !result.data) {
            return [];
        }
        return result.data;
    } catch (error) {
        console.error('❌ Error fetching locations:', error);
        return [];
    }
}
async function getStats() {
    try {
        const url = `${API_BASE_URL}/api/public/stats`;
        const result = await cachedFetch(url, {
            next: {
                revalidate: 300
            }
        }, 300 * 1000 // 5 minutes cache
        );
        if (!result.success || !result.data) {
            return {
                totalProperties: 0,
                availableRooms: [
                    '1',
                    '2',
                    '3',
                    '4+'
                ]
            };
        }
        return result.data;
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        return {
            totalProperties: 0,
            availableRooms: [
                '1',
                '2',
                '3',
                '4+'
            ]
        };
    }
}
async function getPropertyImages(folderUrl) {
    try {
        // ✅ Use cached fetch with longer TTL for images
        const html = await cachedFetch(folderUrl, {
            next: {
                revalidate: 600
            }
        }, 600 * 1000 // 10 minutes cache
        );
        if (typeof html !== 'string') {
            throw new Error('Invalid response format');
        }
        // Extract image URLs from HTML
        const imgRegex = /src="(\/browse\/[^"]+\.(jpg|jpeg|png|webp))"/gi;
        const matches = [
            ...html.matchAll(imgRegex)
        ];
        const imageUrls = matches.map((match)=>`${API_BASE_URL}${match[1]}`).filter((url)=>!url.includes('thumbnail'));
        console.log(`📷 Found ${imageUrls.length} images`);
        return imageUrls;
    } catch (error) {
        console.error('❌ Error fetching images:', error);
        return [];
    }
}
function formatDate(dateString, lang) {
    try {
        const date = new Date(dateString);
        const locales = {
            'uz': 'uz-UZ',
            'ru': 'ru-RU',
            'en': 'en-US',
            'uz-cy': 'uz-UZ'
        };
        return date.toLocaleDateString(locales[lang], {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch  {
        return dateString;
    }
}
function clearCache() {
    cache.clear();
    pendingRequests.clear();
    console.log('🗑️ Cache cleared');
}
}),
"[project]/components/PropertyCard.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "PropertyCard",
    ()=>PropertyCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PropertyCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PropertyCard() from the server but PropertyCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/PropertyCard.tsx <module evaluation>", "PropertyCard");
}),
"[project]/components/PropertyCard.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "PropertyCard",
    ()=>PropertyCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const PropertyCard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call PropertyCard() from the server but PropertyCard is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/PropertyCard.tsx", "PropertyCard");
}),
"[project]/components/PropertyCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PropertyCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/PropertyCard.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PropertyCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/PropertyCard.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PropertyCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/components/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "HeroSection",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HeroSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HeroSection() from the server but HeroSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/HeroSection.tsx <module evaluation>", "HeroSection");
}),
"[project]/components/HeroSection.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "HeroSection",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const HeroSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call HeroSection() from the server but HeroSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/HeroSection.tsx", "HeroSection");
}),
"[project]/components/HeroSection.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/HeroSection.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/HeroSection.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/components/ContactSection.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ContactSection",
    ()=>ContactSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ContactSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ContactSection() from the server but ContactSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ContactSection.tsx <module evaluation>", "ContactSection");
}),
"[project]/components/ContactSection.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "ContactSection",
    ()=>ContactSection
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ContactSection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ContactSection() from the server but ContactSection is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/components/ContactSection.tsx", "ContactSection");
}),
"[project]/components/ContactSection.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/components/ContactSection.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/components/ContactSection.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/[lang]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PropertyCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PropertyCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroSection.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ContactSection.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/filter.js [app-rsc] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionary$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionary.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
async function generateMetadata({ params, searchParams }) {
    const { lang } = await params;
    const sp = await searchParams;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maskanlux.uz';
    const canonicalUrl = `${baseUrl}/${lang}`;
    // Build title based on filters
    let title = 'Maskan Lux - Ko\'chmas Mulk Toshkentda';
    let description = 'Toshkent shahridagi eng yaxshi ko\'chmas mulk takliflari. Kvartira sotish va ijaraga berish.';
    if (sp.rooms) {
        title = `${sp.rooms} xonali kvartiralar - Maskan Lux`;
        description = `${sp.rooms} xonali kvartiralar Toshkentda. Qulay narxlar, professional xizmat.`;
    }
    if (sp.location) {
        title = `Ko'chmas mulk ${sp.location} - Maskan Lux`;
        description = `${sp.location} tumanidagi kvartiralar. Sotish va ijara.`;
    }
    if (sp.type === 'Sotuv') {
        title = `Kvartira sotish - ${title}`;
        description = `Kvartira sotish Toshkentda. ${description}`;
    } else if (sp.type === 'Arenda') {
        title = `Kvartira ijara - ${title}`;
        description = `Kvartira ijaraga olish Toshkentda. ${description}`;
    }
    return {
        title,
        description,
        keywords: [
            'kvartira',
            sp.location || 'Toshkent',
            sp.type === 'Sotuv' ? 'sotish' : 'ijara',
            sp.rooms ? `${sp.rooms} xona` : '',
            'ko\'chmas mulk',
            'maskan'
        ].filter(Boolean).join(', '),
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            locale: lang,
            siteName: 'Maskan Lux'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        },
        alternates: {
            canonical: canonicalUrl,
            languages: {
                'uz': `${baseUrl}/uz`,
                'ru': `${baseUrl}/ru`,
                'en': `${baseUrl}/en`,
                'uz-Cyrl': `${baseUrl}/uz-cy`
            }
        }
    };
}
async function Home({ params, searchParams }) {
    const { lang } = await params;
    const sp = await searchParams;
    const dict = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionary$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDictionary"])(lang);
    // ✅ Parse search params for API
    const filters = {
        rooms: typeof sp.rooms === 'string' ? sp.rooms : undefined,
        location: typeof sp.location === 'string' ? sp.location : undefined,
        type: typeof sp.type === 'string' ? sp.type : undefined
    };
    // ✅ Fetch from real server
    const properties = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProperties"])({
        lang,
        ...filters
    });
    // Group by rooms
    const propertiesByRooms = [
        1,
        2,
        3,
        4,
        5
    ].map((roomCount)=>{
        const props = properties.filter((p)=>roomCount === 5 ? p.rooms >= 5 : p.rooms === roomCount);
        return {
            roomCount,
            props
        };
    }).filter((group)=>group.props.length > 0);
    // ✅ JSON-LD for ItemList
    const itemListJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: properties.slice(0, 10).map((property, index)=>({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'RealEstateListing',
                    name: property.title,
                    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/object/${property.id}`,
                    offers: {
                        '@type': 'Offer',
                        price: property.price,
                        priceCurrency: 'USD'
                    }
                }
            }))
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify(itemListJsonLd)
                }
            }, void 0, false, {
                fileName: "[project]/app/[lang]/page.tsx",
                lineNumber: 131,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HeroSection"], {
                initialFilters: filters,
                lang: lang,
                dict: dict
            }, void 0, false, {
                fileName: "[project]/app/[lang]/page.tsx",
                lineNumber: 136,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-50 py-16 space-y-16",
                children: [
                    properties.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-20 text-slate-500 container mx-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$filter$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                                size: 48,
                                className: "mx-auto mb-4 opacity-20"
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/page.tsx",
                                lineNumber: 142,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl",
                                children: dict.home.no_results
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/page.tsx",
                                lineNumber: 143,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: `/${lang}`,
                                className: "text-emerald-600 hover:underline mt-4 inline-block",
                                children: dict.home.clear_filter
                            }, void 0, false, {
                                fileName: "[project]/app/[lang]/page.tsx",
                                lineNumber: 144,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/[lang]/page.tsx",
                        lineNumber: 141,
                        columnNumber: 15
                    }, this),
                    propertiesByRooms.map((group)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "container mx-auto px-4",
                            itemScope: true,
                            itemType: "https://schema.org/OfferCatalog",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                                    itemProp: "name",
                                    content: `${group.roomCount} xonali kvartiralar`
                                }, void 0, false, {
                                    fileName: "[project]/app/[lang]/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-slate-900 flex items-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-2 h-8 bg-emerald-500 mr-3 rounded-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/[lang]/page.tsx",
                                                    lineNumber: 165,
                                                    columnNumber: 21
                                                }, this),
                                                group.roomCount === 5 ? dict.home.rooms_5plus_title : `${group.roomCount} ${dict.home.rooms_title}`
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/[lang]/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-slate-500 text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/app/[lang]/page.tsx",
                                            lineNumber: 171,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/[lang]/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
                                    children: group.props.map((property)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PropertyCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PropertyCard"], {
                                            property: property,
                                            lang: lang,
                                            dict: dict
                                        }, property.id, false, {
                                            fileName: "[project]/app/[lang]/page.tsx",
                                            lineNumber: 178,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/[lang]/page.tsx",
                                    lineNumber: 176,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, group.roomCount, true, {
                            fileName: "[project]/app/[lang]/page.tsx",
                            lineNumber: 155,
                            columnNumber: 15
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/app/[lang]/page.tsx",
                lineNumber: 138,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ContactSection$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ContactSection"], {
                dict: dict
            }, void 0, false, {
                fileName: "[project]/app/[lang]/page.tsx",
                lineNumber: 190,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/app/[lang]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/[lang]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__28124307._.js.map