import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Home, Users, Brain, Heart, ArrowRight } from "lucide-react";
import Navigation from "@/components/Navigation";

const Adults = () => {
  const adultServices = [
    {
      icon: Briefcase,
      title: "Employment Services",
      description: "Job coaching, vocational training, and employment support programs",
      count: "1,156 services",
      features: [
        "Job Coaching Programs",
        "Vocational Rehabilitation",
        "Autism-Friendly Employers",
        "Interview Preparation",
        "Workplace Accommodations"
      ]
    },
    {
      icon: Home,
      title: "Independent Living",
      description: "Housing options, life skills training, and daily living support",
      count: "567 resources",
      features: [
        "Housing Programs",
        "Life Skills Training",
        "Financial Management",
        "Transportation Resources",
        "Daily Living Support"
      ]
    },
    {
      icon: Users,
      title: "Social Skills Groups",
      description: "Peer support groups and social skill development programs",
      count: "423 groups",
      features: [
        "Adult Social Groups",
        "Communication Skills",
        "Friendship Building",
        "Community Activities",
        "Online Communities"
      ]
    },
    {
      icon: Brain,
      title: "Mental Health Services",
      description: "Specialized mental health support for autistic adults",
      count: "789 providers",
      features: [
        "Autism-Informed Therapy",
        "Anxiety & Depression Support",
        "Crisis Services",
        "Peer Counseling",
        "Family Therapy"
      ]
    },
    {
      icon: Heart,
      title: "Relationships & Dating",
      description: "Support for developing romantic relationships and social connections",
      count: "234 resources",
      features: [
        "Dating Skills Classes",
        "Relationship Counseling",
        "Social Clubs",
        "Online Dating Safety",
        "Communication Training"
      ]
    }
  ];

  const lifeStages = [
    {
      stage: "Young Adults (18-25)",
      description: "Transition from school to adult life",
      focus: "Education, first jobs, independence",
      color: "bg-blue-500"
    },
    {
      stage: "Working Adults (25-40)",
      description: "Career development and relationships",
      focus: "Career growth, housing, partnerships",
      color: "bg-green-500"
    },
    {
      stage: "Midlife Adults (40-60)",
      description: "Stability and community involvement",
      focus: "Career stability, advocacy, mentoring",
      color: "bg-orange-500"
    },
    {
      stage: "Older Adults (60+)",
      description: "Aging and retirement planning",
      focus: "Health, retirement, legacy planning",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Adult Autism Support</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive resources for autistic adults pursuing independence, careers, and fulfilling relationships
          </p>
        </div>

        {/* Life Stages Navigation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Support by Life Stage</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifeStages.map((stage, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-4 h-4 rounded-full ${stage.color} mb-2`}></div>
                  <CardTitle className="text-base">{stage.stage}</CardTitle>
                  <CardDescription className="text-sm">{stage.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">{stage.focus}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div className="space-y-6 mb-12">
          {adultServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{service.title}</CardTitle>
                        <CardDescription className="text-base mt-1">{service.description}</CardDescription>
                        <Badge variant="secondary" className="mt-2">{service.count}</Badge>
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2 p-2 bg-muted/50 rounded-md">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="flex-1">Browse {service.title}</Button>
                    <Button variant="outline" className="flex-1">Find Near Me</Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Stories Section */}
        <div className="mb-12">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Success Stories</CardTitle>
              <CardDescription className="text-lg">
                Read inspiring stories from autistic adults who have achieved their goals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">Career Success</h4>
                  <p className="text-sm text-muted-foreground">Stories of professional achievement</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">Independent Living</h4>
                  <p className="text-sm text-muted-foreground">Journeys to self-sufficiency</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">Relationships</h4>
                  <p className="text-sm text-muted-foreground">Building meaningful connections</p>
                </div>
              </div>
              <Button size="lg">Read Success Stories</Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Section */}
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-muted-foreground mb-6">
            Connect with our adult support specialists for personalized guidance and resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Schedule Consultation</Button>
            <Button variant="outline" size="lg">Join Adult Community</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Adults;