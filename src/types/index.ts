// Houston Resilience Hub data model based on PRD

export type HubStatus = 'open' | 'at_capacity' | 'open_limited' | 'closed' | 'planned_open';

export type Service = 
  | 'cooling_room'
  | 'heating_room' 
  | 'device_charging'
  | 'wifi'
  | 'potable_water'
  | 'restrooms'
  | 'medical_assistance'
  | 'pet_relief'
  | 'food_distribution';

export interface ResilienceHub {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  open_state: HubStatus;
  last_verified: string; // ISO date string
  services_active: Service[];
  accessible: boolean;
  pet_friendly: boolean;
  hours_today: string;
  hours_activation: string;
  languages: string[];
  notes_public: string;
  transit: string;
  house_rules: string;
  contact_public: string;
  distance?: number; // Added when calculating from user location
  temperature_f?: number; // Current temp in Fahrenheit for cooling centers
}

export interface HubFilter {
  openNow: boolean;
  services: Service[];
  accessible: boolean;
  petFriendly: boolean;
  maxDistance?: number;
}

export interface UserLocation {
  lat: number;
  lon: number;
  accuracy?: number;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'urgent';
  title: string;
  message: string;
  link?: string;
  expires_at?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  last_updated: string;
  next_update?: string;
}

// Filter UI helpers
export interface FilterChip {
  id: string;
  label: string;
  labelEs: string;
  icon: string;
  active: boolean;
  count?: number;
}

// Language support
export type Language = 'en' | 'es';

export interface LocalizedText {
  en: string;
  es: string;
}

// Map related types
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface HubCluster {
  id: string;
  lat: number;
  lon: number;
  count: number;
  hubs: ResilienceHub[];
}