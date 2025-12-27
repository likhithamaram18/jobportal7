
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.coerce.number().min(0, 'Salary must be a positive number'),
});

type JobFormInputs = z.infer<typeof jobSchema>;

const PostJobForm: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<JobFormInputs>({
    resolver: zodResolver(jobSchema),
  });

  const onSubmit = async (data: JobFormInputs) => {
    if (!user) {
      toast.error('You must be logged in to post a job.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from('jobs').insert([
        {
          ...data,
          user_id: user.id,
          // Set a default company_id if you have one, or null
          // company_id: 'your-default-company-id',
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success('Job posted successfully!');
      reset(); // Reset form fields
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-8 bg-card rounded-xl shadow-lg border">
       <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">Job Title</Label>
        <Input
          id="title"
          placeholder="e.g. Software Engineer Intern"
          {...register('title')}
          className="w-full"
          disabled={isLoading}
        />
        {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Job Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the role and responsibilities..."
          {...register('description')}
          className="w-full h-36"
          disabled={isLoading}
        />
        {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">Location</Label>
          <Input
            id="location"
            placeholder="e.g. London, UK"
            {...register('location')}
            className="w-full"
            disabled={isLoading}
          />
          {errors.location && <p className="text-sm text-destructive mt-1">{errors.location.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-sm font-medium">Annual Salary (£)</Label>
          <Input
            id="salary"
            type="number"
            placeholder="e.g. 35000"
            {...register('salary')}
            className="w-full"
            disabled={isLoading}
          />
          {errors.salary && <p className="text-sm text-destructive mt-1">{errors.salary.message}</p>}
        </div>
      </div>
      <Button type="submit" className="w-full font-semibold" variant="hero" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Posting Job...
          </>
        ) : (
          'Post Job Now'
        )}
      </Button>
    </form>
  );
};

export default PostJobForm;
