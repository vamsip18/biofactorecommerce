import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  Mail, Phone, MapPin, Clock, Send, User,
  Building, CheckCircle, ChevronRight, MessageSquare,
  Headphones, Shield, Truck, Leaf, ArrowRight, MessageCircle,
  Package, RotateCcw
} from "lucide-react";
import { useState } from "react";

const CustomerCare = () => {
  const t = useTranslation();

  const contactInfo = [
    {
      icon: Mail,
      title: t.customerCare.email,
      value: "info@biofactor.com",
      link: "mailto:info@biofactor.com",
      description: t.customerCare.generalInquiries,
      color: "bg-green-600"
    },
    {
      icon: Phone,
      title: t.customerCare.phone,
      value: "+91 88866 24775",
      link: "tel:+918886624775",
      description: t.customerCare.businessHours,
      color: "bg-green-700"
    },
    {
      icon: MessageCircle,
      title: t.customerCare.whatsapp,
      value: "+91 88866 24775",
      link: "https://wa.me/8886624775",
      description: t.customerCare.chatInstantly,
      color: "bg-emerald-600"
    },
    {
      icon: MapPin,
      title: t.customerCare.address,
      value: "Bio Factor Solutions, Hyderabad, Telangana",
      link: "https://maps.app.goo.gl/b8CkmdTqDm5fosjD9",
      description: t.customerCare.headquarters,
      color: "bg-green-800"
    },
  ];

  const supportServices = [
    {
      icon: Headphones,
      title: t.customerCare.technicalSupport,
      description: t.customerCare.techDesc,
      contact: "tech@biofactor.com"
    },
    {
      icon: Shield,
      title: t.customerCare.qualityAssurance,
      description: t.customerCare.qualityDesc,
      contact: "quality@biofactor.com"
    },
    {
      icon: Truck,
      title: t.customerCare.orderDelivery,
      description: t.customerCare.orderDesc,
      contact: "orders@biofactor.com"
    },
    {
      icon: MessageSquare,
      title: t.customerCare.generalInq,
      description: t.customerCare.generalDesc,
      contact: "info@biofactor.com"
    }
  ];
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
  });

  const [activeTab, setActiveTab] = useState("general");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState({ submitted: false, loading: true });

    // Simulate API call
    setTimeout(() => {
      setFormState({
        submitted: true,
        loading: false
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormState(prev => ({ ...prev, submitted: false }));
      }, 5000);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.customerCare.title}</h1>
          <p className="text-green-100">
            {t.customerCare.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Customer Care Quick Actions Section */}
        <div className="mb-16 pt-12 border-t border-gray-200">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t.customerCare.quickActions}
            </h2>
            <p className="text-gray-600">
              {t.customerCare.commonQuestions}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Your Orders Card */}
            <motion.a
              href="/orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-green-400 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.customerCare.myOrders}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t.customerCare.trackManage}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.customerCare.trackPackages}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.customerCare.editOrders}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    {t.customerCare.downloadInvoices}
                  </li>
                </ul>
              </div>
            </motion.a>

            {/* Returns and Refunds Card */}
            <motion.a
              href="/orders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group"
            >
              <div className="bg-white rounded-lg border border-gray-200 p-8 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 rounded-lg bg-amber-100">
                    <RotateCcw className="w-6 h-6 text-amber-600" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t.customerCare.returnsRefunds}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {t.customerCare.returnExchange}
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                    {t.customerCare.returnItems}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                    {t.customerCare.trackRefund}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                    {t.customerCare.printLabels}
                  </li>
                </ul>
              </div>
            </motion.a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Contact Info */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {t.customerCare.contactInfo}
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
                  {t.customerCare.sendMessage}
                </h2>
                <p className="text-gray-600">
                  {t.customerCare.fillForm}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setActiveTab("general")}
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "general"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t.customerCare.generalInquiry}
                </button>
                <button
                  onClick={() => setActiveTab("order")}
                  className={`px-4 py-2 font-medium text-sm ${activeTab === "order"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t.customerCare.orderInquiry}
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
                      {t.customerCare.messageSent}
                    </h3>

                    <p className="text-gray-600 mb-6">
                      {t.customerCare.messageSentDesc}
                    </p>

                    <Button
                      onClick={() => setFormState(prev => ({ ...prev, submitted: false }))}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Send Another Message
                    </Button>
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
                          {t.customerCare.fullName} *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder={t.customerCare.namePlaceholder}
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t.customerCare.emailAddress} *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder={t.customerCare.emailPlaceholder}
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t.customerCare.phoneNumber}
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder={t.customerCare.phonePlaceholder}
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            disabled={formState.loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          {t.customerCare.subject} *
                        </label>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder={t.customerCare.subjectPlaceholder}
                            className="pl-10 border-gray-300 focus:border-green-600 focus:ring-green-600"
                            required
                            disabled={formState.loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {t.customerCare.yourMessage} *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={t.customerCare.messagePlaceholder}
                        rows={6}
                        className="border-gray-300 focus:border-green-600 focus:ring-green-600"
                        required
                        disabled={formState.loading}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 shadow-lg disabled:opacity-50"
                      disabled={formState.loading}
                    >
                      {formState.loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          {t.customerCare.sending}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t.customerCare.sendMessageBtn}
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>


          </main>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerCare;