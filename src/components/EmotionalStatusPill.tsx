import React from 'react';
import { Heart, Users, Clock, AlertTriangle } from 'lucide-react';

interface EmotionalStatusPillProps {
  status: string;
  language?: 'en' | 'es';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  distance?: number;
  lastVerified?: string;
}

export const EmotionalStatusPill: React.FC<EmotionalStatusPillProps> = ({ 
  status, 
  language = 'en',
  size = 'md',
  showIcon = true,
  distance,
  lastVerified
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const getEmotionalStatus = (status: string) => {
    const recentlyVerified = lastVerified ? 
      (Date.now() - new Date(lastVerified).getTime()) < (2 * 60 * 60 * 1000) : true;

    switch (status) {
      case 'open':
        return {
          en: {
            icon: <Heart className="w-4 h-4" />,
            label: 'Ready to help',
            sublabel: distance ? `${distance.toFixed(1)} mi away` : 'Open now',
            color: 'bg-gradient-to-r from-green-400 to-emerald-500',
            textColor: 'text-white',
            pulse: true
          },
          es: {
            icon: <Heart className="w-4 h-4" />,
            label: 'Listo para ayudar',
            sublabel: distance ? `${distance.toFixed(1)} mi` : 'Abierto ahora',
            color: 'bg-gradient-to-r from-green-400 to-emerald-500',
            textColor: 'text-white',
            pulse: true
          }
        };
      
      case 'at_capacity':
        return {
          en: {
            icon: <Users className="w-4 h-4" />,
            label: 'Almost full, but room for you',
            sublabel: 'Consider nearby alternatives',
            color: 'bg-gradient-to-r from-amber-400 to-orange-500',
            textColor: 'text-white',
            pulse: false
          },
          es: {
            icon: <Users className="w-4 h-4" />,
            label: 'Casi lleno, pero hay espacio',
            sublabel: 'Considere alternativas cercanas',
            color: 'bg-gradient-to-r from-amber-400 to-orange-500',
            textColor: 'text-white',
            pulse: false
          }
        };

      case 'open_limited':
        return {
          en: {
            icon: <AlertTriangle className="w-4 h-4" />,
            label: 'Limited help available',
            sublabel: 'Some services may be reduced',
            color: 'bg-gradient-to-r from-yellow-400 to-amber-500',
            textColor: 'text-white',
            pulse: false
          },
          es: {
            icon: <AlertTriangle className="w-4 h-4" />,
            label: 'Ayuda limitada disponible',
            sublabel: 'Algunos servicios reducidos',
            color: 'bg-gradient-to-r from-yellow-400 to-amber-500',
            textColor: 'text-white',
            pulse: false
          }
        };

      case 'planned_open':
        return {
          en: {
            icon: <Clock className="w-4 h-4" />,
            label: 'Opening soon for you',
            sublabel: 'We\'ll be ready when you need us',
            color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
            textColor: 'text-white',
            pulse: true
          },
          es: {
            icon: <Clock className="w-4 h-4" />,
            label: 'Abriendo pronto para ti',
            sublabel: 'Estaremos listos cuando nos necesites',
            color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
            textColor: 'text-white',
            pulse: true
          }
        };

      case 'closed':
      default:
        return {
          en: {
            icon: <Clock className="w-4 h-4" />,
            label: 'Resting for now',
            sublabel: recentlyVerified ? 'Will open when needed' : 'Check status later',
            color: 'bg-gradient-to-r from-gray-400 to-gray-500',
            textColor: 'text-white',
            pulse: false
          },
          es: {
            icon: <Clock className="w-4 h-4" />,
            label: 'Descansando por ahora',
            sublabel: recentlyVerified ? 'Abrirá cuando sea necesario' : 'Verifique el estado más tarde',
            color: 'bg-gradient-to-r from-gray-400 to-gray-500',
            textColor: 'text-white',
            pulse: false
          }
        };
    }
  };

  const statusInfo = getEmotionalStatus(status)[language];

  return (
    <div 
      className={`
        inline-flex flex-col items-start rounded-2xl font-medium shadow-lg border border-white/20
        ${sizeClasses[size]}
        ${statusInfo.color}
        ${statusInfo.textColor}
        ${statusInfo.pulse ? 'animate-pulse' : ''}
        backdrop-blur-sm
        transform transition-all duration-300 hover:scale-105 hover:shadow-xl
      `}
      role="status"
      aria-label={`Hub status: ${statusInfo.label}. ${statusInfo.sublabel}`}
    >
      <div className="flex items-center gap-2">
        {showIcon && (
          <span aria-hidden="true" className="flex-shrink-0">
            {statusInfo.icon}
          </span>
        )}
        <span className="font-semibold leading-tight">
          {statusInfo.label}
        </span>
      </div>
      
      {statusInfo.sublabel && (
        <span className="text-xs opacity-90 mt-0.5 leading-tight">
          {statusInfo.sublabel}
        </span>
      )}
    </div>
  );
};