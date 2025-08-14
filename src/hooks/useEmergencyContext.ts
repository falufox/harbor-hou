import { useState, useEffect } from 'react';

export type EmergencyType = 'heat' | 'cold' | 'power' | 'flooding' | 'general' | 'overnight';

interface EmergencyContext {
  type: EmergencyType;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
}

interface BatteryInfo {
  level: number;
  charging: boolean;
}

export const useEmergencyContext = () => {
  const [context, setContext] = useState<EmergencyContext>({
    type: 'general',
    urgency: 'medium',
    confidence: 0.5,
    factors: []
  });

  const [batteryInfo, setBatteryInfo] = useState<BatteryInfo | null>(null);

  useEffect(() => {
    const detectEmergencyContext = async () => {
      const factors: string[] = [];
      let type: EmergencyType = 'general';
      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let confidence = 0.5;

      // Time-based detection
      const now = new Date();
      const hour = now.getHours();
      const month = now.getMonth(); // 0-11

      // Houston summer months (May-September are hottest)
      const isSummerMonth = month >= 4 && month <= 8;
      
      // Overnight hours
      if (hour >= 22 || hour <= 6) {
        type = 'overnight';
        factors.push('Late night/early morning hours');
        confidence += 0.2;
      }

      // Summer heat detection
      if (isSummerMonth && hour >= 10 && hour <= 19) {
        type = 'heat';
        urgency = 'high';
        factors.push('Houston summer heat period');
        confidence += 0.3;
      }

      // Winter cold detection (December-February)
      if ((month === 11 || month <= 1) && (hour <= 8 || hour >= 18)) {
        type = 'cold';
        factors.push('Houston winter cold period');
        confidence += 0.2;
      }

      // Battery level detection
      try {
        if ('getBattery' in navigator) {
          const battery = await (navigator as any).getBattery();
          const level = Math.round(battery.level * 100);
          const charging = battery.charging;
          
          setBatteryInfo({ level, charging });

          if (level <= 20 && !charging) {
            type = 'power';
            urgency = level <= 10 ? 'critical' : 'high';
            factors.push(`Low battery (${level}%)`);
            confidence += 0.4;
          } else if (level <= 50 && !charging) {
            factors.push(`Medium battery (${level}%)`);
            confidence += 0.1;
          }
        }
      } catch (error) {
        // Battery API not supported or blocked
      }

      // Network quality detection (poor network might indicate infrastructure issues)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          factors.push('Poor network connectivity');
          if (type === 'general') {
            type = 'power';
          }
          if (urgency === 'low') {
            urgency = 'medium';
          }
          confidence += 0.2;
        }
      }

      // Weather API simulation (in production, integrate with actual weather API)
      const simulateWeatherEmergency = () => {
        const weatherTypes = ['clear', 'hot', 'cold', 'flooding', 'severe'];
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        // For demo purposes, occasionally simulate weather emergencies
        if (Math.random() < 0.1) { // 10% chance for demo
          switch (randomWeather) {
            case 'hot':
              type = 'heat';
              urgency = 'critical';
              factors.push('Excessive heat warning in effect');
              confidence = 0.9;
              break;
            case 'flooding':
              type = 'flooding';
              urgency = 'high';
              factors.push('Flash flood warning');
              confidence = 0.8;
              break;
          }
        }
      };

      // Only simulate weather for demo if no clear emergency detected
      if (confidence < 0.7) {
        simulateWeatherEmergency();
      }

      setContext({
        type,
        urgency,
        confidence: Math.min(confidence, 1),
        factors
      });
    };

    detectEmergencyContext();

    // Re-evaluate context every 5 minutes
    const interval = setInterval(detectEmergencyContext, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getEmergencyMessage = () => {
    switch (context.type) {
      case 'heat':
        return {
          title: 'Stay Cool & Safe',
          subtitle: 'Find air conditioning and hydration nearby',
          action: 'Find Cooling Now',
          color: 'from-orange-500 to-red-500',
          emoji: '☀️'
        };
      case 'cold':
        return {
          title: 'Stay Warm & Dry',
          subtitle: 'Find heating and shelter nearby',
          action: 'Find Warmth Now',
          color: 'from-blue-400 to-blue-600',
          emoji: '❄️'
        };
      case 'power':
        return {
          title: 'Power Up & Connect',
          subtitle: 'Find charging stations and WiFi nearby',
          action: 'Find Power Now',
          color: 'from-yellow-400 to-orange-500',
          emoji: '🔋'
        };
      case 'flooding':
        return {
          title: 'Stay Safe & Dry',
          subtitle: 'Find higher ground and shelter',
          action: 'Find Safety Now',
          color: 'from-blue-600 to-blue-800',
          emoji: '🌊'
        };
      case 'overnight':
        return {
          title: 'Rest Safely Tonight',
          subtitle: 'Find overnight shelter and support',
          action: 'Find Shelter Now',
          color: 'from-purple-500 to-indigo-600',
          emoji: '🌙'
        };
      default:
        return {
          title: 'Help is Near',
          subtitle: 'Find the support you need nearby',
          action: 'Find Help Now',
          color: 'from-green-400 to-blue-500',
          emoji: '🏠'
        };
    }
  };

  return {
    context,
    batteryInfo,
    getEmergencyMessage,
    isEmergencyDetected: context.confidence > 0.6,
    emergencyFactors: context.factors
  };
};