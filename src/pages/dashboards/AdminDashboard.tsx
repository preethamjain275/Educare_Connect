import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiBook,
  FiHeart,
  FiCalendar,
  FiSearch,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiUpload,
  FiDownload,
  FiSettings,
  FiLogOut,
  FiX,
  FiShield,
  FiDatabase,
  FiUserPlus,
  FiGrid,
  FiTruck,
  FiPhone,
  FiHash,
  FiMail as FiMailIcon
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

import { dataManager, User, Event } from "@/lib/data";

const userStats = [
  { role: "Students", count: 156 },
  { role: "Parents", count: 142 },
  { role: "Teachers", count: 24 },
  { role: "Doctors", count: 3 },
];



const activityData = [
  { day: "Mon", logins: 120 },
  { day: "Tue", logins: 145 },
  { day: "Wed", logins: 132 },
  { day: "Thu", logins: 158 },
  { day: "Fri", logins: 142 },
  { day: "Sat", logins: 45 },
  { day: "Sun", logins: 38 },
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState<"overview" | "users" | "events" | "data">("overview");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>(dataManager.getUsers());

  // State for Add/Edit User Form
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    role: "Student",
    name: "",
    email: "",
    phone: "",
    srn: "", // Represents Student SRN or Linked SRN for Parent
    password: "",
    vanDriverPhone: "",
    routeNumber: ""
  });

  // State for Add/Edit Event Form
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
    type: "Other"
  });

  useEffect(() => {
    // Initial fetch
    setEvents(dataManager.getEvents());
    setUsers(dataManager.getUsers());
  }, []);

  // Update lists whenever active section changes (simple way to refresh)
  useEffect(() => {
    if (activeSection === 'users') setUsers(dataManager.getUsers());
    if (activeSection === 'events') setEvents(dataManager.getEvents());
  }, [activeSection]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenUserModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        srn: user.role === "Student" ? user.srn : user.role === "Parent" ? user.linkedSrn : "",
        password: "", // Don't show existing password
        vanDriverPhone: "",
        routeNumber: ""
      });
    } else {
      setEditingUser(null);
      setFormData({
        role: "Student",
        name: "",
        email: "",
        phone: "",
        srn: "",
        password: "",
        vanDriverPhone: "",
        routeNumber: ""
      });
    }
    setShowUserModal(true);
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingUser) {
      // Update existing user
      const updatedUser = {
        ...editingUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role as any,
        srn: formData.role === "Student" ? formData.srn : undefined,
        linkedSrn: formData.role === "Parent" ? formData.srn : undefined,
        password: formData.password ? formData.password : editingUser.password
      };

      dataManager.updateUser(updatedUser);
      setUsers(dataManager.getUsers());
      toast.success("User updated successfully!");
    } else {
      // Add new user
      dataManager.addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role as any,
        phone: formData.phone,
        srn: formData.role === "Student" ? formData.srn : undefined,
        linkedSrn: formData.role === "Parent" ? formData.srn : undefined,
        password: formData.password || "password123"
      });
      setUsers(dataManager.getUsers());
      toast.success("User added successfully!");
    }
    setShowUserModal(false);
  };

  const handleOpenEventModal = (event: Event | null = null) => {
    if (event) {
      setEditingEvent(event);
      setEventFormData({
        title: event.title,
        date: event.date,
        description: event.description,
        link: event.link || "",
        type: event.type
      });
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: "",
        date: "",
        description: "",
        link: "",
        type: "Other"
      });
    }
    setShowAddEventModal(true);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEvent) {
      // Update
      dataManager.updateEvent({
        ...editingEvent,
        title: eventFormData.title,
        date: eventFormData.date,
        description: eventFormData.description,
        link: eventFormData.link,
        type: eventFormData.type as any
      });
      toast.success("Event updated successfully!");
    } else {
      // Create
      dataManager.addEvent({
        title: eventFormData.title,
        date: eventFormData.date,
        description: eventFormData.description,
        link: eventFormData.link,
        type: eventFormData.type as any
      });
      toast.success("Event created successfully!");
    }

    setEvents(dataManager.getEvents());
    setShowAddEventModal(false);
  };

  const handleDeleteEvent = (id: number) => {
    if (confirm("Are you sure you want to delete this event?")) {
      dataManager.deleteEvent(id);
      setEvents(dataManager.getEvents());
      toast.success("Event deleted.");
    }
  };

  const handleDeleteUser = (id: number) => {
    dataManager.deleteUser(id);
    setUsers(dataManager.getUsers());
    toast.success("User removed from the system");
  };

  const handleImportData = () => {
    document.getElementById('import-file')?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        dataManager.importData(json);
        toast.success("Data imported successfully! Reloading...");
        setTimeout(() => location.reload(), 1000);
      } catch (err) {
        toast.error("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportData = () => {
    const data = dataManager.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `educare_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Data export initiated.");
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to RESET all system data to defaults? This will erase all your changes.")) {
      dataManager.resetData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-indigo-50 dark:from-background dark:via-background dark:to-background">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <FiShield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">Admin Console</span>
                <span className="text-xs text-muted-foreground block">EduCare Connect</span>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button onClick={handleImportData} variant="outline" size="sm" className="gap-2 hidden md:flex">
                <FiUpload className="w-4 h-4" />
                Import Data
              </Button>
              <Button onClick={handleExportData} variant="outline" size="sm" className="gap-2 hidden md:flex">
                <FiDownload className="w-4 h-4" />
                Export Data
              </Button>
              <Button onClick={handleResetData} variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hidden md:flex">
                Reset System
              </Button>
              <Button onClick={() => handleOpenUserModal()} size="sm" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                <FiUserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
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
            { label: "Total Users", value: users.length, icon: FiUsers, color: "from-indigo-500 to-purple-600", bg: "bg-indigo-50 dark:bg-indigo-900/20", change: "+12%" },
            { label: "Active Students", value: users.filter(u => u.role === "Student").length, icon: FiBook, color: "from-blue-500 to-cyan-600", bg: "bg-blue-50 dark:bg-blue-900/20", change: "+8%" },
            { label: "Total Events", value: events.length, icon: FiCalendar, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/20", change: "+3" },
            { label: "System Health", value: "98%", icon: FiDatabase, color: "from-amber-500 to-orange-600", bg: "bg-amber-50 dark:bg-amber-900/20", change: "Stable" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${stat.bg} rounded-2xl p-5 border border-border/50`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-4">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: FiGrid },
            { id: "users", label: "User Management", icon: FiUsers },
            { id: "events", label: "Events", icon: FiCalendar },
            { id: "data", label: "Data & Import", icon: FiDatabase },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeSection === tab.id ? "default" : "outline"}
              onClick={() => setActiveSection(tab.id as typeof activeSection)}
              className={`gap-2 shrink-0 ${activeSection === tab.id ? "bg-gradient-to-r from-indigo-500 to-purple-600" : ""}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeSection === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Distribution */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                    <FiUsers className="w-5 h-5 text-indigo-500" />
                    User Distribution by Role
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={userStats} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis dataKey="role" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="count" fill="#6366F1" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Activity Chart */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                    <FiDatabase className="w-5 h-5 text-emerald-500" />
                    Weekly Login Activity
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Line type="monotone" dataKey="logins" stroke="#10B981" strokeWidth={3} dot={{ fill: "#10B981" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Demo Credentials Card (For Testing) */}
              <div className="glass-card p-6 border-l-4 border-l-amber-500">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                  <FiDatabase className="w-5 h-5 text-amber-500" />
                  Demo Credentials (For Testing)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-indigo-600">Student</p>
                    <p>SRN: 24Suube001</p>
                    <p className="text-muted-foreground text-xs">Pass: password123</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-emerald-600">Parent</p>
                    <p>Email: parent@educare.school</p>
                    <p className="text-muted-foreground text-xs">Pass: password123</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-purple-600">Teacher</p>
                    <p>Email: teacher@educare.school</p>
                    <p className="text-muted-foreground text-xs">Pass: password123</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-rose-600">Doctor</p>
                    <p>Email: doctor@educare.school</p>
                    <p className="text-muted-foreground text-xs">Pass: password123</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-semibold text-blue-600">Admin</p>
                    <p>Email: admin@example.com</p>
                    <p className="text-muted-foreground text-xs">Pass: password123</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-indigo-500" />
                  All Users
                </h3>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button onClick={() => handleOpenUserModal()} size="sm" className="gap-2 shrink-0">
                    <FiPlusCircle className="w-4 h-4" />
                    Add User
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Role</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Joined</th>
                      <th className="text-center py-3 px-4 font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${user.role === "Student" ? "bg-gradient-to-br from-blue-400 to-blue-600" :
                              user.role === "Teacher" ? "bg-gradient-to-br from-emerald-400 to-emerald-600" :
                                user.role === "Doctor" ? "bg-gradient-to-br from-rose-400 to-rose-600" :
                                  "bg-gradient-to-br from-purple-400 to-purple-600"
                              }`}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-medium block">{user.name}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "Student" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                            user.role === "Teacher" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                              user.role === "Doctor" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" :
                                "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === "Active"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                            }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{user.joined}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button size="sm" variant="ghost" className="p-2" onClick={() => handleOpenUserModal(user)}>
                              <FiEdit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="p-2 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeSection === "events" && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-emerald-500" />
                  System Events
                </h3>
                <Button onClick={() => handleOpenEventModal()} size="sm" className="gap-2">
                  <FiPlusCircle className="w-4 h-4" />
                  Create Event
                </Button>
              </div>

              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No events scheduled.</p>
                ) : (
                  events.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-muted/50 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 font-bold text-lg">
                          {new Date(event.date).getDate()}
                        </div>
                        <div>
                          <h4 className="font-semibold">{event.title}</h4>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                          {event.link && (
                            <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                              View Details / Register
                            </a>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">Type: {event.type} | Registered: {event.registeredStudents?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button size="sm" variant="ghost" onClick={() => handleOpenEventModal(event)}>
                          <FiEdit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {activeSection === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                  <FiUpload className="w-5 h-5 text-blue-500" />
                  Import Data
                </h3>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <FiUpload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload Excel File</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Import student records, teacher data, or bulk user information
                  </p>
                  <Button onClick={handleImportData} className="gap-2">
                    <FiUpload className="w-4 h-4" />
                    Select File
                  </Button>
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-6">
                  <FiDownload className="w-5 h-5 text-emerald-500" />
                  Export Data
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: "Student Records", desc: "All student data with marks and attendance" },
                    { label: "Teacher List", desc: "Complete teacher directory" },
                    { label: "Health Records", desc: "Student health and vaccination data" },
                    { label: "Event Report", desc: "All events with registration details" },
                    { label: "Attendance Report", desc: "Monthly attendance summary" },
                    { label: "Full Backup", desc: "Complete system data backup" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={handleExportData}
                      className="p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <FiDownload className="w-5 h-5 text-emerald-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add/Edit User Modal */}
        <AnimatePresence>
          {showUserModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowUserModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{editingUser ? "Edit User" : "Add New User"}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowUserModal(false)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleUserSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] px-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        className="w-full px-4 py-2 rounded-xl border border-border bg-background"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="Student">Student</option>
                        <option value="Parent">Parent</option>
                        <option value="Teacher">Teacher</option>
                        <option value="Doctor">Doctor</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <div className="relative">
                        <FiUserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="Enter full name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <div className="relative">
                        <FiMailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          type="email"
                          placeholder="user@example.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Phone Number</label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          className="pl-9"
                          placeholder="+91..."
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {(formData.role === "Student" || formData.role === "Parent") && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          {formData.role === "Student" ? "SRN / Roll No" : "Child's Linked SRN"}
                        </label>
                        <div className="relative">
                          <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            className="pl-9"
                            placeholder={formData.role === "Student" ? "Student ID" : "Student SRN to Link"}
                            value={formData.srn}
                            onChange={(e) => setFormData({ ...formData, srn: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-span-2">
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 mt-2">Transport Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                          <label className="block text-xs mb-1">Van Driver Phone</label>
                          <div className="relative">
                            <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              className="pl-9 h-9 text-sm"
                              placeholder="Driver Contact"
                              value={formData.vanDriverPhone}
                              onChange={(e) => setFormData({ ...formData, vanDriverPhone: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs mb-1">Route Number</label>
                          <Input
                            className="h-9 text-sm"
                            placeholder="Route #42"
                            value={formData.routeNumber}
                            onChange={(e) => setFormData({ ...formData, routeNumber: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <Input
                        type="password"
                        placeholder={editingUser ? "Leave blank to keep current" : "••••••••"}
                        required={!editingUser}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowUserModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                      {editingUser ? "Update User" : "Add User"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Event Modal */}
        <AnimatePresence>
          {showAddEventModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAddEventModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl p-6 w-full max-w-md shadow-2xl border border-border"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">{editingEvent ? "Edit Event" : "Create New Event"}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddEventModal(false)}>
                    <FiX className="w-5 h-5" />
                  </Button>
                </div>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Title</label>
                    <Input
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                      placeholder="Enter event title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Type</label>
                    <select
                      value={eventFormData.type}
                      onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      required
                    >
                      <option value="Sports">Sports</option>
                      <option value="Academic">Academic</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Meeting">Meeting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                      type="date"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                      placeholder="Event description..."
                      className="w-full h-24 p-3 rounded-md border border-input bg-background resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Link / Form URL</label>
                    <Input
                      value={eventFormData.link}
                      onChange={(e) => setEventFormData({ ...eventFormData, link: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddEventModal(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                      {editingEvent ? "Update Event" : "Create Event"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}  </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
