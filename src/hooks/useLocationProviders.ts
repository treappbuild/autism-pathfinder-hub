import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type RemoteCategory =
  | 'Therapists & Specialists'
  | 'Diagnostic Centers'
  | 'Support Groups'
  | 'Educational Services'
  | 'Recreational Programs'
  | 'Adult Services';

export interface RemotePlace {
  id: string;
  name: string;
  category: RemoteCategory;
  lat: number;
  lon: number;
  address?: string;
  phone?: string;
  website?: string;
  distanceKm?: number;
  source: string; // attribution/source label
  osmUrl?: string;
}

interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

const OVERPASS_ENDPOINT = 'https://overpass-api.de/api/interpreter';
const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search';

function buildOverpassQuery(lat: number, lon: number, radiusMeters: number, category: RemoteCategory) {
  // Build an Overpass QL query targeting relevant tags per category
  // References: https://wiki.openstreetmap.org/wiki/Key:healthcare, https://wiki.openstreetmap.org/wiki/Key:social_facility
  let filters: string[] = [];
  switch (category) {
    case 'Therapists & Specialists':
      filters = [
        'nwr["healthcare"~"psychologist|therapy|counselling|speech_therapist|occupational_therapist"]',
        'nwr["amenity"="clinic"]["healthcare"~".*"]',
      ];
      break;
    case 'Diagnostic Centers':
      filters = [
        'nwr["healthcare"~"clinic|diagnostic_centre|hospital"]',
        'nwr["amenity"="clinic"]',
      ];
      break;
    case 'Support Groups':
      filters = [
        'nwr["social_facility"]["social_facility:for"~"autism|disability|special_needs", i]',
        'nwr["amenity"="community_centre"]',
      ];
      break;
    case 'Educational Services':
      filters = [
        'nwr["amenity"="school"]["special_school"="yes"]',
        'nwr["amenity"="school"]["school:for"~"special_needs|autism", i]',
        'nwr["amenity"="college"]["special_needs"="yes"]',
      ];
      break;
    case 'Recreational Programs':
      filters = [
        'nwr["leisure"="sports_centre"]',
        'nwr["leisure"="playground"]["inclusive_playground"="yes"]',
        'nwr["leisure"="playground"]["access:disabled"="yes"]',
        'nwr["amenity"="community_centre"]',
      ];
      break;
    case 'Adult Services':
      filters = [
        'nwr["social_facility"]["social_facility:for"~"adult|disability", i]',
        'nwr["healthcare"~"clinic|therapy"]',
      ];
      break;
    default:
      filters = [
        'nwr["healthcare"~"psychologist|therapy|counselling|speech_therapist|occupational_therapist"]',
        'nwr["amenity"="clinic"]["healthcare"~".*"]',
      ];
  }

  const around = `around:${radiusMeters},${lat},${lon}`;
  const body = `[
    out:json][timeout:25];
    (
      ${filters.map((f) => `${f}(${around});`).join('\n')}
    );
    out body;
    >;
    out skel qt;`;
  return body;
}

async function geocode(query: string): Promise<GeocodeResult | null> {
  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '0');
  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      // Nominatim usage policy requires a valid UA; set a descriptive one
      'User-Agent': 'AutismDirectory/1.0 (+https://lovable.dev)'
    }
  });
  if (!res.ok) return null;
  const data = (await res.json()) as any[];
  if (!data?.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
}

export const useLocationProviders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RemotePlace[]>([]);
  const controllerRef = useRef<AbortController | null>(null);

  const abortOngoing = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  };

  const fetchByCoords = useCallback(
    async (coords: { lat: number; lon: number }, category: RemoteCategory, radiusKm = 25) => {
      try {
        abortOngoing();
        setLoading(true);
        setError(null);
        controllerRef.current = new AbortController();
        const body = buildOverpassQuery(coords.lat, coords.lon, radiusKm * 1000, category);
        const res = await fetch(OVERPASS_ENDPOINT, {
          method: 'POST',
          body,
          headers: { 'Content-Type': 'text/plain' },
          signal: controllerRef.current.signal,
        });
        if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
        const json = await res.json();
        const elements = (json?.elements ?? []) as any[];

        // Build a map of nodes for referencing ways/relations center
        const nodesById = new Map<number, any>();
        elements.forEach((el: any) => {
          if (el.type === 'node') nodesById.set(el.id, el);
        });

        const list: RemotePlace[] = elements
          .filter((el: any) => el.tags && (el.type === 'node' || el.type === 'way' || el.type === 'relation'))
          .map((el: any) => {
            let lat = el.lat;
            let lon = el.lon;
            if (!lat || !lon) {
              // derive center from way/rel via first node if available
              const nd = el.nodes?.[0];
              const node = nd ? nodesById.get(nd) : null;
              if (node) {
                lat = node.lat;
                lon = node.lon;
              }
            }
            const name = el.tags.name || el.tags['operator'] || 'Unnamed location';
            const address = [
              el.tags['addr:housenumber'],
              el.tags['addr:street'],
              el.tags['addr:city'],
              el.tags['addr:state'],
            ]
              .filter(Boolean)
              .join(' ');
            const phone = el.tags.phone || el.tags['contact:phone'];
            const website = el.tags.website || el.tags['contact:website'];
            const distanceKm = lat && lon ?
              haversineKm(coords.lat, coords.lon, lat, lon) : undefined;
            const osmUrl = `https://www.openstreetmap.org/${el.type}/${el.id}`;
            const place: RemotePlace = {
              id: `${el.type}-${el.id}`,
              name,
              category,
              lat: lat ?? coords.lat,
              lon: lon ?? coords.lon,
              address: address || undefined,
              phone,
              website,
              distanceKm,
              source: 'OpenStreetMap (Overpass)',
              osmUrl,
            };
            return place;
          })
          .filter(Boolean)
          .slice(0, 50);

        setResults(list);
      } catch (e: any) {
        if (e?.name === 'AbortError') return;
        setError(e?.message || 'Failed to load providers');
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchByLocation = useCallback(
    async (locationQuery: string, category: RemoteCategory, radiusKm = 25) => {
      const geo = await geocode(locationQuery);
      if (!geo) {
        setError('Could not find that location');
        setResults([]);
        return;
      }
      await fetchByCoords({ lat: geo.lat, lon: geo.lon }, category, radiusKm);
    },
    [fetchByCoords]
  );

  const useMyLocation = useCallback(
    (category: RemoteCategory, radiusKm = 25) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchByCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }, category, radiusKm);
        },
        (err) => {
          setError(err.message || 'Unable to get your location');
          setLoading(false);
        }
      );
    },
    [fetchByCoords]
  );

  useEffect(() => () => abortOngoing(), []);

  const sourceAttribution = useMemo(() => 'Data source: OpenStreetMap contributors (Overpass API)', []);

  return {
    loading,
    error,
    results,
    fetchByLocation,
    fetchByCoords,
    useMyLocation,
    sourceAttribution,
  };
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(v: number) {
  return (v * Math.PI) / 180;
}
