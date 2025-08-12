import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Filter, Phone, Globe, LocateFixed } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useSearchParams } from "react-router-dom";
import { useLocationProviders } from "@/hooks/useLocationProviders";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Therapists & Specialists" | "Diagnostic Centers" | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [params] = useSearchParams();
  const { results: remoteResults, loading, error, fetchByLocation, useMyLocation, sourceAttribution } = useLocationProviders();

  const categories = [
    "Therapists & Specialists",
    "Diagnostic Centers",
    "Support Groups",
    "Educational Services",
    "Recreational Programs",
    "Adult Services"
  ];

  const filters = [
    { id: "insurance", label: "Accepts Insurance", checked: false },
    { id: "telehealth", label: "Offers Telehealth", checked: false },
    { id: "weekend", label: "Weekend Hours", checked: false },
    { id: "languages", label: "Multilingual", checked: false },
    { id: "sliding", label: "Sliding Scale Fees", checked: false }
  ];

  // Initialize from URL params and optionally auto-search
  useEffect(() => {
    const q = params.get('q') || '';
    const loc = params.get('location') || '';
    const cat = (params.get('category') as any) || '';
    const geo = params.get('geo');
    if (q) setSearchTerm(q);
    if (loc) setLocation(loc);
    if (cat) setSelectedCategory(cat);
    const effectiveCategory = (cat || selectedCategory || 'Therapists & Specialists') as any;
    if (geo === '1') {
      useMyLocation(effectiveCategory);
    } else if (loc && (effectiveCategory === 'Therapists & Specialists' || effectiveCategory === 'Diagnostic Centers')) {
      fetchByLocation(loc, effectiveCategory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const effectiveCategory = (selectedCategory || 'Therapists & Specialists') as any;
    if (location && (effectiveCategory === 'Therapists & Specialists' || effectiveCategory === 'Diagnostic Centers')) {
      fetchByLocation(location, effectiveCategory);
    }
  };

  const resultsToShow = remoteResults;
  const totalCount = resultsToShow.length;
  const formatMiles = (km?: number) => (km ? `${(km * 0.621371).toFixed(1)} miles` : undefined);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Search Autism Resources</h1>
          <p className="text-muted-foreground mb-6">
            Find trusted providers, services, and support in your area
          </p>
          
          {/* Main Search Form */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <div className="grid lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for services, providers, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="mt-2">
                  <Button variant="ghost" size="sm" onClick={() => useMyLocation((selectedCategory || 'Therapists & Specialists') as any)} className="inline-flex items-center gap-2">
                    <LocateFixed className="h-4 w-4" /> Use my location
                  </Button>
                </div>
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
              <Button size="lg" className="w-full sm:w-auto" onClick={handleSearch}>
                Search
              </Button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">Additional Filters</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filters.map((filter) => (
                    <div key={filter.id} className="flex items-center space-x-2">
                      <Checkbox id={filter.id} />
                      <label htmlFor={filter.id} className="text-sm">
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Showing {totalCount} result{totalCount === 1 ? '' : 's'}
                </span>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="distance">Nearest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

          {/* Results List */}
          {loading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-6 w-1/3 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </Card>
              ))}
            </div>
          ) : resultsToShow.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              No results yet. Enter a location and press Search, or use "Use my location".
            </div>
          ) : (
            resultsToShow.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-xl">{result.name}</CardTitle>
                        <Badge variant="secondary">{result.category}</Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        {result.distanceKm ? (
                          <span>{formatMiles(result.distanceKm)} away</span>
                        ) : null}
                      </div>
                      {result.address && (
                        <CardDescription className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{result.address}</span>
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                      {result.phone ? (
                        <Button asChild>
                          <a href={`tel:${result.phone}`}>Contact</a>
                        </Button>
                      ) : (
                        <Button disabled>Contact</Button>
                      )}
                      <Button variant="outline" asChild>
                        <a href={result.website || result.osmUrl} target="_blank" rel="noreferrer">View Details</a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{result.phone}</span>
                      </div>
                    )}
                    {result.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[280px]">{result.website}</span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground self-center">{sourceAttribution}</div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>Previous</Button>
            <Button>1</Button>
            <Button variant="outline">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;