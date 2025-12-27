-- Create role enum
CREATE TYPE public.app_role AS ENUM ('student', 'recruiter', 'admin');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create student_profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  skills TEXT[],
  education TEXT,
  experience TEXT,
  resume_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recruiter_profiles table
CREATE TABLE public.recruiter_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  company_website TEXT,
  company_description TEXT,
  industry TEXT,
  company_size TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  location TEXT,
  job_type TEXT NOT NULL DEFAULT 'full-time',
  salary_min INTEGER,
  salary_max INTEGER,
  experience_level TEXT,
  skills_required TEXT[],
  is_remote BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  deadline TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  resume_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, student_id)
);

-- Create saved_jobs table
CREATE TABLE public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Student profiles policies
CREATE POLICY "Students can view own profile" ON public.student_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view student profiles" ON public.student_profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'recruiter'));

CREATE POLICY "Students can insert own profile" ON public.student_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update own profile" ON public.student_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Recruiter profiles policies
CREATE POLICY "Anyone can view recruiter profiles" ON public.recruiter_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Recruiters can insert own profile" ON public.recruiter_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can update own profile" ON public.recruiter_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Jobs policies
CREATE POLICY "Anyone can view approved active jobs" ON public.jobs
  FOR SELECT USING (approved = true AND is_active = true);

CREATE POLICY "Recruiters can view own jobs" ON public.jobs
  FOR SELECT TO authenticated USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can insert jobs" ON public.jobs
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = recruiter_id AND public.has_role(auth.uid(), 'recruiter')
  );

CREATE POLICY "Recruiters can update own jobs" ON public.jobs
  FOR UPDATE TO authenticated USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can delete own jobs" ON public.jobs
  FOR DELETE TO authenticated USING (auth.uid() = recruiter_id);

-- Applications policies
CREATE POLICY "Students can view own applications" ON public.applications
  FOR SELECT TO authenticated USING (auth.uid() = student_id);

CREATE POLICY "Recruiters can view applications for their jobs" ON public.applications
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
  );

CREATE POLICY "Students can insert applications" ON public.applications
  FOR INSERT TO authenticated WITH CHECK (
    auth.uid() = student_id AND public.has_role(auth.uid(), 'student')
  );

CREATE POLICY "Recruiters can update application status" ON public.applications
  FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = applications.job_id AND jobs.recruiter_id = auth.uid())
  );

-- Saved jobs policies
CREATE POLICY "Users can view own saved jobs" ON public.saved_jobs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can save jobs" ON public.saved_jobs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave jobs" ON public.saved_jobs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recruiter_profiles_updated_at BEFORE UPDATE ON public.recruiter_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();