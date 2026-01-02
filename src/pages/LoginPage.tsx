import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiArrowRight,
  FiUser,
  FiUsers,
  FiHeart,
  FiBook,
  FiShield,
  FiEye,
  FiEyeOff,
  FiUserPlus,
  FiHash,
  FiX,
  FiMessageSquare
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().min(1, "This field is required"), // Can be email or SRN
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  studentSRN: z.string().optional(),
});

type AppRole = "student" | "parent" | "teacher" | "doctor" | "admin";

const roleConfig: Record<string, {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  placeholder: { email: string; password: string };
  allowSignUp: boolean;
}> = {
  student: {
    title: "Student Portal",
    description: "Access your marks, attendance, health status, and upcoming events.",
    icon: FiBook,
    gradient: "from-edu-blue to-edu-blue-light",
    placeholder: { email: "Enter SRN / Roll Number", password: "••••••••" },
    allowSignUp: false,
  },
  parent: {
    title: "Parent Portal",
    description: "Monitor your child's academic progress and health updates.",
    icon: FiUsers,
    gradient: "from-edu-mint to-edu-teal",
    placeholder: { email: "parent@example.com", password: "••••••••" },
    allowSignUp: false,
  },
  teacher: {
    title: "Teacher Portal",
    description: "Manage attendance, marks, assignments, and school events.",
    icon: FiUser,
    gradient: "from-edu-purple to-edu-pink",
    placeholder: { email: "teacher@example.com", password: "••••••••" },
    allowSignUp: false,
  },
  doctor: {
    title: "Health Officer Portal",
    description: "Track student health records and provide healthcare updates.",
    icon: FiHeart,
    gradient: "from-edu-pink to-edu-orange",
    placeholder: { email: "doctor@example.com", password: "••••••••" },
    allowSignUp: false,
  },
  admin: {
    title: "Admin Portal",
    description: "Full access to manage users, data, and system settings.",
    icon: FiShield,
    gradient: "from-edu-blue-dark to-edu-purple",
    placeholder: { email: "admin@example.com", password: "••••••••" },
    allowSignUp: false,
  },
};

const LoginPage = () => {
  const { role = "student" } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    studentSRN: "",
  });

  // Forgot Password specific state
  const [forgotData, setForgotData] = useState({
    studentSRN: "",
    email: "",
    description: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [otpStep, setOtpStep] = useState<"request" | "verify" | "reset">("request");
  const [otpValue, setOtpValue] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState<{ fullName?: string; email?: string; password?: string; studentSRN?: string }>({});

  const config = roleConfig[role] || roleConfig.student;
  const IconComponent = config.icon;

  const validateForm = () => {
    try {
      if (isSignUp) {
        signupSchema.parse(formData);
        if (role === 'parent' && !formData.studentSRN) {
          throw new z.ZodError([{ path: ['studentSRN'], code: 'custom', message: "Student SRN is required" }]);
        }
      } else {
        loginSchema.parse({ email: formData.email, password: formData.password });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: typeof errors = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof errors;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.fullName,
          role as AppRole
        );

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in instead.");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        // For Parents, link the Student SRN
        if (role === 'parent' && formData.studentSRN) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('parents').insert({
              id: user.id,
              email: formData.email,
              full_name: formData.fullName,
              phone: "",
              linked_student_sr: formData.studentSRN
            });
          }
        }

        toast.success("Account created successfully! Redirecting...");
      } else {
        // Sign In Logic
        // Sign In Logic
        const { error } = await signIn(
          formData.email,
          formData.password,
          role as AppRole,
          (role === 'parent' && formData.studentSRN) ? formData.studentSRN : undefined,
          rememberMe
        );

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error(role === 'student' ? "Invalid SRN or password." : "Invalid email or password.");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        toast.success("Login successful! Redirecting...");
      }

      navigate(`/dashboard/${role}`);
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. If Student -> Notify Admin directly
    if (role === 'student') {
      import("@/lib/data").then(({ dataManager }) => {
        dataManager.addPasswordRequest({
          email: forgotData.email,
          role: 'Student',
          description: forgotData.description,
          srn: forgotData.studentSRN
        });
      });
      toast.success("Request sent to Admin successfully! They will contact you shortly.");
      setShowForgotPassword(false);
      setForgotData({ studentSRN: "", email: "", description: "" });
      return;
    }

    // 2. If Others (Parent/Teacher/Doctor) -> Start OTP Flow
    if (otpStep === "request") {
      // Verify email exists
      import("@/lib/data").then(({ dataManager }) => {
        const user = dataManager.findUserByEmail(forgotData.email, role);
        if (user) {
          setOtpStep("verify");
          toast.success(`OTP sent to ${forgotData.email}`);
          console.log("DEMO OTP: 123456"); // Demo purpose
        } else {
          toast.error("Email not found for this role.");
        }
      });
    } else if (otpStep === "verify") {
      if (otpValue === "123456") {
        setOtpStep("reset");
        toast.success("OTP Verified. Please set new password.");
      } else {
        toast.error("Invalid OTP. (Try 123456)");
      }
    } else if (otpStep === "reset") {
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters.");
        return;
      }

      // Update Password
      import("@/lib/data").then(({ dataManager }) => {
        const user = dataManager.findUserByEmail(forgotData.email, role);
        if (user) {
          dataManager.updateUser({ ...user, password: newPassword });
          toast.success("Password reset successfully! Please login.");
          setShowForgotPassword(false);
          setOtpStep("request");
          setForgotData({ studentSRN: "", email: "", description: "" });
          setOtpValue("");
          setNewPassword("");
        }
      });
    }
  };

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-edu-blue/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-edu-mint/20 rounded-full blur-3xl" />
              </div>

              <div className="relative glass-card p-8 md:p-12">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-8 icon-3d`}>
                  <IconComponent className="w-10 h-10 text-primary-foreground" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Welcome to{" "}
                  <span className="gradient-text">EduCare Connect</span>
                </h1>

                <p className="text-muted-foreground mb-8">
                  {config.description}
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-edu-blue/10 flex items-center justify-center">
                      <FiBook className="w-4 h-4 text-edu-blue" />
                    </div>
                    <span>Real-time academic tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-edu-mint/10 flex items-center justify-center">
                      <FiHeart className="w-4 h-4 text-edu-mint" />
                    </div>
                    <span>Comprehensive health monitoring</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-edu-purple/10 flex items-center justify-center">
                      <FiShield className="w-4 h-4 text-edu-purple" />
                    </div>
                    <span>Secure role-based access</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass-card p-6 md:p-8 max-w-md mx-auto">
              {/* Mobile Icon */}
              <div className="lg:hidden flex justify-center mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center icon-3d`}>
                  <IconComponent className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>

              <div className="text-center lg:text-left mb-8">
                <h2 className="text-2xl font-bold mb-2">{config.title}</h2>
                <p className="text-muted-foreground text-sm lg:hidden">
                  {config.description}
                </p>
                <p className="text-muted-foreground text-sm hidden lg:block">
                  {isSignUp ? "Create an account to get started" : "Sign in to access your dashboard"}
                </p>
              </div>

              {/* Toggle Buttons */}
              {config.allowSignUp && (
                <div className="flex gap-2 mb-6 p-1 bg-muted rounded-xl">
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${!isSignUp ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${isSignUp ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    Sign Up
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <div className="relative">
                      <FiUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className={`pl-10 ${errors.fullName ? "border-destructive" : ""}`}
                        required={isSignUp}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>
                )}

                {/* Email or SRN Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {role === 'student' ? "SRN / Roll Number" : "Email Address"}
                  </label>
                  <div className="relative">
                    {role === 'student' ? (
                      <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    ) : (
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    )}
                    <Input
                      type="text"
                      placeholder={config.placeholder.email}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      required
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Parent: Student SRN Link (Sign Up or Sign In to view specific child) */}
                {role === 'parent' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Student SRN / Roll Number</label>
                    <div className="relative">
                      <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your child's SRN"
                        value={formData.studentSRN}
                        onChange={(e) =>
                          setFormData({ ...formData, studentSRN: e.target.value })
                        }
                        className={`pl-10 ${errors.studentSRN ? "border-destructive" : ""}`}
                        required
                      />
                    </div>
                    {errors.studentSRN && (
                      <p className="text-xs text-destructive mt-1">{errors.studentSRN}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={config.placeholder.password}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <FiEyeOff className="w-5 h-5" />
                      ) : (
                        <FiEye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive mt-1">{errors.password}</p>
                  )}
                </div>

                {!isSignUp && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full gradient-bg gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {isSignUp ? "Creating Account..." : "Signing in..."}
                    </>
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <FiArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-xs text-muted-foreground text-center">
                  {!config.allowSignUp
                    ? "Access is managed by the school administration. Please contact admin for credentials."
                    : role === 'student'
                      ? "Student Portal access is managed by the school administration."
                      : isSignUp
                        ? `You're signing up as a ${role}. Your account will be set up with ${role} permissions.`
                        : "Don't have an account? Click 'Sign Up' above to create one."
                  }
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForgotPassword(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Request Password Reset</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowForgotPassword(false)}>
                  <FiX className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enter your details to request a password reset from the Administrator.
              </p>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Student SRN (Optional)</label>
                  <div className="relative">
                    <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      className="pl-9"
                      placeholder="e.g. 24Suube001"
                      value={forgotData.studentSRN}
                      onChange={(e) => setForgotData({ ...forgotData, studentSRN: e.target.value })}
                    />
                  </div>
                </div>


                {role === 'student' ? (
                  // STUDENT: Notify Admin Form
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Registered Email</label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          type="email"
                          placeholder="Enter your email"
                          required
                          value={forgotData.email}
                          onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description / Remark</label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <textarea
                          className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background min-h-[100px]"
                          placeholder="e.g. I forgot my password..."
                          required
                          value={forgotData.description}
                          onChange={(e) => setForgotData({ ...forgotData, description: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // OTHERS: OTP Flow
                  <>
                    {otpStep === "request" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Registered Email</label>
                        <div className="relative">
                          <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={forgotData.email}
                            onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">We will send an OTP to this email.</p>
                      </div>
                    )}

                    {otpStep === "verify" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Enter OTP</label>
                        <Input
                          placeholder="Enter 6-digit OTP"
                          required
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                        />
                        <p className="text-xs text-green-600 mt-2">OTP sent! (Use 123456 for demo)</p>
                      </div>
                    )}

                    {otpStep === "reset" && (
                      <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 gradient-bg">
                    {role === 'student' ? "Notify Admin" :
                      otpStep === "request" ? "Send OTP" :
                        otpStep === "verify" ? "Verify OTP" : "Reset Password"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout >
  );
};

export default LoginPage;
