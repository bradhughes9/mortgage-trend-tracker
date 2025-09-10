import { TimeRange } from '../types';

/**
 * Date utilities for working with time ranges and date calculations
 */

/**
 * Get a date N days ago from today
 * @param daysBack - Number of days to go back
 * @returns Date object
 */
export function getDaysAgo(daysBack: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - daysBack);
  return date;
}

/**
 * Convert a TimeRange to the number of days
 * @param range - Time range enum
 * @returns Number of days
 */
export function timeRangeToDays(range: TimeRange): number {
  switch (range) {
    case '30d':
      // Use 45 days for 30d view to account for mortgage data publication delays
      return 45;
    case '90d':
      return 90;
    case '180d':
      return 180;
    case '365d':
      return 365;
    default:
      return 90;
  }
}

/**
 * Get start date for a given time range
 * @param range - Time range
 * @returns ISO date string (YYYY-MM-DD)
 */
export function getStartDateForRange(range: TimeRange): string {
  const days = timeRangeToDays(range);
  return getDaysAgo(days).toISOString().split('T')[0];
}

/**
 * Get today's date as ISO string
 * @returns Today's date in YYYY-MM-DD format
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get yesterday's date as ISO string
 * @returns Yesterday's date in YYYY-MM-DD format
 */
export function getYesterdayISO(): string {
  return getDaysAgo(1).toISOString().split('T')[0];
}

/**
 * Check if a date falls on a weekend
 * @param dateString - Date in YYYY-MM-DD format
 * @returns True if weekend, false otherwise
 */
export function isWeekend(dateString: string): boolean {
  const date = new Date(dateString);
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
}

/**
 * Get the most recent business day (excluding weekends)
 * @param fromDate - Starting date (default: today)
 * @returns Most recent business day in YYYY-MM-DD format
 */
export function getLastBusinessDay(fromDate?: string): string {
  let date = fromDate ? new Date(fromDate) : new Date();
  
  // Keep going back until we find a weekday
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() - 1);
  }
  
  return date.toISOString().split('T')[0];
}

/**
 * Generate an array of business days within a date range
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Array of business day date strings
 */
export function getBusinessDaysInRange(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const businessDays: string[] = [];
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    if (!isWeekend(date.toISOString().split('T')[0])) {
      businessDays.push(date.toISOString().split('T')[0]);
    }
  }
  
  return businessDays;
}

/**
 * Parse a date string and return components
 * @param dateString - Date in YYYY-MM-DD format
 * @returns Object with year, month, day
 */
export function parseDateString(dateString: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

/**
 * Create a date string from components
 * @param year - Full year
 * @param month - Month (1-12)
 * @param day - Day of month
 * @returns Date string in YYYY-MM-DD format
 */
export function createDateString(year: number, month: number, day: number): string {
  const monthStr = month.toString().padStart(2, '0');
  const dayStr = day.toString().padStart(2, '0');
  return `${year}-${monthStr}-${dayStr}`;
}

/**
 * Get the number of days between two dates
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Number of days
 */
export function daysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date string is valid
 * @param dateString - Date string to validate
 * @returns True if valid, false otherwise
 */
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateString);
}
