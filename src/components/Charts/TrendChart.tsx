import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SeriesPoint, TimeRange } from '../../types';
import { formatPercent, formatDate } from '../../lib/format';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  treasuryData: SeriesPoint[];
  estimatedMortgageData: SeriesPoint[];
  estimated15YearData: SeriesPoint[];
  actualMortgageData?: SeriesPoint[];
  actual15YearData?: SeriesPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading?: boolean;
  height?: number;
}

/**
 * Interactive line chart showing Treasury yield vs mortgage rate trends
 */
export function TrendChart({
  treasuryData,
  estimatedMortgageData,
  estimated15YearData,
  actualMortgageData,
  actual15YearData,
  timeRange,
  onTimeRangeChange,
  isLoading = false,
  height = 400,
}: TrendChartProps): JSX.Element {
  // Helper function to align sparse data (like weekly mortgage data) with dense data (like daily Treasury data)
  const alignDataToLabels = (sparseData: SeriesPoint[], labels: string[]): (number | null)[] => {
    const dataMap = new Map(sparseData.map(point => [point.date, point.value]));
    return labels.map(date => dataMap.get(date) || null);
  };

  // State for controlling line visibility
  const [visibleLines, setVisibleLines] = useState({
    treasury: true,
    estimated30Year: true,
    estimated15Year: true,
    actual30Year: true,
    actual15Year: true,
  });

  // Toggle line visibility
  const toggleLine = (lineKey: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({
      ...prev,
      [lineKey]: !prev[lineKey],
    }));
  };

  // Prepare chart datasets (only include visible lines)
  const datasets = [];
  const chartLabels = treasuryData.map(point => point.date);

  if (visibleLines.treasury) {
    datasets.push({
      label: '10-Year Treasury Yield',
      data: treasuryData.map(point => point.value),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
    });
  }

  if (visibleLines.estimated30Year) {
    datasets.push({
      label: 'Estimated 30-Year Mortgage',
      data: estimatedMortgageData.map(point => point.value),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
      tension: 0.1,
    });
  }

  if (visibleLines.estimated15Year) {
    datasets.push({
      label: 'Estimated 15-Year Mortgage',
      data: estimated15YearData.map(point => point.value),
      borderColor: '#d946ef',
      backgroundColor: 'rgba(217, 70, 239, 0.1)',
      borderWidth: 2,
      borderDash: [3, 3],
      fill: false,
      tension: 0.1,
    });
  }

  if (visibleLines.actual30Year && actualMortgageData && actualMortgageData.length > 0) {
    datasets.push({
      label: 'Actual 30-Year Mortgage',
      data: alignDataToLabels(actualMortgageData, chartLabels),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
      spanGaps: true, // Connect points across null values
    });
  }

  if (visibleLines.actual15Year && actual15YearData && actual15YearData.length > 0) {
    datasets.push({
      label: 'Actual 15-Year Mortgage',
      data: alignDataToLabels(actual15YearData, chartLabels),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 2,
      fill: false,
      tension: 0.1,
      spanGaps: true, // Connect points across null values
    });
  }

  // Prepare chart data
  const chartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets,
  };

  // Chart configuration options
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: (context) => {
            const date = context[0]?.label;
            return date ? formatDate(date, 'long') : '';
          },
          label: (context) => {
            const value = context.parsed.y;
            const datasetLabel = context.dataset.label || '';
            return `${datasetLabel}: ${formatPercent(value)}`;
          },
          afterBody: (context) => {
            if (context.length >= 2) {
              const treasury = context[0]?.parsed.y;
              const estimated = context[1]?.parsed.y;
              if (treasury && estimated) {
                const spread = estimated - treasury;
                return [``, `Spread: ${formatPercent(spread)}`];
              }
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
          font: {
            weight: 'bold',
          },
        },
        ticks: {
          color: '#6b7280',
          maxTicksLimit: 8,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Interest Rate (%)',
          font: {
            weight: 'bold',
          },
        },
        ticks: {
          callback: function(value) {
            return formatPercent(value as number);
          },
        },
        grid: {
          color: '#f3f4f6',
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: '#ffffff',
        hoverBorderWidth: 2,
      },
    },
  };

  const timeRangeOptions = [
    { value: '30d' as TimeRange, label: '30 Days' },
    { value: '90d' as TimeRange, label: '90 Days' },
    { value: '180d' as TimeRange, label: '6 Months' },
    { value: '365d' as TimeRange, label: '1 Year' },
  ];

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Interest Rate Trends
        </h3>
        
        {/* Time range selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              disabled={isLoading}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors disabled:opacity-50 ${
                timeRange === option.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Line visibility toggles */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.treasury}
            onChange={() => toggleLine('treasury')}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">10-Year Treasury</span>
          <div className="w-4 h-0.5 bg-blue-500"></div>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.estimated30Year}
            onChange={() => toggleLine('estimated30Year')}
            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
          />
          <span className="text-sm font-medium text-gray-700">Est. 30-Year</span>
          <div className="w-4 h-0.5 bg-amber-500 border-dashed border-t"></div>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={visibleLines.estimated15Year}
            onChange={() => toggleLine('estimated15Year')}
            className="w-4 h-4 text-fuchsia-600 border-gray-300 rounded focus:ring-fuchsia-500"
          />
          <span className="text-sm font-medium text-gray-700">Est. 15-Year</span>
          <div className="w-4 h-0.5 bg-fuchsia-500 border-dashed border-t"></div>
        </label>

        {actualMortgageData && actualMortgageData.length > 0 && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.actual30Year}
              onChange={() => toggleLine('actual30Year')}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Actual 30-Year</span>
            <div className="w-4 h-0.5 bg-green-500"></div>
          </label>
        )}

        {actual15YearData && actual15YearData.length > 0 && (
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visibleLines.actual15Year}
              onChange={() => toggleLine('actual15Year')}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm font-medium text-gray-700">Actual 15-Year</span>
            <div className="w-4 h-0.5 bg-purple-500"></div>
          </label>
        )}
      </div>

      {/* Chart container */}
      <div className="relative" style={{ height: `${height}px` }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      {/* Chart description */}
      <div className="mt-4 text-sm text-gray-600 space-y-3">
        <div>
          <h4 className="font-semibold text-gray-800 mb-2">Understanding the Chart:</h4>
          <div className="space-y-2">
            <p>
              <span className="inline-block w-4 h-0.5 bg-blue-500 mr-2"></span>
              <strong>10-Year Treasury Yield (Blue)</strong>: The interest rate the U.S. government pays on its bonds. This serves as the foundation for all other interest rates.
            </p>
            <p>
              <span className="inline-block w-4 h-0.5 bg-amber-500 mr-2" style={{borderTop: '2px dashed #f59e0b'}}></span>
              <strong>Estimated 30-Year Mortgage (Orange Dashed)</strong>: Our calculation of what mortgage rates should be, based on Treasury rates plus a typical bank markup.
            </p>
            <p>
              <span className="inline-block w-4 h-0.5 bg-purple-500 mr-2" style={{borderTop: '2px dashed #d946ef'}}></span>
              <strong>Estimated 15-Year Mortgage (Purple Dashed)</strong>: Our calculation for 15-year mortgage rates (typically lower than 30-year).
            </p>
            <p>
              <span className="inline-block w-4 h-0.5 bg-green-500 mr-2"></span>
              <strong>Actual 30-Year Mortgage (Green)</strong>: The real average rate banks are offering consumers for 30-year fixed mortgages, from Federal Reserve data.
            </p>
            <p>
              <span className="inline-block w-4 h-0.5 bg-violet-500 mr-2"></span>
              <strong>Actual 15-Year Mortgage (Violet)</strong>: The real average rate for 15-year fixed mortgages from Federal Reserve data.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm">
            <strong>💡 Key Insight:</strong> The "actual" rates are what you'd likely be quoted when shopping for a mortgage. 
            They're published weekly by the Federal Reserve and represent nationwide averages. Your personal rate may vary based on credit score, down payment, and other factors.
          </p>
        </div>
        
        {(actualMortgageData && actualMortgageData.length > 0) || (actual15YearData && actual15YearData.length > 0) ? (
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm">
              <strong>📊 Data Note:</strong> Mortgage rate data is published weekly (usually Thursdays), while Treasury data is daily. 
              <span className="font-medium text-amber-700"> FRED mortgage data typically has a 1-2 week publication delay.</span>
            </p>
          </div>
        ) : (
          <div className="bg-amber-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-amber-700">
              📊 Actual mortgage data is currently unavailable or delayed. The estimated rates show what mortgage rates should be based on current Treasury yields.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
