import React from 'react';
import { formatPercent, formatDelta } from '../../lib/format';

interface StatCardProps {
  title: string;
  value: number;
  unit?: string;
  delta?: number;
  previousValue?: number;
  isLoading?: boolean;
  subtitle?: string;
  badge?: string;
  className?: string;
}

/**
 * Generic card component for displaying large statistical values with deltas
 */
export function StatCard({
  title,
  value,
  unit = '%',
  delta,
  previousValue,
  isLoading = false,
  subtitle,
  badge,
  className = '',
}: StatCardProps) {
  const deltaInfo = delta !== undefined ? formatDelta(delta) : null;

  return (
    <div className={`card card-hover p-6 ${className}`}>
      {/* Header with title and optional badge */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="stat-label">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {badge && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {badge}
          </span>
        )}
      </div>

      {/* Main value */}
      <div className="flex items-baseline space-x-2 mb-2">
        {isLoading ? (
          <div className="stat-number bg-gray-200 animate-pulse rounded h-10 w-24"></div>
        ) : (
          <>
            <span className="stat-number text-gray-900">
              {value.toFixed(2)}
            </span>
            {unit && (
              <span className="text-lg font-medium text-gray-600">{unit}</span>
            )}
          </>
        )}
      </div>

      {/* Delta indicator */}
      {deltaInfo && !isLoading && (
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${deltaInfo.className}`}>
            {deltaInfo.sign === 'positive' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {deltaInfo.sign === 'negative' && (
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            )}
            {deltaInfo.text}{unit}
          </span>
          {previousValue && (
            <span className="text-xs text-gray-500">
              vs {formatPercent(previousValue)}
            </span>
          )}
        </div>
      )}

      {/* Loading state for delta */}
      {isLoading && (
        <div className="h-5 bg-gray-200 animate-pulse rounded w-20 mt-2"></div>
      )}
    </div>
  );
}
