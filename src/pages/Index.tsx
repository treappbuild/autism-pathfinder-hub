import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, GraduationCap, Briefcase, Search, MapPin, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

const Index = () => {
  const quickStats = [
    { number: "3,500+", label: "Service Providers", icon: Heart },
    { number: "1,200+", label: "Support Groups", icon: Users },
    { number: "850+", label: "Educational Programs", icon: GraduationCap },
    { number: "600+", label: "Adult Services", icon: Briefcase }
  ];

  const featuredResources = [
    {
      title: "Newly Diagnosed Guide",
      description: "Essential first steps after an autism diagnosis",
      category: "Family Resources",
      featured: true
    },
    {
      title: "IEP Meeting Toolkit",
      description: "Complete preparation guide for educational planning",
      category: "Educational Resources",
      featured: false
    },
    {
      title: "Employment Success Stories",
      description: "Inspiring career journeys of autistic adults",
      category: "Adult Support",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Autism Directory
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Your comprehensive guide to autism resources, services, and support across all life stages
          </p>
          
          {/* Quick Search */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for services, providers, or resources..."
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Location..."
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-lg sm:w-48"
                />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services">
              <Button size="lg" variant="default">Explore Services</Button>
            </Link>
            <Link to="/families">
              <Button size="lg" variant="outline">Family Resources</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Find What You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/services">
              <Card className="hover:shadow-lg transition-shadow h-full group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Autism Services</CardTitle>
                  <CardDescription>
                    Therapists, diagnostic centers, and specialized care providers
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ArrowRight className="mx-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/families">
              <Card className="hover:shadow-lg transition-shadow h-full group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Family Resources</CardTitle>
                  <CardDescription>
                    Support for newly diagnosed families and ongoing guidance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ArrowRight className="mx-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/education">
              <Card className="hover:shadow-lg transition-shadow h-full group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Educational Resources</CardTitle>
                  <CardDescription>
                    School programs, IEP guidance, and academic support
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ArrowRight className="mx-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/adults">
              <Card className="hover:shadow-lg transition-shadow h-full group">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Adult Support</CardTitle>
                  <CardDescription>
                    Employment, independent living, and adult services
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ArrowRight className="mx-auto h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredResources.map((resource, index) => (
              <Card key={index} className={`hover:shadow-lg transition-shadow ${resource.featured ? 'border-primary bg-primary/5' : ''}`}>
                <CardHeader>
                  {resource.featured && (
                    <Badge className="w-fit mb-2">Featured</Badge>
                  )}
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{resource.category}</Badge>
                    <Button variant="ghost" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of families who have found the support and resources they need
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/search">
              <Button size="lg">Start Searching</Button>
            </Link>
            <Button size="lg" variant="outline">Browse by Location</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
