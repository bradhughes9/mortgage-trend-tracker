import React from 'react';
import { formatLastUpdated } from '../../lib/format';

interface HeaderProps {
  lastUpdated?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

/**
 * Main header component with title and last updated timestamp
 */
export function Header({ lastUpdated, onRefresh, isLoading = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Bond → Mortgage Dashboard
            </h1>
            <div className="hidden sm:block">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Treasury Data
              </span>
            </div>
          </div>
          
          {/* Status and controls */}
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500">
                <span className="hidden sm:inline">Last updated: </span>
                <span className="font-medium">
                  {formatLastUpdated(lastUpdated)}
                </span>
              </div>
            )}
            
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh data"
              >
                <svg
                  className={`-ml-0.5 mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="hidden sm:inline">
                  {isLoading ? 'Updating...' : 'Refresh'}
                </span>
              </button>
            )}
            
            {/* TODO: Theme toggle placeholder */}
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
