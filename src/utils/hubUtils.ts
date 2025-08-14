import type { ResilienceHub, UserLocation, HubFilter, Service } from '../types';

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number, 
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Add distance to hubs based on user location
export function addDistanceToHubs(
  hubs: ResilienceHub[],
  userLocation: UserLocation | null
): ResilienceHub[] {
  if (!userLocation) return hubs;
  
  return hubs.map(hub => ({
    ...hub,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lon,
      hub.lat,
      hub.lon
    )
  }));
}

// Sort hubs by distance and status priority
export function sortHubs(hubs: ResilienceHub[]): ResilienceHub[] {
  return [...hubs].sort((a, b) => {
    // First priority: open status
    const statusPriority = {
      'open': 0,
      'open_limited': 1,
      'planned_open': 2,
      'at_capacity': 3,
      'closed': 4
    };
    
    const statusDiff = statusPriority[a.open_state] - statusPriority[b.open_state];
    if (statusDiff !== 0) return statusDiff;
    
    // Second priority: distance (if available)
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    
    // Fall back to alphabetical
    return a.name.localeCompare(b.name);
  });
}

// Filter hubs based on user criteria
export function filterHubs(hubs: ResilienceHub[], filter: HubFilter): ResilienceHub[] {
  return hubs.filter(hub => {
    // Filter by open status
    if (filter.openNow && !['open', 'open_limited'].includes(hub.open_state)) {
      return false;
    }
    
    // Filter by services
    if (filter.services.length > 0) {
      const hasAllServices = filter.services.every(service => 
        hub.services_active.includes(service)
      );
      if (!hasAllServices) return false;
    }
    
    // Filter by accessibility
    if (filter.accessible && !hub.accessible) {
      return false;
    }
    
    // Filter by pet-friendly
    if (filter.petFriendly && !hub.pet_friendly) {
      return false;
    }
    
    // Filter by distance
    if (filter.maxDistance && hub.distance && hub.distance > filter.maxDistance) {
      return false;
    }
    
    return true;
  });
}

// Check if a hub was verified recently (within the last 3 hours)
export function isRecentlyVerified(lastVerified: string): boolean {
  const threeHoursAgo = Date.now() - (3 * 60 * 60 * 1000);
  return new Date(lastVerified).getTime() > threeHoursAgo;
}

// Format time ago string
export function formatTimeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else {
    return `${days}d ago`;
  }
}

// Get service icon and label
export function getServiceInfo(service: Service): { icon: string; label: string; labelEs: string } {
  const serviceMap = {
    'cooling_room': { icon: '❄️', label: 'Cooling', labelEs: 'Enfriamiento' },
    'heating_room': { icon: '🔥', label: 'Heating', labelEs: 'Calefacción' },
    'device_charging': { icon: '🔌', label: 'Charging', labelEs: 'Carga' },
    'wifi': { icon: '📶', label: 'Wi-Fi', labelEs: 'Wi-Fi' },
    'potable_water': { icon: '💧', label: 'Water', labelEs: 'Agua' },
    'restrooms': { icon: '🚻', label: 'Restrooms', labelEs: 'Baños' },
    'medical_assistance': { icon: '🏥', label: 'Medical', labelEs: 'Médico' },
    'pet_relief': { icon: '🐾', label: 'Pet Area', labelEs: 'Área Mascotas' },
    'food_distribution': { icon: '🍽️', label: 'Food', labelEs: 'Comida' }
  };
  
  return serviceMap[service] || { icon: '📍', label: service, labelEs: service };
}

// Format hub status for display
export function getStatusInfo(status: string): { 
  label: string; 
  labelEs: string; 
  color: string; 
  bgColor: string 
} {
  const statusMap = {
    'open': { 
      label: 'Open', 
      labelEs: 'Abierto', 
      color: 'text-open', 
      bgColor: 'bg-open' 
    },
    'at_capacity': { 
      label: 'At Capacity', 
      labelEs: 'Lleno', 
      color: 'text-at-capacity', 
      bgColor: 'bg-at-capacity' 
    },
    'open_limited': { 
      label: 'Limited Services', 
      labelEs: 'Servicios Limitados', 
      color: 'text-at-capacity', 
      bgColor: 'bg-at-capacity' 
    },
    'closed': { 
      label: 'Closed', 
      labelEs: 'Cerrado', 
      color: 'text-closed', 
      bgColor: 'bg-closed' 
    },
    'planned_open': { 
      label: 'Opens Soon', 
      labelEs: 'Abre Pronto', 
      color: 'text-muted', 
      bgColor: 'bg-muted' 
    }
  };
  
  return statusMap[status] || statusMap['closed'];
}

// Open native maps app for directions
export function openDirections(hub: ResilienceHub) {
  const address = encodeURIComponent(hub.address);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  let url: string;
  
  if (isIOS) {
    url = `maps://maps.apple.com/?daddr=${address}`;
  } else if (isAndroid) {
    url = `geo:${hub.lat},${hub.lon}?q=${address}`;
  } else {
    url = `https://www.google.com/maps/dir/?api=1&destination=${address}`;
  }
  
  window.open(url, '_blank');
}