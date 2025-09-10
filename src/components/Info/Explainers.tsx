import React from 'react';

/**
 * Educational content explaining bonds, yields, and mortgage rates in plain English
 */
export function Explainers() {
  const sections = [
    {
      title: 'What is the 10-Year Treasury Yield?',
      content: `The 10-Year Treasury yield is the interest rate the U.S. government pays to borrow money for 10 years. 
        Think of it as the "baseline" interest rate for the economy. When investors are nervous about the future, 
        they buy Treasury bonds (driving yields down). When they're optimistic about growth and inflation, 
        they demand higher yields.`,
      icon: '📊',
    },
    {
      title: 'How Do Mortgage Rates Connect to Treasury Yields?',
      content: `Mortgage rates typically move in the same direction as Treasury yields, but they're always higher. 
        This is because lenders need to cover their costs and risks. The "spread" is this extra amount - 
        usually 1.5% to 2.5% for most borrowers. Prime borrowers get lower spreads; higher-risk borrowers pay more.`,
      icon: '🏠',
    },
    {
      title: 'Why the Fed Rate Doesn\'t Directly Set Mortgage Rates',
      content: `The Federal Reserve sets short-term rates (overnight lending), but mortgages are long-term loans. 
        Mortgage rates care more about long-term economic expectations, inflation outlook, and bond market sentiment. 
        That's why mortgage rates can sometimes go up even when the Fed cuts rates.`,
      icon: '🏦',
    },
    {
      title: 'Understanding the Estimates',
      content: `Our estimated mortgage rate adds your selected spread to the current 10-Year Treasury yield. 
        This gives you a rough idea of rate trends, but actual mortgage rates depend on many factors: 
        your credit score, down payment, loan type, lender fees, and current market conditions.`,
      icon: '🎯',
    },
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Understanding Bond and Mortgage Rate Relationships
      </h3>
      
      <div className="space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="border-l-4 border-primary-200 pl-4 py-2"
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl" role="img" aria-hidden="true">
                {section.icon}
              </span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {section.title}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Treasury yields tend to rise with economic growth and inflation expectations</li>
          <li>• Mortgage spreads widen during uncertain times (like 2008 or 2020)</li>
          <li>• Your actual rate depends on credit score, down payment, and loan terms</li>
          <li>• Rate locks typically last 30-60 days when you apply for a mortgage</li>
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          <strong>Educational Only:</strong> This information is for learning purposes and should not 
          be considered financial advice. Always consult with qualified mortgage professionals for 
          actual rate quotes and loan decisions.
        </p>
      </div>
    </div>
  );
}
