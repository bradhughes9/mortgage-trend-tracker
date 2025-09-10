import { useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SeriesPoint, TimeRange } from '../../types';
import { formatDate } from '../../lib/format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface InflationChartProps {
  cpiData?: SeriesPoint[];
  corePceData?: SeriesPoint[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  isLoading?: boolean;
  height?: number;
}

/**
 * Interactive line chart showing CPI and Core PCE inflation trends
 */
export function InflationChart({
  cpiData = [],
  corePceData = [],
  timeRange,
  onTimeRangeChange,
  isLoading = false,
  height = 400,
}: InflationChartProps): JSX.Element {
  const chartRef = useRef<ChartJS<'line'>>(null);
  const [visibleDatasets, setVisibleDatasets] = useState({
    cpi: true,
    corePce: true,
  });

  // Find common date range for both datasets
  const allDates = [
    ...cpiData.map(d => d.date),
    ...corePceData.map(d => d.date)
  ].sort();
  
  const uniqueDates = [...new Set(allDates)];
  const labels = uniqueDates.map(date => formatDate(date, 'short'));

  // Align data to common labels
  const alignDataToLabels = (data: SeriesPoint[], dates: string[]): (number | null)[] => {
    return dates.map(date => {
      const point = data.find(d => d.date === date);
      return point ? point.value : null;
    });
  };

  const cpiAligned = alignDataToLabels(cpiData, uniqueDates);
  const corePceAligned = alignDataToLabels(corePceData, uniqueDates);

  const chartData: ChartData<'line'> = {
    labels,
    datasets: [
      {
        label: 'CPI - All Items',
        data: cpiAligned,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 4,
        tension: 0.1,
        spanGaps: true,
        hidden: !visibleDatasets.cpi,
      },
      {
        label: 'Core PCE (Fed Preferred)',
        data: corePceAligned,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 4,
        tension: 0.1,
        spanGaps: true,
        hidden: !visibleDatasets.corePce,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        onClick: (_e, legendItem) => {
          const datasetIndex = legendItem.datasetIndex!;
          const datasetKey = datasetIndex === 0 ? 'cpi' : 'corePce';
          
          setVisibleDatasets(prev => ({
            ...prev,
            [datasetKey]: !prev[datasetKey]
          }));
        },
      },
      tooltip: {
        callbacks: {
          title: (context: TooltipItem<'line'>[]) => {
            const dateStr = uniqueDates[context[0].dataIndex];
            return formatDate(dateStr, 'medium');
          },
          label: (context: TooltipItem<'line'>) => {
            const value = context.parsed.y;
            if (value === null) return '';
            return `${context.dataset.label}: ${value.toFixed(1)}`;
          },
          afterBody: () => {
            return [
              '',
              '💡 CPI tracks prices of goods & services',
              '🎯 Fed targets 2% Core PCE inflation'
            ];
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
        },
        ticks: {
          maxTicksLimit: 8,
          callback: function(_value: any, index: number) {
            if (index % Math.ceil(labels.length / 6) === 0) {
              return labels[index];
            }
            return '';
          },
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Index Value',
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(0);
          },
        },
      },
    },
  };

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '180d', label: '6 Months' },
    { value: '365d', label: '1 Year' },
  ];

  const toggleDataset = (key: 'cpi' | 'corePce') => {
    setVisibleDatasets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            📈 Inflation Trends
          </h3>
          <p className="text-sm text-gray-600">
            Consumer Price Index (CPI) and Federal Reserve's preferred Core PCE measure
          </p>
        </div>
        
        {/* Time range selector */}
        <div className="flex space-x-2 mt-4 lg:mt-0">
          {timeRangeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onTimeRangeChange(option.value)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === option.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggle controls */}
      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => toggleDataset('cpi')}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            visibleDatasets.cpi
              ? 'bg-red-100 text-red-800 hover:bg-red-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            visibleDatasets.cpi ? 'bg-red-500' : 'bg-gray-400'
          }`}></span>
          CPI - All Items
        </button>
        
        <button
          onClick={() => toggleDataset('corePce')}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            visibleDatasets.corePce
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          <span className={`w-2 h-2 rounded-full mr-2 ${
            visibleDatasets.corePce ? 'bg-blue-500' : 'bg-gray-400'
          }`}></span>
          Core PCE (Fed Preferred)
        </button>
      </div>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <Line ref={chartRef} data={chartData} options={options} />
      </div>

      {/* Educational note */}
      <div className="mt-4 bg-blue-50 p-3 rounded-lg">
        <p className="text-sm">
          <strong>💡 Understanding Inflation Data:</strong> CPI measures the average change in prices consumers pay for goods and services. 
          Core PCE excludes volatile food and energy prices and is the Federal Reserve's preferred inflation measure, targeting 2% annually.
        </p>
      </div>
    </div>
  );
}
