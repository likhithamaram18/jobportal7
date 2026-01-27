import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Briefcase, Users, Building, Eye, Trash2, Edit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Job = Tables<'jobs'>;
type Application = Tables<'applications'>;

const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<(Application & { job_title?: string; student_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch recruiter's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('recruiter_id', user?.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch applications for recruiter's jobs
      if (jobsData && jobsData.length > 0) {
        const jobIds = jobsData.map(j => j.id);
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false });

        if (appsError) throw appsError;
        
        // Map applications with job titles
        const mappedApps = (appsData || []).map(app => ({
          ...app,
          job_title: jobsData.find(j => j.id === app.job_id)?.title || 'Unknown Job'
        }));
        setApplications(mappedApps);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId);

      if (error) throw error;
      
      setJobs(prev => prev.filter(j => j.id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', appId);

      if (error) throw error;
      
      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      );
      toast.success('Application status updated');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const totalApplicants = applications.length;
  const pendingApplicants = applications.filter(a => a.status === 'applied').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground p-4 md:p-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Briefcase} label="Posted Jobs" value={jobs.length} />
          <StatCard icon={Users} label="Total Applicants" value={totalApplicants} />
          <StatCard icon={Eye} label="Pending Review" value={pendingApplicants} />
          <Link to="/recruiter/post-job">
            <StatCard icon={PlusCircle} label="Post New Job" isButton />
          </Link>
        </div>

        {/* Tabs for Jobs and Applications */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">My Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Posted Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                {jobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs posted yet.</p>
                    <Button variant="hero" className="mt-4" asChild>
                      <Link to="/recruiter/post-job">Post Your First Job</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:shadow-soft transition-shadow"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline">{job.job_type}</Badge>
                            {job.location && <Badge variant="secondary">{job.location}</Badge>}
                            {job.is_remote && <Badge variant="secondary">Remote</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {applications.filter(a => a.job_id === job.id).length} applicants
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                          <Badge variant={job.is_active ? 'default' : 'destructive'}>
                            {job.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant={job.approved ? 'default' : 'outline'}>
                            {job.approved ? 'Approved' : 'Pending Approval'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No applications received yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold">Application for: {app.job_title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Applied: {new Date(app.created_at).toLocaleDateString()}
                          </p>
                          {app.cover_letter && (
                            <p className="text-sm mt-2 line-clamp-2">{app.cover_letter}</p>
                          )}
                          {app.resume_url && (
                            <a 
                              href={app.resume_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline mt-2 inline-block"
                            >
                              View Resume
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                            className="px-3 py-2 rounded-md border bg-background text-foreground text-sm"
                          >
                            <option value="applied">Applied</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interview</option>
                            <option value="offered">Offered</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

const StatCard: React.FC<{ 
  icon: React.ElementType; 
  label: string; 
  value?: number; 
  isButton?: boolean;
}> = ({ icon: Icon, label, value, isButton }) => {
  if (isButton) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-primary text-primary-foreground p-6 rounded-xl shadow-card flex flex-col items-center justify-center cursor-pointer h-full min-h-[120px]"
      >
        <Icon className="h-8 w-8 mb-2" />
        <span className="text-lg font-semibold">{label}</span>
      </motion.div>
    );
  }
  
  return (
    <div className="bg-card p-6 rounded-xl shadow-soft border">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-primary/10 mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
