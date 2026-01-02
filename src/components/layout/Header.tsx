import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiMenu, 
  FiX, 
  FiUser, 
  FiUsers, 
  FiHeart, 
  FiShield,
  FiChevronDown
} from "react-icons/fi";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Feedback", path: "/feedback" },
];

const loginRoles = [
  { name: "Student", path: "/login/student", icon: FiUser, color: "text-edu-blue" },
  { name: "Parent", path: "/login/parent", icon: FiUsers, color: "text-edu-mint" },
  { name: "Teacher", path: "/login/teacher", icon: FiUser, color: "text-edu-purple" },
  { name: "Doctor", path: "/login/doctor", icon: FiHeart, color: "text-edu-pink" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.div 
              className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-primary-foreground font-bold text-lg">E</span>
            </motion.div>
            <span className="font-bold text-xl gradient-text hidden sm:block">
              EduCare Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.name}
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Login Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                onBlur={() => setTimeout(() => setIsLoginDropdownOpen(false), 150)}
              >
                Login
                <FiChevronDown className={`transition-transform ${isLoginDropdownOpen ? "rotate-180" : ""}`} />
              </Button>
              
              <AnimatePresence>
                {isLoginDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 glass-card p-2 shadow-lg"
                  >
                    {loginRoles.map((role) => (
                      <Link
                        key={role.name}
                        to={role.path}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <role.icon className={`w-4 h-4 ${role.color}`} />
                        <span className="font-medium">{role.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Login */}
            <Link to="/login/admin">
              <Button className="gradient-bg gap-2 shadow-md hover:shadow-glow transition-shadow">
                <FiShield className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-border/50">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  <div className="border-t border-border/50 my-2 pt-2">
                    <p className="px-4 py-2 text-sm text-muted-foreground font-medium">
                      Login as
                    </p>
                    {loginRoles.map((role) => (
                      <Link
                        key={role.name}
                        to={role.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <role.icon className={`w-5 h-5 ${role.color}`} />
                        <span className="font-medium">{role.name}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    to="/login/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mx-4 mt-2"
                  >
                    <Button className="w-full gradient-bg gap-2">
                      <FiShield className="w-4 h-4" />
                      Admin Login
                    </Button>
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
