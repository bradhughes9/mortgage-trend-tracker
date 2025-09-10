import React from 'react';

interface TreasuryCardProps {
  value: number;
  delta?: number;
  previousValue?: number;
  isLoading?: boolean;
}

/**
 * External link icon component
 */
const ExternalLinkIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
);

/**
 * Full-width Treasury card with CNBC link
 */
export function TreasuryCard({
  value,
  delta,
  previousValue,
  isLoading = false,
}: TreasuryCardProps): JSX.Element {
  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`;
  };

  const getDeltaColor = (delta?: number): string => {
    if (!delta) return 'text-gray-500';
    return delta > 0 ? 'text-red-500' : 'text-green-500';
  };

  const getDeltaIcon = (delta?: number): string => {
    if (!delta) return '';
    return delta > 0 ? '↗' : '↘';
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 bg-blue-50 border-blue-200">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              10-Year Treasury Yield
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Benchmark Rate
            </span>
          </div>
          
          <div className="flex items-baseline space-x-3 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPercentage(value)}
            </span>
            {delta !== undefined && (
              <span className={`text-sm font-medium ${getDeltaColor(delta)}`}>
                {getDeltaIcon(delta)} {Math.abs(delta).toFixed(2)}%
                {previousValue && (
                  <span className="text-gray-500 ml-1">
                    (from {formatPercentage(previousValue)})
                  </span>
                )}
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600">
            The 10-Year Treasury yield serves as the benchmark for long-term interest rates 
            and is the foundation for mortgage rate pricing.
          </p>
        </div>

        {/* CNBC Link */}
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <a
            href="https://www.cnbc.com/quotes/US10Y"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ExternalLinkIcon />
            <span className="ml-2">Live Rate on CNBC</span>
          </a>
          <p className="text-xs text-gray-500 mt-1 text-center">
            Real-time market data
          </p>
        </div>
      </div>
      
      {/* Data source note */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-600">
          <strong>Dashboard Data:</strong> FRED daily closing rates (updated after market close) • 
          <strong>CNBC Link:</strong> Live intraday trading data • 
          <strong>For Mortgages:</strong> Lenders typically use end-of-day Treasury rates for pricing
        </p>
      </div>
    </div>
  );
}
