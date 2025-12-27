import {
  HeroSection,
  FeaturesSection,
  FeaturedJobsSection,
  StatsSection,
  CTASection,
  HowItWorksSection,
} from "@/components/landing/LandingSections";
import { useAuth } from "@/hooks/useAuth";
import PostJobForm from "./recruiter/PostJobForm";

const Index = () => {
  const { user, role } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* SEO Meta Tags would be added via react-helmet in production */}
      
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <FeaturedJobsSection />
        
        {user && role === 'recruiter' && (
          <div id="post-a-job" className="py-16 px-4 md:px-8 bg-muted/30 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Post a New Job</h2>
              <PostJobForm />
            </div>
          </div>
        )}

        {!user && <CTASection />}
      </main>
      
    </div>
  );
};

export default Index;
