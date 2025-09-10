import React from 'react';

interface FooterProps {
  onExportCsv?: () => void;
}

/**
 * Footer component with data sources and export functionality
 */
export function Footer({ onExportCsv }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Data sources */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Data Sources:</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a
                href="https://fred.stlouisfed.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                FRED (Federal Reserve)
              </a>
              <a
                href="https://home.treasury.gov/resource-center/data-chart-center/interest-rates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
              >
                U.S. Treasury (XML)
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {onExportCsv && (
              <button
                onClick={onExportCsv}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-0.5 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            <strong>Disclaimer:</strong> This information is for educational purposes only 
            and should not be considered financial advice. Mortgage rate estimates are 
            approximations based on Treasury data and may not reflect actual market rates. 
            Consult with qualified financial professionals for investment decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
