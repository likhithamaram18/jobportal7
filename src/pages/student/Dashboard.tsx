import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Search,
  Bookmark,
  FileText,
  User,
  LogOut,
  ChevronRight,
  MapPin,
  Clock,
  Building2,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string | null;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  is_remote: boolean | null;
  created_at: string;
  recruiter_profiles?: {
    company_name: string;
    company_logo_url: string | null;
  };
}

interface Application {
  id: string;
  status: string;
  created_at: string;
  job: Job;
}

interface SavedJob {
  id: string;
  created_at: string;
  job: Job;
}

const StudentDashboard = () => {
  const { user, signOut } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch approved jobs
    const { data: jobsData, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .eq("approved", true)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10);

    if (jobsError) {
      console.error("Error fetching jobs:", jobsError);
    } else {
      setJobs((jobsData || []) as any);
    }

    // Fetch user's applications
    const { data: applicationsData, error: applicationsError } = await supabase
      .from("applications")
      .select("*, job:jobs(*)")
      .eq("student_id", user.id)
      .order("created_at", { ascending: false });

    if (applicationsError) {
      console.error("Error fetching applications:", applicationsError);
    } else {
      setApplications((applicationsData || []) as any);
    }

    // Fetch saved jobs
    const { data: savedData, error: savedError } = await supabase
      .from("saved_jobs")
      .select("*, job:jobs(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (savedError) {
      console.error("Error fetching saved jobs:", savedError);
    } else {
      setSavedJobs((savedData || []) as any);
    }

    setLoading(false);
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) return;

    const isAlreadySaved = savedJobs.some((s) => s.job.id === jobId);

    if (isAlreadySaved) {
      // Unsave
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("user_id", user.id)
        .eq("job_id", jobId);

      if (error) {
        toast.error("Failed to remove job");
      } else {
        setSavedJobs(savedJobs.filter((s) => s.job.id !== jobId));
        toast.success("Job removed from saved");
      }
    } else {
      // Save
      const { data, error } = await supabase
        .from("saved_jobs")
        .insert({ user_id: user.id, job_id: jobId })
        .select("*, job:jobs(*)")
        .single();

      if (error) {
        toast.error("Failed to save job");
      } else {
        setSavedJobs([data as any, ...savedJobs]);
        toast.success("Job saved!");
      }
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) return;

    const alreadyApplied = applications.some((a) => a.job.id === jobId);
    if (alreadyApplied) {
      toast.info("You've already applied to this job");
      return;
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({ job_id: jobId, student_id: user.id })
      .select("*, job:jobs(*)")
      .single();

    if (error) {
      toast.error("Failed to apply");
    } else {
      setApplications([data as any, ...applications]);
      toast.success("Application submitted!");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "secondary";
      case "shortlisted":
        return "success";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.recruiter_profiles?.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Find your dream job and track your applications
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Bookmark className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{savedJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Saved Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Briefcase className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {applications.filter((a) => a.status === "shortlisted").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="browse" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          {/* Browse Jobs */}
          <TabsContent value="browse" className="space-y-4">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs, companies, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {filteredJobs.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No jobs found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobs.some((s) => s.job.id === job.id)}
                    isApplied={applications.some((a) => a.job.id === job.id)}
                    onSave={() => handleSaveJob(job..id)}
                    onApply={() => handleApply(job.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications */}
          <TabsContent value="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No applications yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start applying to jobs to track them here
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.map((app) => (
                  <Card key={app.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{app.job.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {app.job.recruiter_profiles?.company_name || "Company"}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              {app.job.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {app.job.location}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Applied {new Date(app.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(app.status)}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Jobs */}
          <TabsContent value="saved" className="space-y-4">
            {savedJobs.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="py-12 text-center">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No saved jobs</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Save jobs to apply to them later
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedJobs.map((saved) => (
                  <JobCard
                    key={saved.id}
                    job={saved.job}
                    isSaved={true}
                    isApplied={applications.some((a) => a.job.id === saved.job.id)}
                    onSave={() => handleSaveJob(saved.job.id)}
                    onApply={() => handleApply(saved.job.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Job Card Component
const JobCard = ({
  job,
  isSaved,
  isApplied,
  onSave,
  onApply,
}: {
  job: Job;
  isSaved: boolean;
  isApplied: boolean;
  onSave: () => void;
  onApply: () => void;
}) => {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4 flex-1">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{job.title}</h3>
              <p className="text-sm text-muted-foreground">
                {job.recruiter_profiles?.company_name || "Company"}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                )}
                <Badge variant="outline" className="text-xs">
                  {job.job_type}
                </Badge>
                {job.is_remote && (
                  <Badge variant="secondary" className="text-xs">
                    Remote
                  </Badge>
                )}
              </div>
              {(job.salary_min || job.salary_max) && (
                <p className="text-sm font-medium text-foreground mt-2">
                  {job.salary_min && job.salary_max
                    ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
                    : job.salary_min
                    ? `From ₹${job.salary_min.toLocaleString()}`
                    : `Up to ₹${job.salary_max?.toLocaleString()}`}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className={isSaved ? "text-primary" : "text-muted-foreground"}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant={isApplied ? "secondary" : "hero"}
              size="sm"
              onClick={onApply}
              disabled={isApplied}
            >
              {isApplied ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDashboard;
