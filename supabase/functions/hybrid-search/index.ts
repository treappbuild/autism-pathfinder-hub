import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface HybridSearchRequest {
  query: string
  location?: { lat: number; lng: number }
  radius?: number
  category?: string
  includeOSM?: boolean
  includeGoogle?: boolean
  maxResults?: number
}

interface SearchResult {
  id: string
  name: string
  description: string
  category: string
  location: string
  website: string
  phone?: string
  rating?: number
  reviewCount?: number
  coordinates?: { lat: number; lng: number }
  type: 'provider' | 'organization' | 'resource'
  featured: boolean
  verified?: boolean
  source: string
  relevanceScore?: number
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const searchRequest: HybridSearchRequest = await req.json()
    const { 
      query, 
      location, 
      radius = 50000, 
      category, 
      includeOSM = true, 
      includeGoogle = true,
      maxResults = 50 
    } = searchRequest

    const results: SearchResult[] = []
    const promises: Promise<any>[] = []

    // 1. Search cached Google Places results
    if (includeGoogle) {
      promises.push(searchCachedPlaces(supabase, query, location, radius, category))
    }

    // 2. Search OpenStreetMap via existing hook (if includeOSM)
    if (includeOSM && location) {
      promises.push(searchOSM(location, radius, query, category))
    }

    // 3. Search local static data (existing providers, organizations, resources)
    promises.push(searchLocalData(query, category))

    const searchResults = await Promise.allSettled(promises)
    
    // Combine and deduplicate results
    searchResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        results.push(...result.value)
      } else if (result.status === 'rejected') {
        console.warn(`Search source ${index} failed:`, result.reason)
      }
    })

    // Deduplicate by name and location similarity
    const deduplicatedResults = deduplicateResults(results)
    
    // Score and rank results
    const rankedResults = scoreAndRankResults(deduplicatedResults, query, location)
    
    // Limit results
    const finalResults = rankedResults.slice(0, maxResults)

    // Log hybrid search analytics
    await supabase
      .from('search_analytics')
      .insert({
        search_query: query,
        search_type: 'hybrid_search',
        location_lat: location?.lat,
        location_lng: location?.lng,
        category: category,
        cache_hit: true, // Hybrid searches primarily use cached data
        response_time_ms: 0, // Will be updated in frontend
        result_count: finalResults.length,
        api_cost_estimate: 0, // Hybrid searches are cost-free
        user_agent: req.headers.get('user-agent') || ''
      })

    return new Response(JSON.stringify({
      results: finalResults,
      totalResults: finalResults.length,
      sources: {
        google: includeGoogle,
        osm: includeOSM,
        local: true
      },
      searchStrategy: 'hybrid'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in hybrid-search function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      results: [],
      totalResults: 0 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function searchCachedPlaces(
  supabase: any, 
  query: string, 
  location?: { lat: number; lng: number }, 
  radius?: number,
  category?: string
): Promise<SearchResult[]> {
  let queryBuilder = supabase
    .from('places_cache')
    .select('results, source')
    .gt('expires_at', new Date().toISOString())

  // Search in cached results based on query parameters
  if (location) {
    // Search within radius (approximate)
    const latRange = radius ? radius / 111000 : 0.5 // ~50km default
    const lngRange = radius ? radius / (111000 * Math.cos(location.lat * Math.PI / 180)) : 0.5

    queryBuilder = queryBuilder
      .gte('location_lat', location.lat - latRange)
      .lte('location_lat', location.lat + latRange)
      .gte('location_lng', location.lng - lngRange)
      .lte('location_lng', location.lng + lngRange)
  }

  const { data: cachedPlaces } = await queryBuilder.limit(10)

  if (!cachedPlaces) return []

  const results: SearchResult[] = []
  
  cachedPlaces.forEach(cache => {
    const places = cache.results as any[]
    places.forEach(place => {
      // Filter by query match
      if (query && !matchesQuery(place, query)) return
      
      // Filter by category if specified
      if (category && !matchesCategory(place, category)) return

      results.push({
        id: place.id || place.place_id,
        name: place.name,
        description: place.description || `${place.category || 'Provider'} in ${place.location}`,
        category: place.category || 'Healthcare Provider',
        location: place.location || place.formatted_address,
        website: place.website || '',
        phone: place.phone || place.formatted_phone_number || '',
        rating: place.rating,
        reviewCount: place.reviewCount || place.user_ratings_total,
        coordinates: place.coordinates || (place.geometry ? place.geometry.location : undefined),
        type: 'provider' as const,
        featured: place.featured || false,
        verified: true,
        source: cache.source || 'cached'
      })
    })
  })

  return results
}

async function searchOSM(
  location: { lat: number; lng: number },
  radius: number,
  query: string,
  category?: string
): Promise<SearchResult[]> {
  // This would integrate with the existing OSM search from useLocationProviders
  // For now, return empty array as OSM search is handled by the existing hook
  return []
}

async function searchLocalData(query: string, category?: string): Promise<SearchResult[]> {
  // This would search through the static data in realData.ts
  // Since we can't import it directly in the edge function,
  // we could either:
  // 1. Store this data in the database
  // 2. Pass it from the frontend
  // For now, return empty array
  return []
}

function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>()
  const deduplicated: SearchResult[] = []

  for (const result of results) {
    // Create a key based on name and approximate location
    const key = `${result.name.toLowerCase()}_${result.location.toLowerCase().substring(0, 20)}`
    
    if (!seen.has(key)) {
      seen.add(key)
      deduplicated.push(result)
    }
  }

  return deduplicated
}

function scoreAndRankResults(
  results: SearchResult[], 
  query: string, 
  location?: { lat: number; lng: number }
): SearchResult[] {
  return results.map(result => {
    let score = 0

    // Name relevance (highest weight)
    if (result.name.toLowerCase().includes(query.toLowerCase())) {
      score += 10
    }

    // Description relevance
    if (result.description.toLowerCase().includes(query.toLowerCase())) {
      score += 5
    }

    // Category relevance
    if (result.category.toLowerCase().includes(query.toLowerCase())) {
      score += 3
    }

    // Rating boost
    if (result.rating) {
      score += result.rating
    }

    // Verified provider boost
    if (result.verified) {
      score += 2
    }

    // Featured boost
    if (result.featured) {
      score += 5
    }

    // Distance penalty (if location available)
    if (location && result.coordinates) {
      const distance = calculateDistance(
        location.lat, location.lng,
        result.coordinates.lat, result.coordinates.lng
      )
      // Penalty increases with distance (max 5 point penalty)
      score -= Math.min(5, distance / 10000) // 10km = 1 point penalty
    }

    return { ...result, relevanceScore: score }
  }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
}

function matchesQuery(place: any, query: string): boolean {
  const searchText = `${place.name} ${place.description || ''} ${place.category || ''}`.toLowerCase()
  return searchText.includes(query.toLowerCase())
}

function matchesCategory(place: any, category: string): boolean {
  const placeCategory = (place.category || '').toLowerCase()
  return placeCategory.includes(category.toLowerCase())
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000 // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}