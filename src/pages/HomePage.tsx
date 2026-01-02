import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, 
  FiBook, 
  FiHeart, 
  FiUsers, 
  FiShield,
  FiActivity,
  FiCalendar,
  FiAward
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const features = [
  {
    icon: FiBook,
    title: "Academic Tracking",
    description: "Monitor marks, attendance, and assignments with real-time analytics and insights.",
    color: "bg-edu-blue/10 text-edu-blue",
  },
  {
    icon: FiHeart,
    title: "Health Monitoring",
    description: "Track student health, BMI, vaccinations, and daily wellness with doctor oversight.",
    color: "bg-edu-pink/10 text-edu-pink",
  },
  {
    icon: FiUsers,
    title: "Parent Connect",
    description: "Keep parents informed with instant alerts for attendance, marks, and health updates.",
    color: "bg-edu-mint/10 text-edu-mint",
  },
  {
    icon: FiShield,
    title: "Secure Access",
    description: "Role-based authentication ensures data privacy for students, parents, and staff.",
    color: "bg-edu-purple/10 text-edu-purple",
  },
  {
    icon: FiActivity,
    title: "Real-time Alerts",
    description: "SMS and email notifications for critical updates on attendance and health.",
    color: "bg-edu-orange/10 text-edu-orange",
  },
  {
    icon: FiCalendar,
    title: "Event Management",
    description: "Create and manage school events with integrated registration forms.",
    color: "bg-edu-teal/10 text-edu-teal",
  },
];

const stats = [
  { value: "500+", label: "Students" },
  { value: "50+", label: "Teachers" },
  { value: "95%", label: "Parent Engagement" },
  { value: "24/7", label: "Health Support" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-edu-blue/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-edu-mint/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-edu-teal/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <FiAward className="w-4 h-4" />
                Trusted by 500+ Schools
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Empowering{" "}
              <span className="gradient-text">Education</span>
              <br />
              & Student{" "}
              <span className="gradient-text">Wellness</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              An integrated platform combining student education and healthcare monitoring 
              for real-time alerts, performance tracking, and seamless parent-teacher-health coordination.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/login/student">
                <Button size="lg" className="gradient-bg gap-2 px-8 shadow-lg hover:shadow-glow transition-shadow">
                  Get Started
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="glass-card p-6 text-center hover-lift"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need in{" "}
              <span className="gradient-text">One Platform</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for managing student academics, health, and communication 
              between parents, teachers, and healthcare providers.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="glass-card p-6 hover-lift group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 icon-3d group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Role Cards Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Portals for{" "}
              <span className="gradient-text">Every Role</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tailored dashboards and features for each user type to ensure 
              seamless experience and efficient workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                title: "Students", 
                desc: "View marks, attendance, health status, and upcoming events",
                path: "/login/student",
                gradient: "from-edu-blue to-edu-blue-light",
                icon: FiBook
              },
              { 
                title: "Parents", 
                desc: "Monitor your child's progress with real-time notifications",
                path: "/login/parent",
                gradient: "from-edu-mint to-edu-teal",
                icon: FiUsers
              },
              { 
                title: "Teachers", 
                desc: "Manage attendance, marks, assignments, and events",
                path: "/login/teacher",
                gradient: "from-edu-purple to-edu-pink",
                icon: FiAward
              },
              { 
                title: "Doctors", 
                desc: "Track student health records and provide care updates",
                path: "/login/doctor",
                gradient: "from-edu-pink to-edu-orange",
                icon: FiHeart
              },
            ].map((role, index) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={role.path}>
                  <div className="glass-card p-6 h-full hover-lift group cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 icon-3d group-hover:scale-110 transition-transform`}>
                      <role.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{role.desc}</p>
                    <div className="flex items-center gap-2 text-primary font-medium">
                      Login Now
                      <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 gradient-bg opacity-90" />
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl" />
            </div>
            
            <div className="relative p-8 md:p-16 text-center text-primary-foreground">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your School?
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Join hundreds of schools already using EduCare Connect to streamline 
                education and healthcare management.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/login/admin">
                  <Button size="lg" variant="secondary" className="gap-2 px-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    <FiShield className="w-4 h-4" />
                    Admin Portal
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="gap-2 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    Learn More
                    <FiArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
