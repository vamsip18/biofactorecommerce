// src/pages/OrderSuccess.tsx
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Home, Download, Mail, Phone, Calendar, Truck } from "lucide-react";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId, total, estimatedDelivery } = location.state || {};

  // Redirect if no order data
  useEffect(() => {
    if (!orderId) {
      navigate("/");
    }
  }, [orderId, navigate]);

  if (!orderId) return null;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            {/* Success Icon */}
            <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-gray-600 mb-8">
              Thank you for your purchase. Your order has been confirmed and is being processed.
            </p>

            {/* Order Details Card */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Order Details</h3>
                  </div>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Order ID:</span> {orderId}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Total Amount:</span> ₹{total?.toFixed(2)}
                  </p>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span className="text-green-600 font-semibold">Confirmed</span>
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Delivery Info</h3>
                  </div>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      <span className="font-medium">Estimated Delivery:</span>{" "}
                      {estimatedDelivery?.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </p>
                  <p className="text-gray-700 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Confirmation email sent</span>
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-green-600">1</span>
                  </div>
                  <p className="text-gray-700 text-left">
                    You'll receive an order confirmation email with details.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-green-600">2</span>
                  </div>
                  <p className="text-gray-700 text-left">
                    We'll process your order and update you on shipping.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-green-600">3</span>
                  </div>
                  <p className="text-gray-700 text-left">
                    Your order will be delivered within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <Home className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
              
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              
              <Link to="/orders">
                <Button variant="outline" className="gap-2">
                  <Package className="w-4 h-4" />
                  View Order Status
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-2">
                Need help? Contact our support team
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:support@biofactor.com" className="text-green-600 hover:text-green-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@biofactor.com
                </a>
                <a href="tel:+911234567890" className="text-green-600 hover:text-green-700 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;