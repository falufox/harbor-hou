import type { ResilienceHub, Alert, ApiResponse, UserLocation } from '../types';
import { mockHubs, mockAlerts } from '../data/mockHubs';
import { addDistanceToHubs } from './hubUtils';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Cache configuration
const CACHE_DURATION = 30 * 1000; // 30 seconds
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(url: string, params: Record<string, any> = {}): string {
  return `${url}?${new URLSearchParams(params).toString()}`;
}

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// Simulate API delay for development
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class HubAPI {
  static async getHubs(params: {
    lat?: number;
    lon?: number;
    radius?: number;
    services?: string[];
    open_now?: boolean;
  } = {}): Promise<ApiResponse<ResilienceHub[]>> {
    const cacheKey = getCacheKey('/hubs', params);
    const cached = getCachedData<ApiResponse<ResilienceHub[]>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (USE_MOCK_DATA) {
      await delay(200); // Simulate network delay
      
      let hubs = [...mockHubs];
      
      // Add distance if user location provided
      if (params.lat && params.lon) {
        const userLocation: UserLocation = { lat: params.lat, lon: params.lon };
        hubs = addDistanceToHubs(hubs, userLocation);
      }
      
      // Filter by radius
      if (params.radius && params.lat && params.lon) {
        hubs = hubs.filter(hub => !hub.distance || hub.distance <= params.radius!);
      }
      
      // Filter by services
      if (params.services && params.services.length > 0) {
        hubs = hubs.filter(hub => 
          params.services!.every(service => hub.services_active.includes(service as any))
        );
      }
      
      // Filter by open status
      if (params.open_now) {
        hubs = hubs.filter(hub => ['open', 'open_limited'].includes(hub.open_state));
      }
      
      const response: ApiResponse<ResilienceHub[]> = {
        data: hubs,
        last_updated: new Date().toISOString(),
        next_update: new Date(Date.now() + CACHE_DURATION).toISOString()
      };
      
      setCachedData(cacheKey, response);
      return response;
    }

    // Real API call
    try {
      const url = new URL(`${API_BASE_URL}/hubs`);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(','));
          } else {
            url.searchParams.set(key, value.toString());
          }
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching hubs:', error);
      throw new Error('Failed to fetch resilience hubs. Please try again later.');
    }
  }

  static async getHub(id: string): Promise<ResilienceHub> {
    const cacheKey = getCacheKey(`/hubs/${id}`);
    const cached = getCachedData<ResilienceHub>(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (USE_MOCK_DATA) {
      await delay(150);
      
      const hub = mockHubs.find(h => h.id === id);
      if (!hub) {
        throw new Error('Hub not found');
      }
      
      setCachedData(cacheKey, hub);
      return hub;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/hubs/${id}`);
      if (!response.ok) {
        throw new Error(`Hub not found: ${response.status}`);
      }

      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching hub:', error);
      throw new Error('Failed to fetch hub details. Please try again later.');
    }
  }

  static async getHubsGeoJSON(params: {
    bounds?: { north: number; south: number; east: number; west: number };
  } = {}): Promise<any> {
    const cacheKey = getCacheKey('/hubs.geojson', params);
    const cached = getCachedData<any>(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (USE_MOCK_DATA) {
      await delay(100);
      
      const geojson = {
        type: 'FeatureCollection',
        features: mockHubs.map(hub => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [hub.lon, hub.lat]
          },
          properties: {
            id: hub.id,
            name: hub.name,
            open_state: hub.open_state,
            services_active: hub.services_active,
            accessible: hub.accessible,
            pet_friendly: hub.pet_friendly
          }
        }))
      };
      
      setCachedData(cacheKey, geojson);
      return geojson;
    }

    try {
      const url = new URL(`${API_BASE_URL}/hubs.geojson`);
      if (params.bounds) {
        Object.entries(params.bounds).forEach(([key, value]) => {
          url.searchParams.set(key, value.toString());
        });
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`GeoJSON request failed: ${response.status}`);
      }

      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
      throw new Error('Failed to fetch map data. Please try again later.');
    }
  }

  static async getAlerts(): Promise<ApiResponse<Alert[]>> {
    const cacheKey = getCacheKey('/alerts');
    const cached = getCachedData<ApiResponse<Alert[]>>(cacheKey);
    
    if (cached) {
      return cached;
    }

    if (USE_MOCK_DATA) {
      await delay(100);
      
      const response: ApiResponse<Alert[]> = {
        data: mockAlerts,
        last_updated: new Date().toISOString()
      };
      
      setCachedData(cacheKey, response);
      return response;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/alerts`);
      if (!response.ok) {
        throw new Error(`Alerts request failed: ${response.status}`);
      }

      const data = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      // Don't throw for alerts - they're not critical
      return {
        data: [],
        last_updated: new Date().toISOString()
      };
    }
  }

  // Clear cache (useful for manual refresh)
  static clearCache(): void {
    cache.clear();
  }

  // Get cache status for debugging
  static getCacheStatus(): { size: number; keys: string[] } {
    return {
      size: cache.size,
      keys: Array.from(cache.keys())
    };
  }
}