import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          About GradHire
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Connecting the brightest graduates with innovative companies to launch successful careers.
        </p>
      </motion.div>

      {/* Mission and Vision Section */}
      <div className="py-16 px-4 md:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              To bridge the gap between academic excellence and professional opportunity. We empower students to find roles that match their skills and aspirations, and help companies discover the next generation of talent.
            </p>
            <div className="flex items-center text-primary">
              <Target className="h-6 w-6 mr-3" />
              <span className="font-semibold">Fostering Future Leaders</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground">
              To be the leading platform for graduate recruitment, known for our commitment to quality, integrity, and the success of both our candidates and corporate partners.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            GradHire was founded by a team of recent graduates and seasoned recruiters who experienced firsthand the challenges of the entry-level job market. We saw a need for a more transparent, efficient, and supportive platform to guide students from campus to career. What started as a small project has grown into a thriving community dedicated to helping graduates build meaningful careers.
          </p>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you're a student ready to take the next step or a company looking for exceptional talent, we invite you to join the GradHire community.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/jobs">
            <Button variant="hero" size="lg">Find Your Dream Job</Button>
          </a>
          <a href="/auth">
            <Button variant="outline" size="lg">Post a Job</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
