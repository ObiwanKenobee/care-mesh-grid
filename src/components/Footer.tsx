import { Link } from "react-router-dom";
import { Heart, Grid3X3, MapPin, Bot, BarChart3, Users, Mail, Phone, MapPinned } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-muted/30 border-t border-border/50">
      <div className="container px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-xl font-semibold">CIE</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compassion Infrastructure Engine — Love as infrastructure, not sentiment. Transforming crisis response across Africa.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/grid" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" /> Grid Network
              </Link>
              <Link to="/tracking" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Team Tracking
              </Link>
              <Link to="/companion" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Bot className="w-4 h-4" /> AI Companion
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Dashboard
              </Link>
              <Link to="/donors" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Users className="w-4 h-4" /> Donor Portal
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Resources</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Whitepaper</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact Reports</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partner With Us</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQs</a>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@cie.africa" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> hello@cie.africa
              </a>
              <a href="tel:+2341234567890" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" /> +234 123 456 7890
              </a>
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPinned className="w-4 h-4" /> Lagos, Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Compassion Infrastructure Engine. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
