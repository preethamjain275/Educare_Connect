import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiMessageCircle, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import MainLayout from "@/components/layout/MainLayout";

import { supabase } from "@/integrations/supabase/client";

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      toast.success("Thank you for your feedback! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email",
      value: "contact@educare.connect",
      link: "mailto:contact@educare.connect",
    },
    {
      icon: FiPhone,
      title: "Phone",
      value: "+91 12345 67890",
      link: "tel:+911234567890",
    },
    {
      icon: FiMapPin,
      title: "Address",
      value: "Sapthagiri NPS University, Bangalore",
      link: "#",
    },
  ];

  return (
    <MainLayout>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <FiMessageCircle className="w-4 h-4" />
                Get in Touch
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                We'd Love to Hear{" "}
                <span className="gradient-text">From You</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions, suggestions, or feedback? Send us a message and 
                we'll respond as soon as possible.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    {contactInfo.map((info) => (
                      <a
                        key={info.title}
                        href={info.link}
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <info.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{info.title}</p>
                          <p className="text-sm text-muted-foreground">{info.value}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold mb-2">Office Hours</h3>
                  <p className="text-muted-foreground text-sm">
                    Monday - Friday: 9:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 1:00 PM
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </motion.div>

              {/* Feedback Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="glass-card p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <Input
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({ ...formData, subject: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <Textarea
                        placeholder="Tell us more about your feedback, question, or suggestion..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-bg gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FiSend className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FeedbackPage;
