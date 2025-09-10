import { formatPercent } from '../../lib/format';

interface InflationInsightsProps {
  cpiData?: Array<{ date: string; value: number }>;
  corePceData?: Array<{ date: string; value: number }>;
  isLoading?: boolean;
}

/**
 * Plain English inflation insights for regular people
 */
export function InflationInsights({
  cpiData = [],
  corePceData = [],
  isLoading = false,
}: InflationInsightsProps): JSX.Element {
  
  if (isLoading || cpiData.length === 0 || corePceData.length === 0) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get current and 12-month-ago data for annual rates
  const currentCPI = cpiData[cpiData.length - 1];
  const currentCorePCE = corePceData[corePceData.length - 1];
  
  // Calculate annual inflation rates (need at least 12 data points)
  const cpiYear = cpiData.length >= 12 ? cpiData[cpiData.length - 12] : currentCPI;
  const corePceYear = corePceData.length >= 12 ? corePceData[corePceData.length - 12] : currentCorePCE;
  
  const cpiAnnualRate = ((currentCPI.value - cpiYear.value) / cpiYear.value) * 100;
  const corePceAnnualRate = ((currentCorePCE.value - corePceYear.value) / corePceYear.value) * 100;

  // Calculate 3-month trend
  const recentCPI = cpiData.slice(-3);
  const recentCorePCE = corePceData.slice(-3);
  
  const cpiTrend = recentCPI.length >= 2 
    ? recentCPI[recentCPI.length - 1].value > recentCPI[0].value ? 'rising' : 'falling'
    : 'stable';
  
  const corePceTrend = recentCorePCE.length >= 2
    ? recentCorePCE[recentCorePCE.length - 1].value > recentCorePCE[0].value ? 'rising' : 'falling'
    : 'stable';

  // Generate insights
  const getInflationStatus = (rate: number) => {
    if (rate < 1) return { status: 'Very Low', color: 'text-blue-600', description: 'prices barely rising' };
    if (rate < 2) return { status: 'Low', color: 'text-green-600', description: 'healthy, controlled inflation' };
    if (rate < 3) return { status: 'Moderate', color: 'text-yellow-600', description: 'slightly above Fed target' };
    if (rate < 4) return { status: 'High', color: 'text-orange-600', description: 'concerning for consumers' };
    return { status: 'Very High', color: 'text-red-600', description: 'hurting household budgets' };
  };

  const cpiStatus = getInflationStatus(cpiAnnualRate);
  const corePceStatus = getInflationStatus(corePceAnnualRate);

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return '📈';
    if (trend === 'falling') return '📉';
    return '➡️';
  };

  const getMortgageImpact = (cpiRate: number, corePceRate: number) => {
    const avgRate = (cpiRate + corePceRate) / 2;
    if (avgRate > 3) {
      return {
        impact: 'Mortgage rates likely to stay HIGH',
        reason: 'Fed fighting inflation with higher rates',
        advice: 'Consider waiting or locking rates quickly',
        color: 'text-red-600'
      };
    } else if (avgRate < 2) {
      return {
        impact: 'Mortgage rates may come DOWN',
        reason: 'Fed can ease policy with low inflation',
        advice: 'Good time to shop for rates',
        color: 'text-green-600'
      };
    } else {
      return {
        impact: 'Mortgage rates likely STABLE',
        reason: 'Inflation near Fed target',
        advice: 'Normal market conditions',
        color: 'text-yellow-600'
      };
    }
  };

  const mortgageImpact = getMortgageImpact(cpiAnnualRate, corePceAnnualRate);

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        🧠 Inflation Insights - What This Means for You
      </h3>

      {/* Overall Status */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">📊 Current Inflation Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-600">Overall Prices (CPI):</span>
              <span className={`font-bold ${cpiStatus.color}`}>
                {formatPercent(cpiAnnualRate, 1)} - {cpiStatus.status}
              </span>
              <span>{getTrendIcon(cpiTrend)}</span>
            </div>
            <p className="text-sm text-gray-600">{cpiStatus.description}</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-600">Core Inflation (Fed's Focus):</span>
              <span className={`font-bold ${corePceStatus.color}`}>
                {formatPercent(corePceAnnualRate, 1)} - {corePceStatus.status}
              </span>
              <span>{getTrendIcon(corePceTrend)}</span>
            </div>
            <p className="text-sm text-gray-600">{corePceStatus.description}</p>
          </div>
        </div>
      </div>

      {/* Mortgage Impact */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-semibold text-yellow-900 mb-2">🏠 Impact on Your Mortgage Rates</h4>
        <div className="space-y-2">
          <p className={`font-semibold ${mortgageImpact.color}`}>
            {mortgageImpact.impact}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Why:</strong> {mortgageImpact.reason}
          </p>
          <p className="text-sm text-gray-700">
            <strong>What to do:</strong> {mortgageImpact.advice}
          </p>
        </div>
      </div>

      {/* Ohio Context */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-semibold text-green-900 mb-2">🏛️ Ohio Context</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Cost of Living:</strong> Ohio generally has lower costs than national average, 
            so {formatPercent(cpiAnnualRate, 1)} national inflation might feel like {formatPercent(cpiAnnualRate * 0.85, 1)} locally.
          </p>
          <p>
            <strong>Housing Market:</strong> Cleveland, Cincinnati, and Columbus metro areas typically see 
            different inflation pressures than coastal cities.
          </p>
        </div>
      </div>

      {/* Simple Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">🛒 What is CPI?</h5>
          <p className="text-sm text-gray-700">
            Measures how much more expensive a "basket" of everyday items (food, gas, housing) 
            costs compared to last year. If it's {formatPercent(cpiAnnualRate, 1)}, 
            things that cost $100 last year now cost ${(100 * (1 + cpiAnnualRate/100)).toFixed(0)}.
          </p>
        </div>
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <h5 className="font-semibold text-gray-900 mb-2">🎯 What is Core PCE?</h5>
          <p className="text-sm text-gray-700">
            The Federal Reserve's preferred inflation measure. Excludes volatile food and energy prices 
            to show underlying inflation trends. This is what the Fed uses to decide interest rates.
          </p>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-6 p-4 border-2 border-primary-200 bg-primary-50 rounded-lg">
        <h4 className="font-bold text-primary-900 mb-2">💡 Bottom Line for Your Wallet</h4>
        <div className="text-sm space-y-1">
          {cpiAnnualRate > 3 && (
            <p className="text-red-700">
              • Your money is losing purchasing power faster than usual
            </p>
          )}
          {cpiAnnualRate < 2 && (
            <p className="text-green-700">
              • Price increases are manageable and under control
            </p>
          )}
          {corePceAnnualRate > 2.5 && (
            <p className="text-orange-700">
              • The Fed will likely keep interest rates high to fight inflation
            </p>
          )}
          {corePceAnnualRate < 2 && (
            <p className="text-green-700">
              • The Fed might cut interest rates, potentially lowering mortgage rates
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
