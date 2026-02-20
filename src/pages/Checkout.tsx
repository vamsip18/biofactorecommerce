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
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-3 sm:py-8">
        <div className="container mx-auto px-2 sm:px-4">
          {/* Back to cart */}
          <Link to="/cart" className="inline-flex items-center text-green-700 hover:text-green-800 mb-3 sm:mb-8 text-sm sm:text-base">
            <ArrowLeft className="w-4 h-4 mr-1.5 sm:mr-2" />
            {t.nav.cart}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-2 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-2.5 sm:p-6"
              >
                <h2 className="text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-6 flex items-center">
                  <User className="w-4 sm:w-6 h-4 sm:h-6 mr-1.5 sm:mr-3 text-green-600" />
                  Delivery Address
                </h2>

                {/* Address Form - Always Visible */}
                <div className="border border-green-200 rounded-lg sm:rounded-xl p-2.5 sm:p-4 bg-green-50/50">
                  <h3 className="font-semibold text-xs sm:text-base text-gray-700 mb-2 sm:mb-3">Shipping Address</h3>
                  <div className="space-y-1.5 sm:space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-3">
                      <div>
                        <Label htmlFor="name" className="text-xs font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newAddress.name}
                          onChange={handleNewAddressChange}
                          placeholder="John Doe"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs font-medium">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleNewAddressChange}
                          placeholder="+91 9876543210"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street" className="text-xs font-medium">Street Address *</Label>
                      <Input
                        id="street"
                        name="street"
                        value={newAddress.street}
                        onChange={handleNewAddressChange}
                        placeholder="123 Main Street, Apt 4B"
                        className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-3">
                      <div>
                        <Label htmlFor="city" className="text-xs font-medium">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          placeholder="Mumbai"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-xs font-medium">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          placeholder="Maharashtra"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Label htmlFor="postalCode" className="text-xs font-medium">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          value={newAddress.postalCode}
                          onChange={handleNewAddressChange}
                          placeholder="400001"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-xs font-medium">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleNewAddressChange}
                        className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                        disabled
                      />
                    </div>

                    {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4">
                        <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 gap-1">
                          <RadioGroup
                            value={newAddress.type}
                            onValueChange={(value: 'home' | 'work' | 'other') =>
                              setNewAddress(prev => ({ ...prev, type: value }))
                            }
                            className="flex flex-wrap gap-2 sm:gap-4"
                          >
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <RadioGroupItem value="home" id="home" />

                              <Label htmlFor="home" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <Home className="w-3 sm:w-4 h-3 sm:h-4" />
                                Home
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <RadioGroupItem value="work" id="work" />
                              <Label htmlFor="work" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <Building className="w-3 sm:w-4 h-3 sm:h-4" />
                                Work
                              </Label>
                            </div>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                                <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
                                Other
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isDefault"
                          checked={newAddress.isDefault}
                          onCheckedChange={(checked) =>
                            setNewAddress(prev => ({ ...prev, isDefault: checked as boolean }))
                          }
                        />
                        <Label htmlFor="isDefault" className="text-xs sm:text-sm">
                          Save for future
                        </Label>
                      </div>
                    </div> */}
                  </div>
                </div>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-2.5 sm:p-6"
              >
                <h2 className="text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4 flex items-center">
                  <CreditCard className="w-4 sm:w-6 h-4 sm:h-6 mr-1.5 sm:mr-3 text-green-600" />
                  Payment Method
                </h2>

                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="space-y-1.5 sm:space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-start space-x-1.5 sm:space-x-2">
                        <RadioGroupItem value={method.id} id={method.id} className="mt-1 sm:mt-0.5" />
                        <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                          <div className={`p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${selectedPaymentMethod === method.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                            }`}>
                            <div className="flex items-start gap-1.5 sm:gap-3">
                              <div className={`p-1.5 sm:p-2 rounded-md text-xs sm:text-lg flex-shrink-0 ${method.id === 'card' ? 'bg-blue-100 text-blue-600' :
                                method.id === 'upi' ? 'bg-purple-100 text-purple-600' :
                                  method.id === 'cod' ? 'bg-green-100 text-green-600' :
                                    'bg-indigo-100 text-indigo-600'
                                }`}>
                                {method.icon}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-xs sm:text-base leading-tight">{method.name}</div>
                                <div className="text-xs sm:text-sm text-gray-600 leading-tight">{method.description}</div>
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Payment Details */}
                {selectedPaymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 sm:mt-4 border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-4"
                  >
                    <h3 className="font-semibold text-xs sm:text-base text-gray-700 mb-1.5 sm:mb-3">Card Details</h3>
                    <div className="space-y-1.5 sm:space-y-3">
                      <div>
                        <Label htmlFor="cardNumber" className="text-xs font-medium">Card Number</Label>
                        <Input
                          id="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                          maxLength={19}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName" className="text-xs font-medium">Name on Card</Label>
                        <Input
                          id="cardName"
                          value={paymentDetails.cardName}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, cardName: e.target.value }))}
                          placeholder="John Doe"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                        <div>
                          <Label htmlFor="expiry" className="text-xs font-medium">Expiry Date</Label>
                          <Input
                            id="expiry"
                            value={paymentDetails.expiry}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, expiry: e.target.value }))}
                            placeholder="MM/YY"
                            className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-xs font-medium">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentDetails.cvv}
                            onChange={(e) => setPaymentDetails(prev => ({ ...prev, cvv: e.target.value }))}
                            placeholder="123"
                            className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                            type="password"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedPaymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 sm:mt-4 border border-gray-200 rounded-lg sm:rounded-xl p-2.5 sm:p-4"
                  >
                    <h3 className="font-semibold text-xs sm:text-base text-gray-700 mb-1.5 sm:mb-3">UPI Details</h3>
                    <div>
                      <Label htmlFor="upiId" className="text-xs font-medium">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={paymentDetails.upiId}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, upiId: e.target.value }))}
                        placeholder="username@bank"
                        className="mt-1 text-xs sm:text-sm h-9 sm:h-10"
                      />
                      <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                        You'll be redirected to your UPI app for payment
                      </p>
                    </div>
                  </motion.div>
                )}

                {selectedPaymentMethod === 'cod' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 sm:mt-4 border border-yellow-200 rounded-lg sm:rounded-xl p-2 sm:p-4 bg-yellow-50"
                  >
                    <div className="flex items-start gap-1.5 sm:gap-3">
                      <AlertCircle className="w-3.5 sm:w-5 h-3.5 sm:h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-xs sm:text-base text-yellow-800 leading-tight">Cash on Delivery</h4>
                        <p className="text-xs sm:text-sm text-yellow-700 mt-1 leading-tight">
                          Please keep exact change ready. A small additional fee may apply.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Order Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-2.5 sm:p-6"
              >
                <h2 className="text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Additional Information</h2>
                <div>
                  <Label htmlFor="orderNotes" className="text-xs sm:text-sm font-medium">Order Notes (Optional)</Label>
                  <textarea
                    id="orderNotes"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Special instructions for delivery, gift wrapping requests, etc."
                    className="w-full mt-1 sm:mt-2 p-2 sm:p-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent min-h-20 sm:min-h-24"
                    rows={3}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-2.5 sm:p-6 lg:sticky lg:top-4"
              >
                <h2 className="text-sm sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Order Summary</h2>

                {/* Order Items */}
                <div className="space-y-1 sm:space-y-3 mb-2 sm:mb-4">
                  <h3 className="font-semibold text-xs sm:text-base text-gray-700">Items ({cartItems.length})</h3>
                  <div className="space-y-1 sm:space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-1 sm:pr-2">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                        <div className="w-8 sm:w-12 h-8 sm:h-12 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-xs sm:text-sm text-gray-900 truncate leading-tight">{item.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 leading-tight">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-semibold text-xs sm:text-sm text-gray-900 flex-shrink-0">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-0.5 sm:space-y-2 mb-2 sm:mb-4 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (18%)</span>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <hr className="my-1 sm:my-2" />
                  <div className="flex justify-between font-bold text-sm sm:text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Info */}
                <div className="mb-2 sm:mb-4 p-1.5 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl border border-green-100">
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    <Shield className="w-3.5 sm:w-5 h-3.5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <span className="font-semibold text-xs sm:text-base text-green-700 block leading-tight">Secure Payment</span>
                      <p className="text-xs sm:text-sm text-gray-600 leading-tight">
                        Your payment information is encrypted and secure.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="mb-2 sm:mb-4 p-1.5 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                  <div className="flex items-start gap-1.5 sm:gap-2">
                    <Truck className="w-3.5 sm:w-5 h-3.5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                      <span className="font-semibold text-xs sm:text-base text-blue-700 block leading-tight">Est. Delivery</span>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 leading-tight mt-0.5">
                        <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-2 sm:mb-4">
                  <div className="flex items-start space-x-1.5 sm:space-x-2">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="terms" className="text-xs sm:text-sm leading-tight text-gray-700">
                      I agree to the{" "}
                      <Link to="/terms" className="text-green-600 hover:underline font-medium">
                        Terms and Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-green-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleCheckout}
                  disabled={loading || !termsAccepted}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-10 sm:h-12 text-xs sm:text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="w-4 sm:w-5 h-4 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-1 sm:mr-2"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Processing</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                      <span>Place Order</span>
                      <span className="hidden sm:inline"> · ₹{total.toFixed(2)}</span>
                    </>
                  )}
                </Button>

                {/* Secure Payment Icons */}
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-1.5">We accept</p>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    <div className="w-8 sm:w-9 h-5 sm:h-5 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" />
                    </div>
                    <div className="w-8 sm:w-9 h-5 sm:h-5 bg-gray-100 rounded flex items-center justify-center">
                      <Wallet className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" />
                    </div>
                    <div className="w-8 sm:w-9 h-5 sm:h-5 bg-gray-100 rounded flex items-center justify-center">
                      <Building className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;