# 🎯 Job Portal (GradHire) — Project Summary

## Primary Goal

A web-based job portal connecting **fresh graduates** with **recruiters**, streamlining the entry-level hiring process.

## Target Audience

- **Students / Fresh Graduates** — seeking their first job or internship
- **Recruiters / Companies** — hiring entry-level talent

---

## Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| **Frontend**       | React 18, TypeScript, Vite                  |
| **Styling**        | Tailwind CSS, shadcn/ui, Framer Motion      |
| **Backend / DB**   | Supabase (PostgreSQL), Row Level Security   |
| **Auth**           | Supabase Auth (email/password)              |
| **Storage**        | Supabase Storage (resumes)                  |
| **State Mgmt**     | TanStack React Query                        |
| **Forms**          | React Hook Form + Zod validation            |
| **Routing**        | React Router v6                             |

---

## Key Features

1. **Role-based Authentication** — Students & Recruiters with separate dashboards
2. **Student Dashboard** — Browse jobs, apply, track applications, save jobs, upload resume
3. **Recruiter Dashboard** — Post jobs, manage applicants, update application status
4. **Profile Management** — Skills, education, bio, LinkedIn/portfolio links
5. **Protected Routes** — Role-based access control

---

## Database Schema

| Table                | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `profiles`           | Basic user info (name, email, avatar)        |
| `user_roles`         | Role assignments (student/recruiter/admin)   |
| `student_profiles`   | Skills, education, resume, bio, links        |
| `recruiter_profiles` | Company name, description, logo, website     |
| `jobs`               | Job listings with type, salary, requirements |
| `applications`       | Student applications with status tracking    |
| `saved_jobs`         | Bookmarked jobs per user                     |

---

## Interview Q&A

### Q: Why this tech stack?

> React + Vite for fast dev experience; Supabase for instant backend with auth, database, and storage without building a custom API; Tailwind for rapid UI development; TypeScript for type safety.

### Q: How do you handle authentication & authorization?

> Supabase Auth handles authentication. Roles are stored in a separate `user_roles` table (not on profiles) to prevent privilege escalation. A `has_role()` security-definer function checks roles in RLS policies without recursion. Protected routes on the frontend verify the role before rendering.

### Q: How is data security handled?

> Row Level Security (RLS) on every table. Students can only see/edit their own profiles and applications. Recruiters can only manage their own jobs. Resume storage has RLS policies so only the owner and relevant recruiters can access files.

### Q: What challenges did you face?

> 1. **RLS recursive policy issue** — solved with `SECURITY DEFINER` functions.
> 2. **Role-based UI rendering** — solved with AuthContext providing role info globally.
> 3. **File upload with access control** — solved with Supabase Storage + bucket-level RLS.

### Q: How does the application flow work?

> Student browses jobs → clicks Apply → submits with optional cover letter & resume → application stored with status "pending" → recruiter views applicants → updates status (reviewing/shortlisted/rejected/accepted) → student tracks status in dashboard.

### Q: How would you scale this?

> Add full-text search with PostgreSQL `tsvector`, pagination for job listings, email notifications via Edge Functions, Redis caching for popular queries, and CDN for static assets.

### Q: What's excluded from MVP and why?

> Chat, payments, and AI resume screening — to focus on the core hiring flow first and validate the product before adding complexity.

### Q: Why Supabase over a custom backend?

> Built-in auth, real-time subscriptions, storage, and RLS eliminate the need for a separate API layer, reducing development time by ~60% while maintaining security through PostgreSQL-native policies.
