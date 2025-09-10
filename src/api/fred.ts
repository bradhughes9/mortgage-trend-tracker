import { Observation, FredResponse } from '../types';

const FRED_API_BASE = '/api/fred';
const API_KEY = import.meta.env.VITE_FRED_API_KEY;

/**
 * Generic FRED API data fetcher
 */
async function fetchFredSeries(
  seriesId: string,
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  if (!API_KEY) {
    throw new Error('FRED API key is required. Please add VITE_FRED_API_KEY to your .env.local file.');
  }

  const url = `${FRED_API_BASE}/series/observations`;
  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: API_KEY,
    file_type: 'json',
    observation_start: startDate || '',
    observation_end: endDate || '',
    sort_order: 'asc',
  });

  try {
    const response = await fetch(`${url}?${params}`);
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.status} ${response.statusText}`);
    }

    const data: FredResponse = await response.json();
    
    if (!data.observations || data.observations.length === 0) {
      return [];
    }

    return data.observations
      .filter(obs => obs.value !== '.' && !isNaN(parseFloat(obs.value)))
      .map(obs => ({
        date: obs.date,
        value: parseFloat(obs.value),
      }));
  } catch (error) {
    console.error(`Error fetching FRED series ${seriesId}:`, error);
    throw error;
  }
}

/**
 * Fetch 10-Year Treasury Constant Maturity Rate (DGS10)
 */
export async function fetchDgs10(
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  return fetchFredSeries('DGS10', startDate, endDate);
}

/**
 * Fetch 30-Year Fixed Rate Mortgage Average (MORTGAGE30US)
 */
export async function fetchMortgage30(
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  return fetchFredSeries('MORTGAGE30US', startDate, endDate);
}

/**
 * Fetch 15-Year Fixed Rate Mortgage Average (MORTGAGE15US)
 */
export async function fetchMortgage15(
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  return fetchFredSeries('MORTGAGE15US', startDate, endDate);
}

/**
 * Fetch Consumer Price Index for All Urban Consumers (CPIAUCSL)
 */
export async function fetchCPI(
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  return fetchFredSeries('CPIAUCSL', startDate, endDate);
}

/**
 * Fetch Core PCE Price Index (PCEPILFE)
 */
export async function fetchCorePCE(
  startDate?: string,
  endDate?: string
): Promise<Observation[]> {
  return fetchFredSeries('PCEPILFE', startDate, endDate);
}