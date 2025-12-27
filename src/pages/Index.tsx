import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HeroSection,
  FeaturesSection,
  FeaturedJobsSection,
  StatsSection,
  CTASection,
  HowItWorksSection,
} from "@/components/landing/LandingSections";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Meta Tags would be added via react-helmet in production */}
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedJobsSection />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
