import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GooglePlacesSearchParams {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
  type?: 'text_search' | 'nearby_search' | 'place_details' | 'autocomplete';
  category?: string;
  useCache?: boolean;
}

export interface GooglePlacesResult {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  website: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  coordinates?: { lat: number; lng: number };
  openNow?: boolean;
  businessStatus?: string;
  type: 'provider';
  featured: boolean;
  verified: boolean;
  source: string;
}

export interface GooglePlacesResponse {
  results: GooglePlacesResult[];
  totalResults: number;
  cacheHit?: boolean;
  responseTime?: number;
  source: string;
}

export const useGooglePlaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<GooglePlacesResult[]>([]);

  const searchPlaces = useCallback(async (params: GooglePlacesSearchParams): Promise<GooglePlacesResponse> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('google-places-search', {
        body: params
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to search places');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const response: GooglePlacesResponse = data;
      setResults(response.results);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Google Places search error:', err);
      
      // Return empty response on error
      return {
        results: [],
        totalResults: 0,
        source: 'google_places'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const searchNearby = useCallback(async (
    location: { lat: number; lng: number },
    query: string,
    radius = 50000
  ) => {
    return searchPlaces({
      query,
      location,
      radius,
      type: 'nearby_search'
    });
  }, [searchPlaces]);

  const searchText = useCallback(async (
    query: string,
    location?: { lat: number; lng: number }
  ) => {
    return searchPlaces({
      query,
      location,
      type: 'text_search'
    });
  }, [searchPlaces]);

  const autocomplete = useCallback(async (
    input: string,
    location?: { lat: number; lng: number }
  ) => {
    return searchPlaces({
      query: input,
      location,
      type: 'autocomplete'
    });
  }, [searchPlaces]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    searchPlaces,
    searchNearby,
    searchText,
    autocomplete,
    clearResults
  };
};