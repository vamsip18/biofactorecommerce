import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Mail, Calendar, Phone, Download, Home, User, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const OfficeSuccess = () => {
  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success Message */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 mb-4">
              Welcome to Add Life for Offices!
            </h1>
            <p className="text-lg sm:text-xl text-emerald-700 mb-6">
              Your office delivery plan has been confirmed successfully.
            </p>
            
            {/* Success Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              Order #BO-2024-7892
            </div>
          </div>

          {/* Next Steps */}
          <Card className="border-emerald-200 bg-white mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-emerald-900 mb-6 text-center">
                What Happens Next?
              </h3>
              <div className="space-y-6">
                <div className="flex items-start p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-emerald-900 mb-1">Confirmation Email</h4>
                    <p className="text-emerald-700 text-sm">You'll receive a detailed confirmation email within 15 minutes</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-green-900 mb-1">Onboarding Call</h4>
                    <p className="text-green-700 text-sm">Our team will contact you within 24 hours to schedule delivery</p>
                  </div>
                </div>
                
                <div className="flex items-start p-4 bg-lime-50 rounded-lg border border-lime-100">
                  <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center mr-4 flex-shrink-0">
                    <Truck className="w-5 h-5 text-lime-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-lime-900 mb-1">First Delivery</h4>
                    <p className="text-lime-700 text-sm">Your first delivery will be scheduled for next week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-emerald-200 bg-white mb-8">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg text-emerald-900 mb-4 text-center">
                Need Help?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 mb-1">Call Us</h4>
                  <p className="text-emerald-700 text-sm">1-800-ADD-LIFE</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-semibold text-emerald-900 mb-1">Email Us</h4>
                  <p className="text-emerald-700 text-sm">office@addlife.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-lg"
              size="lg"
            >
              <Link to="/office/dashboard" className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Go to Office Dashboard
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400"
              size="lg"
              asChild
            >
              <Link to="/" className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Return to Homepage
              </Link>
            </Button>
          </div>

          {/* Download/Print */}
          <div className="text-center pt-4 border-t border-emerald-100">
            <Button 
              variant="ghost" 
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Confirmation (PDF)
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};