import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import PostJobForm from './recruiter/PostJobForm';

const ForRecruitersPage = () => {
  const { user, role } = useAuth();

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 px-4 bg-muted/30"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find the Best Graduate Talent
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          GradHire is the premier platform for connecting with ambitious and skilled graduates ready to make an impact.
        </p>
        {!user && (
          <a href="/auth">
              <Button variant="hero" size="lg" className="mt-8">Get Started</Button>
          </a>
        )}
      </motion.div>

      {/* Why GradHire Section */}
      <div className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Recruiters Choose GradHire</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Access to Top Talent</h3>
              <p className="text-muted-foreground">
                Our platform is exclusively for students and recent graduates from leading universities.
              </p>
            </div>
            <div className="p-6">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Streamlined Hiring</h3>
              <p className="text-muted-foreground">
                Easily post jobs, manage applications, and connect with candidates in one place.
              </p>
            </div>
            <div className="p-6">
              <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Cost-Effective</h3>
              <p className="text-muted-foreground">
                Our targeted approach ensures you reach the right candidates without breaking the bank.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 px-4 md:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <p className="text-primary font-bold">Step 1</p>
                <h3 className="text-xl font-semibold">Create Your Company Profile</h3>
                <p className="text-muted-foreground">Sign up and create a compelling employer profile to attract the best candidates.</p>
            </div>
            <ArrowRight className="h-8 w-8 text-primary hidden md:block"/>
            <div className="text-center md:text-left">
                <p className="text-primary font-bold">Step 2</p>
                <h3 className="text-xl font-semibold">Post Your Job Openings</h3>
                <p className="text-muted-foreground">Post detailed job descriptions and specify the skills and qualifications you're looking for.</p>
            </div>
            <ArrowRight className="h-8 w-8 text-primary hidden md:block"/>
            <div className="text-center md:text-left">
                <p className="text-primary font-bold">Step 3</p>
                <h3 className="text-xl font-semibold">Connect with Talent</h3>
                <p className="text-muted-foreground">Receive applications, shortlist candidates, and start the conversation with your next great hire.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Post a Job Section */}
      {user && role === 'recruiter' && (
        <div className="py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Post a New Job</h2>
            <PostJobForm />
          </div>
        </div>
      )}

      {/* Pricing Section */}
        <div className="py-16 px-4 md:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
                <p className="text-muted-foreground mb-12">Choose the plan that's right for you.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="border p-8 rounded-lg shadow-card">
                        <h3 className="text-2xl font-bold mb-4">Basic</h3>
                        <p className="text-4xl font-bold mb-4">Free</p>
                        <ul className="text-muted-foreground space-y-2">
                            <li>Post 1 job per month</li>
                            <li>Access to candidate profiles</li>
                            <li>Basic support</li>
                        </ul>
                    </div>
                    <div className="border p-8 rounded-lg shadow-card">
                        <h3 className="text-2xl font-bold mb-4">Premium</h3>
                        <p className="text-4xl font-bold mb-4">$99<span className="text-lg">/month</span></p>
                        <ul className="text-muted-foreground space-y-2">
                            <li>Post unlimited jobs</li>
                            <li>Featured company profile</li>
                            <li>Priority support</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

      {/* Call to Action */}
      {!user && (
        <div className="py-20 px-4 text-center bg-primary text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Great Hire?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join GradHire today and start connecting with the best graduate talent available.
          </p>
          <a href="/auth">
            <Button variant="secondary" size="lg">Sign Up Now</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default ForRecruitersPage;
