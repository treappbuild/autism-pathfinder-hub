import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, Star, Phone, Globe, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useSearch } from "@/hooks/useSearch";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    searchTerm, 
    setSearchTerm, 
    filters, 
    updateFilter, 
    results, 
    totalResults, 
    categories 
  } = useSearch();
  
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    // Initialize search term and location from URL params
    const urlSearchTerm = searchParams.get('q') || '';
    const urlLocation = searchParams.get('location') || '';
    
    if (urlSearchTerm !== searchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    if (urlLocation !== filters.location) {
      updateFilter('location', urlLocation);
    }
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (filters.location) params.set('location', filters.location);
    if (filters.category) params.set('category', filters.category);
    setSearchParams(params);
  };


  const filters = [
    { id: "insurance", label: "Accepts Insurance", checked: false },
    { id: "telehealth", label: "Offers Telehealth", checked: false },
    { id: "weekend", label: "Weekend Hours", checked: false },
    { id: "languages", label: "Multilingual", checked: false },
    { id: "sliding", label: "Sliding Scale Fees", checked: false }
  ];

  // Sort results based on selected criteria
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0; // relevance - keep original order
    }
  });

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
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter location..."
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
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
                Showing {sortedResults.length} of {totalResults} results
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Most Relevant</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviewed</SelectItem>
                  <SelectItem value="name">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results List */}
          {sortedResults.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button onClick={() => {
                  setSearchTerm('');
                  updateFilter('location', '');
                  updateFilter('category', '');
                }}>
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{result.name}</CardTitle>
                      <Badge variant="secondary">{result.category}</Badge>
                      {result.featured && <Badge className="bg-primary">Featured</Badge>}
                      {result.verified && <Badge variant="outline">Verified</Badge>}
                    </div>
                    {result.rating && (
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{result.rating}</span>
                        <span>({result.reviewCount} reviews)</span>
                      </div>
                      </div>
                    )}
                    <CardDescription className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{result.location}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <Button onClick={() => window.open(result.website, '_blank')}>
                      Visit Website
                    </Button>
                    {result.phone && (
                      <Button variant="outline" onClick={() => window.open(`tel:${result.phone}`)}>
                        Call Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {result.phone && (
                    <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{result.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate">{result.website}</span>
                  </div>
                  {result.telehealth && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Telehealth Available</span>
                    </div>
                  )}
                </div>
                {result.services && result.services.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm font-medium">Services: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {result.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {result.specialties && result.specialties.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">Specialties: </span>
                    <span className="text-sm text-muted-foreground">
                      {result.specialties.join(", ")}
                    </span>
                  </div>
                )}
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