import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X, Home, Grid3X3, MapPin, Bot, BarChart3, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/grid", label: "Grid", icon: Grid3X3 },
  { href: "/tracking", label: "Tracking", icon: MapPin },
  { href: "/companion", label: "AI Companion", icon: Bot },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/donors", label: "Donors", icon: Users },
];

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-semibold tracking-tight">CIE</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Button asChild size="sm" className="bg-gradient-to-r from-terracotta to-amber text-primary-foreground hover:opacity-90">
            <Link to="/donors">Support a Mission</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[320px]">
            <div className="flex flex-col gap-6 mt-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif text-xl font-semibold">CIE</span>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Button asChild className="mt-4 bg-gradient-to-r from-terracotta to-amber text-primary-foreground">
                <Link to="/donors" onClick={() => setIsOpen(false)}>Support a Mission</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
