import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocationProviders, type RemoteCategory } from './useLocationProviders';

export interface HybridSearchParams {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
  category?: string;
  includeOSM?: boolean;
  includeGoogle?: boolean;
  maxResults?: number;
}

export interface HybridSearchResult {
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
  type: 'provider' | 'organization' | 'resource';
  featured: boolean;
  verified?: boolean;
  source: string;
  relevanceScore?: number;
}

export interface HybridSearchResponse {
  results: HybridSearchResult[];
  totalResults: number;
  sources: {
    google: boolean;
    osm: boolean;
    local: boolean;
  };
  searchStrategy: string;
}

export const useHybridSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<HybridSearchResult[]>([]);
  
  const { fetchByCoords, results: osmResults } = useLocationProviders();

  const hybridSearch = useCallback(async (params: HybridSearchParams): Promise<HybridSearchResponse> => {
    setLoading(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      // 1. Call the hybrid search edge function
      promises.push(
        supabase.functions.invoke('hybrid-search', { body: params })
      );

      // 2. If OSM is enabled and location is provided, search OSM directly
      if (params.includeOSM !== false && params.location) {
        const osmCategory = mapCategoryToRemoteCategory(params.category);
        promises.push(
          fetchByCoords({ lat: params.location.lat, lon: params.location.lng }, osmCategory)
        );
      }

      const [hybridResponse, osmResponse] = await Promise.allSettled(promises);

      let combinedResults: HybridSearchResult[] = [];

      // Process hybrid search results
      if (hybridResponse.status === 'fulfilled' && hybridResponse.value.data) {
        const hybridData = hybridResponse.value.data;
        if (hybridData.error) {
          console.warn('Hybrid search error:', hybridData.error);
        } else {
          combinedResults.push(...hybridData.results);
        }
      }

      // Process OSM results
      if (osmResponse.status === 'fulfilled' && osmResults.length > 0) {
        const osmMapped = osmResults.map(place => ({
          id: place.id,
          name: place.name,
          description: `${place.category} in ${place.address}`,
          category: place.category,
          location: place.address || '',
          website: place.website || '',
          phone: place.phone || '',
          coordinates: { lat: place.lat, lng: place.lon },
          type: 'provider' as const,
          featured: false,
          verified: true,
          source: 'openstreetmap',
          relevanceScore: calculateRelevanceScore(place.name, params.query)
        }));
        combinedResults.push(...osmMapped);
      }

      // Deduplicate and limit results
      const deduplicatedResults = deduplicateByNameAndLocation(combinedResults);
      const finalResults = deduplicatedResults
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, params.maxResults || 50);

      setResults(finalResults);

      return {
        results: finalResults,
        totalResults: finalResults.length,
        sources: {
          google: params.includeGoogle !== false,
          osm: params.includeOSM !== false,
          local: true
        },
        searchStrategy: 'hybrid'
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Hybrid search failed';
      setError(errorMessage);
      console.error('Hybrid search error:', err);
      
      return {
        results: [],
        totalResults: 0,
        sources: { google: false, osm: false, local: false },
        searchStrategy: 'hybrid'
      };
    } finally {
      setLoading(false);
    }
  }, [fetchByCoords, osmResults]);

  const searchWithLocation = useCallback(async (
    query: string,
    location: { lat: number; lng: number },
    category?: string
  ) => {
    return hybridSearch({
      query,
      location,
      category,
      includeOSM: true,
      includeGoogle: true,
      maxResults: 25
    });
  }, [hybridSearch]);

  const searchWithoutLocation = useCallback(async (
    query: string,
    category?: string
  ) => {
    return hybridSearch({
      query,
      category,
      includeOSM: false,
      includeGoogle: true,
      maxResults: 25
    });
  }, [hybridSearch]);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    loading,
    error,
    results,
    hybridSearch,
    searchWithLocation,
    searchWithoutLocation,
    clearResults
  };
};

function calculateRelevanceScore(name: string, query: string): number {
  const nameLower = name.toLowerCase();
  const queryLower = query.toLowerCase();
  
  if (nameLower.includes(queryLower)) {
    return 10;
  }
  
  const words = queryLower.split(' ');
  let score = 0;
  words.forEach(word => {
    if (nameLower.includes(word)) {
      score += 2;
    }
  });
  
  return score;
}

function deduplicateByNameAndLocation(results: HybridSearchResult[]): HybridSearchResult[] {
  const seen = new Map<string, HybridSearchResult>();
  
  results.forEach(result => {
    const key = `${result.name.toLowerCase()}_${result.location.toLowerCase().substring(0, 30)}`;
    
    if (!seen.has(key) || (result.relevanceScore || 0) > (seen.get(key)?.relevanceScore || 0)) {
      seen.set(key, result);
    }
  });
  
  return Array.from(seen.values());
}

function mapCategoryToRemoteCategory(category?: string): RemoteCategory | undefined {
  if (!category) return undefined;
  
  const categoryMap: { [key: string]: RemoteCategory } = {
    'therapy': 'Therapists & Specialists',
    'medical': 'Diagnostic Centers',
    'support': 'Support Groups',
    'education': 'Educational Services',
    'recreation': 'Recreational Programs',
    'adult': 'Adult Services'
  };
  
  const lowerCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerCategory.includes(key)) {
      return value;
    }
  }
  
  return 'Therapists & Specialists'; // Default fallback
}