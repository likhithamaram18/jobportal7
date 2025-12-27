import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t shadow-sm">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.svg" alt="GradHire" className="h-8 w-auto" />
              <span className="font-bold text-xl">GradHire</span>
            </Link>
            <p className="text-muted-foreground">Connecting talented graduates with top companies.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">For Students</h4>
            <ul className="space-y-1">
              <li><Link to="/jobs" className="text-muted-foreground hover:text-primary">Find Jobs</Link></li>
              <li><Link to="/student/profile" className="text-muted-foreground hover:text-primary">My Profile</Link></li>
              <li><Link to="/student/applications" className="text-muted-foreground hover:text-primary">My Applications</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">For Recruiters</h4>
            <ul className="space-y-1">
              <li><Link to="/recruiter/dashboard" className="text-muted-foreground hover:text-primary">Dashboard</Link></li>
              <li><Link to="/recruiter/jobs/new" className="text-muted-foreground hover:text-primary">Post a Job</Link></li>
              <li><Link to="/recruiter/profile" className="text-muted-foreground hover:text-primary">Company Profile</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Stay Connected</h4>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /></a>
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer"><Facebook className="h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GradHire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
