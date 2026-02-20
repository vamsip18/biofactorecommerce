import { ReactNode } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, LogOut, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  userName?: string;
}

const sidebarItems = [
  { icon: User, label: "My Profile", href: "/profile" },
  { icon: Package, label: "My Orders", href: "/account/orders" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses" },
];

export const AccountLayout = ({ children, title, userName }: AccountLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to log out");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-1">My Account</h1>
                <p className="text-xs sm:text-sm text-green-100/80">Your profile, orders</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm">
                  Welcome back, {userName || "there"}!
                </span>
                <button
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  onClick={handleLogout}
                  aria-label="Log out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="grid lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-green-200/50 overflow-hidden">
                <nav className="p-3 sm:p-4">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl mb-2 transition-all ${isActive
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 font-semibold border border-green-200"
                          : "text-green-700 hover:bg-green-50 hover:text-green-900"
                          }`}
                      >
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                        <span className="text-sm sm:text-base">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-3 sm:p-4 border-t border-green-200">
                  <button
                    className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-rose-600 hover:bg-rose-50 w-full transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="text-sm sm:text-base">Log Out</span>
                  </button>
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
                <div className="border-b border-green-200 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-900">{title}</h2>
                </div>
                <div className="p-4 sm:p-6">
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