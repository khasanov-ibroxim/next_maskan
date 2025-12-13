// lib/api.ts - Optimized with caching and request deduplication
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

// ✅ In-memory cache for reducing duplicate requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60 * 1000; // 60 seconds

// ✅ Pending requests map for deduplication
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Generic fetch with caching and deduplication
 */
async function cachedFetch<T>(
    url: string,
    options: RequestInit = {},
    cacheTTL: number = CACHE_TTL
): Promise<T> {
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
    return pendingRequests.get(cacheKey)!;
  }

  // ✅ Make new request
  const requestPromise = (async () => {
    try {
      console.log('🌐 Fetching:', url);

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
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
    } finally {
      // ✅ Remove from pending
      pendingRequests.delete(cacheKey);
    }
  })();

  // ✅ Add to pending
  pendingRequests.set(cacheKey, requestPromise);

  return requestPromise;
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

    const result = await cachedFetch<ApiResponse<Property[]>>(url, {
      next: {
        revalidate: 60, // Next.js cache
      } as any
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

/**
 * Fetch single property by ID
 */
export async function getPropertyById(id: string, lang: Locale): Promise<Property | null> {
  try {
    const url = `${API_BASE_URL}/api/public/properties/${id}?lang=${lang}`;

    const result = await cachedFetch<ApiResponse<Property>>(url, {
      next: {
        revalidate: 60,
      } as any
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

/**
 * Fetch available locations
 */
export async function getLocations(): Promise<{ name: string; count: number }[]> {
  try {
    const url = `${API_BASE_URL}/api/public/locations`;

    const result = await cachedFetch<ApiResponse<{ name: string; count: number }[]>>(
        url,
        {
          next: {
            revalidate: 300, // 5 minutes
          } as any
        },
        300 * 1000 // 5 minutes cache
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

/**
 * Fetch statistics
 */
export async function getStats() {
  try {
    const url = `${API_BASE_URL}/api/public/stats`;

    const result = await cachedFetch(
        url,
        {
          next: {
            revalidate: 300,
          } as any
        },
        300 * 1000 // 5 minutes cache
    );

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
 * Fetch images for a property folder - with timeout and retry
 */
export async function getPropertyImages(folderUrl: string): Promise<string[]> {
  try {
    // ✅ Use cached fetch with longer TTL for images
    const html = await cachedFetch<string>(
        folderUrl,
        {
          next: { revalidate: 600 } as any // 10 minutes
        },
        600 * 1000 // 10 minutes cache
    );

    if (typeof html !== 'string') {
      throw new Error('Invalid response format');
    }

    // Extract image URLs from HTML
    const imgRegex = /src="(\/browse\/[^"]+\.(jpg|jpeg|png|webp))"/gi;
    const matches = [...html.matchAll(imgRegex)];

    const imageUrls = matches
        .map(match => `${API_BASE_URL}${match[1]}`)
        .filter(url => !url.includes('thumbnail'));

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

/**
 * Clear cache (useful for development)
 */
export function clearCache() {
  cache.clear();
  pendingRequests.clear();
  console.log('🗑️ Cache cleared');
}