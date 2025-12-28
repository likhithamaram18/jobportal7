
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Job } from '@/pages/FindJobs'; // Re-using the Job interface
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const JobDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, role } = useAuth();

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        toast.error('Job not found.');
      } else {
        setJob(data);
      }
      setLoading(false);
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
        toast.error("You must be logged in to apply.");
        return;
    }
    if (role !== 'student') {
        toast.error("Only students can apply for jobs.");
        return;
    }
    if (!job) return;

    const { error } = await supabase.from('applications').insert({ job_id: job.id, student_id: user.id });
    if (error) {
        toast.error('Error submitting application.');
    } else {
        toast.success('Application submitted successfully!');
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 px-4 md:px-6 text-center">Loading...</div>;
  }

  if (!job) {
    return <div className="container mx-auto py-8 px-4 md:px-6 text-center">Job not found.</div>;
  }

  return (
    <main className="flex-1 bg-muted/20">
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
                    <div>
                        <CardTitle className="text-3xl font-bold">{job.title}</CardTitle>
                        <p className="text-lg text-muted-foreground">{job.company_name}</p>
                    </div>
                    <img src={`https://logo.clearbit.com/${job.company_name.toLowerCase().replace(/ /g, '')}.com`} alt={`${job.company_name} logo`} className="h-16 w-16 object-contain rounded-md self-start md:self-center" />
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6 text-md">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span className="font-medium">Location:</span> {job.is_remote ? "Remote" : job.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <span className="font-medium">Job Type:</span> {job.job_type}
                        </div>
                        {job.salary_min && job.salary_max && (
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                <span className="font-medium">Salary:</span> ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                            </div>
                        )}
                    </div>
                    <div className="prose max-w-none">
                        <h3 className="font-bold text-xl mb-2">Job Description</h3>
                        <p>{job.description}</p>
                    </div>
                    <div className="mt-8 text-center">
                        <Button size="lg" onClick={handleApply}>Apply Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    </main>
  );
};

export default JobDetailsPage;
