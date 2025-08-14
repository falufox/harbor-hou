import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Heart, Users } from 'lucide-react';
import { useEmergencyContext } from '../hooks/useEmergencyContext';
import { useLocation } from '../contexts/LocationContext';

interface AppleStyleHeroProps {
  onFindHelp: () => void;
  nearbyHubs?: number;
  openHubs?: number;
}

export const AppleStyleHero: React.FC<AppleStyleHeroProps> = ({
  onFindHelp,
  nearbyHubs,
  openHubs
}) => {
  const { context, batteryInfo, getEmergencyMessage, isEmergencyDetected } = useEmergencyContext();
  const { userLocation, requestLocation, isLoadingLocation } = useLocation();
  const [showDelightMessage, setShowDelightMessage] = useState(false);
  
  const emergencyMessage = getEmergencyMessage();

  // Apple-style surprise and delight
  useEffect(() => {
    const showRandomDelight = () => {
      if (Math.random() < 0.3) { // 30% chance
        setShowDelightMessage(true);
        setTimeout(() => setShowDelightMessage(false), 4000);
      }
    };

    const timer = setTimeout(showRandomDelight, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleFindHelp = () => {
    if (!userLocation) {
      requestLocation();
    }
    onFindHelp();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Apple-style gradient background */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${emergencyMessage.color} opacity-90
        animate-gradient-x
      `} />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12" />
      </div>

      <div className="relative px-6 py-16 text-center text-white">
        {/* Emergency context indicator */}
        {isEmergencyDetected && (
          <div className="mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
              <span className="text-2xl" aria-hidden="true">{emergencyMessage.emoji}</span>
              <span className="text-sm font-medium">
                Emergency detected • {context.confidence > 0.8 ? 'High confidence' : 'Moderate confidence'}
              </span>
            </div>
          </div>
        )}

        {/* Main hero content with Apple typography */}
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-4xl md:text-5xl font-system font-bold leading-tight mb-4 tracking-tight">
            {emergencyMessage.title}
          </h1>
          <p className="text-xl md:text-2xl font-normal opacity-90 leading-relaxed">
            {emergencyMessage.subtitle}
          </p>
        </div>

        {/* Apple-style primary action button */}
        <div className="mb-8">
          <button
            onClick={handleFindHelp}
            disabled={isLoadingLocation}
            className="
              group relative inline-flex items-center gap-3 
              px-12 py-4 bg-white text-gray-900 rounded-2xl 
              font-semibold text-lg shadow-xl
              transform transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-2xl
              active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed
              focus:outline-none focus:ring-4 focus:ring-white/30
            "
            aria-label={`${emergencyMessage.action}${userLocation ? '' : ' - will request location first'}`}
          >
            {isLoadingLocation ? (
              <>
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Finding your location...</span>
              </>
            ) : (
              <>
                <Heart className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                <span>{emergencyMessage.action}</span>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </>
            )}
          </button>
        </div>

        {/* Contextual information */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium opacity-90">
          {batteryInfo && batteryInfo.level <= 50 && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>
                Battery: {batteryInfo.level}%
                {batteryInfo.charging && " (charging)"}
              </span>
            </div>
          )}
          
          {nearbyHubs !== null && userLocation && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{nearbyHubs} hubs within 10 mi</span>
            </div>
          )}
          
          {openHubs && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{openHubs} open now</span>
            </div>
          )}
        </div>

        {/* Surprise and delight message */}
        {showDelightMessage && (
          <div className="mt-6 animate-fade-in-up">
            <div className="inline-block px-6 py-3 bg-white/10 rounded-full backdrop-blur-sm">
              <p className="text-sm font-medium">
                🌟 4 neighbors found help here today
              </p>
            </div>
          </div>
        )}

        {/* Emergency factors (for development/debugging) */}
        {process.env.NODE_ENV === 'development' && context.factors.length > 0 && (
          <div className="mt-8 text-xs opacity-60">
            <details>
              <summary className="cursor-pointer">Debug: Emergency factors detected</summary>
              <ul className="mt-2 space-y-1">
                {context.factors.map((factor, index) => (
                  <li key={index}>• {factor}</li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};