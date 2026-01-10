// lib/api.ts - ✅ MULTILANG SUPPORT
// @ts-ignore
import { Property } from '@/types/property';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
const API_URL = `${API_BASE}/api/public`;

/**
 * ✅ Helper to get text in current language
 */
function getLocalizedText(data: any, lang: string): string {
  if (!data) return '';

  // If data is already a string, return it
  if (typeof data === 'string') return data;

  // If data is object with translations
  if (typeof data === 'object') {
    // Try exact language match
    if (data[lang]) return data[lang];

    // Fallback chain
    return data.uz || data.ru || data.en || data.uz_cy || Object.values(data)[0] || '';
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
    console.log('📥 Fetching properties:', filters);

    const params = new URLSearchParams();

    // Don't send lang to API anymore, we handle it on frontend
    if (filters.rooms) params.append('rooms', filters.rooms);
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);

    const url = `${API_URL}/properties${params.toString() ? `?${params.toString()}` : ''}`;
    console.log('  URL:', url);

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
    console.log('✅ Received:', result.count, 'properties');

    if (!result.success) {
      throw new Error(result.error || 'Unknown error');
    }

    // ✅ Transform all properties to current language
    const properties = (result.data || []).map((prop: any) =>
        transformProperty(prop, filters.lang)
    );

    console.log('  Sample property:', {
      id: properties[0]?.id,
      title: properties[0]?.title,
      district: properties[0]?.district,
      price: properties[0]?.price,
      images: properties[0]?.images?.length,
    });

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
    console.log(`📥 Fetching property: ${id} (lang: ${lang})`);

    const url = `${API_URL}/properties/${id}`;
    console.log('  URL:', url);

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

    // ✅ Transform to current language
    const property = transformProperty(result.data, lang);

    console.log('✅ Property loaded:', {
      id: property.id,
      title: property.title,
      district: property.district,
      price: property.price,
      images: property.images.length,
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
    const response = await fetch(`${API_URL}/locations`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) return [];

    // ✅ Transform location names to current language
    return (result.data || []).map((loc: any) => ({
      name: getLocalizedText(loc.name, lang),
      count: loc.count,
    }));

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