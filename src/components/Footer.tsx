import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-terracotta to-amber flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-medium">CIE</span>
          </div>
          
          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center">
            Compassion Infrastructure Engine — Love as infrastructure, not sentiment.
          </p>
          
          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Whitepaper</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
