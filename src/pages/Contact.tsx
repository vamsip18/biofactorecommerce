import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, User, Building, ChevronRight, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ekfqurdhdfdfqatvgwwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZnF1cmRoZGZkZnFhdHZnd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzMzkzNDMsImV4cCI6MjA4MDkxNTM0M30.KiRAEyJvyxXlQgQ_5VD8yc0LCV2rXesl2mLV3h1YNF0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// FormSubmit configuration
const FORM_SUBMIT_CONFIG = {
  endpoint: "https://formsubmit.co/ajax/sanjaykrishnachinna@gmail.com",
  subject: "New Contact Form Submission - ADD LIFE",
};

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "sanjaykrishnachinna@gmail.com",
    link: "mailto:sanjaykrishnachinna@gmail.com",
    description: "General inquiries & support",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+41 32 123 45 67",
    link: "tel:+41321234567",
    description: "Mon-Fri: 9am-5pm",
    color: "from-cyan-500 to-blue-600"
  },
  {
    icon: MapPin,
    title: "Address",
    value: "Chemin des Cevins 4, 2096 Cressier, Switzerland",
    link: "https://maps.google.com/?q=Chemin+des+Cevins+4,+2096+Cressier",
    description: "Our headquarters",
    color: "from-sky-400 to-blue-500"
  },
  {
    icon: Clock,
    title: "Business Hours",
    value: "Monday - Friday: 9am-5pm",
    link: null,
    description: "Customer support available",
    color: "from-amber-400 to-orange-500"
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });
  
  const [formState, setFormState] = useState({
    submitted: false,
    loading: false,
    error: null as string | null,
    successMessage: "",
    submissionId: null as string | null,
  });

  const sendEmailViaFormSubmit = async (submissionData: any) => {
    try {
      const emailData = {
        firstName: submissionData.first_name,
        lastName: submissionData.last_name,
        fullName: `${submissionData.first_name} ${submissionData.last_name}`,
        email: submissionData.email,
        phone: submissionData.phone || 'Not provided',
        company: submissionData.company || 'Not provided',
        subject: submissionData.subject,
        message: submissionData.message,
        _subject: `${FORM_SUBMIT_CONFIG.subject}: ${submissionData.subject}`,
        _template: "table",
        _captcha: "false",
        _honey: "",
        submissionId: submissionData.id,
        submittedAt: new Date().toLocaleString(),
      };

      const response = await fetch(FORM_SUBMIT_CONFIG.endpoint, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      return { success: true };
    } catch (error) {
      console.error('FormSubmit error:', error);
      throw error;
    }
  };

  const saveToSupabase = async (data: any) => {
    try {
      const { data: result, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            subject: data.subject,
            message: data.message,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (error) {
        // If table doesn't exist, provide helpful error
        if (error.message.includes('relation "contact_submissions" does not exist')) {
          throw new Error('Database table not configured. Please create the contact_submissions table first.');
        }
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ 
      submitted: false, 
      loading: true, 
      error: null, 
      successMessage: "",
      submissionId: null 
    });

    try {
      // Validate form data
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Step 1: Save to Supabase database
      const dbResult = await saveToSupabase(formData);
      console.log('Saved to database:', dbResult);

      // Step 2: Send email via FormSubmit (non-blocking, don't fail if email fails)
      let emailSuccess = false;
      let emailError = null;
      
      try {
        await sendEmailViaFormSubmit(dbResult);
        emailSuccess = true;
        console.log('Email sent via FormSubmit');
      } catch (emailErr) {
        emailError = emailErr;
        console.warn('Email sending failed, but form was saved to database:', emailErr);
        // Continue even if email fails - database save is primary
      }

      // Success - update state
      setFormState({ 
        submitted: true, 
        loading: false, 
        error: null,
        successMessage: `Your message has been saved successfully! ${emailSuccess ? 'Email notification sent.' : 'Email notification failed, but your message is saved in our system.'}`,
        submissionId: dbResult.id
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      });

      // Reset success message after 8 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, submitted: false }));
      }, 8000);

    } catch (error) {
      console.error('Form submission error:', error);
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Provide specific guidance for database setup issues
        if (error.message.includes('Database table not configured')) {
          errorMessage = `Database setup required: ${error.message}. Please contact administrator to set up the contact_submissions table.`;
        }
      }
      
      setFormState({
        submitted: false,
        loading: false,
        error: errorMessage,
        successMessage: "",
        submissionId: null
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-300/10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 40}px`,
              }}
              animate={{
                y: [0, -100, 0],
                rotate: [0, 360],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 20 + Math.random() * 20,
                repeat: Infinity,
                delay: Math.random() * 15,
              }}
            >
              ✉️
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8">
              Let's Connect & Grow Together
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-black text-3xl md:text-4xl font-serif italic leading-tight mb-8"
            >
              Have questions about our organic baskets, delivery, or partnerships? 
              We're here to help and would love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {formState.error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-red-700 font-medium mb-1">Submission Error</p>
                      <p className="text-red-600 text-sm">{formState.error}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {formState.submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-b from-white to-blue-50 rounded-3xl p-8 shadow-2xl border-2 border-blue-200/50"
                >
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="inline-flex p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6"
                    >
                      <CheckCircle className="w-12 h-12 text-white" />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Message Sent Successfully!
                    </h3>
                    
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                      <p className="text-green-800 text-lg mb-3">
                        ✓ Saved to secure database
                      </p>
                      <p className="text-green-800 text-lg mb-3">
                        ✓ Email sent to sanjaykrishnachinna@gmail.com
                      </p>
                      <p className="text-green-800 text-lg">
                        ✓ We'll respond within 24 hours
                      </p>
                      
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-8">
                      {formState.successMessage}
                    </p>
                    
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={() => setFormState(prev => ({ ...prev, submitted: false }))}
                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      >
                        Send Another Message
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "mailto:sanjaykrishnachinna@gmail.com"}
                      >
                        Email Directly
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-gradient-to-b from-white to-blue-50 rounded-3xl p-8 shadow-2xl border-2 border-blue-200/50">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Send us a Message
                      </h2>
                      <p className="text-gray-600">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <Input 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="First name" 
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <Input 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Last name" 
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <Input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com" 
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          We'll reply to this address
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                          <Input 
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+41 32 123 45 67" 
                            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            disabled={formState.loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company (Optional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                        <Input 
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Your company name" 
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          disabled={formState.loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <Input 
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="How can we help you?" 
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                        disabled={formState.loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your inquiry, question, or partnership idea..."
                        rows={6}
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        required
                        disabled={formState.loading}
                      />
                    </div>

                

                    <Button 
                      type="submit"
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg disabled:opacity-50"
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
                  </form>
                </div>
              )}
            </motion.div>

            {/* Contact Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Contact Cards */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Contact Information
                </h2>
                <p className="text-gray-600">
                  Reach out to us through any of these channels. We're here to help!
                </p>

                <div className="grid gap-4">
                  {contactInfo.map((item, index) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl p-6 border-2 border-gray-200/50 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start gap-4">
                          <motion.div
                            className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white`}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <item.icon className="w-6 h-6" />
                          </motion.div>
                          
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="text-gray-700 hover:text-blue-700 transition-colors block group-hover:underline"
                                target={item.link.startsWith('http') ? '_blank' : '_self'}
                                rel={item.link.startsWith('http') ? 'noopener noreferrer' : ''}
                              >
                                {item.value}
                              </a>
                            ) : (
                              <span className="text-gray-700">{item.value}</span>
                            )}
                            <p className="text-gray-600 text-sm mt-1">
                              {item.description}
                            </p>
                          </div>
                          
                          {item.link && (
                            <ChevronRight className="w-5 h-5 text-blue-400 group-hover:text-blue-600 transition-colors" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Interactive Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden border-2 border-gray-200/50 shadow-lg"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Our Location
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Chemin des Cevins 4, 2096 Cressier, Switzerland
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 border-gray-300 text-gray-700 hover:bg-gray-50"
                      asChild
                    >
                      <a 
                        href="https://maps.google.com/?q=Chemin+des+Cevins+4,+2096+Cressier"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default Contact;