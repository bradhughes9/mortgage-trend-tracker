/**
 * Mathematical utilities for mortgage rate calculations
 */

/**
 * Calculate estimated 30-year mortgage rate from 10-year Treasury yield and spread
 * @param treasuryYield - 10-year Treasury yield as percentage (e.g., 4.25)
 * @param spread - Lender spread as percentage (e.g., 1.8)
 * @returns Estimated mortgage rate as percentage
 */
export function estimateMortgageRate(
  treasuryYield: number,
  spread: number
): number {
  return Number((treasuryYield + spread).toFixed(2));
}

/**
 * Calculate estimated 15-year mortgage rate from 10-year Treasury yield and spread
 * 15-year mortgages typically have a smaller spread (about 0.25-0.5% less than 30-year)
 * @param treasuryYield - 10-year Treasury yield as percentage (e.g., 4.25)
 * @param spread - Base lender spread as percentage (e.g., 1.8)
 * @returns Estimated 15-year mortgage rate as percentage
 */
export function estimate15YearMortgageRate(
  treasuryYield: number,
  spread: number
): number {
  const fifteenYearSpread = spread - 0.4; // 15-year typically 0.4% lower spread
  return Number((treasuryYield + fifteenYearSpread).toFixed(2));
}

/**
 * Calculate the change (delta) between current and previous values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Delta with proper sign
 */
export function calculateDelta(current: number, previous: number): number {
  return Number((current - previous).toFixed(2));
}

/**
 * Calculate percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Percentage change (e.g., 0.05 for 5% increase)
 */
export function calculatePercentageChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return 0;
  return Number(((current - previous) / previous).toFixed(4));
}

/**
 * Calculate a simple moving average over N periods
 * @param values - Array of numbers
 * @param periods - Number of periods for the average
 * @returns Array of moving averages (shorter than input by periods-1)
 */
export function movingAverage(values: number[], periods: number): number[] {
  if (periods <= 0 || periods > values.length) return [];
  
  const result: number[] = [];
  
  for (let i = periods - 1; i < values.length; i++) {
    const slice = values.slice(i - periods + 1, i + 1);
    const average = slice.reduce((sum, val) => sum + val, 0) / periods;
    result.push(Number(average.toFixed(2)));
  }
  
  return result;
}

/**
 * Calculate volatility (standard deviation) of a series
 * @param values - Array of numbers
 * @returns Standard deviation
 */
export function calculateVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);
  
  return Number(Math.sqrt(variance).toFixed(3));
}

/**
 * Find the minimum and maximum values in an array
 * @param values - Array of numbers
 * @returns Object with min and max values
 */
export function findRange(values: number[]): { min: number; max: number } {
  if (values.length === 0) return { min: 0, max: 0 };
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  };
}

/**
 * Normalize values to a 0-1 range for visualization
 * @param values - Array of numbers
 * @returns Array of normalized values
 */
export function normalizeValues(values: number[]): number[] {
  const { min, max } = findRange(values);
  const range = max - min;
  
  if (range === 0) return values.map(() => 0);
  
  return values.map(val => Number(((val - min) / range).toFixed(3)));
}

/**
 * Calculate annual inflation rate from CPI values
 * @param currentCPI - Current CPI index value
 * @param previousYearCPI - CPI index value from 12 months ago
 * @returns Annual inflation rate as percentage
 */
export function calculateInflationRate(
  currentCPI: number,
  previousYearCPI: number
): number {
  if (previousYearCPI === 0) return 0;
  return Number((((currentCPI - previousYearCPI) / previousYearCPI) * 100).toFixed(2));
}

/**
 * Calculate month-over-month inflation rate
 * @param currentCPI - Current month CPI index value
 * @param previousMonthCPI - Previous month CPI index value
 * @returns Monthly inflation rate as percentage
 */
export function calculateMonthlyInflationRate(
  currentCPI: number,
  previousMonthCPI: number
): number {
  if (previousMonthCPI === 0) return 0;
  return Number((((currentCPI - previousMonthCPI) / previousMonthCPI) * 100).toFixed(3));
}
