import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import FeedbackPage from "./pages/FeedbackPage";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/dashboards/StudentDashboard";
import ParentDashboard from "./pages/dashboards/ParentDashboard";
import TeacherDashboard from "./pages/dashboards/TeacherDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";
import AIAssistant from "./components/AIAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/login/:role" element={<LoginPage />} />
            <Route path="/dashboard/student/*" element={<StudentDashboard />} />
            <Route path="/dashboard/parent/*" element={<ParentDashboard />} />
            <Route path="/dashboard/teacher/*" element={<TeacherDashboard />} />
            <Route path="/dashboard/doctor/*" element={<DoctorDashboard />} />
            <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AIAssistant />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
