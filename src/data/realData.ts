export interface ServiceProvider {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email?: string;
    website: string;
  };
  services: string[];
  specialties: string[];
  ageGroups: string[];
  insurance: string[];
  rating: number;
  reviewCount: number;
  featured: boolean;
  verified: boolean;
  telehealth: boolean;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'national' | 'local' | 'online';
  website: string;
  phone?: string;
  email?: string;
  services: string[];
  targetAudience: string[];
  resources: string[];
  featured: boolean;
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'guide' | 'tool' | 'program' | 'service';
  ageGroup: string;
  provider: string;
  website: string;
  cost: 'free' | 'paid' | 'varies';
  downloadable: boolean;
  featured: boolean;
}

// Real Autism Service Providers Data
export const serviceProviders: ServiceProvider[] = [
  {
    id: "card-1",
    name: "Center for Autism and Related Disorders (CARD)",
    description: "One of the world's largest ABA treatment providers with over 30 years of experience serving children and adults with autism.",
    category: "Therapy Centers",
    subcategory: "ABA Therapy",
    location: {
      address: "19019 Ventura Blvd",
      city: "Tarzana",
      state: "CA",
      zipCode: "91356",
      coordinates: { lat: 34.1689, lng: -118.5426 }
    },
    contact: {
      phone: "(855) 345-2273",
      email: "info@centerforautism.com",
      website: "https://centerforautism.com"
    },
    services: ["Applied Behavior Analysis (ABA)", "Early Intervention", "School Consultation", "Parent Training"],
    specialties: ["Autism Spectrum Disorder", "Developmental Delays", "Behavioral Challenges"],
    ageGroups: ["Toddlers (18 months - 3 years)", "Preschool (3-5 years)", "School Age (6-17 years)", "Adults (18+ years)"],
    insurance: ["Most major insurance plans", "Medicaid", "Tricare"],
    rating: 4.8,
    reviewCount: 245,
    featured: true,
    verified: true,
    telehealth: true
  },
  {
    id: "cortica-1",
    name: "Cortica",
    description: "Comprehensive autism care with medical, therapeutic, and behavioral services all in one place.",
    category: "Diagnostic Centers",
    subcategory: "Comprehensive Care",
    location: {
      address: "Multiple Locations",
      city: "Nationwide",
      state: "Multiple States",
      zipCode: "Various",
      coordinates: { lat: 39.8283, lng: -98.5795 }
    },
    contact: {
      phone: "(833) 267-8422",
      website: "https://www.corticacare.com"
    },
    services: ["Autism Diagnosis", "ABA Therapy", "Speech Therapy", "Occupational Therapy", "Medical Care"],
    specialties: ["Autism Spectrum Disorder", "ADHD", "Developmental Delays"],
    ageGroups: ["Toddlers (18 months - 3 years)", "Preschool (3-5 years)", "School Age (6-17 years)"],
    insurance: ["Most major insurance plans", "Medicaid"],
    rating: 4.6,
    reviewCount: 189,
    featured: true,
    verified: true,
    telehealth: true
  },
  {
    id: "hopebridge-1",
    name: "Hopebridge Autism Therapy Centers",
    description: "Providing comprehensive autism therapy with 360 Care approach combining multiple therapeutic disciplines.",
    category: "Therapy Centers",
    subcategory: "Multi-Disciplinary",
    location: {
      address: "Multiple Locations",
      city: "Midwest & Southeast",
      state: "Multiple States",
      zipCode: "Various",
      coordinates: { lat: 39.1612, lng: -87.5847 }
    },
    contact: {
      phone: "(317) 826-2966",
      website: "https://www.hopebridge.com"
    },
    services: ["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Diagnostic Evaluations"],
    specialties: ["Autism Spectrum Disorder", "Sensory Processing", "Communication Delays"],
    ageGroups: ["Toddlers (18 months - 3 years)", "Preschool (3-5 years)", "School Age (6-12 years)"],
    insurance: ["Most major insurance plans", "Medicaid"],
    rating: 4.7,
    reviewCount: 156,
    featured: false,
    verified: true,
    telehealth: false
  },
  {
    id: "success-spectrum-1",
    name: "Success on the Spectrum",
    description: "National franchise providing ABA, speech, and occupational therapy with social skills group classes.",
    category: "Therapy Centers",
    subcategory: "Multi-Disciplinary",
    location: {
      address: "Multiple Locations",
      city: "Nationwide",
      state: "Multiple States",
      zipCode: "Various",
      coordinates: { lat: 39.8283, lng: -98.5795 }
    },
    contact: {
      phone: "(877) 737-4776",
      website: "https://successonthespectrum.com"
    },
    services: ["ABA Therapy", "Speech Therapy", "Occupational Therapy", "Social Skills Groups"],
    specialties: ["Autism Spectrum Disorder", "Social Communication", "Behavioral Intervention"],
    ageGroups: ["Preschool (3-5 years)", "School Age (6-17 years)", "Young Adults (18-25 years)"],
    insurance: ["Most major insurance plans", "Self-pay options"],
    rating: 4.5,
    reviewCount: 98,
    featured: false,
    verified: true,
    telehealth: true
  }
];

// Real Family Support Organizations
export const familyOrganizations: Organization[] = [
  {
    id: "autism-speaks-1",
    name: "Autism Speaks",
    description: "Leading autism advocacy organization providing support, resources, and advocacy for individuals with autism and their families.",
    category: "Family Support",
    type: "national",
    website: "https://www.autismspeaks.org",
    phone: "(646) 385-8500",
    email: "help@autismspeaks.org",
    services: ["Advocacy", "Resource Library", "100 Day Kit", "Autism Response Team", "Financial Assistance Directory"],
    targetAudience: ["Newly Diagnosed Families", "Parents", "Siblings", "Extended Family"],
    resources: ["100 Day Kit for Newly Diagnosed", "Financial Resource Guide", "IEP Goal Bank", "Safety Tools"],
    featured: true
  },
  {
    id: "autism-society-1",
    name: "Autism Society of America",
    description: "Grassroots autism organization with local chapters providing support, education, and advocacy nationwide.",
    category: "Family Support",
    type: "national",
    website: "https://autismsociety.org",
    phone: "(800) 328-8476",
    services: ["Local Support Groups", "Educational Workshops", "Advocacy Training", "Information & Referral"],
    targetAudience: ["Families", "Individuals with Autism", "Professionals", "Community Members"],
    resources: ["Resource Database", "Educational Materials", "Support Group Directory"],
    featured: true
  },
  {
    id: "arc-1",
    name: "Autism Resource Central",
    description: "Comprehensive autism resource center providing information, support, and advocacy for families in New England.",
    category: "Family Support",
    type: "local",
    website: "https://www.autismresourcecentral.org",
    phone: "(508) 835-4278",
    email: "AutismResourceCenter@Advocates.org",
    services: ["Resource Navigation", "Family Support", "Educational Advocacy", "Transition Planning"],
    targetAudience: ["Newly Diagnosed Families", "School-Age Children", "Young Adults"],
    resources: ["Resource Guides", "Webinar Series", "Family Support Groups"],
    featured: false
  }
];

// Real Educational Resources
export const educationalResources: EducationalResource[] = [
  {
    id: "iep-guide-1",
    title: "IEP vs 504 Plan: Complete Parent Guide",
    description: "Comprehensive guide explaining the differences between IEPs and 504 plans, eligibility criteria, and how to advocate for your child.",
    category: "IEP & 504 Plans",
    type: "guide",
    ageGroup: "School Age (3-21 years)",
    provider: "Life Skills Advocate",
    website: "https://lifeskillsadvocate.com/blog/iep-vs-504/",
    cost: "free",
    downloadable: true,
    featured: true
  },
  {
    id: "autism-education-1",
    title: "Autism and Education Resource Hub",
    description: "Comprehensive educational resources including IEP goals, classroom strategies, and transition planning.",
    category: "School Support",
    type: "tool",
    ageGroup: "All School Ages",
    provider: "Autism Speaks",
    website: "https://www.autismspeaks.org/autism-and-education",
    cost: "free",
    downloadable: true,
    featured: true
  },
  {
    id: "undivided-iep-1",
    title: "School Supports and IEP Accommodations for Autism",
    description: "Detailed guide on school supports, IEP accommodations, and 504 plan options specifically for students with autism.",
    category: "IEP & 504 Plans",
    type: "guide",
    ageGroup: "School Age (3-21 years)",
    provider: "Undivided",
    website: "https://undivided.io/resources/school-supports-and-iep-504-accommodations-for-autism-1340",
    cost: "free",
    downloadable: false,
    featured: false
  }
];

// Real Adult Support Services
export const adultServices: Organization[] = [
  {
    id: "easterseals-1",
    name: "Easterseals Adult Autism Services",
    description: "Comprehensive support for autistic adults including employment services, independent living support, and social activities.",
    category: "Adult Support",
    type: "national",
    website: "https://www.easterseals.com/programs-and-services/autism-services/adults-with-autism.html",
    services: ["Employment Support", "Independent Living Training", "Social Skills Groups", "Day Programs"],
    targetAudience: ["Adults with Autism", "Young Adults in Transition", "Families"],
    resources: ["Employment Resources", "Independent Living Guides", "Social Activity Programs"],
    featured: true
  },
  {
    id: "asperger-works-1",
    name: "Asperger Works",
    description: "Employment and career services specifically designed for adults on the autism spectrum.",
    category: "Employment Services",
    type: "national",
    website: "https://aspergerworks.org",
    phone: "(351) 208-9450",
    email: "info@aspergerworks.org",
    services: ["Job Coaching", "Career Counseling", "Skills Training", "Employer Education"],
    targetAudience: ["Adults with Autism", "Employers", "Job Seekers"],
    resources: ["Job Search Tools", "Resume Templates", "Interview Preparation"],
    featured: true
  }
];