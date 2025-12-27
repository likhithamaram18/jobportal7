
import React from 'react';
import { motion } from 'framer-motion';
import { Building, Search } from 'lucide-react';

const CompaniesPage: React.FC = () => {
  const companies = [
    { name: 'Innovate Inc.', industry: 'Tech', location: 'San Francisco, CA', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Quantum Solutions', industry: 'Finance', location: 'New York, NY', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    { name: 'BioHealth Corp.', industry: 'Biotech', location: 'Boston, MA', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704f' },
    { name: 'Creative Minds', industry: 'Marketing', location: 'Los Angeles, CA', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
    { name: 'GreenEnergy Co.', industry: 'Renewables', location: 'Austin, TX', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704h' },
    { name: 'NextGen Edu', industry: 'EdTech', location: 'Chicago, IL', logo: 'https://i.pravatar.cc/150?u=a042581f4e29026704i' },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-20 px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Discover Top Companies
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Explore innovative companies and find the perfect fit for your career.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <div className="py-8 px-4 md:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto flex gap-4">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="Search by company name or industry" className="w-full pl-10 pr-4 py-2 border rounded-md" />
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-semibold">Search</button>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <img src={company.logo} alt={`${company.name} logo`} className="w-16 h-16 rounded-full mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  <p className="text-primary">{company.industry}</p>
                </div>
              </div>
              <p className="text-muted-foreground">{company.location}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;
