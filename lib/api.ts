// lib/api.ts - ✅ FIXED MULTILANG SUPPORT
// @ts-ignore
import { Property } from '@/types/property';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
const API_URL = `${API_BASE}/api/public`;

/**
 * ✅ FIXED: Helper to get text in current language
 */
function getLocalizedText(data: any, lang: string): string {
  if (!data) return '';

  // If data is already a string, return it
  if (typeof data === 'string') return data;

  // If data is object with translations
  if (typeof data === 'object') {
    // ✅ CRITICAL FIX: Normalize language code
    // uz-cy → uz_cy for object keys
    const normalizedLang = lang.replace('-', '_');

    console.log('🌐 getLocalizedText:', {
      lang,
      normalizedLang,
      keys: Object.keys(data),
      data
    });

    // Try normalized language match first
    if (data[normalizedLang]) {
      console.log('  ✅ Found:', normalizedLang, '=', data[normalizedLang]);
      return data[normalizedLang];
    }

    // Try exact language match
    if (data[lang]) {
      console.log('  ✅ Found:', lang, '=', data[lang]);
      return data[lang];
    }

    // Fallback chain
    const fallback = data.uz || data.ru || data.en || data.uz_cy || Object.values(data)[0] || '';
    console.log('  ⚠️ Fallback:', fallback);
    return fallback;
  }

  return String(data);
}

/**
 * ✅ Get Telegram config
 */
export async function GetTelegramConfig() {
  try {
    const res = await fetch(`${API_URL}/config`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('❌ Config response not ok:', res.status);
      return null;
    }

    const result = await res.json();

    if (!result.success) {
      console.error('❌ Config API error:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('❌ GetTelegramConfig error:', error);
    return null;
  }
}

/**
 * ✅ Transform API property to frontend property (with lang)
 */
function transformProperty(apiProperty: any, lang: string): Property {
  console.log('\n📦 transformProperty:', {
    id: apiProperty.id,
    lang,
    title: apiProperty.title,
    district: apiProperty.district,
  });

  return {
    id: apiProperty.id,

    // ✅ Localized text fields
    title: getLocalizedText(apiProperty.title, lang),
    description: getLocalizedText(apiProperty.description, lang),
    district: getLocalizedText(apiProperty.district, lang),
    type: getLocalizedText(apiProperty.type, lang),
    buildingType: getLocalizedText(apiProperty.buildingType, lang),
    renovation: getLocalizedText(apiProperty.renovation, lang),
    layout: getLocalizedText(apiProperty.layout, lang),
    balcony: getLocalizedText(apiProperty.balcony, lang),
    parking: getLocalizedText(apiProperty.parking, lang),

    // Numeric fields
    price: typeof apiProperty.price === 'number'
        ? apiProperty.price
        : parseFloat(apiProperty.price) || 0,
    rooms: apiProperty.rooms || 0,
    area: apiProperty.area || 0,
    floor: apiProperty.floor || 0,
    totalFloors: apiProperty.totalFloors || 0,

    // Images
    images: Array.isArray(apiProperty.images) ? apiProperty.images : [],
    mainImage: apiProperty.mainImage || (apiProperty.images?.[0]) || null,

    // Contact info
    phone: apiProperty.phone || '',
    rieltor: apiProperty.rieltor || '',

    // Date
    createdAt: apiProperty.createdAt || new Date().toISOString(),
  };
}

/**
 * ✅ Fetch properties with proper error handling
 */
export async function getProperties(filters: {
  lang: string;
  rooms?: string;
  location?: string;
  type?: 'Sotuv' | 'Arenda';
}): Promise<Property[]> {
  try {
    console.log('\n📥 getProperties:', filters);

    const params = new URLSearchParams();

    // Don't send lang to API anymore, we handle it on frontend
    if (filters.rooms) params.append('rooms', filters.rooms);
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);

    const url = `${API_URL}/properties${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('  🌐 URL:', url);

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('  ✅ Received:', result.count, 'properties');

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    // ✅ Log first property before transform
    if (result.data && result.data.length > 0) {
      console.log('  📊 Sample API response:', {
        id: result.data[0].id,
        title: result.data[0].title,
        district: result.data[0].district,
        type: result.data[0].type,
      });
    }

    // ✅ Transform all properties to current language
    const properties = (result.data || []).map((prop: any) =>
        transformProperty(prop, filters.lang)
    );

    // ✅ Log first property after transform
    if (properties.length > 0) {
      console.log('  ✅ Sample transformed property:', {
        id: properties[0].id,
        title: properties[0].title,
        district: properties[0].district,
        type: properties[0].type,
        price: properties[0].price,
      });
    }

    return properties;

  } catch (error) {
    console.error('❌ getProperties error:', error);
    return [];
  }
}

/**
 * ✅ Fetch single property by ID
 */
export async function getPropertyById(id: string, lang: string): Promise<Property | null> {
  try {
    console.log(`\n📥 getPropertyById: ${id} (lang: ${lang})`);

    const url = `${API_URL}/properties/${id}`;
    console.log('  🌐 URL:', url);

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('  ❌ Response not ok:', response.status);
      return null;
    }

    const result = await response.json();

    if (!result.success) {
      console.error('  ❌ API error:', result.error);
      return null;
    }

    // ✅ Log API response
    console.log('  📊 API response:', {
      id: result.data.id,
      title: result.data.title,
      district: result.data.district,
    });

    // ✅ Transform to current language
    const property = transformProperty(result.data, lang);

    console.log('  ✅ Transformed property:', {
      id: property.id,
      title: property.title,
      district: property.district,
      price: property.price,
    });

    return property;

  } catch (error) {
    console.error('❌ getPropertyById error:', error);
    return null;
  }
}

/**
 * ✅ Get locations with translations
 */
export async function getLocations(lang: string): Promise<{ name: string; count: number }[]> {
  try {
    console.log('\n📥 getLocations:', lang);

    const response = await fetch(`${API_URL}/locations`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) return [];

    // ✅ Log first location before transform
    if (result.data && result.data.length > 0) {
      console.log('  📊 Sample location API response:', result.data[0]);
    }

    // ✅ Transform location names to current language
    const locations = (result.data || []).map((loc: any) => {
      const name = getLocalizedText(loc.name, lang);
      console.log('  🌐 Location:', {
        original: loc.name,
        transformed: name,
        count: loc.count
      });
      return {
        name,
        count: loc.count,
      };
    });

    return locations;

  } catch (error) {
    console.error('❌ getLocations error:', error);
    return [];
  }
}

/**
 * ✅ Format date
 */
export function formatDate(dateString: string, locale: string): string {
  try {
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString(locale === 'uz' ? 'uz-UZ' : 'ru-RU', options);
  } catch {
    return dateString;
  }
}

/**
 * ✅ Format price with proper spacing
 */
export function formatPrice(price: number): string {
  if (!price || isNaN(price)) return '0';

  // Convert to string and add spaces every 3 digits
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * ✅ Check if backend is reachable
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/api/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    return response.ok;
  } catch {
    return false;
  }
}