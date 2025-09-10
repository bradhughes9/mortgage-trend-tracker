import { formatPercent } from '../../lib/format';

interface InflationCardProps {
  title: string;
  subtitle: string;
  value: number;
  annualRate: number;
  delta?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * Card component for displaying inflation statistics
 */
export function InflationCard({
  title,
  subtitle,
  value,
  annualRate,
  delta,
  isLoading = false,
  className = "bg-white",
}: InflationCardProps): JSX.Element {
  const formatValue = (num: number): string => {
    return num.toFixed(1);
  };

  const getDeltaColor = (delta?: number): string => {
    if (!delta) return 'text-gray-500';
    return delta > 0 ? 'text-red-500' : 'text-green-500';
  };

  const getDeltaIcon = (delta?: number): string => {
    if (!delta) return '';
    return delta > 0 ? '↗' : '↘';
  };

  const getInflationColor = (rate: number): string => {
    if (rate < 2) return 'text-green-600';
    if (rate < 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Index
        </span>
      </div>
      
      <div className="flex items-baseline space-x-3 mb-2">
        <span className="text-2xl font-bold text-gray-900">
          {formatValue(value)}
        </span>
        {delta !== undefined && (
          <span className={`text-sm font-medium ${getDeltaColor(delta)}`}>
            {getDeltaIcon(delta)} {Math.abs(delta).toFixed(1)}
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-gray-600">{subtitle}</p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Annual Rate:</span>
          <span className={`text-sm font-semibold ${getInflationColor(annualRate)}`}>
            {formatPercent(annualRate)}
          </span>
          {annualRate > 2 && (
            <span className="text-xs text-red-500">Above Fed Target</span>
          )}
        </div>
      </div>
    </div>
  );
}
