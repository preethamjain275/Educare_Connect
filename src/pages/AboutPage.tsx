import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBook,
  FiHeart,
  FiUsers,
  FiShield,
  FiTarget,
  FiZap,
  FiArrowRight,
  FiLinkedin,
  FiGithub,
  FiMail,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";

const developers = [
  {
    name: "Purushotham K",
    role: "Frontend Developer",
    image:
      "prem.jpg",
    linkedin: "#",
    github: "#",
    email: "prem@educare.connect",
  },
  {
    name: "Prerith",
    role: "Backend Developer",
    image:
      "prerith.jpg",
    linkedin: "#",
    github: "#",
    email: "prerith@educare.connect",
  },
  {
    name: "Preetham",
    role: "Database Management",
    image:
      "preetham.jpg",
    linkedin: "#",
    github: "#",
    email: "preetham@educare.connect",
  },
  {
    name: "Ankitha",
    role: "UI/UX Design",
    image:
      "ankitha.jpg",
    linkedin: "#",
    github: "#",
    email: "ankitha@educare.connect",
  },
];

const values = [
  {
    icon: FiTarget,
    title: "Mission",
    description:
      "To seamlessly integrate education and healthcare management, ensuring every student thrives academically and stays healthy.",
  },
  {
    icon: FiZap,
    title: "Vision",
    description:
      "Creating a future where parents, teachers, and healthcare providers work together for the holistic development of students.",
  },
  {
    icon: FiHeart,
    title: "Values",
    description:
      "Innovation, accessibility, privacy, and student-first approach guide everything we build and improve.",
  },
];

const features = [
  { icon: FiBook, text: "Real-time academic tracking with detailed analytics" },
  {
    icon: FiHeart,
    text: "Comprehensive health monitoring and doctor oversight",
  },
  { icon: FiUsers, text: "Instant parent notifications via SMS and email" },
  { icon: FiShield, text: "Role-based secure access for all stakeholders" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-edu-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-edu-mint/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About EduCare Connect
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bridging <span className="gradient-text">Education</span> &{" "}
              <span className="gradient-text">Healthcare</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              EduCare Connect is an integrated platform combining student
              education and healthcare monitoring. It ensures real-time alerts,
              performance tracking, and seamless parent-teacher-health
              coordination for the complete development of every student.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card/50 border border-border/50"
                >
                  <feature.icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {feature.text}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="gradient-text">Purpose</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Driven by the belief that education and health go hand in hand.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="glass-card p-8 text-center hover-lift"
              >
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 icon-3d">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Created by passionate developers from Sapthagiri NPS University,
              committed to transforming educational technology.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {developers.map((dev, index) => (
              <motion.div
                key={dev.name}
                variants={itemVariants}
                className="glass-card p-6 text-center hover-lift group"
              >
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full gradient-bg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className={`w-full h-full rounded-full object-cover border-4 border-card ${
                      dev.name === "Prerith" ? "object-center" : "object-top"
                    }`}
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{dev.role}</p>

                <div className="flex items-center justify-center gap-3">
                  <a
                    href={dev.linkedin}
                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-edu-blue hover:bg-edu-blue/10 transition-colors"
                  >
                    <FiLinkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={dev.github}
                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                  >
                    <FiGithub className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${dev.email}`}
                    className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-edu-mint hover:bg-edu-mint/10 transition-colors"
                  >
                    <FiMail className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                Sapthagiri NPS University
              </span>
              <br />
              Department of Computer Science & Engineering
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join EduCare Connect today and experience the future of integrated
              education and healthcare management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login/student">
                <Button size="lg" className="gradient-bg gap-2 px-8">
                  Get Started
                  <FiArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/feedback">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
