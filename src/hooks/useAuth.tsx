import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { dataManager, User as LocalUser } from "@/lib/data";

type AppRole = "student" | "parent" | "teacher" | "doctor" | "admin";

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  role: AppRole | null;
  relatedStudent: LocalUser | null; // The student currently being viewed (for Student/Parent views)
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string, role: AppRole, studentSrn?: string) => Promise<{ error: Error | null }>;
  signIn: (identifier: string, password: string, role: AppRole, childSrn?: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [relatedStudent, setRelatedStudent] = useState<LocalUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for demo/local session first (Try LocalStorage then SessionStorage)
    const demoSessionStr = localStorage.getItem("educare_demo_session") || sessionStorage.getItem("educare_demo_session");
    if (demoSessionStr) {
      try {
        const demoData = JSON.parse(demoSessionStr);
        setUser(demoData.user);
        setSession(demoData.session);
        setRole(demoData.role);
        setRelatedStudent(demoData.relatedStudent || null);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem("educare_demo_session");
        sessionStorage.removeItem("educare_demo_session");
      }
    }

    // Set up real auth state listener (Supabase Fallback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setRelatedStudent(null);
        }
      }
    );

    // Initial check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const hasLocal = localStorage.getItem("educare_demo_session") || sessionStorage.getItem("educare_demo_session");
      if (!hasLocal) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setIsLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        // console.error("Error fetching user role:", error);
        return;
      }
      setRole(data?.role as AppRole);
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, selectedRole: AppRole, studentSrn?: string) => {
    try {
      // Create in Local Data Manager as well for consistency in this hybrid mode
      dataManager.addUser({
        name: fullName,
        email: email,
        role: selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) as any, // Capitalize
        srn: selectedRole === 'student' ? studentSrn : undefined, // In reality, SRN might be assigned, but for signup we can take it
        linkedSrn: selectedRole === 'parent' ? studentSrn : undefined,
        password: password
      });

      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fullName },
        },
      });

      if (error) {
        // If Supabase fails (e.g. rate limit or no internet), we already added to local data
        // We can just proceed with "Local Signup Success" effectively
        if (!data.user) {
          // Check if we added to dataManager successfully?
          // For now, let's treat it as success if we added locally, or return error.
          // But to avoid confusion, let's return null error if local succeeded.
          return { error: null };
        }
      }

      if (data.user) {
        await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: selectedRole,
        });
        setRole(selectedRole);
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (identifier: string, password: string, roleType: AppRole, childSrn?: string, rememberMe: boolean = false) => {
    try {
      // 1. Check Local Data Manager using the requested role
      const authResult = dataManager.authenticate(identifier, password, roleType);

      if (authResult.user) {
        const localUser = authResult.user;

        let targetStudent: LocalUser | undefined;

        // Logic for setting the 'relatedStudent'
        if (roleType === 'student') {
          targetStudent = localUser;
        } else if (roleType === 'parent') {
          // If parent provided a child SRN, verify it
          if (childSrn) {
            const child = dataManager.getStudentBySRN(childSrn);
            if (child) {
              targetStudent = child;
            } else {
              // Don't block login if child not found, just don't link them yet
              console.warn("Child SRN not found during login.");
            }
          } else if (localUser.linkedSrn) {
            // Fallback to default linked SRN if available
            targetStudent = dataManager.getStudentBySRN(localUser.linkedSrn);
          }
        }

        // Create Mock User & Session
        const mockUser = {
          id: localUser.id.toString(),
          email: localUser.email,
          app_metadata: {},
          user_metadata: { full_name: localUser.name, srn: localUser.srn },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          role: "authenticated",
          updated_at: new Date().toISOString(),
          phone: localUser.phone || "",
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          factors: []
        } as unknown as SupabaseUser;

        const mockSession = {
          access_token: "local-token-" + Date.now(),
          refresh_token: "local-refresh-token",
          expires_in: 3600,
          token_type: "bearer",
          user: mockUser,
        } as Session;

        // Update State
        setUser(mockUser);
        setSession(mockSession);
        setRole(roleType);
        setRelatedStudent(targetStudent || null);
        setIsLoading(false);

        // Persist
        // Persist
        const sessionData = JSON.stringify({
          user: mockUser,
          session: mockSession,
          role: roleType,
          relatedStudent: targetStudent || null
        });

        if (rememberMe) {
          localStorage.setItem("educare_demo_session", sessionData);
        } else {
          sessionStorage.setItem("educare_demo_session", sessionData);
        }

        return { error: null };
      }

      // 2. Fallback to Real Supabase Auth (Only if not found locally)
      // Note: This might cause issues if Supabase user exists but not in local mock.
      // But for this task, local mock is the source of truth for "Admin added students".

      const { error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password,
      });

      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem("educare_demo_session");
    sessionStorage.removeItem("educare_demo_session");
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setRelatedStudent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        relatedStudent,
        isLoading,
        signUp,
        signIn,
        signOut,
      }}
    >
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
