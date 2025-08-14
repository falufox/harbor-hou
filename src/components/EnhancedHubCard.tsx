import React, { useState } from 'react';
import { MapPin, ExternalLink, Thermometer, Wifi, Zap } from 'lucide-react';
import type { ResilienceHub } from '../types';
import { EmotionalStatusPill } from './EmotionalStatusPill';
import { formatTimeAgo, openDirections } from '../utils/hubUtils';

interface EnhancedHubCardProps {
  hub: ResilienceHub;
  language?: 'en' | 'es';
  showDistance?: boolean;
  onClick?: () => void;
  rank?: number; // For community features
}

export const EnhancedHubCard: React.FC<EnhancedHubCardProps> = ({
  hub,
  language = 'en',
  showDistance = true,
  onClick,
  rank
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeAgo = formatTimeAgo(hub.last_verified);

  const handleDirectionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDirections(hub);
    
    // Apple-style haptic feedback simulation
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  };

  // Apple's surprise and delight: Community insights
  const getCommunityInsight = () => {
    const insights = [
      "🤝 Community volunteers are here",
      "⭐ Highly rated by visitors", 
      "🏆 Most helpful hub this week",
      "💚 Solar-powered facility",
      "🌱 Eco-friendly operations",
      "🎯 Quick service guaranteed",
      "👥 Family-friendly environment"
    ];
    
    if (rank && rank <= 3) {
      return insights[Math.floor(Math.random() * insights.length)];
    }
    return null;
  };

  const communityInsight = getCommunityInsight();

  const cardContent = (
    <div 
      className={`
        relative overflow-hidden rounded-3xl bg-white shadow-lg border border-gray-100
        transform transition-all duration-500 ease-out
        ${isHovered ? 'scale-[1.02] shadow-2xl' : 'hover:shadow-xl'}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Apple-style gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-gray-50/30 pointer-events-none" />
      
      {/* Rank indicator for top hubs */}
      {rank && rank <= 3 && (
        <div className="absolute top-4 left-4 z-10">
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
            <span>#{rank}</span>
            <span className="text-yellow-600">★</span>
          </div>
        </div>
      )}

      <div className="relative p-6">
        {/* Header with enhanced status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 leading-tight">
              {hub.name}
            </h3>
            <EmotionalStatusPill 
              status={hub.open_state} 
              language={language}
              distance={hub.distance}
              lastVerified={hub.last_verified}
            />
          </div>
          
          {showDistance && hub.distance !== undefined && (
            <div className="text-right ml-4">
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{hub.distance.toFixed(1)} mi</span>
              </div>
              {/* Apple-style arrival time estimate */}
              <div className="text-xs text-gray-400">
                ~{Math.ceil(hub.distance * 3)} min drive
              </div>
            </div>
          )}
        </div>

        {/* Community insight */}
        {communityInsight && (
          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-sm text-blue-800 font-medium">
              {communityInsight}
            </p>
          </div>
        )}

        {/* Enhanced services with emotional context */}
        {hub.services_active.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-700">Available now:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {hub.services_active.slice(0, 4).map((service) => {
                const getServiceDisplay = (service: string) => {
                  switch (service) {
                    case 'cooling_room':
                      return {
                        icon: <Thermometer className="w-4 h-4 text-blue-500" />,
                        label: `Cool ${hub.temperature_f ? `${hub.temperature_f}°F` : 'space'}`,
                        bgColor: 'bg-blue-50 border-blue-200'
                      };
                    case 'device_charging':
                      return {
                        icon: <Zap className="w-4 h-4 text-yellow-500" />,
                        label: 'Power up',
                        bgColor: 'bg-yellow-50 border-yellow-200'
                      };
                    case 'wifi':
                      return {
                        icon: <Wifi className="w-4 h-4 text-green-500" />,
                        label: 'Free WiFi',
                        bgColor: 'bg-green-50 border-green-200'
                      };
                    default:
                      return {
                        icon: <div className="w-4 h-4 rounded-full bg-gray-400" />,
                        label: service.replace('_', ' '),
                        bgColor: 'bg-gray-50 border-gray-200'
                      };
                  }
                };
                
                const serviceDisplay = getServiceDisplay(service);
                
                return (
                  <div
                    key={service}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border
                      ${serviceDisplay.bgColor}
                    `}
                  >
                    {serviceDisplay.icon}
                    <span className="text-sm font-medium text-gray-700">
                      {serviceDisplay.label}
                    </span>
                  </div>
                );
              })}
              
              {hub.services_active.length > 4 && (
                <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-600">
                    +{hub.services_active.length - 4} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Address with improved typography */}
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed">
            {hub.address}
          </p>
        </div>

        {/* Enhanced accessibility indicators */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {hub.accessible && (
            <div className="flex items-center gap-1 text-blue-600">
              <span aria-hidden="true">♿</span>
              <span className="font-medium">
                {language === 'es' ? 'Totalmente accesible' : 'Fully accessible'}
              </span>
            </div>
          )}
          {hub.pet_friendly && (
            <div className="flex items-center gap-1 text-green-600">
              <span aria-hidden="true">🐾</span>
              <span className="font-medium">
                {language === 'es' ? 'Acepta mascotas' : 'Pet welcome'}
              </span>
            </div>
          )}
        </div>

        {/* Notes with better formatting */}
        {hub.notes_public && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-700 leading-relaxed">
              {hub.notes_public}
            </p>
          </div>
        )}

        {/* Apple-style action button */}
        <button
          onClick={handleDirectionsClick}
          className="
            w-full flex items-center justify-center gap-3 
            px-6 py-4 bg-blue-500 text-white rounded-2xl
            font-semibold shadow-lg
            transform transition-all duration-300 ease-out
            hover:bg-blue-600 hover:scale-[1.02] hover:shadow-xl
            active:scale-95
            focus:outline-none focus:ring-4 focus:ring-blue-200
          "
          aria-label={`Get directions to ${hub.name}`}
        >
          <ExternalLink className="w-5 h-5" />
          <span>
            {language === 'es' ? 'Cómo llegar' : 'Get Directions'}
          </span>
          
          {/* Apple-style button shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>

        {/* Verification status with Apple-style subtlety */}
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-400">
            {language === 'es' 
              ? `Verificado hace ${timeAgo.replace('ago', '').replace('m', ' min').replace('h', ' h')}`
              : `Verified ${timeAgo}`
            }
          </span>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-4 focus:ring-blue-200 rounded-3xl"
        aria-label={`View details for ${hub.name}`}
      >
        {cardContent}
      </button>
    );
  }

  return cardContent;
};