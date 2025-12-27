
import React from 'react';
import { motion } from 'framer-motion';
import { PlusCircle, Briefcase, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecruiterDashboard: React.FC = () => {
  // Dummy data for posted jobs
  const postedJobs = [
    { title: 'Software Engineer', applicants: 12, status: 'Open' },
    { title: 'Product Manager', applicants: 5, status: 'Open' },
    { title: 'UX Designer', applicants: 8, status: 'Closed' },
  ];

  return (
    <div className="bg-background text-foreground p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8"
      >
        Recruiter Dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <StatCard icon={Briefcase} label="Posted Jobs" value={postedJobs.length} />
        <StatCard icon={Users} label="Total Applicants" value={postedJobs.reduce((acc, job) => acc + job.applicants, 0)} />
        <Link to="/recruiter/jobs/new">
         <StatCard icon={PlusCircle} label="New Post" isButton={true} />
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Posted Jobs</h2>
        <div className="bg-card p-4 rounded-lg shadow-card">
          <ul>
            {postedJobs.map((job, index) => (
              <li key={index} className="flex justify-between items-center py-3 border-b last:border-b-0">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.applicants} Applicants</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {job.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ElementType, label: string, value?: number, isButton?: boolean }> = ({ icon: Icon, label, value, isButton }) => {
    if (isButton) {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-primary text-primary-foreground p-6 rounded-lg shadow-card flex flex-col items-center justify-center cursor-pointer h-full"
            >
                <Icon className="h-8 w-8 mb-2" />
                <span className="text-lg font-semibold">{label}</span>
            </motion.div>
        )
    }
  return (
    <div className="bg-card p-6 rounded-lg shadow-card">
      <div className="flex items-center">
        <Icon className="h-8 w-8 text-primary mr-4" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
