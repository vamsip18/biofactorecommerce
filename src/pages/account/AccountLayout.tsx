import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, Bell, CreditCard, MapPin, Calendar } from "lucide-react";

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
}

const sidebarItems = [
  { icon: User, label: "My Profile", href: "/account" },
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: Calendar, label: "Delivery Schedule", href: "/account/schedule" },
  { icon: Heart, label: "Favorites", href: "/account/favorites" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/account/payments" },
  { icon: Bell, label: "Notifications", href: "/account/notifications" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

export const AccountLayout = ({ children, title }: AccountLayoutProps) => {
  const location = useLocation();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Account</h1>
                <p className="text-green-100/80">Manage your organic journey with us</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">Welcome back, John!</span>
                <button className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-green-200/50 overflow-hidden">
                <nav className="p-4">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 font-semibold border border-green-200"
                            : "text-green-700 hover:bg-green-50 hover:text-green-900"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="p-4 border-t border-green-200">
                  <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 w-full transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="mt-6 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-4">Your Organic Journey</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-100/80">Orders</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-100/80">Saved CO₂</span>
                    <span className="font-bold">45kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-100/80">Member Since</span>
                    <span className="font-bold">2023</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-green-200/50 overflow-hidden">
                <div className="border-b border-green-200 p-6">
                  <h2 className="text-2xl font-bold text-green-900">{title}</h2>
                </div>
                <div className="p-6">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};