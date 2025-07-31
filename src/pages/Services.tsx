import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Brain, Stethoscope, GraduationCap } from "lucide-react";
import Navigation from "@/components/Navigation";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('q', searchTerm);
    if (locationTerm) params.set('location', locationTerm);
    navigate(`/search?${params.toString()}`);
  };

  const handleCategorySearch = (category: string) => {
    const params = new URLSearchParams();
    params.set('category', category);
    if (locationTerm) params.set('location', locationTerm);
    navigate(`/search?${params.toString()}`);
  };
  const serviceCategories = [
    {
      icon: Brain,
      title: "Therapists & Specialists",
      description: "ABA, speech, occupational therapy, and behavioral specialists",
      count: "1,247 providers",
      subcategories: ["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Behavioral Specialists"]
    },
    {
      icon: Stethoscope,
      title: "Diagnostic Centers",
      description: "Autism assessment and diagnostic services",
      count: "342 centers",
      subcategories: ["Pediatric Clinics", "Psychology Centers", "Developmental Specialists", "Hospital Programs"]
    },
    {
      icon: Users,
      title: "Support Groups",
      description: "Community organizations and peer support",
      count: "896 groups",
      subcategories: ["Parent Support", "Sibling Groups", "Adult Groups", "Online Communities"]
    },
    {
      icon: GraduationCap,
      title: "Educational Services",
      description: "Specialized tutoring and academic support",
      count: "523 providers",
      subcategories: ["Special Education", "Tutoring", "Academic Coaching", "Learning Centers"]
    },
    {
      icon: MapPin,
      title: "Recreational Programs",
      description: "Camps, activities, and social programs",
      count: "445 programs",
      subcategories: ["Summer Camps", "Sports Programs", "Art Classes", "Social Skills Groups"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Autism Services Directory</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find trusted therapists, specialists, and support services in your area
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <Button size="lg" onClick={handleSearch}>Search</Button>
          </div>
        </div>

        {/* Service Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {serviceCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.subcategories.map((sub, subIndex) => (
                      <Badge key={subIndex} variant="outline" className="mr-2 mb-1">
                        {sub}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleCategorySearch(category.title)}
                  >
                    Browse {category.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Section */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Need Help Finding Services?</h2>
          <p className="text-muted-foreground mb-6">
            Our team can help match you with the right providers based on your specific needs and location.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Get Personalized Recommendations</Button>
            <Button variant="outline" size="lg">Browse by Location</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;