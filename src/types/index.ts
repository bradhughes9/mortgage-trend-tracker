/**
 * Data structures for bond and mortgage rate information
 */

export interface Observation {
  date: string; // YYYY-MM-DD format
  value: number; // percentage as decimal (e.g., 4.25 for 4.25%)
}

export interface FredObservation {
  date: string;
  value: string; // FRED returns values as strings, including "." for missing
  realtime_start: string;
  realtime_end: string;
}

export interface SeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface FredResponse {
  observations: FredObservation[];
}

export interface MortgageEstimate {
  date: string;
  treasuryYield: number;
  spread: number;
  estimatedRate: number;
}

export interface DashboardData {
  tenYearYield: {
    current: number;
    previous: number;
    delta: number;
    lastUpdated: string;
  };
  mortgageRates: {
    estimated: number;
    estimated15Year: number;
    actual?: number;
    actual15Year?: number;
    spread: number;
  };
  inflationData?: {
    cpi: {
      current: number;
      previous: number;
      delta: number;
      annualRate: number;
    };
    corePce: {
      current: number;
      previous: number;
      delta: number;
      annualRate: number;
    };
  };
  historicalData: {
    treasuryYield: SeriesPoint[];
    estimatedMortgage: SeriesPoint[];
    estimated15YearMortgage: SeriesPoint[];
    actualMortgage?: SeriesPoint[];
    actual15YearMortgage?: SeriesPoint[];
    cpiData?: SeriesPoint[];
    corePceData?: SeriesPoint[];
  };
}

export interface ChartDataPoint {
  x: string; // date
  y: number; // rate percentage
}

export type TimeRange = '30d' | '90d' | '180d' | '365d';

export type DataSource = 'fred' | 'treasury-xml' | 'mixed';
