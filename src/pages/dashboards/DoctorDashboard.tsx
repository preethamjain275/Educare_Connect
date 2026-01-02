import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { dataManager } from "@/lib/data";
import EducareAI from "@/components/EducareAI";
import {
  FiHeart,
  FiUsers,
  FiActivity,
  FiAlertCircle,
  FiSearch,
  FiEdit,
  FiMessageCircle,
  FiLogOut,
  FiX,
  FiThermometer,
  FiDroplet,
  FiShield
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const healthAlerts = [
  { id: 1, student: "Sarah Davis", message: "Reported feeling unwell today - Fever symptoms", time: "2 hours ago", priority: "high" },
  { id: 2, student: "Michael Brown", message: "Vaccination overdue by 2 weeks", time: "1 day ago", priority: "medium" },
  { id: 3, student: "James Miller", message: "BMI above normal range - needs dietary review", time: "3 days ago", priority: "low" },
];

const healthDistribution = [
  { name: "Healthy", value: 4, color: "#10B981" },
  { name: "Monitoring", value: 2, color: "#F59E0B" },
  { name: "Not Well", value: 1, color: "#EF4444" },
];

const DoctorDashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "records" | "vaccinations">("overview");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    // Fetch students from dataManager
    const allUsers = dataManager.getUsers();
    const studentUsers = allUsers.filter(u => u.role === "Student");

    // Map to dashboard format (mocking health data for now)
    const formattedStudents = studentUsers.map(s => ({
      id: s.id,
      name: s.name,
      sr: s.srn || "N/A",
      class: "10-A",
      bmi: (Math.random() * 10 + 18).toFixed(1), // Mock BMI 18-28 
      status: Math.random() > 0.8 ? "Monitoring" : (Math.random() > 0.9 ? "Not Well" : "Good"),
      vaccination: Math.random() > 0.2 ? "Complete" : "Pending",
      lastCheckup: "Oct 15"
    }));

    setStudents(formattedStudents);
  }, []);

  const bmiData = students.map(s => ({ name: s.name.split(" ")[0], bmi: s.bmi }));

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateHealth = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Health record updated successfully!");
    setSelectedStudent(null);
  };

  const handleSendAlert = (studentName: string) => {
    toast.success(`Health alert sent to ${studentName}'s parents and class teacher`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-pink-50 dark:from-background dark:via-background dark:to-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Health Portal</span>
                <span className="text-xs text-muted-foreground block">Dr. Brown | Health Officer</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsAiModalOpen(true)}
                className="gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/20"
              >
                <FiMessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">AI Health Assistant</span>
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                  <FiLogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Total Students", value: students.length, icon: FiUsers, color: "from-blue-500 to-indigo-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Healthy", value: students.filter(s => s.status === "Good").length, icon: FiHeart, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Need Attention", value: students.filter(s => s.status !== "Good").length, icon: FiActivity, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
            { label: "Active Alerts", value: healthAlerts.length, icon: FiAlertCircle, color: "from-rose-500 to-red-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${stat.bg} rounded-2xl p-5 border border-border/50`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Health Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border-l-4 border-l-rose-500"
        >
          <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
            <FiAlertCircle className="w-5 h-5 text-rose-500" />
            Active Health Alerts
          </h3>
          <div className="space-y-3">
            {healthAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border ${alert.priority === "high"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  : alert.priority === "medium"
                    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${alert.priority === "high" ? "bg-red-500" :
                    alert.priority === "medium" ? "bg-amber-500" : "bg-blue-500"
                    }`} />
                  <div>
                    <p className="font-semibold">{alert.student}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendAlert(alert.student)}
                >
                  Notify Parents
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Health Overview", icon: FiActivity },
            { id: "records", label: "Student Records", icon: FiUsers },
            { id: "vaccinations", label: "Vaccinations", icon: FiShield },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`gap-2 shrink-0 ${activeTab === tab.id ? "bg-gradient-to-r from-rose-500 to-pink-500" : ""}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Health Distribution */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                  <FiHeart className="w-5 h-5 text-rose-500" />
                  Health Status Distribution
                </h3>
                <div className="flex items-center gap-8">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie
                        data={healthDistribution}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {healthDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    {healthDistribution.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-bold ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* BMI Chart */}
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                  <FiThermometer className="w-5 h-5 text-amber-500" />
                  BMI Distribution
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bmiData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "12px",
                      }}
                    />
                    <Bar dataKey="bmi" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {activeTab === "records" && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-blue-500" />
                  Student Health Records
                </h3>
                <div className="relative w-full sm:w-64">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">BMI</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Last Checkup</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white font-medium">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium block">{student.name}</span>
                              <span className="text-xs text-muted-foreground">{student.sr} | {student.class}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-bold ${student.bmi >= 25 ? "text-amber-600" :
                            student.bmi < 18.5 ? "text-blue-600" : "text-emerald-600"
                            }`}>
                            {student.bmi}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === "Good"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : student.status === "Monitoring"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground">
                          {student.lastCheckup}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedStudent(student)}
                            className="gap-1"
                          >
                            <FiEdit className="w-4 h-4" />
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "vaccinations" && (
            <motion.div
              key="vaccinations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                <FiShield className="w-5 h-5 text-emerald-500" />
                Vaccination Status
              </h3>

              <div className="grid gap-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-4 rounded-xl border ${student.vaccination === "Complete"
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                      : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${student.vaccination === "Complete" ? "bg-emerald-500" : "bg-amber-500"
                        }`}>
                        <FiShield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.sr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.vaccination === "Complete"
                        ? "bg-emerald-200 text-emerald-800"
                        : "bg-amber-200 text-amber-800"
                        }`}>
                        {student.vaccination}
                      </span>
                      {student.vaccination === "Pending" && (
                        <Button size="sm" variant="outline">
                          Schedule
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Health Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedStudent(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Update Health Record</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <div className="mb-4 p-3 rounded-xl bg-muted/50">
                  <p className="font-medium">{selectedStudent.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedStudent.sr} | {selectedStudent.class}</p>
                </div>
                <form onSubmit={handleUpdateHealth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">BMI</label>
                    <Input type="number" step="0.1" defaultValue={selectedStudent.bmi} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Health Status</label>
                    <select defaultValue={selectedStudent.status} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background">
                      <option value="Good">Good</option>
                      <option value="Monitoring">Monitoring</option>
                      <option value="Not Well">Not Well</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Vaccination Status</label>
                    <select defaultValue={selectedStudent.vaccination} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background">
                      <option value="Complete">Complete</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Doctor Notes</label>
                    <textarea
                      placeholder="Add medical notes..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setSelectedStudent(null)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
                      Update Record
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <EducareAI context="general" />
      <EducareAI
        context="doctor"
        isOpen={isAiModalOpen}
        onOpenChange={setIsAiModalOpen}
        hideFloatingButton={true}
      />
    </div>
  );
};

export default DoctorDashboard;
