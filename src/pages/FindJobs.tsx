import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, DollarSign, Clock, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Assuming Job and Company types from a types file
export interface Company {
  id: string;
  name: string;
  logo_url?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  is_remote: boolean;
  company_name: string;
  created_at: string;
}

const JobCard = ({ job, onApply, isApplied }: { job: Job; onApply: (jobId: string) => void; isApplied: boolean }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{job.company_name}</p>
        </div>
        <img src={`https://logo.clearbit.com/${job.company_name.toLowerCase().replace(/ /g, '')}.com`} alt={`${job.company_name} logo`} className="h-12 w-12 object-contain rounded-md" />
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          <span>{job.is_remote ? "Remote" : job.location}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span>{job.job_type}</span>
        </div>
        {job.salary_min && job.salary_max && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            <span>{`$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">Posted on {new Date(job.created_at).toLocaleDateString()}</p>
        <Button size="sm" onClick={() => onApply(job.id)} disabled={isApplied}>
          {isApplied ? "Applied" : "Apply Now"}
        </Button>
      </div>
    </CardContent>
  </Card>
);

const FindJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const [applications, setApplications] = useState<string[]>([]);
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const postedJobs: Job[] = [
    { id: "1", title: 'Software Engineer', company_name: "Innovate Inc.", description: "We are looking for a talented software engineer to join our team.", job_type: "Full-time", location: "San Francisco, CA", salary_min: 120000, salary_max: 150000, is_remote: false, created_at: "2024-05-20T10:00:00Z" },
    { id: "2", title: 'Product Manager', company_name: "Quantum Solutions", description: "We are looking for an experienced product manager to lead our product development.", job_type: "Full-time", location: "New York, NY", salary_min: 140000, salary_max: 170000, is_remote: false, created_at: "2024-05-18T14:30:00Z" },
    { id: "3", title: 'UX Designer', company_name: "Creative Minds", description: "We are looking for a creative UX designer to design our new mobile app.", job_type: "Contract", location: "Los Angeles, CA", salary_min: 80000, salary_max: 100000, is_remote: true, created_at: "2024-05-15T12:00:00Z" },
  ];

  useEffect(() => {
    setLoading(true);
    setJobs(postedJobs);
    setFilteredJobs(postedJobs);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => job.location?.toLowerCase() === locationFilter.toLowerCase());
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.job_type === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  const handleApply = async (jobId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (role !== 'student') {
        toast.error("Only students can apply for jobs.");
        return;
    }
    toast.success("Application submitted successfully!");
    setApplications([...applications, jobId]);
  };

  const uniqueLocations = [...new Set(jobs.map(job => job.location).filter(Boolean))];
  const uniqueJobTypes = [...new Set(jobs.map(job => job.job_type))];

  return (
    <main className="flex-1">
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl gradient-text">Find Your Dream Job</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">Search through thousands of open positions and find the perfect role for you.</p>
      </header>

      <Card className="p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              {uniqueLocations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {uniqueJobTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-4"><div className="h-4 bg-muted rounded w-2/3"></div><div className="h-4 bg-muted rounded w-1/2"></div><div className="h-10 bg-muted rounded w-full"></div></CardContent></Card>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onApply={handleApply} isApplied={applications.includes(job.id)} />
          ))}
        </div>
      )}
    </div>
    </main>
  );
};

export default FindJobsPage;
