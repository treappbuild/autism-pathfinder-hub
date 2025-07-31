import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { serviceProviders, familyOrganizations, educationalResources, adultServices } from '@/data/realData';
import type { ServiceProvider, Organization, EducationalResource } from '@/data/realData';

export interface SearchFilters {
  category: string;
  location: string;
  ageGroup: string;
  insurance: string;
  telehealth: boolean;
  rating: number;
}

export interface SearchResult {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  website: string;
  phone?: string;
  rating?: number;
  reviewCount?: number;
  specialties?: string[];
  services?: string[];
  type: 'provider' | 'organization' | 'resource';
  featured: boolean;
  verified?: boolean;
  telehealth?: boolean;
}

export const useSearch = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    ageGroup: '',
    insurance: '',
    telehealth: false,
    rating: 0
  });

  const allResults = useMemo(() => {
    const providerResults: SearchResult[] = serviceProviders.map(provider => ({
      id: provider.id,
      name: provider.name,
      description: provider.description,
      category: provider.category,
      location: `${provider.location.city}, ${provider.location.state}`,
      website: provider.contact.website,
      phone: provider.contact.phone,
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      specialties: provider.specialties,
      services: provider.services,
      type: 'provider' as const,
      featured: provider.featured,
      verified: provider.verified,
      telehealth: provider.telehealth
    }));

    const organizationResults: SearchResult[] = [...familyOrganizations, ...adultServices].map(org => ({
      id: org.id,
      name: org.name,
      description: org.description,
      category: org.category,
      location: org.type === 'national' ? 'Nationwide' : org.type === 'local' ? 'Regional' : 'Online',
      website: org.website,
      phone: org.phone,
      services: org.services,
      type: 'organization' as const,
      featured: org.featured,
      verified: true
    }));

    const resourceResults: SearchResult[] = educationalResources.map(resource => ({
      id: resource.id,
      name: resource.title,
      description: resource.description,
      category: resource.category,
      location: 'Online',
      website: resource.website,
      services: [resource.type],
      type: 'resource' as const,
      featured: resource.featured,
      verified: true
    }));

    return [...providerResults, ...organizationResults, ...resourceResults];
  }, []);

  const filteredResults = useMemo(() => {
    return allResults.filter(result => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          result.name.toLowerCase().includes(searchLower) ||
          result.description.toLowerCase().includes(searchLower) ||
          result.category.toLowerCase().includes(searchLower) ||
          result.services?.some(service => service.toLowerCase().includes(searchLower)) ||
          result.specialties?.some(specialty => specialty.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'all') {
        if (!result.category.toLowerCase().includes(filters.category.toLowerCase())) {
          return false;
        }
      }

      // Location filter
      if (filters.location) {
        const locationLower = filters.location.toLowerCase();
        const matchesLocation = 
          result.location.toLowerCase().includes(locationLower) ||
          (result.type === 'provider' && 
           serviceProviders.find(p => p.id === result.id)?.location.state.toLowerCase().includes(locationLower)) ||
          (result.type === 'provider' && 
           serviceProviders.find(p => p.id === result.id)?.location.city.toLowerCase().includes(locationLower));
        
        if (!matchesLocation) {
          return false;
        }
      }

      // Rating filter
      if (filters.rating > 0 && result.rating) {
        if (result.rating < filters.rating) {
          return false;
        }
      }

      // Telehealth filter
      if (filters.telehealth && result.telehealth !== undefined) {
        if (!result.telehealth) {
          return false;
        }
      }

      return true;
    });
  }, [allResults, searchTerm, filters]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      location: '',
      ageGroup: '',
      insurance: '',
      telehealth: false,
      rating: 0
    });
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    results: filteredResults,
    totalResults: filteredResults.length,
    featuredResults: filteredResults.filter(r => r.featured),
    categories: [...new Set(allResults.map(r => r.category))],
    locations: [...new Set(allResults.map(r => r.location))]
  };
};