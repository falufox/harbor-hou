import React from 'react';
import { getStatusInfo } from '../utils/hubUtils';

interface StatusPillProps {
  status: string;
  language?: 'en' | 'es';
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({ 
  status, 
  language = 'en',
  size = 'md',
  showIcon = true 
}) => {
  const statusInfo = getStatusInfo(status);
  const label = language === 'es' ? statusInfo.labelEs : statusInfo.label;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return '🟢';
      case 'at_capacity':
      case 'open_limited':
        return '🟡';
      case 'closed':
        return '🔴';
      case 'planned_open':
        return '🟠';
      default:
        return '⚪';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-open/10 text-open border-open/20';
      case 'at_capacity':
      case 'open_limited':
        return 'bg-at-capacity/10 text-at-capacity border-at-capacity/20';
      case 'closed':
        return 'bg-closed/10 text-closed border-closed/20';
      case 'planned_open':
        return 'bg-muted/10 text-muted border-muted/20';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <span 
      className={`
        inline-flex items-center rounded-full border font-medium
        ${sizeClasses[size]}
        ${getStatusClass(status)}
      `}
      role="status"
      aria-label={`Hub status: ${label}`}
    >
      {showIcon && (
        <span className="mr-1" aria-hidden="true">
          {getStatusIcon(status)}
        </span>
      )}
      {label}
    </span>
  );
};