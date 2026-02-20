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
import { useLanguage } from "@/contexts/LanguageContext";
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
  originalPrice?: number;
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

const normalizeOrderStatus = (status?: string): Order['status'] => {
  const normalized = (status || 'pending').toLowerCase();

  if (normalized === 'canceled') return 'cancelled';
  if (normalized === 'pending' || normalized === 'processing' || normalized === 'shipped' || normalized === 'delivered' || normalized === 'cancelled' || normalized === 'refunded') {
    return normalized;
  }

  return 'pending';
};

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(false);

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
        status: normalizeOrderStatus(data.status),
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
      toast.success(t.orderDetails.invoiceDownloadSuccess);

    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(t.orderDetails.invoiceDownloadError);
    } finally {
      setGeneratingInvoice(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status: Order['status']) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> },
      processing: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-3 h-3 sm:w-4 sm:h-4" /> },
      shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-3 h-3 sm:w-4 sm:h-4" /> },
      delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> },
      refunded: { color: "bg-purple-100 text-purple-800", icon: <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" /> }
    };

    return (
      <Badge className={`${config[status].color} gap-1 sm:gap-2 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm`}>
        {config[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Cancel order
  const cancelOrder = async () => {
    if (!order || !user || cancellingOrder) return;

    const canCancel = ['pending', 'processing'].includes(order.status);
    if (!canCancel) return;

    if (!window.confirm(t.orderDetails.cancelOrderConfirm)) return;

    try {
      setCancellingOrder(true);

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', order.id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      const { data: updatedOrder, error: verifyError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', order.id)
        .eq('user_id', user.id)
        .single();

      if (verifyError) throw verifyError;
      const verifiedStatus = normalizeOrderStatus(updatedOrder?.status);
      if (verifiedStatus !== 'cancelled') {
        throw new Error('Order cancellation was not applied');
      }

      setOrder(prev => (prev ? { ...prev, status: verifiedStatus } : prev));

      toast.success(t.orderDetails.orderCancelledSuccess);
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(t.orderDetails.orderCancelledError);
    } finally {
      setCancellingOrder(false);
    }
  };

  // Track order
  const trackOrder = () => {
    if (!order) return;

    const trackingSteps = [
      { status: 'pending', label: t.orderDetails.orderPlaced, date: order.createdAt, active: true },
      { status: 'processing', label: t.orderDetails.processing, date: new Date(order.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000), active: order.status !== 'pending' },
      { status: 'shipped', label: t.orderDetails.shipped, date: new Date(order.createdAt.getTime() + 2 * 24 * 60 * 60 * 1000), active: ['shipped', 'delivered'].includes(order.status) },
      { status: 'delivered', label: t.orderDetails.delivered, date: order.deliveredAt || order.estimatedDelivery, active: order.status === 'delivered' },
    ];

    toast(
      <div className="p-4">
        <h4 className="font-semibold mb-2">{t.orderDetails.orderTracking}</h4>
        <div className="space-y-3">
          {trackingSteps.map((step, index) => (
            <div key={step.status} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${step.active
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
                  {step.active ? step.date.toLocaleDateString('en-IN') : t.orderDetails.pending}
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
            <p className="text-gray-600">{t.orderDetails.loadingMessage}</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.orderDetails.notFoundTitle}</h3>
            <p className="text-gray-600 mb-4">{t.orderDetails.notFoundMessage}</p>
            <Link to="/orders">
              <Button className="bg-green-600 hover:bg-green-700">
                {t.orderDetails.viewAllOrders}
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const canCancelOrder = ['pending', 'processing'].includes(order.status);

  return (
  <Layout>
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-white to-green-50 py-4 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">

        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

            <Link
              to="/orders"
              className="inline-flex items-center text-green-700 hover:text-green-800 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.orderDetails.backToOrders}
            </Link>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={generateInvoice}
                disabled={generatingInvoice}
                className="h-9 sm:h-10 text-xs sm:text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.orderDetails.downloadInvoice}
              </Button>

              {canCancelOrder && (
                <Button
                  variant="destructive"
                  onClick={cancelOrder}
                  disabled={cancellingOrder}
                  className="h-9 sm:h-10 text-xs sm:text-sm"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  {t.orderDetails.cancelOrder}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                {t.orderDetails.pageTitle} {order.orderNumber}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t.orderDetails.placedOn}{" "}
                {order.createdAt.toLocaleDateString("en-IN")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {getStatusBadge(order.status)}
              <Badge className="text-xs sm:text-sm px-3 py-1">
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6 w-full">

            {/* ORDER ITEMS CARD */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>
                  {t.orderDetails.orderItems} ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border rounded-xl p-3 w-full"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-sm truncate">
                              {item.name}
                            </h4>
                            {item.variant && (
                              <p className="text-xs text-gray-600 truncate">
                                {item.variant}
                              </p>
                            )}
                          </div>

                          <div className="text-right text-sm">
                            ₹{(item.price * item.quantity).toFixed(2)}
                            <div className="text-xs text-gray-500">
                              ₹{item.price.toFixed(2)} × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ORDER SUMMARY */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>{t.orderDetails.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{t.orderDetails.subtotal}</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.orderDetails.tax}</span>
                    <span>₹{order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.orderDetails.shipping}</span>
                    <span>
                      {order.shipping === 0
                        ? t.orderDetails.free
                        : `₹${order.shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>{t.orderDetails.total}</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 w-full">

            {/* SHIPPING ADDRESS */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>{t.orderDetails.shippingAddress}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
                <p>{order.shippingAddress.phone}</p>
              </CardContent>
            </Card>

            {/* PAYMENT INFO */}
            <Card className="rounded-2xl shadow-lg">
              <CardHeader>
                <CardTitle>{t.orderDetails.paymentInformation}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t.orderDetails.paymentMethod}</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.orderDetails.paymentStatus}</span>
                  <span>{order.paymentStatus.toUpperCase()}</span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* SUPPORT SECTION */}
        <div className="mt-10 p-6 bg-green-50 border rounded-2xl">
          <h3 className="font-semibold mb-2">
            {t.orderDetails.needHelp}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t.orderDetails.helpAvailable}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `mailto:support@biofactor.com?subject=Help with Order ${order.orderNumber}`)
              }
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>

            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = "tel:+911234567890")
              }
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </div>

      </div>
    </div>
  </Layout>
);
};

export default OrderDetails;