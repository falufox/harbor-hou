import React from 'react';
import { X } from 'lucide-react';
import type { HubFilter, Service } from '../types';
import { getServiceInfo } from '../utils/hubUtils';

interface FilterChipsProps {
  filter: HubFilter;
  onUpdateFilter: (filter: Partial<HubFilter>) => void;
  onToggleService: (service: string) => void;
  language?: 'en' | 'es';
  hubCounts?: {
    open: number;
    withCooling: number;
    withCharging: number;
    withWifi: number;
    withWater: number;
    accessible: number;
    petFriendly: number;
  };
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filter,
  onUpdateFilter,
  onToggleService,
  language = 'en',
  hubCounts
}) => {
  const commonServices: Service[] = [
    'cooling_room',
    'device_charging', 
    'wifi',
    'potable_water'
  ];

  const getServiceLabel = (service: Service) => {
    const info = getServiceInfo(service);
    return language === 'es' ? info.labelEs : info.label;
  };

  const getCount = (service: Service) => {
    if (!hubCounts) return null;
    switch (service) {
      case 'cooling_room': return hubCounts.withCooling;
      case 'device_charging': return hubCounts.withCharging;
      case 'wifi': return hubCounts.withWifi;
      case 'potable_water': return hubCounts.withWater;
      default: return null;
    }
  };

  const hasActiveFilters = filter.openNow || 
    filter.services.length > 0 || 
    filter.accessible || 
    filter.petFriendly;

  return (
    <div className="space-y-3">
      {/* Primary filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Open Now */}
        <button
          onClick={() => onUpdateFilter({ openNow: !filter.openNow })}
          className={`
            filter-chip flex-shrink-0 
            ${filter.openNow ? 'filter-chip-active' : 'filter-chip-inactive'}
          `}
          aria-pressed={filter.openNow}
        >
          <span className="mr-1" aria-hidden="true">🟢</span>
          {language === 'es' ? 'Abierto Ahora' : 'Open Now'}
          {hubCounts?.open && (
            <span className="ml-1 text-xs opacity-75">({hubCounts.open})</span>
          )}
        </button>

        {/* Service filters */}
        {commonServices.map((service) => {
          const isActive = filter.services.includes(service);
          const serviceInfo = getServiceInfo(service);
          const count = getCount(service);
          
          return (
            <button
              key={service}
              onClick={() => onToggleService(service)}
              className={`
                filter-chip flex-shrink-0
                ${isActive ? 'filter-chip-active' : 'filter-chip-inactive'}
              `}
              aria-pressed={isActive}
            >
              <span className="mr-1" aria-hidden="true">{serviceInfo.icon}</span>
              {getServiceLabel(service)}
              {count && (
                <span className="ml-1 text-xs opacity-75">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Accessible */}
        <button
          onClick={() => onUpdateFilter({ accessible: !filter.accessible })}
          className={`
            filter-chip flex-shrink-0
            ${filter.accessible ? 'filter-chip-active' : 'filter-chip-inactive'}
          `}
          aria-pressed={filter.accessible}
        >
          <span className="mr-1" aria-hidden="true">♿</span>
          {language === 'es' ? 'Accesible' : 'Accessible'}
          {hubCounts?.accessible && (
            <span className="ml-1 text-xs opacity-75">({hubCounts.accessible})</span>
          )}
        </button>

        {/* Pet Friendly */}
        <button
          onClick={() => onUpdateFilter({ petFriendly: !filter.petFriendly })}
          className={`
            filter-chip flex-shrink-0
            ${filter.petFriendly ? 'filter-chip-active' : 'filter-chip-inactive'}
          `}
          aria-pressed={filter.petFriendly}
        >
          <span className="mr-1" aria-hidden="true">🐾</span>
          {language === 'es' ? 'Mascotas' : 'Pet Friendly'}
          {hubCounts?.petFriendly && (
            <span className="ml-1 text-xs opacity-75">({hubCounts.petFriendly})</span>
          )}
        </button>
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <div className="flex justify-start">
          <button
            onClick={() => onUpdateFilter({ 
              openNow: false, 
              services: [], 
              accessible: false, 
              petFriendly: false 
            })}
            className="text-sm text-primary hover:text-accent flex items-center gap-1 py-1"
            aria-label={language === 'es' ? 'Limpiar todos los filtros' : 'Clear all filters'}
          >
            <X className="w-4 h-4" aria-hidden="true" />
            {language === 'es' ? 'Limpiar Filtros' : 'Clear Filters'}
          </button>
        </div>
      )}
    </div>
  );
};