import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type AppRole = "student" | "recruiter" | "admin";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  fullName: string | null;
  signUp: (email: string, password: string, fullName: string, role: AppRole) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState<string | null>(null);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching role:", error);
      return null;
    }
    return data?.role as AppRole | null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      // First, check for an existing session
      const { data: { session }, } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setSession(session);
      setUser(currentUser);
      setFullName(currentUser?.user_metadata?.full_name || null);

      if (currentUser) {
        const userRole = await fetchUserRole(currentUser.id);
        setRole(userRole);
      } else {
        setRole(null);
      }

      // Initial load is complete
      setLoading(false);

      // Set up a listener for future auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, changedSession) => {
          const changedUser = changedSession?.user ?? null;
          setSession(changedSession);
          setUser(changedUser);
          setFullName(changedUser?.user_metadata?.full_name || null);
          
          if (changedUser) {
            const userRole = await fetchUserRole(changedUser.id);
            setRole(userRole);
          } else {
            setRole(null);
          }
          // After a change, we are no longer in an initial loading state
          setLoading(false);
        }
      );
      
      return () => subscription.unsubscribe();
    };

    initializeAuth();
  }, []);


  const signUp = async (email: string, password: string, fullName: string, selectedRole: AppRole) => {
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { error };
    }

    // Insert user role
    if (data.user) {
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: data.user.id, role: selectedRole });

      if (roleError) {
        console.error("Error setting role:", roleError);
        return { error: roleError };
      }

      // Create role-specific profile
      if (selectedRole === "student") {
        const { error: profileError } = await supabase
          .from("student_profiles")
          .insert({ user_id: data.user.id });

        if (profileError) {
          console.error("Error creating student profile:", profileError);
        }
      } else if (selectedRole === "recruiter") {
        const { error: profileError } = await supabase
          .from("recruiter_profiles")
          .insert({ 
            user_id: data.user.id,
            company_name: "My Company" // Default value, can be updated later
          });

        if (profileError) {
          console.error("Error creating recruiter profile:", profileError);
        }
      }

      setRole(selectedRole);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setFullName(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, fullName, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
