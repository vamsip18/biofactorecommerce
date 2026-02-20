// src/pages/Cart.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  LogIn,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/contexts/LanguageContext";

const Cart = () => {
  const navigate = useNavigate();
  const t = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartTotal,
    isLoading,
  } = useCart();

  // State for current user
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check user on mount and auth changes
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + tax + shipping;

  /* ---------------- CHECKOUT ---------------- */
  const handleCheckout = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (cartItems.length === 0) {
        toast.error(t.cart.emptyCart);
        return;
      }

      // Check current user (real-time)
      const { data: { user } } = await supabase.auth.getUser();

      // 🔐 If NOT logged in → redirect to login with checkout redirect
      if (!user) {
        toast.info(t.messages.pleaseLogin);
        navigate("/login?redirect=/checkout");
        return;
      }

      // ✅ User is logged in → continue checkout
      toast.success("Proceeding to checkout!");

      // Navigate to checkout page
      navigate("/checkout");

    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------------- QUICK CHECKOUT INFO ---------------- */
  const showCheckoutInfo = !currentUser && cartItems.length > 0;

  /* ---------------- LOADING STATE ---------------- */
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center">
          <ShoppingCart className="w-16 h-16 text-green-600 animate-pulse mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <Link to="/" className="flex items-center text-green-700 hover:text-green-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.common.continueShopping}
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.cart.yourCart}</h1>
        <p className="text-gray-600 mb-8">
          {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
        </p>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{t.cart.emptyCart}</p>
            <Link to="/">
              <Button className="bg-green-600 hover:bg-green-700">
                {t.home.shopNow}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {/* Guest Checkout Info Banner */}
              {showCheckoutInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <LogIn className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-1">
                        Complete your purchase in seconds
                      </h4>
                      <p className="text-sm text-blue-600 mb-3">
                        You'll be asked to login or create an account when you proceed to checkout.
                        Your cart items will be saved.
                      </p>
                      <div className="text-xs text-blue-500">
                        ✓ Guest checkout not available
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-4 md:gap-6"
                >
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {t.common.category}: {item.category || "Uncategorized"}
                      </p>
                      {(() => {
                        const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                        return hasDiscount ? (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              ₹{item.originalPrice?.toFixed(2)}
                            </div>
                            <p className="text-lg font-semibold text-green-700">
                              ₹{item.price.toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <p className="text-lg font-semibold text-green-700">
                            ₹{item.price.toFixed(2)}
                          </p>
                        );
                      })()}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>

                        <span className="font-bold text-lg px-3 py-1 border rounded-lg min-w-[40px] text-center">
                          {item.quantity}
                        </span>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock || 99)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.cart.removeItem}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit sticky top-8">
                <h3 className="font-bold text-xl text-gray-900 mb-6">{t.cart.orderSummary}</h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.common.subtotal} ({getCartCount()} items)</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.cart.tax} (18%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.cart.shipping}</span>
                    <span className="font-semibold">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>{t.common.total}</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex items-start gap-3 mb-3">
                    <Truck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-700">{t.product.freeShipping}</p>
                      <p className="text-sm text-gray-600">
                        {t.product.freeShipping}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-700">{t.product.secureCheckout}</p>
                      <p className="text-sm text-gray-600">
                        100% secure and encrypted payments
                      </p>
                    </div>
                  </div>
                </div>

                {/* User Status Info */}
                {/* {!currentUser ? (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium text-amber-800">Guest checkout</p>
                    </div>
                    <p className="text-xs text-amber-600">
                      You'll need to login or create an account to complete your purchase.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-medium text-green-800">
                        Logged in as: {currentUser.email?.split('@')[0]}
                      </p>
                    </div>
                  </div>
                )} */}

                {/* Checkout Button */}
                <Button
                  disabled={isLoading || isProcessing || cartItems.length === 0}
                  className="w-full mt-6 h-12 text-lg bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleCheckout}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      {currentUser ? (
                        <>
                          <CreditCard className="mr-2 w-5 h-5" />
                          {t.cart.proceedToCheckout}
                        </>
                      ) : (
                        <>
                          <LogIn className="mr-2 w-5 h-5" />
                          {t.nav.login}
                        </>
                      )}
                    </>
                  )}
                </Button>

                {/* Guest User Login Option */}
                {!currentUser && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      onClick={() => navigate("/login?redirect=/cart")}
                    >
                      {t.nav.login}
                    </Button>
                  </div>
                )}

                {/* Continue Shopping */}
                <Link to="/" className="block mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                    disabled={isProcessing}
                  >
                    {t.common.continueShopping}
                  </Button>
                </Link>

                {/* Clear Cart Button */}
                {cartItems.length > 0 && (
                  <Button
                    variant="ghost"
                    className="w-full mt-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={clearCart}
                    disabled={isProcessing}
                  >
                    {t.cart.clearCart}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;