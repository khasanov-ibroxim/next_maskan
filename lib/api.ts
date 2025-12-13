// lib/api.ts - SIMPLIFIED
import { Property } from '@/types';
import { Locale } from '@/i18n-config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://194.163.140.30:5000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}

interface GetPropertiesParams {
  lang: Locale;
  rooms?: string;
  location?: string;
  type?: 'Sotuv' | 'Arenda';
}

/**
 * ✅ Fetch properties - Server returns images array directly
 */
export async function getProperties(params: GetPropertiesParams): Promise<Property[]> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('lang', params.lang);

    if (params.rooms) queryParams.append('rooms', params.rooms);
    if (params.location) queryParams.append('location', params.location);
    if (params.type) queryParams.append('type', params.type);

    const url = `${API_BASE_URL}/api/public/properties?${queryParams.toString()}`;

    console.log('🌐 Fetching properties:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Property[]> = await response.json();

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

/**
 * ✅ Fetch single property - Server returns images array directly
 */
export async function getPropertyById(id: string, lang: Locale): Promise<Property | null> {
  try {
    const url = `${API_BASE_URL}/api/public/properties/${id}?lang=${lang}`;

    console.log('🌐 Fetching property:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Property> = await response.json();

    if (!result.success || !result.data) {
      return null;
    }

    console.log('✅ Fetched property:', result.data.id);
    console.log('  Images:', result.data.images?.length || 0);
    console.log('  Rieltor:', result.data.rieltor);

    return result.data;

  } catch (error) {
    console.error('❌ Error fetching property:', error);
    return null;
  }
}

/**
 * ✅ Format date
 */
export function formatDate(dateString: string, lang: Locale): string {
  try {
    const date = new Date(dateString);
    const locales: Record<Locale, string> = {
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
  } catch {
    return dateString;
  }
}