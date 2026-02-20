import { motion } from "framer-motion";
import { AccountLayout } from "./AccountLayout";
import { Link, useNavigate } from "react-router-dom";
import { Package, User, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useTranslation } from "@/contexts/LanguageContext";

const Account = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("there");

  useEffect(() => {
    const loadUserName = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          navigate("/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .upsert(
            { id: user.id },
            { onConflict: "id" }
          )
          .select("first_name,last_name")
          .single();

        if (profileError) throw profileError;

        const first = (profileData?.first_name || "").trim();
        const last = (profileData?.last_name || "").trim();
        const fullName = [first, last].filter(Boolean).join(" ");
        setUserName(fullName || user.email?.split("@")[0] || "there");
      } catch (err) {
        console.error(err);
        toast.error(t.messages.errorOccurred);
      } finally {
        setLoading(false);
      }
    };

    loadUserName();
  }, [navigate, t.messages.errorOccurred]);

  return (
    <AccountLayout title="Account Overview" userName={userName}>
      <div className="space-y-4 sm:space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-1"
        >
          <h3 className="text-lg sm:text-xl font-bold text-green-900">Your Account</h3>
          <p className="text-xs sm:text-sm text-green-700/70">
            Choose where you want to go next.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
        >
          {[
            {
              title: "My Profile",
              description: "View and edit your details",
              href: "/profile",
              icon: User
            },
            {
              title: "My Orders",
              description: "Track your recent orders",
              href: "/account/orders",
              icon: Package
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="group bg-white rounded-2xl border border-green-200/50 shadow-sm p-4 sm:p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-green-50 text-green-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-400 group-hover:text-green-600" />
                </div>
                <div className="mt-3">
                  <h4 className="font-semibold text-green-900 text-sm sm:text-base">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-green-700/70 mt-1">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </motion.div>

        {loading && (
          <p className="text-xs sm:text-sm text-green-700/70">Loading your account...</p>
        )}
      </div>
    </AccountLayout>
  );
};

export default Account;