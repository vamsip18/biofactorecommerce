import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ChevronRight, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, refreshUser } = useAuth();

  // Get redirect parameter from URL or state
  const from = location.state?.from?.pathname || "/";
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam || from;

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      console.log("User already logged in, redirecting to:", redirectTo);
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, navigate, redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Basic validation
    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Trim and validate
      const email = formData.email.trim();
      const password = formData.password;

      console.log("Attempting login for:", email);

      // Clear any existing errors
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Login error:", signInError);

        // Handle specific error cases
        if (signInError.message.includes("Invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        } else if (signInError.message.includes("Email not confirmed")) {
          throw new Error("Please verify your email before logging in.");
        } else if (signInError.message.includes("User not found")) {
          throw new Error("No account found with this email.");
        } else if (signInError.message.includes("rate limit")) {
          throw new Error("Too many attempts. Please try again in a few minutes.");
        } else {
          throw new Error(signInError.message || "Login failed. Please try again.");
        }
      }

      console.log("Login response:", data);

      // Wait a moment for auth state to update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Force refresh auth context
      await refreshUser();

      // Verify session exists
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("Login successful but session not established. Please refresh the page.");
      }

      console.log("Login successful, session verified!");

      toast.success("Login successful! Redirecting...");

      // Clear form
      setFormData({ email: "", password: "" });

      // Navigate to the intended destination
      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 300);

    } catch (err: any) {
      console.error("Login failed:", err);

      // Set error for display
      setError(err.message || "Login failed. Please try again.");

      // Also show toast
      toast.error(err.message || "Login failed");

    } finally {
      setLoading(false);
    }
  };

  // Demo credentials for testing
  const useDemoCredentials = () => {
    setFormData({
      email: "test@example.com",
      password: "test123",
    });
    toast.info("Demo credentials filled. Click Login to continue.");
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      toast.error("Please enter your email address first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold text-green-900 mb-3">
                Welcome Back
              </h1>
              <p className="text-green-700">
                Sign in to your account to continue
              </p>
              {/* Show redirect info if applicable */}
              {redirectTo !== "/" && (
                <p className="text-sm text-green-600 mt-2 bg-green-50 px-3 py-1 rounded-full inline-block">
                  After login, you'll be redirected to continue your purchase
                </p>
              )}
            </motion.div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-green-200 p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <Label className="text-green-800 mb-2 block font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      className="pl-10 w-full"
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-green-800 font-medium">Password</Label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-green-700 hover:text-green-900 hover:underline"
                      disabled={loading}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10 pr-10 w-full"
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800"
                      disabled={loading}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={loading}
                  />
                  <Label htmlFor="remember-me" className="text-green-800 cursor-pointer">
                    Remember me
                  </Label>
                </div>

                {/* Demo Credentials Button */}
                <div className="pt-4 border-t">
                  <button
                    type="button"
                    onClick={useDemoCredentials}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline w-full text-center"
                    disabled={loading}
                  >
                    Try demo credentials (test@example.com / test123)
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="w-full bg-green-700 hover:bg-green-800 text-white h-12 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      Log In
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-green-700">
                Don&apos;t have an account?{" "}
                <Link
                  to={`/register${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
                  className="font-semibold text-green-800 hover:text-green-900 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-600">
                  Debug: User logged in: {user ? "Yes" : "No"} |
                  Redirecting to: {redirectTo} |
                  Loading: {loading ? "Yes" : "No"}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
