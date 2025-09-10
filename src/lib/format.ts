/**
 * Formatting utilities for display values
 */

/**
 * Format a number as a percentage with specified decimal places
 * @param value - Number to format (e.g., 4.25)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "4.25%")
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a delta value with appropriate sign and color class
 * @param delta - Change value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Object with formatted text and CSS class
 */
export function formatDelta(
  delta: number,
  decimals: number = 2
): { text: string; className: string; sign: 'positive' | 'negative' | 'neutral' } {
  const sign = delta > 0 ? 'positive' : delta < 0 ? 'negative' : 'neutral';
  const prefix = delta > 0 ? '+' : '';
  
  return {
    text: `${prefix}${delta.toFixed(decimals)}`,
    className: `delta-${sign}`,
    sign,
  };
}

/**
 * Format a delta as basis points (1% = 100 bp)
 * @param delta - Change in percentage points
 * @returns Formatted basis points string
 */
export function formatBasisPoints(delta: number): string {
  const bp = Math.round(delta * 100);
  const sign = bp > 0 ? '+' : '';
  return `${sign}${bp} bp`;
}

/**
 * Format a date string for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param format - Display format ('short', 'medium', 'long')
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string,
  format: 'short' | 'medium' | 'long' = 'medium'
): string {
  const date = new Date(dateString);
  
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      });
    case 'medium':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    case 'long':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    default:
      return dateString;
  }
}

/**
 * Format a timestamp for "last updated" displays
 * @param timestamp - ISO timestamp or Date object
 * @returns Human-readable "last updated" string
 */
export function formatLastUpdated(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatDate(date.toISOString().split('T')[0], 'medium');
}

/**
 * Format large numbers with appropriate units (K, M, B)
 * @param value - Number to format
 * @returns Formatted string with units
 */
export function formatLargeNumber(value: number): string {
  const abs = Math.abs(value);
  
  if (abs >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (abs >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (abs >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  
  return value.toString();
}

/**
 * Format currency values
 * @param value - Monetary value
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousands separators
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number string
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}
