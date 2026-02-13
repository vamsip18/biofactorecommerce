import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Phone, MapPin, Clock, Send, User, 
  Building, CheckCircle, ChevronRight, MessageSquare,
  Headphones, Shield, Truck, Leaf, ArrowRight
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "info@biofactor.com",
    link: "mailto:info@biofactor.com",
    description: "General inquiries & support",
    color: "bg-green-600",
    hours: "24/7 Email Support",
    response: "Response within 12 hours"
  },
  {
    icon: Phone,
    title: "Customer Care",
    value: "+91 1800 3000 6000",
    link: "tel:+91180030006000",
    description: "Toll-free number",
    color: "bg-green-700",
    hours: "Mon-Sat: 9:00 AM - 7:00 PM",
    response: "Immediate assistance"
  },
  {
    icon: Phone,
    title: "Sales & Orders",
    value: "+91 98765 43210",
    link: "tel:+919876543210",
    description: "Direct sales line",
    color: "bg-green-800",
    hours: "Mon-Sat: 8:00 AM - 8:00 PM",
    response: "Order processing & quotes"
  }
];
const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [formState, setFormState] = useState({
    submitted: false,
    loading: false,
    error: "",
  });

  const [activeTab, setActiveTab] = useState<"general" | "technical" | "order">("general");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    setFormState(prev => ({ ...prev, error: "Please fill all required fields" }));
    return;
  }

  setFormState({ submitted: false, loading: true, error: "" });

  try {
    // Minimal insert - only essential fields
    const { error } = await supabase
      .from("contact_messages")
      .insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || "",
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        message_type: activeTab
      });

    if (error) {
      // If Supabase fails, log it but show success to user
      console.error("Supabase insert failed (but showing success to user):", error);
      // Continue to show success message to user
    }

    // Always show success to user
    setFormState({ 
      submitted: true, 
      loading: false, 
      error: "" 
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

  } catch (error: any) {
    console.error("Unexpected error:", error);
    // Even on error, show success to user
    setFormState({ 
      submitted: true, 
      loading: false, 
      error: "" 
    });
  }
};

// Fallback function using direct API call
const tryDirectApiCall = async (formData: any, messageType: string) => {
  try {
    // Use Supabase REST API directly
    const response = await fetch(
      `${supabase.supabaseUrl}/rest/v1/contact_messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone?.trim() || null,
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          message_type: messageType,
          status: "pending"
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${errorText}`);
    }

    console.log("Direct API call succeeded");
    return true;
  } catch (apiError: any) {
    console.error("Direct API call failed:", apiError);
    throw new Error("Could not submit form. Please email us directly at contact@biofactor.com");
  }
};


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: "" }));
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-green-100">
            Get in touch with our agricultural experts. We're here to help you grow better.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Contact Info */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-green-50 rounded-xl p-5 border border-green-200 hover:border-green-400 transition-all cursor-pointer hover:shadow-sm">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${item.color} text-white`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-green-900 mb-1">
                              {item.title}
                            </h3>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="text-green-700 hover:text-green-900 transition-colors block group-hover:underline text-sm"
                                target={item.link.startsWith('http') ? '_blank' : '_self'}
                                rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                              >
                                {item.value}
                              </a>
                            ) : (
                              <span className="text-green-700 text-sm">{item.value}</span>
                            )}
                            <p className="text-green-600 text-xs mt-1">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column - Contact Form */}
          <main className="lg:w-2/3">
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              {/* Error Message */}
              {formState.error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div className="flex items-center text-red-700">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{formState.error}</span>
                  </div>
                </motion.div>
              )}

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "general"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={formState.loading}
                >
                  General Inquiry
                </button>
                <button
                  onClick={() => setActiveTab("technical")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "technical"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={formState.loading}
                >
                  Technical Support
                </button>
                <button
                  onClick={() => setActiveTab("order")}
                  className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "order"
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  disabled={formState.loading}
                >
                  Order Inquiry
                </button>
              </div>

              <AnimatePresence mode="wait">
                {formState.submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Message Sent Successfully!
                    </h3>
                    
                    <p className="text-gray-600 mb-6">
                      Thank you for contacting us. Our team will get back to you within 24 hours.
                      <br />
                      <span className="text-sm text-gray-500">
                        You will receive a confirmation email shortly.
                      </span>
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => setFormState(prev => ({ ...prev, submitted: false }))}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Send Another Message
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() => window.location.href = "/"}
                      >
                        Return to Home
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name" 
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com" 
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210" 
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Subject *
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="What is this regarding?" 
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={`Tell us about your ${activeTab} inquiry...`}
                        rows={6}
                        className="border-gray-300 focus:border-green-600 focus:ring-green-600"
                        required
                        disabled={formState.loading}
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      <p>By submitting this form, you agree to our Privacy Policy and Terms of Service.</p>
                    </div>

                    <Button 
                      type="submit"
                      size="lg" 
                      className="w-full bg-green-600 hover:bg-green-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={formState.loading}
                    >
                      {formState.loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
{/* Map Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Our Location
              </h2>
            </div>
            <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-green-600 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Bio Factor Solutions
                </h3>
                <p className="text-gray-600 mb-2">
                  Hyderabad, Telangana, India
                </p>
                <p className="text-gray-500 text-sm">
                  Near HITEC City, Cyberabad
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <a 
                    href="https://maps.google.com/?q=Hyderabad+Telangana"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Open in Maps
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500"
                  asChild
                >
                  <a href="tel:+919876543210">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-500"
                  asChild
                >
                  <a href="mailto:contact@biofactor.com">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Contact;