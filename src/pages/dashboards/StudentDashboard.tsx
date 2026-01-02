import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiCheckSquare,
  FiHeart,
  FiCalendar,
  FiTrendingUp,
  FiActivity,
  FiDownload,
  FiExternalLink,
  FiHome,
  FiLogOut,
  FiUser,
  FiFileText,
  FiAward,
  FiX
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { dataManager, Event } from "@/lib/data";

const marksData = [
  { month: "Aug", marks: 78 },
  { month: "Sep", marks: 82 },
  { month: "Oct", marks: 75 },
  { month: "Nov", marks: 88 },
  { month: "Dec", marks: 85 },
];

const subjectMarks = [
  { subject: "Math", marks: 85, fullMarks: 100 },
  { subject: "Science", marks: 92, fullMarks: 100 },
  { subject: "English", marks: 78, fullMarks: 100 },
  { subject: "History", marks: 88, fullMarks: 100 },
  { subject: "Art", marks: 95, fullMarks: 100 },
];

const attendanceRadial = [
  { name: "Attendance", value: 91, fill: "#10B981" },
];



const assignments = [
  { title: "Math Homework Ch. 5", due: "Dec 26", status: "pending" },
  { title: "Science Project", due: "Dec 30", status: "submitted" },
  { title: "English Essay", due: "Jan 2", status: "pending" },
];

const StudentDashboard = () => {
  const { relatedStudent, user } = useAuth();
  const displayName = relatedStudent?.name || user?.user_metadata?.full_name || "Student";
  const displaySRN = relatedStudent?.srn || user?.user_metadata?.srn || "Class 10-A";

  const [healthStatus, setHealthStatus] = useState<"fine" | "notwell" | null>(null);
  const [events, setEvents] = useState<Event[]>(dataManager.getEvents());

  const handleHealthUpdate = (status: "fine" | "notwell") => {
    setHealthStatus(status);
    if (status === "fine") {
      toast.success("Great! Your health status has been updated.");
    } else {
      toast.error("Alert sent to School Doctor & Parents. Please visit the medical room immediately.");
      // In a real app, this would trigger an API call to send SMS/Email
    }
  };

  const handleRegisterEvent = (eventId: number) => {
    const studentSrn = relatedStudent?.srn || user?.user_metadata?.srn;
    if (!studentSrn) {
      toast.error("Student SRN not found. Cannot register.");
      return;
    }

    const eventData = events.find(e => e.id === eventId);
    const success = dataManager.registerForEvent(eventId, studentSrn);

    if (success) {
      toast.success("Successfully registered for the event!");
      setEvents(dataManager.getEvents()); // Refresh

      // Redirect to external link if available
      if (eventData?.link) {
        window.open(eventData.link, "_blank");
      }
    } else {
      toast.error("You are already registered or event not found.");
    }
  };

  const handleUnregisterEvent = (eventId: number) => {
    const studentSrn = relatedStudent?.srn || user?.user_metadata?.srn;
    if (!studentSrn) return;

    if (confirm("Are you sure you want to unregister from this event?")) {
      dataManager.unregisterFromEvent(eventId, studentSrn);
      toast.success("Unregistered successfully.");
      setEvents(dataManager.getEvents());
    }
  };

  const handleDownloadReport = () => {
    toast.success("Your performance report is being generated...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-cyan-50 dark:from-background dark:via-background dark:to-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FiBook className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Student Portal</span>
                <span className="text-xs text-muted-foreground block">EduCare Connect</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FiUser className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-xs text-muted-foreground">{displaySRN}</span>
              </div>
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                  <FiLogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {displayName.split(' ')[0]}! 👋</h1>
            <p className="opacity-90 mt-1">Here's your academic journey overview</p>
          </div>
          <Button onClick={handleDownloadReport} className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2">
            <FiDownload className="w-4 h-4" />
            Download Report Card
          </Button>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Average Score", value: "82%", icon: FiAward, gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Attendance", value: "91%", icon: FiCheckSquare, gradient: "from-emerald-500 to-green-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Health Status", value: "Good", icon: FiHeart, gradient: "from-pink-500 to-rose-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
            { label: "Pending Tasks", value: "2", icon: FiFileText, gradient: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`${stat.bg} rounded-2xl p-5 border border-border/50`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Daily Health Check */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border-l-4 border-l-pink-500"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <FiActivity className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Daily Health Check-in</h3>
                <p className="text-sm text-muted-foreground">How are you feeling today?</p>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => handleHealthUpdate("fine")}
                variant={healthStatus === "fine" ? "default" : "outline"}
                className={`flex-1 sm:flex-initial ${healthStatus === "fine" ? "bg-emerald-500 hover:bg-emerald-600" : "border-emerald-500 text-emerald-600 hover:bg-emerald-50"}`}
              >
                😊 Feeling Great
              </Button>
              <Button
                onClick={() => handleHealthUpdate("notwell")}
                variant={healthStatus === "notwell" ? "default" : "outline"}
                className={`flex-1 sm:flex-initial ${healthStatus === "notwell" ? "bg-rose-500 hover:bg-rose-600" : "border-rose-500 text-rose-600 hover:bg-rose-50"}`}
              >
                😷 Not Well
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Marks Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <FiTrendingUp className="w-5 h-5 text-blue-500" />
              Academic Progress
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={marksData}>
                <defs>
                  <linearGradient id="studentMarksGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="marks"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#studentMarksGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Attendance Radial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 flex flex-col items-center justify-center"
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
              <FiCheckSquare className="w-5 h-5 text-emerald-500" />
              Attendance
            </h3>
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="70%"
                  outerRadius="100%"
                  data={attendanceRadial}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: "hsl(var(--muted))" }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">91%</span>
                <span className="text-sm text-muted-foreground">Present</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subject Marks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
            <FiBook className="w-5 h-5 text-purple-500" />
            Subject-wise Performance
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjectMarks} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="subject" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Bar dataKey="marks" fill="#8B5CF6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <FiCalendar className="w-5 h-5 text-amber-500" />
              Upcoming Events
            </h3>
            <div className="space-y-4">
              <div className="space-y-4">
                {events.map((event) => {
                  const isRegistered = relatedStudent?.srn && event.registeredStudents?.includes(relatedStudent.srn);

                  return (
                    <div
                      key={event.id}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${event.type === "Sports" ? "bg-orange-500" :
                          event.type === "Academic" ? "bg-blue-500" : "bg-purple-500"
                          }`} />
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.date}</p>
                        </div>
                      </div>

                      {isRegistered ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                            ✓ Registered
                          </span>
                          <Button
                            onClick={() => handleUnregisterEvent(event.id)}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            title="Unregister"
                          >
                            <FiX className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => handleRegisterEvent(event.id)} variant="ghost" size="sm" className="gap-1">
                          Register
                          <FiExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Assignments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card p-6"
          >
            <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
              <FiFileText className="w-5 h-5 text-cyan-500" />
              My Assignments
            </h3>
            <div className="space-y-4">
              {assignments.map((assignment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl bg-muted/50 border border-border/50"
                >
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">Due: {assignment.due}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${assignment.status === "submitted"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                    {assignment.status === "submitted" ? "✓ Submitted" : "⏳ Pending"}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
