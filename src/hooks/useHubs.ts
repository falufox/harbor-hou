import { useState, useEffect, useCallback } from 'react';
import type { ResilienceHub, HubFilter, ApiResponse } from '../types';
import { HubAPI } from '../utils/api';
import { filterHubs, sortHubs } from '../utils/hubUtils';
import { useLocation } from '../contexts/LocationContext';

export const useHubs = (initialFilter: Partial<HubFilter> = {}) => {
  const { userLocation } = useLocation();
  const [hubs, setHubs] = useState<ResilienceHub[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<ResilienceHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [filter, setFilter] = useState<HubFilter>({
    openNow: false,
    services: [],
    accessible: false,
    petFriendly: false,
    ...initialFilter
  });

  const fetchHubs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {};
      
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lon = userLocation.lon;
        params.radius = filter.maxDistance || 50; // Default 50 mile radius
      }

      // Let the API handle initial filtering for performance
      if (filter.openNow) {
        params.open_now = true;
      }
      
      if (filter.services.length > 0) {
        params.services = filter.services;
      }

      const response: ApiResponse<ResilienceHub[]> = await HubAPI.getHubs(params);
      
      let hubsData = response.data;
      
      // Apply client-side filters that weren't handled by API
      hubsData = filterHubs(hubsData, filter);
      
      // Sort by status and distance
      hubsData = sortHubs(hubsData);
      
      setHubs(hubsData);
      setFilteredHubs(hubsData);
      setLastUpdated(new Date(response.last_updated));
    } catch (err) {
      console.error('Error fetching hubs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load resilience hubs');
    } finally {
      setLoading(false);
    }
  }, [userLocation, filter]);

  // Update filtered hubs when filter changes (client-side filtering)
  useEffect(() => {
    if (hubs.length > 0) {
      const filtered = filterHubs(hubs, filter);
      const sorted = sortHubs(filtered);
      setFilteredHubs(sorted);
    }
  }, [hubs, filter]);

  // Fetch hubs when location or filter changes
  useEffect(() => {
    fetchHubs();
  }, [fetchHubs]);

  const updateFilter = useCallback((newFilter: Partial<HubFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({
      openNow: false,
      services: [],
      accessible: false,
      petFriendly: false
    });
  }, []);

  const refresh = useCallback(() => {
    HubAPI.clearCache();
    fetchHubs();
  }, [fetchHubs]);

  const toggleService = useCallback((service: string) => {
    setFilter(prev => ({
      ...prev,
      services: prev.services.includes(service as any)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service as any]
    }));
  }, []);

  return {
    hubs: filteredHubs,
    allHubs: hubs,
    loading,
    error,
    lastUpdated,
    filter,
    updateFilter,
    clearFilter,
    refresh,
    toggleService,
    // Statistics
    totalHubs: hubs.length,
    openHubs: hubs.filter(h => ['open', 'open_limited'].includes(h.open_state)).length,
    nearbyHubs: userLocation ? hubs.filter(h => h.distance && h.distance <= 10).length : null
  };
};