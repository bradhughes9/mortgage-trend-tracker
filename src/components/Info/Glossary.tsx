import React, { useState } from 'react';

interface GlossaryTerm {
  term: string;
  definition: string;
  example?: string;
}

/**
 * Expandable glossary of financial terms used in the dashboard
 */
export function Glossary() {
  const [isExpanded, setIsExpanded] = useState(false);

  const terms: GlossaryTerm[] = [
    {
      term: 'Bond',
      definition: 'An IOU from a government or company. When you buy a bond, you\'re lending money and earning interest.',
      example: 'A 10-year Treasury bond means you lend money to the U.S. government for 10 years.',
    },
    {
      term: 'Yield',
      definition: 'The annual return you get from a bond, expressed as a percentage. Higher yields mean higher returns.',
      example: 'A 4.5% yield means you earn $45 per year for every $1,000 invested.',
    },
    {
      term: 'Spread',
      definition: 'The extra interest rate lenders charge above a benchmark rate to cover costs and risk.',
      example: 'If Treasury yields 4% and your mortgage is 6.5%, the spread is 2.5%.',
    },
    {
      term: 'Mortgage-Backed Security (MBS)',
      definition: 'Bonds created by bundling many mortgages together. These compete with Treasury bonds for investor money.',
      example: 'When MBS yields rise, mortgage rates typically rise too.',
    },
    {
      term: 'Duration',
      definition: 'How sensitive a bond\'s price is to interest rate changes. Longer duration = more price volatility.',
      example: 'A 30-year mortgage has longer duration than a 5-year loan, so rates change more.',
    },
    {
      term: 'Federal Funds Rate',
      definition: 'The overnight interest rate set by the Federal Reserve. It mainly affects short-term rates.',
      example: 'The Fed rate influences credit cards and car loans more than mortgage rates.',
    },
    {
      term: 'Basis Point',
      definition: 'One hundredth of a percentage point (0.01%). Financial professionals use this for precision.',
      example: 'If rates go from 6.00% to 6.25%, that\'s a 25 basis point increase.',
    },
    {
      term: 'Rate Lock',
      definition: 'A guarantee from your lender that your mortgage rate won\'t change for a specific period.',
      example: 'A 60-day rate lock protects you if rates rise while your loan is processed.',
    },
  ];

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Financial Terms Glossary
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md"
          aria-expanded={isExpanded}
          aria-controls="glossary-content"
        >
          {isExpanded ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Hide
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show All Definitions
            </>
          )}
        </button>
      </div>

      {/* Quick preview when collapsed - show key terms inline */}
      {!isExpanded && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Quick definitions for key terms:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {terms.slice(0, 4).map((item, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-gray-900">{item.term}:</span>{' '}
                <span className="text-gray-600">{item.definition.split('.')[0]}.</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Click "Show All Definitions" for {terms.length - 4} more terms with examples.
          </p>
        </div>
      )}

      {/* Full glossary content */}
      {isExpanded && (
        <div id="glossary-content" className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Financial terms explained in plain English, without the jargon.
          </p>
          
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {terms.map((item, index) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">
                  {item.term}
                </h4>
                <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                  {item.definition}
                </p>
                {item.example && (
                  <p className="text-xs text-gray-500 italic">
                    Example: {item.example}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Additional resources */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              📚 Want to Learn More?
            </h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                • <a href="https://www.investopedia.com/terms/b/bond.asp" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                  Investopedia Bond Basics
                </a>
              </p>
              <p>
                • <a href="https://fred.stlouisfed.org/series/DGS10" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                  FRED 10-Year Treasury Data
                </a>
              </p>
              <p>
                • <a href="https://www.consumerfinance.gov/owning-a-home/process/compare/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 underline">
                  CFPB Mortgage Shopping Guide
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
