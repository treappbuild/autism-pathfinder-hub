import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchRequest {
  query: string
  location?: { lat: number; lng: number }
  radius?: number
  type?: 'text_search' | 'nearby_search' | 'place_details' | 'autocomplete'
  category?: string
  useCache?: boolean
}

interface GooglePlacesResult {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: { lat: number; lng: number }
  }
  rating?: number
  user_ratings_total?: number
  types: string[]
  business_status?: string
  website?: string
  formatted_phone_number?: string
  opening_hours?: {
    open_now?: boolean
    weekday_text?: string[]
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const startTime = Date.now()
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    const searchRequest: SearchRequest = await req.json()
    const { query, location, radius = 50000, type = 'text_search', category, useCache = true } = searchRequest

    // Generate cache key
    const cacheParams = { query, location, radius, type, category }
    const cacheKey = `${type}_${await generateHash(JSON.stringify(cacheParams))}`

    let cacheHit = false
    let results: GooglePlacesResult[] = []

    // Check cache first
    if (useCache) {
      const { data: cachedResult } = await supabase
        .from('places_cache')
        .select('results, expires_at')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (cachedResult) {
        console.log('Cache hit for query:', query)
        cacheHit = true
        results = cachedResult.results as GooglePlacesResult[]
      }
    }

    // If no cache hit, fetch from Google Places API
    if (!cacheHit) {
      console.log('Cache miss, fetching from Google Places API')
      
      let googleUrl = 'https://maps.googleapis.com/maps/api/place/'
      const params = new URLSearchParams({ key: googleApiKey })

      if (type === 'text_search') {
        googleUrl += 'textsearch/json'
        params.append('query', query)
        if (location) {
          params.append('location', `${location.lat},${location.lng}`)
          params.append('radius', radius.toString())
        }
      } else if (type === 'nearby_search') {
        googleUrl += 'nearbysearch/json'
        if (location) {
          params.append('location', `${location.lat},${location.lng}`)
          params.append('radius', radius.toString())
        }
        params.append('keyword', query)
      } else if (type === 'autocomplete') {
        googleUrl += 'autocomplete/json'
        params.append('input', query)
        if (location) {
          params.append('location', `${location.lat},${location.lng}`)
          params.append('radius', radius.toString())
        }
      }

      // Add autism-related place types and keywords
      if (type !== 'autocomplete') {
        params.append('type', 'health|doctor|hospital|physiotherapist|establishment')
      }

      const response = await fetch(`${googleUrl}?${params}`)
      const data = await response.json()

      if (data.status === 'OK') {
        results = data.results || []

        // Cache the results (TTL: 24 hours for searches, 7 days for place details)
        const ttlHours = type === 'place_details' ? 168 : 24
        const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000)

        await supabase
          .from('places_cache')
          .upsert({
            cache_key: cacheKey,
            search_type: type,
            query_params: cacheParams,
            results: results,
            source: 'google_places',
            location_lat: location?.lat,
            location_lng: location?.lng,
            radius_meters: radius,
            expires_at: expiresAt.toISOString()
          })

        // Track API usage
        await supabase
          .from('api_usage_tracking')
          .upsert({
            api_provider: 'google_places',
            endpoint: type,
            request_count: 1,
            estimated_cost: calculateCost(type, results.length),
            date: new Date().toISOString().split('T')[0]
          }, {
            onConflict: 'api_provider,endpoint,date'
          })
      } else {
        console.error('Google Places API error:', data)
        throw new Error(`Google Places API error: ${data.status}`)
      }
    }

    const responseTime = Date.now() - startTime

    // Log search analytics
    await supabase
      .from('search_analytics')
      .insert({
        search_query: query,
        search_type: type,
        location_lat: location?.lat,
        location_lng: location?.lng,
        category: category,
        cache_hit: cacheHit,
        response_time_ms: responseTime,
        result_count: results.length,
        api_cost_estimate: cacheHit ? 0 : calculateCost(type, results.length),
        user_agent: req.headers.get('user-agent') || ''
      })

    // Transform results to standardized format
    const transformedResults = results.map(place => ({
      id: place.place_id,
      name: place.name,
      description: `${place.types?.join(', ') || 'Healthcare Provider'} in ${place.formatted_address}`,
      category: mapGoogleTypesToCategory(place.types || []),
      location: place.formatted_address,
      website: place.website || '',
      phone: place.formatted_phone_number || '',
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      coordinates: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng
      },
      openNow: place.opening_hours?.open_now,
      businessStatus: place.business_status,
      type: 'provider' as const,
      featured: false,
      verified: true,
      source: 'google_places'
    }))

    return new Response(JSON.stringify({
      results: transformedResults,
      totalResults: transformedResults.length,
      cacheHit,
      responseTime,
      source: 'google_places'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in google-places-search function:', error)
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

async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function calculateCost(type: string, resultCount: number): number {
  // Google Places API pricing (approximate)
  const baseCosts = {
    'text_search': 0.032,
    'nearby_search': 0.032,
    'place_details': 0.017,
    'autocomplete': 0.00283
  }
  return baseCosts[type as keyof typeof baseCosts] || 0.032
}

function mapGoogleTypesToCategory(types: string[]): string {
  const categoryMap: { [key: string]: string } = {
    'doctor': 'Medical Care',
    'hospital': 'Medical Care',
    'physiotherapist': 'Therapy Services',
    'psychologist': 'Mental Health',
    'health': 'Medical Care',
    'establishment': 'Healthcare Provider',
    'school': 'Education',
    'university': 'Education',
    'library': 'Education',
    'gym': 'Recreation',
    'park': 'Recreation'
  }

  for (const type of types) {
    if (categoryMap[type]) {
      return categoryMap[type]
    }
  }
  
  return 'Healthcare Provider'
}