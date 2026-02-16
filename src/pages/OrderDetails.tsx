import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Download, Printer, Mail, Phone, MapPin, 
  Calendar, Package, Truck, CheckCircle, Clock, XCircle,
  RefreshCw, CreditCard, User, Home, ShoppingBag, 
  ChevronRight, AlertCircle, ExternalLink, MessageSquare, FileText
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  variant: string;
  product_id?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentMethod: 'card' | 'upi' | 'cod' | 'netbanking';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    country: string;
  };
  billingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
    country: string;
  };
  createdAt: Date;
  estimatedDelivery: Date;
  deliveredAt?: Date;
  items: OrderItem[];
  notes?: string;
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  // Helper function to get default product image
  const getDefaultProductImage = (productName: string) => {
    const lowerName = productName?.toLowerCase() || '';
    
    if (lowerName.includes('soil') || lowerName.includes('booster')) {
      return 'https://images.unsplash.com/photo-1592982537447-7444dc31f8e8?w=400&h=400&fit=crop';
    }
    if (lowerName.includes('aqua') || lowerName.includes('probiotic')) {
      return 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop';
    }
    if (lowerName.includes('plant') || lowerName.includes('growth')) {
      return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop';
    }
    if (lowerName.includes('organic') || lowerName.includes('fertilizer')) {
      return 'https://images.unsplash.com/photo-1597848218514-8b2f5f6c13fc?w=400&h=400&fit=crop';
    }
    if (lowerName.includes('aquaculture') || lowerName.includes('kit')) {
      return 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&h=400&fit=crop';
    }
    if (lowerName.includes('animal') || lowerName.includes('supplement')) {
      return 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400&h=400&fit=crop';
    }
    
    // Default placeholder from Unsplash
    return 'https://images.unsplash.com/photo-1611095567219-8fa9a8a5b5b7?w=400&h=400&fit=crop';
  };

  // Load order details
  const loadOrderDetails = async () => {
    if (!id || !user) {
      navigate("/orders");
      return;
    }

    setLoading(true);
    try {
      // Fetch order with order items
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      // Transform data
      const orderData: Order = {
        id: data.id,
        orderNumber: `ORD-${data.id.slice(0, 8).toUpperCase()}`,
        total: Number(data.grand_total) || 0,
        subtotal: Number(data.subtotal) || 0,
        tax: Number(data.tax_total) || 0,
        shipping: Number(data.shipping_total) || 0,
        status: data.status || 'pending',
        paymentMethod: data.payment_method || 'cod',
        paymentStatus: data.payment_status || 'pending',
        shippingAddress: {
          name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          street: data.street || '',
          city: data.city || '',
          state: data.state || '',
          postalCode: data.postal_code || '',
          phone: data.phone || '',
          country: data.country || 'India'
        },
        createdAt: new Date(data.created_at),
        estimatedDelivery: new Date(
          new Date(data.created_at).getTime() + 5 * 24 * 60 * 60 * 1000
        ),
        deliveredAt: data.delivered_at ? new Date(data.delivered_at) : undefined,
        items: (data.order_items || []).map((item: any) => {
          // Get image from stored image_url or fetch from products table
          let productImage = '/placeholder.jpg';
          
          // Try to get image from multiple possible sources
          if (item.image_url) {
            productImage = item.image_url;
          } else if (item.image) {
            productImage = item.image;
          } else {
            // Fallback to default image based on product name
            productImage = getDefaultProductImage(item.product_name);
          }
          
          return {
            id: item.id,
            name: item.product_name || 'Product',
            quantity: item.quantity || 1,
            price: Number(item.price) || 0,
            image: productImage,
            variant: item.variant_title || 'Standard',
            product_id: item.product_id
          };
        }),
        notes: data.notes
      };

      setOrder(orderData);
    } catch (error) {
      console.error("Error loading order:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetails();
  }, [id, user]);

  // Generate and download invoice
  const generateInvoice = async () => {
    if (!order) return;

    setGeneratingInvoice(true);
    try {
      const doc = new jsPDF();
      
      // Company Info
      doc.setFontSize(20);
      doc.setTextColor(34, 197, 94);
      doc.text("BIOFACTOR AGRI SOLUTIONS", 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("123 Green Tech Park, Mumbai, Maharashtra 400001", 105, 30, { align: 'center' });
      doc.text("GSTIN: 27AABCU9603R1ZX | CIN: U74999MH2022PTC389712", 105, 35, { align: 'center' });
      doc.text("Phone: +91 22 1234 5678 | Email: info@biofactor.com", 105, 40, { align: 'center' });
      
      // Invoice Title
      doc.setFontSize(16);
      doc.text("TAX INVOICE", 105, 55, { align: 'center' });
      
      // Order Details
      doc.setFontSize(10);
      
      autoTable(doc, {
        startY: 65,
        head: [['Order Details', '']],
        body: [
          [`Invoice No:`, order.orderNumber],
          [`Invoice Date:`, order.createdAt.toLocaleDateString('en-IN')],
          [`Order Date:`, order.createdAt.toLocaleDateString('en-IN')],
          [`Payment Method:`, order.paymentMethod.toUpperCase()],
          [`Payment Status:`, order.paymentStatus.toUpperCase()],
        ],
        theme: 'plain',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      });
      
      // Customer Details
      const customerY = (doc as any).lastAutoTable.finalY + 10;
      
      autoTable(doc, {
        startY: customerY,
        head: [['Customer Details', '']],
        body: [
          [`Bill To:`, order.shippingAddress.name],
          [`Address:`, `${order.shippingAddress.street}, ${order.shippingAddress.city}`],
          [`City, State, PIN:`, `${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}`],
          [`Phone:`, order.shippingAddress.phone],
          [`Email:`, user?.email || ''],
        ],
        theme: 'plain',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
      });
      
      // Order Items Table
      const itemsY = (doc as any).lastAutoTable.finalY + 10;
      const itemsData = order.items.map((item, index) => [
        index + 1,
        item.name,
        item.variant,
        item.quantity.toString(),
        `₹${item.price.toFixed(2)}`,
        `₹${(item.price * item.quantity).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: itemsY,
        head: [['#', 'Product', 'Variant', 'Qty', 'Unit Price', 'Total']],
        body: itemsData,
        foot: [
          ['', '', '', 'Subtotal:', '', `₹${order.subtotal.toFixed(2)}`],
          ['', '', '', 'Tax (18%):', '', `₹${order.tax.toFixed(2)}`],
          ['', '', '', 'Shipping:', '', order.shipping === 0 ? 'FREE' : `₹${order.shipping.toFixed(2)}`],
          ['', '', '', 'Grand Total:', '', `₹${order.total.toFixed(2)}`]
        ],
        theme: 'striped',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [34, 197, 94], textColor: 255 },
        footStyles: { fillColor: [245, 245, 245] },
        margin: { left: 10, right: 10 }
      });
      
      // Terms and Conditions
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      doc.setFontSize(8);
      doc.text("Terms & Conditions:", 14, finalY);
      doc.text("1. Goods once sold will not be taken back.", 14, finalY + 5);
      doc.text("2. Subject to Mumbai Jurisdiction.", 14, finalY + 10);
      doc.text("3. This is a computer generated invoice.", 14, finalY + 15);
      
      // Signature
      doc.setFontSize(10);
      doc.text("Authorized Signatory", 160, finalY + 25);
      doc.line(160, finalY + 26, 190, finalY + 26);
      
      // Save PDF
      doc.save(`Invoice-${order.orderNumber}.pdf`);
      toast.success("Invoice downloaded successfully!");
      
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error("Failed to generate invoice");
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: Order['status']) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-4 h-4" /> },
      processing: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-4 h-4" /> },
      shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-4 h-4" /> },
      delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
      refunded: { color: "bg-purple-100 text-purple-800", icon: <RefreshCw className="w-4 h-4" /> }
    };
    
    return (
      <Badge className={`${config[status].color} gap-2 px-3 py-1`}>
        {config[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Cancel order
  const cancelOrder = async () => {
    if (!order || !window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast.success("Order cancelled successfully");
      loadOrderDetails();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  // Track order
  const trackOrder = () => {
    if (!order) return;
    
    const trackingSteps = [
      { status: 'pending', label: 'Order Placed', date: order.createdAt, active: true },
      { status: 'processing', label: 'Processing', date: new Date(order.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000), active: order.status !== 'pending' },
      { status: 'shipped', label: 'Shipped', date: new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000), active: ['shipped', 'delivered'].includes(order.status) },
      { status: 'delivered', label: 'Delivered', date: order.deliveredAt || order.estimatedDelivery, active: order.status === 'delivered' },
    ];

    toast(
      <div className="p-4">
        <h4 className="font-semibold mb-2">Order Tracking</h4>
        <div className="space-y-3">
          {trackingSteps.map((step, index) => (
            <div key={step.status} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                step.active 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <div className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.label}
                </div>
                <div className="text-sm text-gray-500">
                  {step.active ? step.date.toLocaleDateString('en-IN') : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>,
      { duration: 10000 }
    );
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have access to it.</p>
            <Link to="/orders">
              <Button className="bg-green-600 hover:bg-green-700">
                View All Orders
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link to="/orders" className="inline-flex items-center text-green-700 hover:text-green-800">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Link>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={generateInvoice}
                  disabled={generatingInvoice}
                  className="gap-2"
                >
                  {generatingInvoice ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </>
                  )}
                </Button>
                
                {order.status === 'pending' && (
                  <Button
                    variant="destructive"
                    onClick={cancelOrder}
                    className="gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Order {order.orderNumber}</h1>
                <p className="text-gray-600 mt-1">
                  Placed on {order.createdAt.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {getStatusBadge(order.status)}
                <Badge className={`gap-2 px-3 py-1 ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : order.paymentStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <CreditCard className="w-4 h-4" />
                  {order.paymentStatus.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Order Items & Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Items ({order.items.length})</CardTitle>
                  <CardDescription>Products in your order</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getDefaultProductImage(item.name);
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{item.name}</h4>
                              {item.variant && (
                                <p className="text-sm text-gray-600">{item.variant}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{item.price.toFixed(2)} × {item.quantity}
                              </div>
                            </div>
                          </div>
                          
                          {item.product_id && (
                            <div className="mt-2">
                              <Link 
                                to={`/product/${item.product_id}`}
                                className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                              >
                                View Product
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (18%)</span>
                      <span className="font-medium">₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.shipping === 0 ? "Free" : `₹${order.shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                    
                    {order.paymentMethod === 'cod' && order.paymentStatus === 'pending' && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600" />
                          <span className="font-semibold text-yellow-800">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-yellow-700">
                          Please keep ₹{order.total.toFixed(2)} ready for payment upon delivery.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              {order.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700">{order.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Shipping & Actions */}
            <div className="space-y-8">
              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{order.shippingAddress.name}</span>
                    </div>
                    <p className="text-gray-700">{order.shippingAddress.street}</p>
                    <p className="text-gray-700">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-700">{order.shippingAddress.country}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{order.shippingAddress.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Order Placed</div>
                        <div className="text-sm text-gray-500">
                          {order.createdAt.toLocaleDateString('en-IN')} at{" "}
                          {order.createdAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        order.status !== 'pending' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Package className={`w-4 h-4 ${
                          order.status !== 'pending' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${order.status !== 'pending' ? 'text-gray-900' : 'text-gray-500'}`}>
                          Processing
                        </div>
                        {order.status !== 'pending' ? (
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Pending</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        ['shipped', 'delivered'].includes(order.status) ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Truck className={`w-4 h-4 ${
                          ['shipped', 'delivered'].includes(order.status) ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${
                          ['shipped', 'delivered'].includes(order.status) ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          Shipped
                        </div>
                        {['shipped', 'delivered'].includes(order.status) ? (
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">Pending</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        order.status === 'delivered' ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${
                          order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium ${order.status === 'delivered' ? 'text-gray-900' : 'text-gray-500'}`}>
                          Delivered
                        </div>
                        {order.status === 'delivered' && order.deliveredAt ? (
                          <div className="text-sm text-gray-500">
                            {order.deliveredAt.toLocaleDateString('en-IN')}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Est: {order.estimatedDelivery.toLocaleDateString('en-IN')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-4 gap-2"
                    onClick={trackOrder}
                  >
                    <Truck className="w-4 h-4" />
                    Track Order
                  </Button>
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={generateInvoice}
                    disabled={generatingInvoice}
                  >
                    <FileText className="w-4 h-4" />
                    {generatingInvoice ? 'Generating Invoice...' : 'Download Invoice'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => window.print()}
                  >
                    <Printer className="w-4 h-4" />
                    Print Order Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      window.location.href = `mailto:support@biofactor.com?subject=Help with Order ${order.orderNumber}`;
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Contact Support
                  </Button>
                  
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <ShoppingBag className="w-4 h-4" />
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-medium capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'pending' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Paid:</span>
                      <span className="font-medium">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help With This Order?</h3>
            <p className="text-gray-600 mb-4">
              Our customer support team is available 24/7 to assist you with any questions about your order.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = `mailto:support@biofactor.com?subject=Help with Order ${order.orderNumber}`;
                }}
                className="gap-2"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  window.location.href = 'tel:+911234567890';
                }}
                className="gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </Button>
              <Link to="/contact">
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact Form
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderDetails;