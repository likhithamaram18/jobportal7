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
      
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedJobsSection />
        <CTASection />
      </main>
      
    </div>
  );
};

export default Index;
