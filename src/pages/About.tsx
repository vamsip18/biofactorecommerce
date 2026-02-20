import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Headphones,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  HelpCircle,
  FileText,
  Shield,
  Truck,
  RefreshCw,
  User,
  Globe,
  Star,
  CheckCircle,
  Award,
  Heart,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import customer service image
import customerService from "@/assets/customer-service.png";

const supportChannels = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our customer care specialists",
    contact: "+41 44 123 45 67",
    hours: "Mon-Fri: 8:00-18:00 CET",
    color: "from-emerald-500 to-green-500",
    buttonText: "Call Now"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your questions and receive detailed responses",
    contact: "support@biofactor.com",
    hours: "Response within 24 hours",
    color: "from-green-500 to-emerald-500",
    buttonText: "Send Email"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Instant messaging with our support team",
    contact: "Available on website",
    hours: "Mon-Fri: 9:00-17:00 CET",
    color: "from-lime-500 to-emerald-500",
    buttonText: "Start Chat"
  },
];

const faqs = [
  {
    question: "How do I order Biofactor products?",
    answer: "You can order directly through our website, contact your regional distributor, or call our sales team. We offer both bulk orders for farms and smaller quantities for testing.",
    category: "Ordering"
  },
  {
    question: "What is the shelf life of your biofertilizers?",
    answer: "Our products have a shelf life of 18-24 months when stored in cool, dry conditions. Always check the expiration date on the packaging and store away from direct sunlight.",
    category: "Product Info"
  },
  {
    question: "How do I apply Biofactor products to my crops?",
    answer: "Application methods vary by product. We provide detailed instructions with each order, and our agronomy team offers personalized application guidance based on your crop type and soil conditions.",
    category: "Application"
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries. Shipping times and costs vary by location. Contact our logistics team for specific shipping information to your region.",
    category: "Shipping"
  },
  {
    question: "What is your return policy?",
    answer: "Unopened products in original packaging can be returned within 30 days for a full refund. For quality concerns, please contact our support team immediately.",
    category: "Returns"
  },
  {
    question: "How do I become a distributor?",
    answer: "We're always looking for qualified distributors. Please visit our 'Become a Partner' page or contact our partnership team for distribution opportunities.",
    category: "Partnership"
  },
];

const servicePromises = [
  {
    icon: Clock,
    title: "24-Hour Response",
    description: "We guarantee a response to all inquiries within 24 hours",
    color: "bg-emerald-50 text-emerald-700"
  },
  {
    icon: Shield,
    title: "Quality Guarantee",
    description: "100% satisfaction or your money back",
    color: "bg-green-50 text-green-700"
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Orders processed within 24-48 hours",
    color: "bg-lime-50 text-lime-700"
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Simple return process for unused products",
    color: "bg-emerald-50 text-emerald-700"
  },
];

const teamMembers = [
  {
    name: "Sarah Müller",
    role: "Customer Care Manager",
    bio: "10+ years in agricultural customer service, fluent in 4 languages",
    expertise: ["Order Management", "Technical Support", "Customer Relations"],
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Thomas Bauer",
    role: "Technical Support Specialist",
    bio: "Agronomy background with 8 years field experience",
    expertise: ["Product Application", "Soil Analysis", "Troubleshooting"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Lisa Schneider",
    role: "Logistics Coordinator",
    bio: "Expert in international shipping and supply chain management",
    expertise: ["Shipping", "Inventory", "Customs Clearance"],
    image: "https://images.unsplash.com/photo-1551836026-d5c2c0b4d5a9?w=400&h=400&fit=crop&crop=face"
  },
];

const CustomerCare = () => {
  const t = useTranslation();
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white rounded-b-[60px]">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={customerService}
            alt="Biofactor customer care team"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/30 via-emerald-50/10 to-white" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100"
              >
                <Headphones className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  {t.about.dedicatedSupport}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-gray-900">{t.about.customerCare}</span>
                <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {t.about.hereToHelp}
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-700 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
              >
                "Our commitment extends beyond products. We provide exceptional support
                to ensure your success with Biofactor solutions, from order to harvest."
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                  asChild
                >
                  <a href="#contact" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact Support
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  asChild
                >
                  <Link to="/faq" className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    View FAQs
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Promises */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Service
                <span className="block bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Promises to You
                </span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                We're committed to providing exceptional support at every step
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicePromises.map((promise, index) => (
                <motion.div
                  key={promise.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl border border-gray-200 hover:border-emerald-200 h-full transition-all duration-300">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${promise.color.split(' ')[0]} ${promise.color.split(' ')[1]}`}>
                      <promise.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {promise.title}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {promise.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">Guaranteed</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Channels Section */}
      <section id="contact" className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">
                {t.about.getInTouch}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multiple Ways to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Connect With Us
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Choose the contact method that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-200 hover:border-emerald-200 h-full transition-all duration-300">
                  {/* Icon */}
                  <motion.div
                    className={`inline-flex p-4 rounded-xl mb-6 bg-gradient-to-br ${channel.color} text-white`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <channel.icon className="w-6 h-6" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {channel.title}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    {channel.description}
                  </p>

                  <div className="space-y-4 mb-8">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Contact</div>
                      <div className="font-semibold text-gray-900 text-lg">{channel.contact}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Hours</div>
                      <div className="font-medium text-gray-700">{channel.hours}</div>
                    </div>
                  </div>

                  <Button
                    className={`w-full bg-gradient-to-r ${channel.color} hover:opacity-90 text-white`}
                    asChild
                  >
                    <a href={channel.title === "Email Support" ? "mailto:support@biofactor.com" : "#"}>
                      {channel.buttonText}
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="inline-block bg-gradient-to-r from-emerald-100 to-green-100 px-8 py-6 rounded-2xl border border-emerald-200 max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-900">Office Address</span>
                  </div>
                  <p className="text-gray-700">
                    Biofactor AG<br />
                    Technoparkstrasse 1<br />
                    8005 Zurich, Switzerland
                  </p>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-gray-900">Business Hours</span>
                  </div>
                  <p className="text-gray-700">
                    Monday - Friday: 8:00 - 18:00 CET<br />
                    Saturday: 9:00 - 13:00 CET
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">
                  Frequently Asked Questions
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Quick Answers to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                  Common Questions
                </span>
              </h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6 border border-emerald-200 hover:border-emerald-300 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="inline-flex px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium mb-3">
                          {faq.category}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">
                          {faq.answer}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-emerald-500 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                asChild
              >
                <Link to="/faq" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  View All FAQs
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold text-sm uppercase tracking-wider">
                Your Support Team
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Customer Care Experts
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Knowledgeable professionals dedicated to helping you succeed
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl border border-gray-200 hover:border-emerald-200 h-full transition-all duration-300">
                  {/* Image */}
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <div className="text-emerald-600 font-medium mb-3">{member.role}</div>
                    <p className="text-gray-600 text-sm mb-4">{member.bio}</p>

                    {/* Expertise */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Customer Satisfaction */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 mb-6">
              <Star className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Customer Satisfaction</span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Rated Excellent by Farmers Worldwide
            </h3>

            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
              {[
                {
                  value: "98%",
                  label: "Customer Satisfaction",
                  icon: Heart
                },
                {
                  value: "4.8/5",
                  label: "Support Rating",
                  icon: Star
                },
                {
                  value: "<2 hrs",
                  label: "Average Response Time",
                  icon: Clock
                },
                {
                  value: "24/7",
                  label: "Emergency Support",
                  icon: Shield
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <stat.icon className="w-5 h-5 text-emerald-600" />
                    <div className="text-2xl font-bold text-emerald-700">{stat.value}</div>
                  </div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


    </Layout>
  );
};

export default CustomerCare;
