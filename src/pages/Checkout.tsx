import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Wallet,
  Building,
  Home,
  MapPin,
  Phone,
  Mail,
  User,
  Package,
  Truck,
  Shield,
  Lock,
  ArrowLeft,
  ChevronRight,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'cod' | 'netbanking';
  name: string;
  icon: React.ReactNode;
  description: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const { cartItems, getCartTotal, clearCart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    type: 'home' as 'home' | 'work' | 'other',
    name: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    phone: "",
    isDefault: false
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    upiId: ""
  });

  const [orderNotes, setOrderNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-5 h-5" />,
      description: "Pay with your card"
    },
    {
      id: "upi",
      type: "upi",
      name: "UPI",
      icon: <Wallet className="w-5 h-5" />,
      description: "Pay using UPI ID"
    },
    {
      id: "cod",
      type: "cod",
      name: "Cash on Delivery",
      icon: <Package className="w-5 h-5" />,
      description: "Pay when you receive"
    },
    {
      id: "netbanking",
      type: "netbanking",
      name: "Net Banking",
      icon: <Building className="w-5 h-5" />,
      description: "Bank transfer"
    }
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + tax + shipping;

  // Handle new address form
  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({ ...prev, [name]: value }));
  };

  // Validate form
  const validateForm = () => {
    // Validate address
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.postalCode ||
      !newAddress.phone
    ) {
      toast.error(t.messages.fillRequired);
      return false;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }

    if (selectedPaymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.cardName ||
        !paymentDetails.expiry || !paymentDetails.cvv) {
        toast.error("Please fill all card details");
        return false;
      }
    }

    if (selectedPaymentMethod === 'upi' && !paymentDetails.upiId) {
      toast.error("Please enter your UPI ID");
      return false;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return false;
    }

    return true;
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (loading || cartLoading) return;

    if (!validateForm()) return;

    if (!user) {
      toast.error(t.messages.pleaseLogin);
      return;
    }

    setLoading(true);

    try {
      const address = newAddress;

      /* ------------------ INSERT ORDER ------------------ */
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            subtotal: subtotal,
            discount_total: 0,
            tax_total: tax,
            shipping_total: shipping,
            grand_total: total,
            payment_method: selectedPaymentMethod,
            payment_status:
              selectedPaymentMethod === "cod" ? "unpaid" : "paid",

            first_name: address.name.split(" ")[0] || address.name,
            last_name: address.name.split(" ")[1] || "",
            phone: address.phone,
            street: address.street,
            house_number: "",
            city: address.city,
            postal_code: address.postalCode,
            country: address.country,
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      /* ------------------ INSERT ORDER ITEMS ------------------ */
      // In your checkout function, update orderItemsData:
      const orderItemsData = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId,
        product_name: item.name,
        variant_title: item.variantTitle || null,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image, // ✅ Save image URL
      }));
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsData);

      if (itemsError) throw itemsError;

      /* ------------------ SUCCESS ------------------ */
      await clearCart();

      toast.success(t.messages.orderPlaced);

      navigate("/order-success", {
        state: {
          orderId: order.id,
          total,
        },
      });
    } catch (error) {
      console.error("Order error:", error);
      toast.error(t.messages.errorOccurred);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (cartLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t.common.loading}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-16">
          <div className="container mx-auto px-4 text-center">
            <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.cart.emptyCart}</h1>
            <p className="text-gray-600 mb-8">Add items to your cart to checkout</p>
            <Link to="/">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                {t.common.continueShopping}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
  <Layout>
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-white to-green-50 py-4 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">

        {/* Back */}
        <Link
          to="/cart"
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-4 sm:mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.nav.cart}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* DELIVERY ADDRESS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-base sm:text-2xl font-bold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-green-600" />
                Delivery Address
              </h2>

              <div className="border border-green-200 rounded-xl p-4 sm:p-6 bg-green-50/50 space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs">Full Name *</Label>
                    <Input
                      name="name"
                      value={newAddress.name}
                      onChange={handleNewAddressChange}
                      placeholder="Rahul Sharma"
                      className="mt-1 w-full text-sm"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Phone *</Label>
                    <Input
                      name="phone"
                      value={newAddress.phone}
                      onChange={handleNewAddressChange}
                      placeholder="9876543210"
                      className="mt-1 w-full text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Street *</Label>
                  <Input
                    name="street"
                    value={newAddress.street}
                    onChange={handleNewAddressChange}
                    placeholder="Flat 302, Green Residency, MG Road"
                    className="mt-1 w-full text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    name="city"
                    value={newAddress.city}
                    onChange={handleNewAddressChange}
                    placeholder="Hyderabad"
                    className="w-full text-sm"
                  />
                  <Input
                    name="state"
                    value={newAddress.state}
                    onChange={handleNewAddressChange}
                    placeholder="Telangana"
                    className="w-full text-sm"
                  />
                  <Input
                    name="postalCode"
                    value={newAddress.postalCode}
                    onChange={handleNewAddressChange}
                    placeholder="500081"
                    className="w-full text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Country</Label>
                  <Input
                    value={newAddress.country}
                    disabled
                    className="mt-1 w-full text-sm"
                  />
                </div>
              </div>
            </motion.div>

            {/* PAYMENT METHOD */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6"
            >
              <h2 className="text-base sm:text-2xl font-bold mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Method
              </h2>

              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center justify-between border rounded-xl p-4 cursor-pointer transition
                    ${selectedPaymentMethod === method.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-400"}`}
                  >
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <span className="text-sm font-medium">
                        {method.name}
                      </span>
                    </div>
                    <RadioGroupItem value={method.id} id={method.id} />
                  </Label>
                ))}
              </RadioGroup>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 lg:sticky lg:top-6"
            >
              <h2 className="text-base sm:text-2xl font-bold mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      className="w-14 h-14 rounded-md object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-base sm:text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading || !termsAccepted}
                className="w-full mt-6 h-11 sm:h-12 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                {loading ? "Processing..." : `Place Order · ₹${total.toFixed(2)}`}
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  </Layout>
);
};

export default Checkout;