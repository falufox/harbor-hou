import React from 'react';
import { getServiceInfo } from '../utils/hubUtils';
import type { Service } from '../types';

interface ServiceIconsProps {
  services: Service[];
  limit?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  language?: 'en' | 'es';
}

export const ServiceIcons: React.FC<ServiceIconsProps> = ({
  services,
  limit = 5,
  size = 'md',
  showLabels = false,
  language = 'en'
}) => {
  const displayServices = services.slice(0, limit);
  const hasMore = services.length > limit;

  const sizeClasses = {
    sm: showLabels ? 'text-xs' : 'text-sm',
    md: showLabels ? 'text-sm' : 'text-base', 
    lg: showLabels ? 'text-base' : 'text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  if (showLabels) {
    return (
      <div className="flex flex-wrap gap-2">
        {displayServices.map((service) => {
          const serviceInfo = getServiceInfo(service);
          const label = language === 'es' ? serviceInfo.labelEs : serviceInfo.label;
          
          return (
            <div
              key={service}
              className={`
                flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md
                ${sizeClasses[size]}
              `}
              title={label}
            >
              <span className={iconSizeClasses[size]} aria-hidden="true">
                {serviceInfo.icon}
              </span>
              <span className="text-gray-700">{label}</span>
            </div>
          );
        })}
        {hasMore && (
          <div
            className={`
              px-2 py-1 bg-gray-100 rounded-md text-gray-500
              ${sizeClasses[size]}
            `}
            title={`+${services.length - limit} more services`}
          >
            +{services.length - limit} more
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {displayServices.map((service) => {
        const serviceInfo = getServiceInfo(service);
        const label = language === 'es' ? serviceInfo.labelEs : serviceInfo.label;
        
        return (
          <span
            key={service}
            className={`${sizeClasses[size]} ${iconSizeClasses[size]}`}
            title={label}
            aria-label={label}
            role="img"
          >
            {serviceInfo.icon}
          </span>
        );
      })}
      {hasMore && (
        <span
          className={`text-gray-400 ${sizeClasses[size]}`}
          title={`${services.length - limit} more services available`}
          aria-label={`${services.length - limit} additional services`}
        >
          +{services.length - limit}
        </span>
      )}
    </div>
  );
};