// lib/api.ts
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
 * Fetch properties from server
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
      // Next.js caching strategy
      next: {
        revalidate: 60, // Revalidate every 60 seconds
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<Property[]> = await response.json();
    console.log(result.data);
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch properties');
    }

    console.log(`✅ Fetched ${result.count} properties`);

    return result.data;

  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    // Return empty array instead of throwing
    return [];
  }
}

/**
 * Fetch single property by ID
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

    return result.data;

  } catch (error) {
    console.error('❌ Error fetching property:', error);
    return null;
  }
}

/**
 * Fetch available locations
 */
export async function getLocations(): Promise<{ name: string; count: number }[]> {
  try {
    const url = `${API_BASE_URL}/api/public/locations`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<{ name: string; count: number }[]> = await response.json();

    if (!result.success || !result.data) {
      return [];
    }

    return result.data;

  } catch (error) {
    console.error('❌ Error fetching locations:', error);
    return [];
  }
}

/**
 * Fetch statistics
 */
export async function getStats() {
  try {
    const url = `${API_BASE_URL}/api/public/stats`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      return {
        totalProperties: 0,
        availableRooms: ['1', '2', '3', '4+'],

      };
    }

    return result.data;

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return {
      totalProperties: 0,
      availableRooms: ['1', '2', '3', '4+'],

    };
  }
}

/**
 * Fetch images for a property folder
 */
export async function getPropertyImages(folderUrl: string): Promise<string[]> {
  try {
    // If folderUrl is a browse URL, fetch the HTML and parse image URLs
    const response = await fetch(folderUrl, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extract image URLs from HTML
    // This regex matches src="/browse/..." from img tags
    const imgRegex = /src="(\/browse\/[^"]+\.(jpg|jpeg|png|webp))"/gi;
    const matches = [...html.matchAll(imgRegex)];

    const imageUrls = matches
        .map(match => `${API_BASE_URL}${match[1]}`)
        .filter(url => !url.includes('thumbnail')); // Skip thumbnails

    console.log(`📷 Found ${imageUrls.length} images`);

    return imageUrls;

  } catch (error) {
    console.error('❌ Error fetching images:', error);
    return [];
  }
}

/**
 * Format date to locale string
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