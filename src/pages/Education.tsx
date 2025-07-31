import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, FileText, Home, Users, ArrowRight, BookOpen } from "lucide-react";
import Navigation from "@/components/Navigation";

const Education = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams();
    params.set('category', 'Educational Resources');
    navigate(`/search?${params.toString()}`);
  };
  const educationCategories = [
    {
      icon: GraduationCap,
      title: "School District Programs",
      description: "Special education programs and services by district",
      count: "2,341 programs",
      features: ["Program Search", "District Reviews", "Contact Information", "Enrollment Process"]
    },
    {
      icon: FileText,
      title: "IEP & 504 Plans",
      description: "Complete guidance for individualized education plans",
      count: "150+ resources",
      features: ["IEP Templates", "Goal Examples", "Meeting Prep", "Rights & Advocacy"]
    },
    {
      icon: Home,
      title: "Homeschooling Resources",
      description: "Curriculum, support, and legal guidance for homeschooling",
      count: "89 curriculums",
      features: ["Curriculum Reviews", "Legal Requirements", "Support Groups", "Assessment Tools"]
    },
    {
      icon: Users,
      title: "College Preparation",
      description: "Transition planning and higher education support",
      count: "245 programs",
      features: ["College Programs", "Transition Planning", "Disability Services", "Career Prep"]
    }
  ];

  const ageGroups = [
    { age: "Early Intervention (0-3)", color: "bg-blue-500", programs: 456 },
    { age: "Preschool (3-5)", color: "bg-green-500", programs: 789 },
    { age: "Elementary (6-11)", color: "bg-yellow-500", programs: 1234 },
    { age: "Middle School (12-14)", color: "bg-orange-500", programs: 567 },
    { age: "High School (15-18)", color: "bg-red-500", programs: 890 },
    { age: "Post-Secondary (18+)", color: "bg-purple-500", programs: 234 }
  ];

  const quickTools = [
    { title: "IEP Meeting Checklist", description: "Prepare for your child's IEP meeting" },
    { title: "Accommodation Finder", description: "Find appropriate accommodations by need" },
    { title: "Progress Tracking Sheet", description: "Monitor your child's educational progress" },
    { title: "Transition Timeline", description: "Plan for transitions between grade levels" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive guidance for autism education from early intervention through adulthood
          </p>
        </div>

        {/* Age Group Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Browse by Age Group</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ageGroups.map((group, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${group.color} mx-auto mb-3 flex items-center justify-center text-white font-bold`}>
                    {group.age.split('(')[1]?.split(')')[0] || group.age.charAt(0)}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{group.age}</h3>
                  <Badge variant="secondary" className="text-xs">{group.programs} programs</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Categories */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {educationCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs mt-1">{category.count}</Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    Explore {category.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Tools & Resources</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTools.map((tool, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleCategoryClick(category.title)}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-4">Need Help Navigating Your Child's Education?</h2>
            <p className="text-muted-foreground">
              Our education advocates can help you understand your options and fight for your child's needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => handleCategoryClick('Educational Services')}>
              Schedule Consultation
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleCategoryClick('Educational Resources')}>
              Browse Success Stories
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Education;