// lib/analytics.ts

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        ym?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-B3NW7JFEDN';
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || '105857815';

// ✅ Google Analytics Events
export const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
) => {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

// ✅ Yandex Metrika Goals
export const trackGoal = (target: string, params?: any) => {
    if (typeof window !== 'undefined' && window.ym) {
        window.ym(YM_ID, 'reachGoal', target, params);
    }
};

// ✅ Track property view
export const trackPropertyView = (propertyId: string, propertyTitle: string) => {
    // Google Analytics
    trackEvent('view_item', 'Property', propertyTitle);

    // Yandex Metrika
    trackGoal('property_view', {
        property_id: propertyId,
        property_title: propertyTitle,
    });
};

// ✅ Track phone click
export const trackPhoneClick = (phone: string, source: string) => {
    // Google Analytics
    trackEvent('phone_click', 'Contact', source);

    // Yandex Metrika
    trackGoal('phone_click', {
        phone: phone,
        source: source,
    });
};

// ✅ Track form submission
export const trackFormSubmit = (formName: string) => {
    // Google Analytics
    trackEvent('form_submit', 'Contact', formName);

    // Yandex Metrika
    trackGoal('form_submit', {
        form: formName,
    });
};

// ✅ Track search
export const trackSearch = (searchTerm: string) => {
    // Google Analytics
    trackEvent('search', 'Search', searchTerm);

    // Yandex Metrika
    trackGoal('search', {
        query: searchTerm,
    });
};

// ✅ Track filter change
export const trackFilterChange = (filterType: string, filterValue: string) => {
    // Google Analytics
    trackEvent('filter_change', 'Filter', `${filterType}:${filterValue}`);

    // Yandex Metrika
    trackGoal('filter_change', {
        type: filterType,
        value: filterValue,
    });
};