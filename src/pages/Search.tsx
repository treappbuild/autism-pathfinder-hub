import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, Star, Phone, Globe, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

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

  const sampleResults = [
    {
      id: 1,
      name: "Autism Spectrum Therapies",
      category: "ABA Therapy",
      rating: 4.8,
      reviews: 127,
      address: "123 Main St, Springfield, IL",
      phone: "(555) 123-4567",
      website: "www.autismtherapies.com",
      distance: "2.3 miles",
      hours: "Mon-Fri 8am-6pm",
      accepts: ["Insurance", "Medicaid", "Private Pay"],
      specialties: ["Early Intervention", "School-Age", "Social Skills"]
    },
    {
      id: 2,
      name: "Children's Developmental Center",
      category: "Diagnostic Services",
      rating: 4.6,
      reviews: 89,
      address: "456 Oak Ave, Springfield, IL",
      phone: "(555) 987-6543",
      website: "www.childrensdevelopment.org",
      distance: "3.7 miles",
      hours: "Mon-Thu 9am-5pm",
      accepts: ["Insurance", "Private Pay"],
      specialties: ["ADOS Assessment", "Psychological Testing", "Early Diagnosis"]
    },
    {
      id: 3,
      name: "Midwest Autism Support Group",
      category: "Support Groups",
      rating: 4.9,
      reviews: 45,
      address: "789 Community Center Dr, Springfield, IL",
      phone: "(555) 456-7890",
      website: "www.midwestautism.org",
      distance: "1.8 miles",
      hours: "2nd Saturdays 10am-12pm",
      accepts: ["Free"],
      specialties: ["Parent Support", "Newly Diagnosed", "Spanish-Speaking"]
    }
  ];

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
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
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
              <Button size="lg" className="w-full sm:w-auto">
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
                Showing {sampleResults.length} of 156 results
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
          {sampleResults.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{result.name}</CardTitle>
                      <Badge variant="secondary">{result.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{result.rating}</span>
                        <span>({result.reviews} reviews)</span>
                      </div>
                      <span>•</span>
                      <span>{result.distance}</span>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{result.address}</span>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                    <Button>Contact</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{result.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{result.website}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{result.hours}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {result.accepts.map((payment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {payment}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Specialties: </span>
                  <span className="text-sm text-muted-foreground">
                    {result.specialties.join(", ")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
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