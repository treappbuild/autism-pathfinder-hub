import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, Users, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Autism Directory</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Services</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <Link to="/services" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Autism Services Directory</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Find therapists, diagnostic centers, and specialized services
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Families</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <Link to="/families" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Resources for Families</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Support for newly diagnosed families and ongoing resources
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <GraduationCap className="h-4 w-4" />
                <span>Education</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <Link to="/education" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Educational Resources</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      School programs, IEP guidance, and academic support
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Adults</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <Link to="/adults" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <div className="text-sm font-medium leading-none">Adult Autism Support</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Employment, independent living, and adult services
                    </p>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/search">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Search
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-2">
            <Link
              to="/services"
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                isActive("/services") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Autism Services
            </Link>
            <Link
              to="/families"
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                isActive("/families") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Family Resources
            </Link>
            <Link
              to="/education"
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                isActive("/education") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Educational Resources
            </Link>
            <Link
              to="/adults"
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                isActive("/adults") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Adult Support
            </Link>
            <Link
              to="/search"
              className={cn(
                "block px-4 py-2 text-sm rounded-md transition-colors",
                isActive("/search") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;