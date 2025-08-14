import React, { useState } from 'react';
import { Search, MapPin, RotateCcw, AlertCircle } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';
import { useHubs } from '../hooks/useHubs';
import { HubCard } from '../components/HubCard';
import { FilterChips } from '../components/FilterChips';

export const HomePage: React.FC = () => {
  const { 
    userLocation, 
    locationError, 
    isLoadingLocation, 
    requestLocation, 
    clearLocationError 
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
    totalHubs,
    nearbyHubs 
  } = useHubs();

  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Calculate filter counts for display
  const hubCounts = {
    open: openHubs,
    withCooling: hubs.filter(h => h.services_active.includes('cooling_room')).length,
    withCharging: hubs.filter(h => h.services_active.includes('device_charging')).length,
    withWifi: hubs.filter(h => h.services_active.includes('wifi')).length,
    withWater: hubs.filter(h => h.services_active.includes('potable_water')).length,
    accessible: hubs.filter(h => h.accessible).length,
    petFriendly: hubs.filter(h => h.pet_friendly).length
  };

  const handleLocationRequest = () => {
    clearLocationError();
    requestLocation();
  };

  const filteredHubsBySearch = hubs.filter(hub =>
    searchQuery === '' ||
    hub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hub.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Harbor HOU</h1>
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Refresh hub data"
            >
              <RotateCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <p className="text-blue-100 text-lg mb-4">
            Find nearby resilience hubs during emergencies
          </p>

          {/* Quick stats */}
          <div className="flex gap-4 text-sm text-blue-100">
            <div>
              <span className="font-medium text-white">{openHubs}</span> open now
            </div>
            {nearbyHubs !== null && (
              <div>
                <span className="font-medium text-white">{nearbyHubs}</span> within 10 mi
              </div>
            )}
            <div>
              <span className="font-medium text-white">{totalHubs}</span> total hubs
            </div>
          </div>
        </div>
      </header>

      {/* Search and Location */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by hub name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Location section */}
          <div className="space-y-2">
            {!userLocation && !locationError && (
              <button
                onClick={handleLocationRequest}
                disabled={isLoadingLocation}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                {isLoadingLocation ? 'Getting your location...' : 'Use my location'}
              </button>
            )}

            {locationError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800">{locationError}</p>
                    <button
                      onClick={handleLocationRequest}
                      className="text-sm text-yellow-700 hover:text-yellow-900 underline mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {userLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Location found - showing hubs sorted by distance
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <FilterChips
            filter={filter}
            onUpdateFilter={updateFilter}
            onToggleService={toggleService}
            hubCounts={hubCounts}
          />
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading resilience hubs...</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredHubsBySearch.length === 0 
                  ? 'No hubs found'
                  : `${filteredHubsBySearch.length} ${filteredHubsBySearch.length === 1 ? 'hub' : 'hubs'} found`
                }
              </h2>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMap(false)}
                  className={`px-3 py-1 rounded text-sm ${
                    !showMap 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setShowMap(true)}
                  className={`px-3 py-1 rounded text-sm ${
                    showMap 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>

            {/* Hub list */}
            {!showMap && (
              <div className="space-y-4">
                {filteredHubsBySearch.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏢</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No hubs match your criteria
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
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
                      className="btn-secondary"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredHubsBySearch.map((hub) => (
                      <HubCard
                        key={hub.id}
                        hub={hub}
                        showDistance={!!userLocation}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map view placeholder */}
            {showMap && (
              <div className="bg-gray-100 rounded-lg p-12 text-center">
                <div className="text-gray-400 text-6xl mb-4">🗺️</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Map View Coming Soon
                </h3>
                <p className="text-gray-600">
                  Interactive map with hub locations will be available here
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};