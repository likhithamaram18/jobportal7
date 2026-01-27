import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  requirements: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  job_type: z.string().min(1, 'Job type is required'),
  experience_level: z.string().optional(),
  salary_min: z.coerce.number().min(0).optional(),
  salary_max: z.coerce.number().min(0).optional(),
  is_remote: z.boolean().default(false),
  skills_required: z.string().optional(),
});

type JobFormInputs = z.infer<typeof jobSchema>;

const PostJobForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<JobFormInputs>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      job_type: 'full-time',
      is_remote: false,
    },
  });

  const isRemote = watch('is_remote');

  const onSubmit = async (data: JobFormInputs) => {
    if (!user) {
      toast.error('You must be logged in to post a job.');
      return;
    }

    setIsLoading(true);

    try {
      const skillsArray = data.skills_required
        ? data.skills_required.split(',').map(s => s.trim()).filter(Boolean)
        : null;

      const { error } = await supabase.from('jobs').insert([
        {
          title: data.title,
          description: data.description,
          requirements: data.requirements || null,
          location: data.location,
          job_type: data.job_type,
          experience_level: data.experience_level || null,
          salary_min: data.salary_min || null,
          salary_max: data.salary_max || null,
          is_remote: data.is_remote,
          skills_required: skillsArray,
          recruiter_id: user.id,
          is_active: true,
          approved: false, // Jobs need admin approval
        },
      ]);

      if (error) throw error;

      toast.success('Job posted successfully! It will be visible after admin approval.');
      reset();
      navigate('/recruiter/dashboard');
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/recruiter/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="bg-card rounded-xl shadow-lg border p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Post a New Job</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Software Engineer Intern"
                {...register('title')}
                disabled={isLoading}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                {...register('description')}
                className="min-h-[150px]"
                disabled={isLoading}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List the qualifications and requirements for this position..."
                {...register('requirements')}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type *</Label>
                <Select
                  defaultValue="full-time"
                  onValueChange={(value) => setValue('job_type', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  onValueChange={(value) => setValue('experience_level', value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. London, UK"
                  {...register('location')}
                  disabled={isLoading}
                />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <Switch
                  id="is_remote"
                  checked={isRemote}
                  onCheckedChange={(checked) => setValue('is_remote', checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="is_remote">Remote Work Available</Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Minimum Salary (£/year)</Label>
                <Input
                  id="salary_min"
                  type="number"
                  placeholder="e.g. 30000"
                  {...register('salary_min')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_max">Maximum Salary (£/year)</Label>
                <Input
                  id="salary_max"
                  type="number"
                  placeholder="e.g. 45000"
                  {...register('salary_max')}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills_required">Required Skills</Label>
              <Input
                id="skills_required"
                placeholder="e.g. React, TypeScript, Node.js (comma separated)"
                {...register('skills_required')}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Separate skills with commas</p>
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Job...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PostJobForm;
