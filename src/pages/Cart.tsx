import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  CheckCircle,
  XCircle
} from "lucide-react";

// Cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  formulation: string;
  coverage: string;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = subtotal > 0 ? 99 : 0; // Free shipping over ₹500
    const tax = subtotal * 0.18; // 18% GST
    return subtotal + shipping + tax;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-green-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link 
                to="/recipes" 
                className="inline-flex items-center text-green-700 hover:text-green-800 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Your Shopping Cart
                  </h1>
                  <p className="text-gray-600">
                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white px-4 py-3 rounded-xl shadow-sm border border-green-200">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                  <span className="font-bold text-gray-900">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                {cartItems.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShoppingCart className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Add some agricultural products to get started!</p>
                    <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Link to="/recipes">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row gap-6">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl"
                              />
                            </div>
                            
                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                                  <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                                  <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                      {item.formulation}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                      {item.coverage}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="h-6 w-6 rounded-full hover:bg-white"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="text-lg font-bold text-gray-900 w-8 text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="h-6 w-6 rounded-full hover:bg-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  
                                  <div className="text-sm text-gray-600">
                                    ₹{item.price.toFixed(2)} each
                                  </div>
                                </div>
                                
                                <div className="text-xl font-bold text-gray-900">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trust Badges */}
                {cartItems.length > 0 && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3 border border-green-200">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Secure Checkout</p>
                        <p className="text-sm text-gray-600">100% Secure</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3 border border-green-200">
                      <Truck className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Free Shipping</p>
                        <p className="text-sm text-gray-600">Over ₹500</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 flex items-center gap-3 border border-green-200">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Easy Returns</p>
                        <p className="text-sm text-gray-600">7 Days Return</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              {cartItems.length > 0 && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium text-gray-900">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-gray-900">
                          {calculateSubtotal() > 500 ? "Free" : "₹99.00"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax (GST 18%)</span>
                        <span className="font-medium text-gray-900">
                          ₹{(calculateSubtotal() * 0.18).toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-green-700">
                            ₹{calculateTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter code" 
                          className="flex-1"
                        />
                        <Button variant="outline">Apply</Button>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 mb-4"
                      size="lg"
                    >
                      <CreditCard className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>

                    {/* Payment Methods */}
                    <div className="pt-6 border-t">
                      <p className="text-sm text-gray-600 mb-3">We accept</p>
                      <div className="flex gap-2">
                        <div className="w-10 h-6 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-700">VISA</span>
                        </div>
                        <div className="w-10 h-6 bg-orange-100 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-700">MC</span>
                        </div>
                        <div className="w-10 h-6 bg-purple-100 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-700">PP</span>
                        </div>
                        <div className="w-10 h-6 bg-green-100 rounded flex items-center justify-center">
                          <span className="text-xs font-bold text-green-700">UPI</span>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-4 bg-green-50 rounded-xl">
                      <p className="text-sm text-green-800">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Your payment information is secured with 256-bit SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;