// lib/api.ts - FIXED VERSION
// @ts-ignore
import { Property } from '@/types/property';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';
const API_URL = `${API_BASE}/api/public`;



export async function GetTelegramConfig() {
  try {
      const res = await fetch(`${API_URL}/config`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
      })

    if (!res.ok) {
      console.error('  ❌ Response not ok:', res.status);
      return null;
    }

    const result = await res.json();

    if (!result.success) {
      console.error('  ❌ API error:', result.error);
      return null;
    }

    return result.data;
  }catch (error) {
    console.error(error);
  }
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

    const params = new URLSearchParams({
      lang: filters.lang,
    });

    if (filters.rooms) params.append('rooms', filters.rooms);
    if (filters.location) params.append('location', filters.location);
    if (filters.type) params.append('type', filters.type);

    const url = `${API_URL}/properties?${params.toString()}`;
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

    // ✅ Validate data
    const properties = (result.data || []).map((prop: any) => ({
      ...prop,
      // ✅ Ensure images is array
      images: Array.isArray(prop.images) ? prop.images : [],
      // ✅ Ensure mainImage exists
      mainImage: prop.mainImage || (prop.images && prop.images[0]) || null,
      // ✅ Ensure price is number
      price: typeof prop.price === 'number' ? prop.price : parseFloat(prop.price) || 0,
    }));

    console.log('  Sample property:', {
      id: properties[0]?.id,
      price: properties[0]?.price,
      images: properties[0]?.images?.length,
      mainImage: properties[0]?.mainImage ? '✅' : '❌',
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
    console.log(`📥 Fetching property: ${id}`);

    const url = `${API_URL}/properties/${id}?lang=${lang}`;
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

    const prop = result.data;

    // ✅ Validate and fix data
    const property: Property = {
      ...prop,
      // ✅ Ensure images is array
      images: Array.isArray(prop.images) ? prop.images : [],
      // ✅ Ensure mainImage exists
      mainImage: prop.mainImage || (prop.images && prop.images[0]) || null,
      // ✅ Ensure price is number
      price: typeof prop.price === 'number' ? prop.price : parseFloat(prop.price) || 0,
    };

    console.log('✅ Property loaded:', {
      id: property.id,
      price: property.price,
      images: property.images.length,
      mainImage: property.mainImage ? '✅' : '❌',
    });

    return property;

  } catch (error) {
    console.error('❌ getPropertyById error:', error);
    return null;
  }
}

/**
 * ✅ Get locations
 */
export async function getLocations(): Promise<{ name: string; count: number }[]> {
  try {
    const response = await fetch(`${API_URL}/locations`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const result = await response.json();
    return result.success ? result.data : [];

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