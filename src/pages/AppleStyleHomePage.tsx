import React, { useState, useRef, useEffect } from 'react';
import { Search, RotateCcw, AlertCircle, Sliders } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useHubs } from '../hooks/useHubs';
import { useEmergencyContext } from '../hooks/useEmergencyContext';
import { AppleStyleHero } from '../components/AppleStyleHero';
import { EnhancedHubCard } from '../components/EnhancedHubCard';
import { FilterChips } from '../components/FilterChips';

export const AppleStyleHomePage: React.FC = () => {
  const { 
    userLocation
  } = useLocation();
  
  const { 
    hubs, 
    loading, 
    error, 
    filter, 
    updateFilter, 
    toggleService, 
    refresh,
    openHubs,
    nearbyHubs 
  } = useHubs();

  const { isEmergencyDetected, emergencyFactors } = useEmergencyContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [smartMode, setSmartMode] = useState(true);
  const [stressLevel, setStressLevel] = useState<'low' | 'medium' | 'high'>('medium');
  
  const heroRef = useRef<HTMLDivElement>(null);

  // Apple-style stress detection (simulated)
  useEffect(() => {
    const detectStress = () => {
      // In a real app, this would use HealthKit/Google Fit data
      const timeOfDay = new Date().getHours();
      const isNightTime = timeOfDay > 22 || timeOfDay < 6;
      const hasEmergency = isEmergencyDetected;
      
      if (hasEmergency || isNightTime) {
        setStressLevel('high');
      } else if (emergencyFactors.length > 1) {
        setStressLevel('medium');
      } else {
        setStressLevel('low');
      }
    };

    detectStress();
  }, [isEmergencyDetected, emergencyFactors]);

  // Apple-style smart filtering based on context
  const getSmartFilteredHubs = () => {
    if (!smartMode) return hubs;

    // Prioritize based on emergency context and stress level
    return hubs.sort((a, b) => {
      // Prioritize open hubs
      if (a.open_state === 'open' && b.open_state !== 'open') return -1;
      if (b.open_state === 'open' && a.open_state !== 'open') return 1;

      // Prioritize closer hubs when stressed
      if (stressLevel === 'high' && a.distance && b.distance) {
        return a.distance - b.distance;
      }

      // Prioritize recently verified hubs
      const aTime = new Date(a.last_verified).getTime();
      const bTime = new Date(b.last_verified).getTime();
      return bTime - aTime;
    }).slice(0, stressLevel === 'high' ? 3 : 6); // Show fewer options when stressed
  };

  const smartFilteredHubs = getSmartFilteredHubs();

  const filteredHubsBySearch = smartFilteredHubs.filter(hub =>
    searchQuery === '' ||
    hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hub.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hubCounts = {
    open: openHubs,
    withCooling: hubs.filter(h => h.services_active.includes('cooling_room')).length,
    withCharging: hubs.filter(h => h.services_active.includes('device_charging')).length,
    withWifi: hubs.filter(h => h.services_active.includes('wifi')).length,
    withWater: hubs.filter(h => h.services_active.includes('potable_water')).length,
    accessible: hubs.filter(h => h.accessible).length,
    petFriendly: hubs.filter(h => h.pet_friendly).length
  };

  const handleFindHelp = () => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  const getStressAwareColors = () => {
    switch (stressLevel) {
      case 'high':
        return 'bg-gradient-to-br from-red-50 to-orange-50';
      case 'medium':
        return 'bg-gradient-to-br from-blue-50 to-indigo-50';
      default:
        return 'bg-gradient-to-br from-green-50 to-blue-50';
    }
  };

  return (
    <div className={`min-h-screen ${getStressAwareColors()} transition-colors duration-1000`}>
      {/* Apple-style hero section */}
      <div ref={heroRef}>
        <AppleStyleHero
          onFindHelp={handleFindHelp}
          nearbyHubs={nearbyHubs || undefined}
          openHubs={openHubs}
        />
      </div>

      {/* Adaptive interface based on stress level */}
      {stressLevel !== 'high' && (
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            {/* Search bar - hidden when highly stressed */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  backdrop-blur-sm transition-all duration-300
                "
              />
            </div>

            {/* Smart mode toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smartMode}
                    onChange={(e) => setSmartMode(e.target.checked)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Smart recommendations
                  </span>
                </label>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <button
                onClick={refresh}
                disabled={loading}
                className="
                  flex items-center gap-2 px-4 py-2 text-sm font-medium
                  text-gray-600 hover:text-gray-900 
                  bg-white/50 hover:bg-white/80 
                  border border-gray-200 rounded-xl
                  transition-all duration-300
                "
              >
                <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Filters - collapsed by default */}
            {showFilters && (
              <div className="animate-fade-in-up">
                <FilterChips
                  filter={filter}
                  onUpdateFilter={updateFilter}
                  onToggleService={toggleService}
                  hubCounts={hubCounts}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content with stress-aware layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error state with calming design */}
        {error && (
          <div className="mb-6 p-6 bg-red-50 border border-red-100 rounded-3xl">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-red-900">We're having trouble loading hubs</h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state with calming animation */}
        {loading && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full animate-heartbeat"></div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Finding help near you</h3>
            <p className="text-gray-600">We're locating the best resources...</p>
          </div>
        )}

        {/* Results with Apple-style presentation */}
        {!loading && !error && (
          <>
            {/* Results header with smart context */}
            <div className="mb-8">
              <div className="text-center">
                {smartMode && stressLevel === 'high' ? (
                  <h2 className="text-2xl font-system text-gray-900 mb-2">
                    🏠 Here's immediate help nearby
                  </h2>
                ) : (
                  <h2 className="text-2xl font-system text-gray-900 mb-2">
                    {filteredHubsBySearch.length === 0 
                      ? 'No matches found'
                      : `${filteredHubsBySearch.length} ${filteredHubsBySearch.length === 1 ? 'place' : 'places'} ready to help`
                    }
                  </h2>
                )}
                
                {smartMode && (
                  <p className="text-gray-600">
                    {stressLevel === 'high' 
                      ? 'Showing closest options for quick help'
                      : 'Personalized recommendations based on your needs'
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Hub cards with ranking for community features */}
            {filteredHubsBySearch.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-8xl mb-6">🏢</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  No hubs match your search
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or clearing filters
                </p>
                <button
                  onClick={() => {
                    updateFilter({ 
                      openNow: false, 
                      services: [], 
                      accessible: false, 
                      petFriendly: false 
                    });
                    setSearchQuery('');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white rounded-2xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Show all hubs
                </button>
              </div>
            ) : (
              <div className={`
                grid gap-6
                ${stressLevel === 'high' 
                  ? 'grid-cols-1 max-w-2xl mx-auto' 
                  : 'grid-cols-1 lg:grid-cols-2'
                }
              `}>
                {filteredHubsBySearch.map((hub, index) => (
                  <EnhancedHubCard
                    key={hub.id}
                    hub={hub}
                    showDistance={!!userLocation}
                    rank={index + 1}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Apple-style footer with community message */}
        {!loading && !error && filteredHubsBySearch.length > 0 && (
          <div className="mt-16 text-center">
            <div className="inline-block p-6 bg-white/50 rounded-3xl backdrop-blur-sm">
              <p className="text-gray-600 leading-relaxed">
                💙 <strong>Harbor HOU</strong> connects you with community resources.<br />
                <span className="text-sm">Your safety and wellbeing matter to us.</span>
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};