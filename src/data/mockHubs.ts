import type { ResilienceHub } from '../types';

// Mock data for Houston resilience hubs during development
export const mockHubs: ResilienceHub[] = [
  {
    id: 'hub-001',
    name: 'George R. Brown Convention Center',
    address: '1001 Avenidas de las Americas, Houston, TX 77010',
    lat: 29.7499,
    lon: -95.3590,
    open_state: 'open',
    last_verified: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    services_active: ['cooling_room', 'device_charging', 'wifi', 'potable_water', 'restrooms'],
    accessible: true,
    pet_friendly: false,
    hours_today: '8:00 AM – 8:00 PM',
    hours_activation: 'Extended hours during activation: 24/7',
    languages: ['English', 'Spanish'],
    notes_public: 'Large cooling area maintained at 79°F or below. Multiple device charging stations available.',
    transit: 'METRO Red Line (Convention District Station), Bus Routes 40, 44',
    house_rules: 'No smoking, alcohol, or weapons. Service animals welcome.',
    contact_public: '(713) 853-8000',
    temperature_f: 78
  },
  {
    id: 'hub-002', 
    name: 'Fifth Ward Multi-Service Center',
    address: '4014 Market St, Houston, TX 77020',
    lat: 29.7752,
    lon: -95.3422,
    open_state: 'at_capacity',
    last_verified: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    services_active: ['cooling_room', 'device_charging', 'wifi', 'potable_water'],
    accessible: true,
    pet_friendly: true,
    hours_today: '7:00 AM – 9:00 PM',
    hours_activation: 'Extended hours during emergencies',
    languages: ['English', 'Spanish'],
    notes_public: 'Currently at capacity. Consider nearby alternatives. Pet relief area available.',
    transit: 'METRO Bus Routes 11, 66',
    house_rules: 'Pets must be leashed. No smoking indoors.',
    contact_public: '(713) 845-1100',
    temperature_f: 76
  },
  {
    id: 'hub-003',
    name: 'Acres Homes Multi-Service Center', 
    address: '6719 W Montgomery Rd, Houston, TX 77091',
    lat: 29.8542,
    lon: -95.4158,
    open_state: 'open',
    last_verified: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
    services_active: ['cooling_room', 'heating_room', 'device_charging', 'wifi', 'potable_water', 'restrooms'],
    accessible: true,
    pet_friendly: true,
    hours_today: '6:00 AM – 10:00 PM',
    hours_activation: '24/7 during severe weather events',
    languages: ['English', 'Spanish'],
    notes_public: 'Dual climate control - heating and cooling available. Pet-friendly with outdoor relief area.',
    transit: 'METRO Bus Route 73',
    house_rules: 'Quiet hours after 10 PM. Service animals and pets welcome with proof of vaccination.',
    contact_public: '(713) 696-8541',
    temperature_f: 79
  },
  {
    id: 'hub-004',
    name: 'Sunnyside Multi-Service Center',
    address: '4410 Reed Rd, Houston, TX 77051',
    lat: 29.6842,
    lon: -95.3089,
    open_state: 'closed',
    last_verified: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    services_active: [],
    accessible: true,
    pet_friendly: false,
    hours_today: 'Closed',
    hours_activation: 'Opens during emergency activation',
    languages: ['English', 'Spanish'],
    notes_public: 'Currently closed. Will open during emergency activation.',
    transit: 'METRO Bus Routes 28, 44',
    house_rules: 'No pets (except service animals). No smoking.',
    contact_public: '(713) 645-1475'
  },
  {
    id: 'hub-005',
    name: 'Kashmere Multi-Service Center',
    address: '4802 Lockwood Dr, Houston, TX 77026',
    lat: 29.7814,
    lon: -95.3156,
    open_state: 'open_limited',
    last_verified: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 mins ago
    services_active: ['cooling_room', 'wifi', 'potable_water'],
    accessible: true,
    pet_friendly: false,
    hours_today: '9:00 AM – 6:00 PM',
    hours_activation: 'Extended hours during activation',
    languages: ['English', 'Spanish'],
    notes_public: 'Limited services available. Charging stations temporarily out of service.',
    transit: 'METRO Bus Routes 9, 50',
    house_rules: 'Service animals only. No smoking.',
    contact_public: '(713) 845-1200',
    temperature_f: 77
  },
  {
    id: 'hub-006',
    name: 'Hidalgo Park Community Center',
    address: '7000 Avenue P, Houston, TX 77011', 
    lat: 29.7156,
    lon: -95.2889,
    open_state: 'planned_open',
    last_verified: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    services_active: [],
    accessible: true,
    pet_friendly: true,
    hours_today: 'Opens at 12:00 PM',
    hours_activation: 'Will open if emergency declared',
    languages: ['English', 'Spanish'],
    notes_public: 'Scheduled to open at noon. Pet relief area will be available.',
    transit: 'METRO Bus Route 44',
    house_rules: 'Pets welcome with vaccination proof. No smoking.',
    contact_public: '(713) 845-1500'
  }
];

// Mock alerts data
export const mockAlerts = [
  {
    id: 'alert-001',
    severity: 'warning' as const,
    title: 'Heat Advisory in Effect',
    message: 'Excessive heat warning through Thursday. Heat index may reach 108°F. Seek air conditioning.',
    link: 'https://ready.harris-county.com/heat',
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
  }
];