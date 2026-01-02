import { ReactNode, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, 
  FiBook, 
  FiCalendar, 
  FiHeart,
  FiFileText,
  FiUsers,
  FiSettings,
  FiBell,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
  FiActivity,
  FiCheckSquare,
  FiAlertCircle,
  FiPlusCircle,
  FiDatabase
} from "react-icons/fi";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: ReactNode;
}

const roleMenuItems: Record<string, { name: string; path: string; icon: React.ElementType }[]> = {
  student: [
    { name: "Overview", path: "", icon: FiHome },
    { name: "Marks", path: "marks", icon: FiBook },
    { name: "Attendance", path: "attendance", icon: FiCheckSquare },
    { name: "Health", path: "health", icon: FiHeart },
    { name: "Events", path: "events", icon: FiCalendar },
    { name: "Assignments", path: "assignments", icon: FiFileText },
  ],
  parent: [
    { name: "Overview", path: "", icon: FiHome },
    { name: "Academic Summary", path: "academic", icon: FiBook },
    { name: "Health Summary", path: "health", icon: FiHeart },
    { name: "Notifications", path: "notifications", icon: FiBell },
    { name: "Leave Letter", path: "leave", icon: FiFileText },
  ],
  teacher: [
    { name: "Overview", path: "", icon: FiHome },
    { name: "Attendance", path: "attendance", icon: FiCheckSquare },
    { name: "Marks Entry", path: "marks", icon: FiBook },
    { name: "Assignments", path: "assignments", icon: FiFileText },
    { name: "Events", path: "events", icon: FiCalendar },
    { name: "Alerts", path: "alerts", icon: FiAlertCircle },
  ],
  doctor: [
    { name: "Overview", path: "", icon: FiHome },
    { name: "Students", path: "students", icon: FiUsers },
    { name: "Health Records", path: "records", icon: FiHeart },
    { name: "Vaccinations", path: "vaccinations", icon: FiActivity },
    { name: "Alerts", path: "alerts", icon: FiAlertCircle },
  ],
  admin: [
    { name: "Overview", path: "", icon: FiHome },
    { name: "Users", path: "users", icon: FiUsers },
    { name: "Students", path: "students", icon: FiUser },
    { name: "Teachers", path: "teachers", icon: FiBook },
    { name: "Doctors", path: "doctors", icon: FiHeart },
    { name: "Events", path: "events", icon: FiCalendar },
    { name: "Import Data", path: "import", icon: FiDatabase },
    { name: "Settings", path: "settings", icon: FiSettings },
  ],
};

const roleTitles: Record<string, string> = {
  student: "Student",
  parent: "Parent",
  teacher: "Teacher",
  doctor: "Health Officer",
  admin: "Administrator",
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { role = "student" } = useParams<{ role: string }>();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = roleMenuItems[role] || roleMenuItems.student;
  const title = roleTitles[role] || "Dashboard";

  const isActive = (path: string) => {
    const currentPath = location.pathname;
    const basePath = `/dashboard/${role}`;
    const fullPath = path ? `${basePath}/${path}` : basePath;
    return currentPath === fullPath;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-bold gradient-text">EduCare</span>
        </Link>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-muted"
        >
          {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border/50 z-50 flex flex-col"
            >
              {/* Logo */}
              <div className="p-6 border-b border-border/50">
                <Link to="/" className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">E</span>
                  </div>
                  <div>
                    <span className="font-bold text-lg gradient-text block">EduCare</span>
                    <span className="text-xs text-muted-foreground">{title} Portal</span>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-1">
                  {menuItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.path ? `/dashboard/${role}/${item.path}` : `/dashboard/${role}`}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            active
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                          {item.name}
                          {active && (
                            <motion.div
                              layoutId="activeMenu"
                              className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* User Section */}
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Demo User</p>
                    <p className="text-xs text-muted-foreground truncate">{title}</p>
                  </div>
                </div>
                <Link to="/">
                  <Button variant="ghost" className="w-full mt-2 gap-2 text-muted-foreground hover:text-destructive">
                    <FiLogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border/50 z-30 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <div>
              <span className="font-bold text-lg gradient-text block">EduCare</span>
              <span className="text-xs text-muted-foreground">{title} Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.name}>
                  <Link
                    to={item.path ? `/dashboard/${role}/${item.path}` : `/dashboard/${role}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${active ? "text-primary" : ""}`} />
                    {item.name}
                    {active && (
                      <motion.div
                        layoutId="activeMenuDesktop"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
              <FiUser className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Demo User</p>
              <p className="text-xs text-muted-foreground truncate">{title}</p>
            </div>
          </div>
          <Link to="/">
            <Button variant="ghost" className="w-full mt-2 gap-2 text-muted-foreground hover:text-destructive">
              <FiLogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-[280px] pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
