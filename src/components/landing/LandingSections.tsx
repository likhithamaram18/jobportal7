import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles, Users, Briefcase, Building2, CheckCircle2, GraduationCap, Target, Shield, Zap, TrendingUp, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const HeroSection = () => {
  const { user, role } = useAuth();

  const isRecruiter = user && role === 'recruiter';

  const handleScrollToPostJob = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const section = document.getElementById('post-a-job');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="accent" className="mb-6 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              {isRecruiter ? "#1 Platform for Hiring Graduates" : "#1 Platform for Fresh Graduates"}
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
          >
            {isRecruiter ? "Find the Best Talent" : "Find Your Dream Job"}<br />
            <span className="text-gradient inline-block">Right After Graduation</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {isRecruiter 
              ? "Connect with top graduates and build your dream team. Post jobs, manage candidates, and hire the best."
              : "Connect with top companies hiring freshers. Build your profile, showcase your skills, and land your first career opportunity."}
          </motion.p>

          {/* Search Bar / Post Job Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8"
          >
            {isRecruiter ? (
              <Button variant="hero" size="xl" asChild>
                <a href="#post-a-job" onClick={handleScrollToPostJob} className="gap-2">
                  Post a Job <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            ) : (
              <>
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Job title, keywords, or company" 
                    className="pl-12 h-14 text-base rounded-xl border-border bg-card shadow-soft focus:shadow-card"
                  />
                </div>
                <Button variant="hero" size="xl" asChild>
                  <Link to="/jobs" className="gap-2">
                    Search Jobs <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>10,000+ Active Jobs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>500+ Companies</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>50,000+ Students Hired</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Built for Fresh Graduates",
      description: "Exclusively designed for students and freshers. No experience? No problem. We match you with entry-level opportunities.",
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "Our AI-powered system matches your skills with the right opportunities, saving you time in your job search.",
    },
    {
      icon: Shield,
      title: "Verified Recruiters",
      description: "All recruiters are verified to ensure you only interact with legitimate companies and opportunities.",
    },
    {
      icon: Zap,
      title: "Quick Apply",
      description: "Apply to multiple jobs with a single click. Your profile does the talking, making applications effortless.",
    },
    {
      icon: TrendingUp,
      title: "Track Applications",
      description: "Monitor your application status in real-time. Know exactly where you stand in the hiring process.",
    },
    {
      icon: Star,
      title: "Career Resources",
      description: "Access resume templates, interview tips, and career guidance to help you succeed in your job search.",
    },
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="primary" className="mb-4">Why GradHire?</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Land Your First Job
          </h2>
          <p className="text-muted-foreground">
            We've built the most comprehensive platform to help fresh graduates kickstart their careers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/20 shadow-soft hover:shadow-card transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedJobsSection = () => {
  const jobs = [
    {
      title: "Frontend Developer",
      company: "TechCorp Solutions",
      location: "Remote",
      type: "Full-time" as const,
      salary: "₹6-8 LPA",
      postedAt: "2 days ago",
      tags: ["React", "TypeScript", "Tailwind"],
      featured: true,
    },
    {
      title: "Software Engineer Intern",
      company: "StartupXYZ",
      location: "Bangalore",
      type: "Internship" as const,
      salary: "₹25K/month",
      postedAt: "1 day ago",
      tags: ["Python", "Django", "PostgreSQL"],
      featured: false,
    },
    {
      title: "Data Analyst",
      company: "DataDriven Inc",
      location: "Mumbai",
      type: "Full-time" as const,
      salary: "₹5-7 LPA",
      postedAt: "3 days ago",
      tags: ["SQL", "Excel", "Tableau"],
      featured: true,
    },
    {
      title: "UI/UX Designer",
      company: "Creative Studios",
      location: "Hybrid",
      type: "Full-time" as const,
      salary: "₹4-6 LPA",
      postedAt: "5 days ago",
      tags: ["Figma", "Adobe XD", "Prototyping"],
      featured: false,
    },
  ];

  const typeColors: Record<string, "accent" | "success" | "warning" | "primary"> = {
    "Full-time": "success",
    "Part-time": "warning",
    Internship: "accent",
    Contract: "primary",
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <Badge variant="accent" className="mb-4">Featured Jobs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Latest Opportunities for You
            </h2>
          </div>
          <Button variant="outline-hero" asChild>
            <Link to="/jobs" className="gap-2">
              View All Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.title + job.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`group relative p-6 rounded-xl bg-card border transition-all duration-300 cursor-pointer ${
                job.featured 
                  ? "border-primary/30 shadow-card hover:shadow-elevated" 
                  : "border-border hover:border-primary/20 shadow-soft hover:shadow-card"
              }`}
            >
              {job.featured && (
                <div className="absolute -top-3 left-4">
                  <Badge variant="accent" className="shadow-soft">
                    ✨ Featured
                  </Badge>
                </div>
              )}
              
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center">
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                    <span>{job.location}</span>
                    <span>{job.postedAt}</span>
                    <span className="font-medium text-foreground">{job.salary}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <Badge variant={typeColors[job.type]}>{job.type}</Badge>
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="muted">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { value: "10K+", label: "Active Jobs" },
    { value: "500+", label: "Companies" },
    { value: "50K+", label: "Placements" },
    { value: "95%", label: "Success Rate" },
  ];

  return (
    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students who've already found their dream jobs through GradHire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth" className="gap-2">
                <Users className="h-5 w-5" />
                Sign Up as Student
              </Link>
            </Button>
            <Button variant="outline-hero" size="xl" asChild>
              <Link to="/auth" className="gap-2">
                <Briefcase className="h-5 w-5" />
                Post a Job
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and build your professional profile. Add your skills, education, and upload your resume.",
      icon: Users,
    },
    {
      step: "02",
      title: "Explore Opportunities",
      description: "Browse through verified job listings from top companies actively hiring freshers.",
      icon: Search,
    },
    {
      step: "03",
      title: "Apply & Track",
      description: "Apply to your application status in real-time.",
      icon: Target,
    },
    {
      step: "04",
      title: "Get Hired",
      description: "Receive interview calls, ace them with our resources, and land your dream job!",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="primary" className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Path to Success
          </h2>
          <p className="text-muted-foreground">
            Getting your first job doesn't have to be complicated. Follow these simple steps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-hero text-primary-foreground text-2xl font-bold mb-6 shadow-card">
                {item.step}
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export {
  HeroSection,
  FeaturesSection,
  FeaturedJobsSection,
  StatsSection,
  CTASection,
  HowItWorksSection,
};
