import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import HowItWorks from "@/components/HowItWorks";
import Philosophy from "@/components/Philosophy";
import ImpactRegions from "@/components/ImpactRegions";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Pillars />
      <HowItWorks />
      <Philosophy />
      <ImpactRegions />
      <CallToAction />
      <Footer />
    </main>
  );
};

export default Index;
