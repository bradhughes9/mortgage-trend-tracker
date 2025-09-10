import { useState, useEffect } from 'react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { StatCard } from '../components/Cards/StatCard';
import { TreasuryCard } from '../components/Cards/TreasuryCard';
import { SpreadControl } from '../components/Controls/SpreadControl';
import { TrendChart } from '../components/Charts/TrendChart';
import { InflationInsights } from '../components/Info/InflationInsights';
import { Explainers } from '../components/Info/Explainers';
import { Glossary } from '../components/Info/Glossary';
import { fetchDgs10, fetchMortgage30, fetchMortgage15, fetchCPI, fetchCorePCE } from '../api/fred';
import { estimateMortgageRate, estimate15YearMortgageRate, calculateDelta, calculateInflationRate } from '../lib/math';
import { TimeRange, DashboardData, SeriesPoint } from '../types';
import { getStartDateForRange, getTodayISO } from '../lib/dates';

/**
 * Main dashboard page that orchestrates all components and data
 */
export function Dashboard() {
  // State management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [spread, setSpread] = useState(1.9); // Default spread
  const [timeRange, setTimeRange] = useState<TimeRange>('90d');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh] = useState(false);

  // Load data on component mount and when time range changes
  useEffect(() => {
    loadData();
  }, [timeRange]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [autoRefresh]); // Removed timeRange dependency to prevent duplicate calls

  // Recalculate estimated mortgage rates when spread changes
  useEffect(() => {
    if (dashboardData) {
      updateEstimatedRates();
    }
  }, [spread]);

  /**
   * Fetch data from FRED API (or mock data)
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const startDate = getStartDateForRange(timeRange);
      const endDate = getTodayISO();

      // Fetch Treasury, mortgage, and inflation data in parallel
      // Note: Inflation data needs longer range for annual calculations
      // Get 15 months of data to ensure proper year-over-year comparison
      const inflationDate = new Date();
      inflationDate.setMonth(inflationDate.getMonth() - 15);
      const inflationStartDate = inflationDate.toISOString().split('T')[0];
      
      console.log('🗓️ Date ranges:', {
        timeRange,
        startDate,
        endDate,
        inflationStartDate
      });
      
      const [treasuryObs, mortgageObs, mortgage15Obs, cpiObs, corePceObs] = await Promise.all([
        fetchDgs10(startDate, endDate),
        fetchMortgage30(startDate, endDate).catch((err) => {
          console.warn('⚠️ MORTGAGE30US fetch failed:', err.message);
          return [];
        }),
        fetchMortgage15(startDate, endDate).catch((err) => {
          console.warn('⚠️ MORTGAGE15US fetch failed:', err.message);
          return [];
        }),
        fetchCPI(inflationStartDate, endDate).catch((err) => {
          console.warn('⚠️ CPI fetch failed:', err.message);
          return [];
        }),
        fetchCorePCE(inflationStartDate, endDate).catch((err) => {
          console.warn('⚠️ Core PCE fetch failed:', err.message);
          return [];
        }),
      ]);

      if (treasuryObs.length === 0) {
        throw new Error('No Treasury data available');
      }

      // Get current and previous values for delta calculation
      const currentTreasury = treasuryObs[treasuryObs.length - 1];
      const previousTreasury = treasuryObs[treasuryObs.length - 2];
      
      const currentEstimated = estimateMortgageRate(currentTreasury.value, spread);
      const currentEstimated15Year = estimate15YearMortgageRate(currentTreasury.value, spread);

      // Process inflation data
      let inflationData;
      if (cpiObs.length > 0 && corePceObs.length > 0) {
        console.log('🔍 CPI Data Points:', cpiObs.length, 'Latest:', cpiObs[cpiObs.length - 1]);
        console.log('🔍 Core PCE Data Points:', corePceObs.length, 'Latest:', corePceObs[corePceObs.length - 1]);
        
        const currentCPI = cpiObs[cpiObs.length - 1];
        const previousCPI = cpiObs[cpiObs.length - 2];
        const currentCorePCE = corePceObs[corePceObs.length - 1];
        const previousCorePCE = corePceObs[corePceObs.length - 2];

        console.log('🔍 CPI values - Current:', currentCPI.value, typeof currentCPI.value);
        console.log('🔍 Core PCE values - Current:', currentCorePCE.value, typeof currentCorePCE.value);

        // Calculate annual inflation rates (need 12 months of data)
        // Find data point approximately 12 months ago
        console.log('🔍 Total CPI observations:', cpiObs.length);
        console.log('🔍 First CPI:', cpiObs[0]);
        console.log('🔍 Last CPI:', cpiObs[cpiObs.length - 1]);
        console.log('🔍 Total Core PCE observations:', corePceObs.length);
        console.log('🔍 First Core PCE:', corePceObs[0]);
        console.log('🔍 Last Core PCE:', corePceObs[corePceObs.length - 1]);

        // For proper annual inflation, we need to find the value from approximately 12 months ago
        // CPI data is monthly, so we look for data point closest to 12 months ago
        let cpiYear = null;
        let corePceYear = null;
        
        if (cpiObs.length >= 10) {
          // Find data point closest to 12 months ago
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
          const targetDate = twelveMonthsAgo.toISOString().split('T')[0];
          
          // Find closest date to 12 months ago
          cpiYear = cpiObs.find(obs => obs.date <= targetDate) || cpiObs[0];
          console.log('🎯 CPI target date (12 months ago):', targetDate, 'Found:', cpiYear?.date);
        }
        
        if (corePceObs.length >= 10) {
          const twelveMonthsAgo = new Date();
          twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
          const targetDate = twelveMonthsAgo.toISOString().split('T')[0];
          
          corePceYear = corePceObs.find(obs => obs.date <= targetDate) || corePceObs[0];
          console.log('🎯 Core PCE target date (12 months ago):', targetDate, 'Found:', corePceYear?.date);
        }

        console.log('📅 CPI 12 months ago (using first obs):', cpiYear, 'Current:', currentCPI);
        console.log('📅 Core PCE 12 months ago (using first obs):', corePceYear, 'Current:', currentCorePCE);

        // Test calculation directly
        if (cpiYear && currentCPI) {
          console.log('🧮 CPI values for calculation:', 'current =', currentCPI.value, 'previous =', cpiYear.value);
          const testCpiRate = calculateInflationRate(currentCPI.value, cpiYear.value);
          console.log('🧮 CPI Calculation Test:', currentCPI.value, 'vs', cpiYear.value, '=', testCpiRate + '%');
        } else {
          console.log('❌ CPI calculation skipped - missing data. cpiYear:', !!cpiYear, 'currentCPI:', !!currentCPI);
        }
        if (corePceYear && currentCorePCE) {
          console.log('🧮 Core PCE values for calculation:', 'current =', currentCorePCE.value, 'previous =', corePceYear.value);
          const testPceRate = calculateInflationRate(currentCorePCE.value, corePceYear.value);
          console.log('🧮 Core PCE Calculation Test:', currentCorePCE.value, 'vs', corePceYear.value, '=', testPceRate + '%');
        } else {
          console.log('❌ Core PCE calculation skipped - missing data. corePceYear:', !!corePceYear, 'currentCorePCE:', !!currentCorePCE);
        }

        inflationData = {
          cpi: {
            current: currentCPI.value,
            previous: previousCPI?.value || currentCPI.value,
            delta: calculateDelta(currentCPI.value, previousCPI?.value || currentCPI.value),
            annualRate: cpiYear ? calculateInflationRate(currentCPI.value, cpiYear.value) : 0,
          },
          corePce: {
            current: currentCorePCE.value,
            previous: previousCorePCE?.value || currentCorePCE.value,
            delta: calculateDelta(currentCorePCE.value, previousCorePCE?.value || currentCorePCE.value),
            annualRate: corePceYear ? calculateInflationRate(currentCorePCE.value, corePceYear.value) : 0,
          },
        };

        console.log('📊 Final inflation data:', inflationData);
        
        // Temporary debugging - remove this after finding the issue
        if (inflationData) {
          console.log('🚨 DEBUG: CPI Annual Rate:', inflationData.cpi.annualRate);
          console.log('🚨 DEBUG: Core PCE Annual Rate:', inflationData.corePce.annualRate);
          
          // Let's see what actual values are being calculated
          const debugCurrentCPI = cpiObs[cpiObs.length - 1];
          const debugYearAgoCPI = cpiObs.length >= 12 ? cpiObs[cpiObs.length - 12] : null;
          
          console.log('🔍 Current CPI Value:', debugCurrentCPI?.value);
          console.log('🔍 Year Ago CPI Value:', debugYearAgoCPI?.value);
          
          if (debugCurrentCPI && debugYearAgoCPI) {
            const manualCalc = ((debugCurrentCPI.value - debugYearAgoCPI.value) / debugYearAgoCPI.value) * 100;
            console.log('🧮 Manual calculation:', manualCalc.toFixed(2), '%');
          }
        }
      }

      // Prepare chart data
      const treasuryChart: SeriesPoint[] = treasuryObs.map(obs => ({
        date: obs.date,
        value: obs.value,
        label: 'Treasury',
      }));

      const estimatedChart: SeriesPoint[] = treasuryObs.map(obs => ({
        date: obs.date,
        value: estimateMortgageRate(obs.value, spread),
        label: 'Estimated 30-Year Mortgage',
      }));

      const estimated15YearChart: SeriesPoint[] = treasuryObs.map(obs => ({
        date: obs.date,
        value: estimate15YearMortgageRate(obs.value, spread),
        label: 'Estimated 15-Year Mortgage',
      }));

      const actualChart: SeriesPoint[] | undefined = mortgageObs.length > 0
        ? mortgageObs.map(obs => ({
            date: obs.date,
            value: obs.value,
            label: 'Actual Mortgage',
          }))
        : undefined;

      const actual15YearChart: SeriesPoint[] | undefined = mortgage15Obs.length > 0
        ? mortgage15Obs.map(obs => ({
            date: obs.date,
            value: obs.value,
            label: 'Actual 15-Year Mortgage',
          }))
        : undefined;

      const cpiChart: SeriesPoint[] | undefined = cpiObs.length > 0
        ? cpiObs.map(obs => ({
            date: obs.date,
            value: obs.value,
            label: 'CPI - All Items',
          }))
        : undefined;

      const corePceChart: SeriesPoint[] | undefined = corePceObs.length > 0
        ? corePceObs.map(obs => ({
            date: obs.date,
            value: obs.value,
            label: 'Core PCE',
          }))
        : undefined;

      // Build dashboard data
      const newData: DashboardData = {
        tenYearYield: {
          current: currentTreasury.value,
          previous: previousTreasury?.value || currentTreasury.value,
          delta: calculateDelta(
            currentTreasury.value,
            previousTreasury?.value || currentTreasury.value
          ),
          lastUpdated: currentTreasury.date,
        },
        mortgageRates: {
          estimated: currentEstimated,
          estimated15Year: currentEstimated15Year,
          actual: mortgageObs.length > 0 ? mortgageObs[mortgageObs.length - 1].value : undefined,
          actual15Year: mortgage15Obs.length > 0 ? mortgage15Obs[mortgage15Obs.length - 1].value : undefined,
          spread,
        },
        inflationData,
        historicalData: {
          treasuryYield: treasuryChart,
          estimatedMortgage: estimatedChart,
          estimated15YearMortgage: estimated15YearChart,
          actualMortgage: actualChart,
          actual15YearMortgage: actual15YearChart,
          cpiData: cpiChart,
          corePceData: corePceChart,
        },
      };

      setDashboardData(newData);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update estimated mortgage rates when spread changes
   */
  const updateEstimatedRates = () => {
    if (!dashboardData) return;

    const currentEstimated = estimateMortgageRate(dashboardData.tenYearYield.current, spread);
    const currentEstimated15Year = estimate15YearMortgageRate(dashboardData.tenYearYield.current, spread);

    const updatedChart = dashboardData.historicalData.treasuryYield.map(point => ({
      date: point.date,
      value: estimateMortgageRate(point.value, spread),
      label: 'Estimated Mortgage',
    }));

    setDashboardData({
      ...dashboardData,
      mortgageRates: {
        ...dashboardData.mortgageRates,
        estimated: currentEstimated,
        estimated15Year: currentEstimated15Year,
        spread,
      },
      historicalData: {
        ...dashboardData.historicalData,
        estimatedMortgage: updatedChart,
      },
    });
  };

  /**
   * Export data as CSV
   */
  const handleExportCsv = () => {
    if (!dashboardData) return;

    const { treasuryYield, estimatedMortgage, actualMortgage } = dashboardData.historicalData;
    
    // Prepare CSV data
    const headers = ['Date', '10Y Treasury', 'Estimated Mortgage', 'Actual Mortgage'];
    const rows = treasuryYield.map((treasury, index) => {
      const estimated = estimatedMortgage[index];
      const actual = actualMortgage?.[index];
      
      return [
        treasury.date,
        treasury.value.toFixed(2),
        estimated.value.toFixed(2),
        actual ? actual.value.toFixed(2) : 'N/A',
      ];
    });

    // Create CSV content
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mortgage-trends-${timeRange}-${getTodayISO()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Error state
  if (error && !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-900 mb-2">
                Unable to Load Data
              </h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={loadData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer onExportCsv={handleExportCsv} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={loadData}
        isLoading={isLoading}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick explanation section */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">📊 What Am I Looking At?</h2>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Treasury Yield:</strong> The baseline interest rate the U.S. government pays. All other rates build from this.</p>
            <p><strong>Estimated Rates:</strong> Our calculations of what mortgage rates should be (Treasury + typical bank markup).</p>
            <p><strong>Actual Rates:</strong> The real average rates banks are offering consumers nationwide (from Federal Reserve data).</p>
            <p><strong>30-year vs 15-year:</strong> Different loan terms - 15-year loans typically have lower rates but higher monthly payments.</p>
          </div>
        </div>
        {/* Full-width Treasury card with CNBC link */}
        <div className="mb-6">
          <TreasuryCard
            value={dashboardData?.tenYearYield.current || 0}
            delta={dashboardData?.tenYearYield.delta}
            previousValue={dashboardData?.tenYearYield.previous}
            isLoading={isLoading}
          />
        </div>

        {/* 2x2 Mortgage rate cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* First row: 15-year rates */}
          <StatCard
            title="Estimated 15-Year Mortgage"
            subtitle="Our calculation based on Treasury + spread"
            value={dashboardData?.mortgageRates.estimated15Year || 0}
            badge="Estimate"
            isLoading={isLoading}
            className="bg-purple-50 border-purple-200"
          />

          {dashboardData?.mortgageRates.actual15Year && (
            <StatCard
              title="Actual 15-Year Mortgage"
              subtitle="Real rates banks are offering (Fed data)"
              value={dashboardData.mortgageRates.actual15Year}
              isLoading={isLoading}
              className="bg-purple-100 border-purple-300"
            />
          )}

          {/* Second row: 30-year rates */}
          <StatCard
            title="Estimated 30-Year Mortgage"
            subtitle="Our calculation based on Treasury + spread"
            value={dashboardData?.mortgageRates.estimated || 0}
            badge="Estimate"
            isLoading={isLoading}
            className="bg-amber-50 border-amber-200"
          />

          {dashboardData?.mortgageRates.actual && (
            <StatCard
              title="Actual 30-Year Mortgage"
              subtitle="Real rates banks are offering (Fed data)"
              value={dashboardData.mortgageRates.actual}
              isLoading={isLoading}
              className="bg-green-50 border-green-200"
            />
          )}
        </div>

        {/* Full-width spread control card */}
        <div className="mb-8">
          <div className="card p-6">
            <SpreadControl
              value={spread}
              onChange={setSpread}
              isDisabled={isLoading}
            />
          </div>
        </div>

        {/* Chart section */}
        <div className="mb-8">
          <TrendChart
            treasuryData={dashboardData?.historicalData.treasuryYield || []}
            estimatedMortgageData={dashboardData?.historicalData.estimatedMortgage || []}
            estimated15YearData={dashboardData?.historicalData.estimated15YearMortgage || []}
            actualMortgageData={dashboardData?.historicalData.actualMortgage}
            actual15YearData={dashboardData?.historicalData.actual15YearMortgage}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            isLoading={isLoading}
          />
        </div>

        {/* Inflation insights */}
        {dashboardData?.inflationData && (
          <div className="mb-8">
            <InflationInsights
              cpiData={dashboardData?.historicalData.cpiData || []}
              corePceData={dashboardData?.historicalData.corePceData || []}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Educational content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Explainers />
          <Glossary />
        </div>
      </main>

      <Footer onExportCsv={handleExportCsv} />
    </div>
  );
}
