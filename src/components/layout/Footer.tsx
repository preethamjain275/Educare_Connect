import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiMail, 
  FiPhone, 
  FiLinkedin, 
  FiGithub, 
  FiSend,
  FiHeart
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Footer = () => {
  const [quickFeedback, setQuickFeedback] = useState("");

  const handleQuickFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickFeedback.trim()) {
      toast.success("Thank you for your feedback!");
      setQuickFeedback("");
    }
  };

  const socialLinks = [
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
    { icon: FiGithub, href: "#", label: "GitHub" },
    { icon: FiMail, href: "mailto:contact@educare.connect", label: "Email" },
  ];

  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Feedback", path: "/feedback" },
      ],
    },
    {
      title: "Portals",
      links: [
        { name: "Student Login", path: "/login/student" },
        { name: "Parent Login", path: "/login/parent" },
        { name: "Teacher Login", path: "/login/teacher" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Doctor Portal", path: "/login/doctor" },
        { name: "Admin Portal", path: "/login/admin" },
        { name: "Help Center", path: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl gradient-text">EduCare Connect</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm">
              An integrated platform combining student education and healthcare monitoring 
              for real-time alerts, performance tracking, and seamless coordination.
            </p>

            {/* Quick Feedback */}
            <form onSubmit={handleQuickFeedback} className="flex gap-2">
              <Input
                placeholder="Quick feedback or tips..."
                value={quickFeedback}
                onChange={(e) => setQuickFeedback(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="gradient-bg shrink-0">
                <FiSend className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-muted-foreground hover:text-primary transition-colors hover-glow inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact & Social */}
        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
              <a href="mailto:contact@educare.connect" className="flex items-center gap-2 hover:text-primary transition-colors">
                <FiMail className="w-4 h-4" />
                contact@educare.connect
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-primary transition-colors">
                <FiPhone className="w-4 h-4" />
                +91 12345 67890
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors hover-glow"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 EduCare Connect. All rights reserved.</p>
            <p className="flex items-center gap-2">
              Created with <FiHeart className="w-4 h-4 text-edu-pink" /> by 
              <span className="font-medium text-foreground"> Purushottam</span> | 
              <span className="font-medium text-foreground"> Preetham</span> | 
              <span className="font-medium text-foreground"> Prerit</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
