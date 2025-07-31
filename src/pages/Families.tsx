import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, DollarSign, Scale, Users, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";

const Families = () => {
  const navigate = useNavigate();

  const handleResourceClick = (category: string) => {
    const params = new URLSearchParams();
    params.set('category', 'Family Support');
    navigate(`/search?${params.toString()}`);
  };
  const familyResources = [
    {
      icon: Heart,
      title: "Newly Diagnosed Families",
      description: "Essential first steps and guidance for families receiving an autism diagnosis",
      resources: ["First 100 Days Guide", "What to Expect", "Building Your Team", "Insurance Basics"],
      featured: true
    },
    {
      icon: DollarSign,
      title: "Financial Assistance",
      description: "Navigate insurance, funding options, and financial support programs",
      resources: ["Insurance Navigation", "State Funding Programs", "Grants & Scholarships", "Tax Benefits"],
      featured: false
    },
    {
      icon: Scale,
      title: "Legal Rights & Advocacy",
      description: "Understanding your rights and advocating for your child's needs",
      resources: ["Educational Rights", "Advocacy Training", "Legal Resources", "IEP Advocacy"],
      featured: false
    },
    {
      icon: Users,
      title: "Sibling Support",
      description: "Resources and support for brothers and sisters of children with autism",
      resources: ["Sibling Groups", "Age-Appropriate Books", "Family Activities", "Counseling Resources"],
      featured: false
    },
    {
      icon: BookOpen,
      title: "Extended Family Guide",
      description: "Help grandparents and extended family understand and support",
      resources: ["Grandparent Guide", "Family Education", "Communication Tips", "Respite Resources"],
      featured: false
    }
  ];

  const quickGuides = [
    { title: "Getting Started Checklist", description: "Step-by-step guide for new families" },
    { title: "Emergency Preparedness", description: "Planning for emergencies and unexpected situations" },
    { title: "Building Support Networks", description: "Connecting with other families and communities" },
    { title: "Self-Care for Parents", description: "Taking care of yourself while caring for your child" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Resources for Families</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive support and guidance for families navigating autism
          </p>
        </div>

        {/* Featured Resource */}
        <div className="mb-12">
          <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <Badge className="mb-2">Featured Resource</Badge>
                  <CardTitle className="text-2xl">Newly Diagnosed Families Guide</CardTitle>
                  <CardDescription className="text-lg">
                    Your comprehensive roadmap for the first steps after an autism diagnosis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {familyResources[0].resources.map((resource, index) => (
                  <div key={index} className="p-3 bg-background rounded-md">
                    <h4 className="font-medium text-sm">{resource}</h4>
                  </div>
                ))}
              </div>
              <Button size="lg" className="w-full sm:w-auto">
                Access Complete Guide
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resource Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {familyResources.slice(1).map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
                        <span className="text-sm">{resource}</span>
                        <Button variant="ghost" size="sm">View</Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    onClick={() => handleResourceClick(category.title)}
                    Explore All Resources
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Access Guides */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Access Guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickGuides.map((guide, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{guide.title}</CardTitle>
                  <CardDescription className="text-sm">{guide.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Connect with Other Families</h2>
          <p className="text-muted-foreground mb-6">
            Join our community of families for support, advice, and shared experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleResourceClick('Support Groups')}>
              Join Family Forum
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleResourceClick('Support Groups')}>
              Find Local Support Groups
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Families;