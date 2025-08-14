import React from 'react';
import { MapPin, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import type { ResilienceHub } from '../types';
import { StatusPill } from './StatusPill';
import { ServiceIcons } from './ServiceIcons';
import { formatTimeAgo, isRecentlyVerified, openDirections } from '../utils/hubUtils';

interface HubCardProps {
  hub: ResilienceHub;
  language?: 'en' | 'es';
  showDistance?: boolean;
  onClick?: () => void;
}

export const HubCard: React.FC<HubCardProps> = ({
  hub,
  language = 'en',
  showDistance = true,
  onClick
}) => {
  const isRecent = isRecentlyVerified(hub.last_verified);
  const timeAgo = formatTimeAgo(hub.last_verified);

  const handleDirectionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirections(hub);
  };

  const getTemperatureDisplay = () => {
    if (hub.temperature_f && hub.services_active.includes('cooling_room')) {
      return (
        <div className="flex items-center gap-1 text-sm text-blue-600">
          <span className="text-blue-500">❄️</span>
          <span>{hub.temperature_f}°F</span>
        </div>
      );
    }
    return null;
  };

  const cardContent = (
    <div className="card p-4 hover:shadow-lg transition-shadow duration-200">
      {/* Header with status and distance */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {hub.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill status={hub.open_state} language={language} />
            {getTemperatureDisplay()}
          </div>
        </div>
        {showDistance && hub.distance !== undefined && (
          <div className="text-right text-sm text-gray-500 ml-2">
            <div className="font-medium">{hub.distance.toFixed(1)} mi</div>
            <MapPin className="w-4 h-4 mx-auto mt-1" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Services */}
      {hub.services_active.length > 0 && (
        <div className="mb-3">
          <ServiceIcons 
            services={hub.services_active}
            limit={6}
            size="md"
            language={language}
          />
        </div>
      )}

      {/* Address */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 line-clamp-2">{hub.address}</p>
      </div>

      {/* Hours and verification */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-gray-400" aria-hidden="true" />
          <span className="text-gray-600">{hub.hours_today}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1 ${isRecent ? 'text-green-600' : 'text-amber-600'}`}>
            {!isRecent && <AlertTriangle className="w-3 h-3" aria-hidden="true" />}
            <span>
              {language === 'es' 
                ? `Verificado hace ${timeAgo.replace('ago', '').replace('m', ' min').replace('h', ' h').replace('d', ' d')}`
                : `Verified ${timeAgo}`
              }
            </span>
          </div>
          
          {!isRecent && (
            <span className="text-amber-600 text-xs">
              {language === 'es' ? 'Confirme antes de ir' : 'Check before you go'}
            </span>
          )}
        </div>
      </div>

      {/* Accessibility and pet indicators */}
      <div className="flex items-center gap-3 mb-4 text-sm">
        {hub.accessible && (
          <div className="flex items-center gap-1 text-blue-600">
            <span aria-hidden="true">♿</span>
            <span>{language === 'es' ? 'Accesible' : 'Accessible'}</span>
          </div>
        )}
        {hub.pet_friendly && (
          <div className="flex items-center gap-1 text-green-600">
            <span aria-hidden="true">🐾</span>
            <span>{language === 'es' ? 'Mascotas' : 'Pet Friendly'}</span>
          </div>
        )}
      </div>

      {/* Notes */}
      {hub.notes_public && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">{hub.notes_public}</p>
        </div>
      )}

      {/* Action button */}
      <div className="flex gap-2">
        <button
          onClick={handleDirectionsClick}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
          aria-label={`Get directions to ${hub.name}`}
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          {language === 'es' ? 'Direcciones' : 'Directions'}
        </button>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="w-full text-left focus-visible"
        aria-label={`View details for ${hub.name}`}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};