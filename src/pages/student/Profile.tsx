import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  GraduationCap,
  FileText,
  Plus,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

interface StudentProfile {
  id: string;
  user_id: string;
  skills: string[] | null;
  education: string | null;
  experience: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  bio: string | null;
  location: string | null;
}

const StudentProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setLoading(true);

    // Fetch main profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
    } else {
      setProfile(profileData);
    }

    // Fetch student profile
    const { data: studentData, error: studentError } = await supabase
      .from("student_profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (studentError) {
      console.error("Error fetching student profile:", studentError);
    } else {
      setStudentProfile(studentData);
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);

    // Update main profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
      })
      .eq("id", user.id);

    if (profileError) {
      toast.error("Failed to update profile");
      setSaving(false);
      return;
    }

    // Update student profile
    if (studentProfile) {
      const { error: studentError } = await supabase
        .from("student_profiles")
        .update({
          skills: studentProfile.skills,
          education: studentProfile.education,
          experience: studentProfile.experience,
          linkedin_url: studentProfile.linkedin_url,
          portfolio_url: studentProfile.portfolio_url,
          bio: studentProfile.bio,
          location: studentProfile.location,
        })
        .eq("user_id", user.id);

      if (studentError) {
        toast.error("Failed to update student profile");
        setSaving(false);
        return;
      }
    }

    toast.success("Profile updated successfully!");
    setSaving(false);
  };

  const addSkill = () => {
    if (!newSkill.trim() || !studentProfile) return;

    const updatedSkills = [...(studentProfile.skills || []), newSkill.trim()];
    setStudentProfile({ ...studentProfile, skills: updatedSkills });
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    if (!studentProfile) return;

    const updatedSkills = (studentProfile.skills || []).filter((s) => s !== skillToRemove);
    setStudentProfile({ ...studentProfile, skills: updatedSkills });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Profile</h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to stand out to recruiters
            </p>
          </div>

          {/* Basic Info */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile?.full_name || ""}
                    onChange={(e) =>
                      setProfile((prev) =>
                        prev ? { ...prev, full_name: e.target.value } : null
                      )
                    }
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile?.email || user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile?.phone || ""}
                      onChange={(e) =>
                        setProfile((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={studentProfile?.location || ""}
                      onChange={(e) =>
                        setStudentProfile((prev) =>
                          prev ? { ...prev, location: e.target.value } : null
                        )
                      }
                      placeholder="Mumbai, India"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                About You
              </CardTitle>
              <CardDescription>A brief introduction about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={studentProfile?.bio || ""}
                onChange={(e) =>
                  setStudentProfile((prev) =>
                    prev ? { ...prev, bio: e.target.value } : null
                  )
                }
                placeholder="I am a passionate software developer with experience in..."
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Skills
              </CardTitle>
              <CardDescription>Add your technical and soft skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(studentProfile?.skills || []).map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, Python)"
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                />
                <Button variant="outline" onClick={addSkill}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={studentProfile?.education || ""}
                onChange={(e) =>
                  setStudentProfile((prev) =>
                    prev ? { ...prev, education: e.target.value } : null
                  )
                }
                placeholder="B.Tech in Computer Science, XYZ University (2021-2025)"
                rows={3}
              />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={studentProfile?.experience || ""}
                onChange={(e) =>
                  setStudentProfile((prev) =>
                    prev ? { ...prev, experience: e.target.value } : null
                  )
                }
                placeholder="Software Engineering Intern at ABC Corp (June 2024 - Present)"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Links
              </CardTitle>
              <CardDescription>Add your professional links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="linkedin"
                    value={studentProfile?.linkedin_url || ""}
                    onChange={(e) =>
                      setStudentProfile((prev) =>
                        prev ? { ...prev, linkedin_url: e.target.value } : null
                      )
                    }
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="portfolio">Portfolio Website</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="portfolio"
                    value={studentProfile?.portfolio_url || ""}
                    onChange={(e) =>
                      setStudentProfile((prev) =>
                        prev ? { ...prev, portfolio_url: e.target.value } : null
                      )
                    }
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default StudentProfilePage;
