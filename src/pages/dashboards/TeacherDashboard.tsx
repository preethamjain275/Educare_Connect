import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { dataManager } from "@/lib/data";
import {
  FiCheckSquare,
  FiBook,
  FiCalendar,
  FiUsers,
  FiSend,
  FiPlusCircle,
  FiAlertCircle,
  FiSearch,
  FiLogOut,
  FiX,
  FiMessageSquare,
  FiEdit3,
  FiClipboard,
  FiFileText,
  FiHelpCircle
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const recentAlerts = [
  { id: 1, student: "Michael Brown", type: "Attendance", message: "Absent for 3 consecutive days", severity: "high" },
  { id: 2, student: "James Miller", type: "Marks", message: "Scored below 50% in Math test", severity: "medium" },
  { id: 3, student: "David Lee", type: "Health", message: "Reported feeling unwell", severity: "low" },
];

const TeacherDashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Fetch students from dataManager
    const allUsers = dataManager.getUsers();
    const studentUsers = allUsers.filter(u => u.role === "Student");

    // Map to dashboard format (mocking academic data for now)
    const formattedStudents = studentUsers.map(s => ({
      id: s.id,
      name: s.name,
      sr: s.srn || "N/A",
      class: "10-A",
      present: true,
      marks: Math.floor(Math.random() * 40) + 60 // Mock marks 60-100
    }));

    setStudents(formattedStudents);
    setAttendance(formattedStudents.reduce((acc, s) => ({ ...acc, [s.id]: true }), {} as Record<number, boolean>));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [showEventForm, setShowEventForm] = useState(false);
  const [showMarksForm, setShowMarksForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeView, setActiveView] = useState<"attendance" | "marks" | "alerts" | "leaves" | "tests">("attendance");
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [editingMark, setEditingMark] = useState<any>(null);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleOpenMarksModal = (studentId?: number) => {
    if (studentId) {
      const student = students.find(s => s.id === studentId);
      setEditingMark({
        studentId: studentId,
        studentName: student?.name,
        subject: "Mathematics", // Default or mock
        marks: student?.marks || 0,
        type: "Mid Term"
      });
    } else {
      setEditingMark(null);
    }
    setShowMarksForm(true);
  };

  const fetchLeaveRequests = async () => {
    const { data, error } = await supabase
      .from('leave_letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching leaves:", error);
    } else {
      setLeaveRequests(data || []);
    }
  };

  const handleApproveLeave = async (id: string, status: string) => {
    const { error } = await supabase
      .from('leave_letters')
      .update({ status: status })
      .eq('id', id);

    if (!error) {
      toast.success(`Leave request ${status}`);
      fetchLeaveRequests();
    } else {
      toast.error("Failed to update status");
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.sr.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const absentStudents = students.filter((s) => !attendance[s.id]);
  const presentCount = Object.values(attendance).filter(Boolean).length;

  const handleAttendanceChange = (id: number) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendSMS = () => {
    if (absentStudents.length === 0) {
      toast.info("All students are present today!");
      return;
    }
    toast.success(`SMS sent to parents of ${absentStudents.length} absent student(s)`);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    const date = (form.elements.namedItem('date') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

    const { error } = await supabase.from('events').insert({
      title,
      event_date: date,
      description,
      // created_by: teacher_id // In real app
    });

    if (error) {
      console.error(error);
      toast.error("Failed to add event");
    } else {
      toast.success("Event added successfully! Students will be notified.");
      setShowEventForm(false);
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Question added to question bank successfully!");
    setShowQuestionForm(false);
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMark) {
      // Update logic (mock)
      const updatedStudents = students.map(s =>
        s.id === Number(editingMark.studentId) ? { ...s, marks: Number(editingMark.marks) } : s
      );
      setStudents(updatedStudents);
      toast.success("Marks updated successfully!");
    } else {
      toast.success("Marks saved successfully!");
    }
    setShowMarksForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-background dark:via-background dark:to-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <FiClipboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Teacher Portal</span>
                <span className="text-xs text-muted-foreground block">Mr. Williams | Class 10-A</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Button onClick={() => setShowEventForm(true)} variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <FiCalendar className="w-4 h-4" />
                Add Event
              </Button>
              <Button onClick={() => setShowMarksForm(true)} variant="outline" size="sm" className="gap-2 hidden sm:flex">
                <FiEdit3 className="w-4 h-4" />
                Enter Marks
              </Button>
              <Button onClick={handleSendSMS} size="sm" className="gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                <FiSend className="w-4 h-4" />
                <span className="hidden sm:inline">SMS Absent</span>
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
            { label: "Total Students", value: students.length, icon: FiUsers, color: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            { label: "Present Today", value: presentCount, icon: FiCheckSquare, color: "from-emerald-500 to-green-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { label: "Absent Today", value: absentStudents.length, icon: FiAlertCircle, color: "from-red-500 to-rose-600", bg: "bg-red-50 dark:bg-red-900/20" },
            { label: "Pending Alerts", value: recentAlerts.length, icon: FiMessageSquare, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
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

        {/* View Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "attendance", label: "Attendance", icon: FiCheckSquare },
            { id: "marks", label: "Marks Entry", icon: FiBook },
            { id: "marks", label: "Marks Entry", icon: FiBook },
            { id: "alerts", label: "Alerts", icon: FiAlertCircle },
            { id: "leaves", label: "Leave Requests", icon: FiFileText },
            { id: "tests", label: "Online Tests", icon: FiHelpCircle },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeView === tab.id ? "default" : "outline"}
              onClick={() => setActiveView(tab.id as typeof activeView)}
              className={`gap-2 shrink-0 ${activeView === tab.id ? "bg-gradient-to-r from-emerald-500 to-teal-500" : ""}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeView === "attendance" && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <FiCheckSquare className="w-5 h-5 text-emerald-500" />
                    Today's Attendance
                  </h3>
                  <p className="text-sm text-muted-foreground">December 23, 2024</p>
                </div>
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
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">SR Number</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Mark Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <motion.tr
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm font-mono">{student.sr}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${attendance[student.id]
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {attendance[student.id] ? "Present" : "Absent"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleAttendanceChange(student.id)}
                            className={`w-6 h-6 rounded-md border-2 transition-all ${attendance[student.id]
                              ? "bg-emerald-500 border-emerald-500"
                              : "border-muted-foreground/30 hover:border-emerald-500"
                              }`}
                          >
                            {attendance[student.id] && (
                              <FiCheckSquare className="w-5 h-5 text-white mx-auto" />
                            )}
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {absentStudents.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>{absentStudents.length} student(s)</strong> marked absent.
                    <button onClick={handleSendSMS} className="underline ml-1 font-medium">
                      Click to notify parents via SMS
                    </button>
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeView === "marks" && (
            <motion.div
              key="marks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiBook className="w-5 h-5 text-blue-500" />
                  Student Marks Overview
                </h3>
                <Button onClick={() => setShowMarksForm(true)} size="sm" className="gap-2">
                  <FiPlusCircle className="w-4 h-4" />
                  Add Marks
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Student</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Current Avg</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Performance</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium block">{student.name}</span>
                              <span className="text-xs text-muted-foreground">{student.sr}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-lg font-bold">{student.marks}%</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="w-full bg-muted rounded-full h-2 max-w-[120px] mx-auto">
                            <div
                              className={`h-2 rounded-full ${student.marks >= 80 ? "bg-emerald-500" :
                                student.marks >= 60 ? "bg-amber-500" : "bg-red-500"
                                }`}
                              style={{ width: `${student.marks}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Button variant="ghost" size="sm" onClick={() => handleOpenMarksModal(student.id)}>
                            <FiEdit3 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeView === "alerts" && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                <FiAlertCircle className="w-5 h-5 text-amber-500" />
                Student Alerts
              </h3>
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-start gap-4 p-4 rounded-xl border ${alert.severity === "high"
                      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      : alert.severity === "medium"
                        ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                        : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${alert.severity === "high" ? "bg-red-100 dark:bg-red-900/40" :
                      alert.severity === "medium" ? "bg-amber-100 dark:bg-amber-900/40" :
                        "bg-blue-100 dark:bg-blue-900/40"
                      }`}>
                      <FiAlertCircle className={`w-5 h-5 ${alert.severity === "high" ? "text-red-600" :
                        alert.severity === "medium" ? "text-amber-600" : "text-blue-600"
                        }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{alert.student}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${alert.severity === "high" ? "bg-red-200 text-red-800" :
                          alert.severity === "medium" ? "bg-amber-200 text-amber-800" :
                            "bg-blue-200 text-blue-800"
                          }`}>
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Take Action
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeView === "leaves" && (
            <motion.div
              key="leaves"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                <FiFileText className="w-5 h-5 text-purple-500" />
                Leave Applications
              </h3>

              {leaveRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No leave requests found.</p>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((leave) => (
                    <div key={leave.id} className="p-4 rounded-xl border border-border/50 bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {/* In real app we would join student name */}
                          <p className="font-bold">Student ID: {leave.student_id?.slice(0, 8)}...</p>
                          <p className="text-sm text-muted-foreground">{leave.from_date} to {leave.to_date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                          leave.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {leave.status}
                        </span>
                      </div>
                      <p className="text-sm mb-4">{leave.reason}</p>
                      {leave.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApproveLeave(leave.id, 'approved')} className="bg-green-500 hover:bg-green-600">
                            Approve & Notify Parent
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleApproveLeave(leave.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      )}
                      <div className="mt-2 text-xs text-muted-foreground">
                        {leave.status === 'approved' && "✓ Parent notified via SMS"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeView === "tests" && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiHelpCircle className="w-5 h-5 text-blue-500" />
                  Online Tests & Question Bank
                </h3>
                <Button onClick={() => setShowQuestionForm(true)} size="sm" className="gap-2">
                  <FiPlusCircle className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              <div className="grid gap-4">
                <div className="p-4 border rounded-xl bg-muted/20">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Mathematics - Chapter 5 Quiz</h4>
                    <span className="text-xs text-muted-foreground">Created: Dec 20, 2024</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">10 Questions • 30 Minutes • 20 Marks</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">Preview</Button>
                  </div>
                </div>
                {/* Placeholder for more tests */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showEventForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowEventForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add New Event</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowEventForm(false)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input name="title" placeholder="Event title" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input type="date" name="date" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      placeholder="Event description..."
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background resize-none"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Google Form Link (Optional)</label>
                    <Input placeholder="https://forms.google.com/..." />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowEventForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      Add Event
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Marks Modal */}
        <AnimatePresence>
          {showMarksForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowMarksForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{editingMark ? "Edit Marks" : "Enter Marks"}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowMarksForm(false)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleSaveMarks} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Student</label>
                    <select
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background"
                      value={editingMark?.studentId || ""}
                      onChange={(e) => setEditingMark({ ...editingMark, studentId: e.target.value })}
                      disabled={!!editingMark} // Disable student change if editing specific
                    >
                      <option value="">-- Select Student --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.sr})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background">
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                      <option>History</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Exam Type</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background">
                      <option>Unit Test</option>
                      <option>Mid Term</option>
                      <option>Final Exam</option>
                      <option>Assignment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Marks (out of 100)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter marks"
                      required
                      value={editingMark?.marks || ""}
                      onChange={(e) => setEditingMark({ ...editingMark, marks: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowMarksForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                      {editingMark ? "Update Marks" : "Save Marks"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Question Modal */}
        <AnimatePresence>
          {showQuestionForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowQuestionForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Add Question</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowQuestionForm(false)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleAddQuestion} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Question Text</label>
                    <textarea placeholder="Type your question..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    <div className="space-y-2">
                      <Input placeholder="Option A" />
                      <Input placeholder="Option B" />
                      <Input placeholder="Option C" />
                      <Input placeholder="Option D" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer</label>
                    <select className="w-full px-4 py-2.5 rounded-xl border border-border bg-background">
                      <option>Option A</option>
                      <option>Option B</option>
                      <option>Option C</option>
                      <option>Option D</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500">Add to Bank</Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TeacherDashboard;
