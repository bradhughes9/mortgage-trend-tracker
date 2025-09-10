import React from 'react';

interface DeltaBadgeProps {
  value: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

/**
 * Badge component for displaying change indicators with appropriate colors
 */
export function DeltaBadge({
  value,
  unit = '%',
  size = 'md',
  showIcon = true,
}: DeltaBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getClasses = () => {
    const baseClasses = `inline-flex items-center rounded-full font-medium ${sizeClasses[size]}`;
    
    if (isPositive) {
      return `${baseClasses} delta-positive`;
    }
    if (isNegative) {
      return `${baseClasses} delta-negative`;
    }
    return `${baseClasses} delta-neutral`;
  };

  const formatValue = () => {
    const prefix = isPositive ? '+' : '';
    return `${prefix}${value.toFixed(2)}${unit}`;
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    if (isPositive) {
      return (
        <svg
          className={`${iconSize[size]} mr-1`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    if (isNegative) {
      return (
        <svg
          className={`${iconSize[size]} mr-1`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <svg
        className={`${iconSize[size]} mr-1`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <span className={getClasses()} aria-label={`Change: ${formatValue()}`}>
      {renderIcon()}
      {formatValue()}
    </span>
  );
}
