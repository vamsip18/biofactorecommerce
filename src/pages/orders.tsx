import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Filter, Download, Eye, Package, Truck, CheckCircle,
  XCircle, Clock, RefreshCw, AlertCircle, ChevronRight, Calendar,
  User, MapPin, CreditCard, DollarSign, ArrowUpDown, MoreVertical,
  ShoppingBag, Home, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useTranslation } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  variant: string;
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
  };
  createdAt: Date;
  estimatedDelivery: Date;
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

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const t = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Load orders from Supabase
  const loadOrders = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data to match our interface
      const formattedOrders: Order[] = (data || []).map((order: any) => ({
        id: order.id,
        orderNumber: `ORD-${order.id.slice(0, 8).toUpperCase()}`,
        total: Number(order.grand_total) || 0,
        subtotal: Number(order.subtotal) || 0,
        tax: Number(order.tax_total) || 0,
        shipping: Number(order.shipping_total) || 0,
        status: normalizeOrderStatus(order.status),
        paymentMethod: order.payment_method || 'cod',
        paymentStatus: order.payment_status || 'pending',
        shippingAddress: {
          name: `${order.first_name || ''} ${order.last_name || ''}`.trim(),
          street: order.street || '',
          city: order.city || '',
          state: order.state || '',
          postalCode: order.postal_code || '',
          phone: order.phone || ''
        },
        createdAt: new Date(order.created_at),
        estimatedDelivery: new Date(
          new Date(order.created_at).getTime() + 5 * 24 * 60 * 60 * 1000
        ),
        items: (order.order_items || []).map((item: any) => ({
          id: item.id,
          name: item.product_name || 'Product',
          quantity: item.quantity || 1,
          price: Number(item.price) || 0,
          image: item.image || "/placeholder.jpg",
          variant: item.variant_title || 'Standard',
        })),
      }));

      setOrders(formattedOrders);

    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  // Filter orders
  const filteredOrders = orders
    .filter(order => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.shippingAddress.city.toLowerCase().includes(query) ||
          order.id.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(order => {
      // Status filter
      if (statusFilter !== "all") {
        return order.status === statusFilter;
      }
      return true;
    })
    .filter(order => {
      // Date filter
      if (dateFilter !== "all") {
        const now = new Date();
        const orderDate = new Date(order.createdAt);

        switch (dateFilter) {
          case "today":
            return orderDate.toDateString() === now.toDateString();
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            return orderDate >= yearAgo;
          default:
            return true;
        }
      }
      return true;
    })
    .sort((a, b) => {
      // Always show newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Get status badge
  const getStatusBadge = (status?: Order['status'] | string) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
      processing: { color: "bg-blue-100 text-blue-800", icon: <Package className="w-3 h-3" /> },
      shipped: { color: "bg-indigo-100 text-indigo-800", icon: <Truck className="w-3 h-3" /> },
      delivered: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
      refunded: { color: "bg-purple-100 text-purple-800", icon: <RefreshCw className="w-3 h-3" /> }
    };
    const safeStatus = status && status in config ? (status as keyof typeof config) : "pending";

    return (
      <Badge className={`${config[safeStatus].color} gap-1`}>
        {config[safeStatus].icon}
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </Badge>
    );
  };

  // Get payment status badge
  const getPaymentBadge = (status?: Order['paymentStatus'] | string) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="w-3 h-3" /> },
      paid: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="w-3 h-3" /> },
      failed: { color: "bg-red-100 text-red-800", icon: <XCircle className="w-3 h-3" /> },
      refunded: { color: "bg-purple-100 text-purple-800", icon: <RefreshCw className="w-3 h-3" /> }
    };
    const safeStatus = status && status in config ? (status as keyof typeof config) : "pending";

    return (
      <Badge className={`${config[safeStatus].color} gap-1`}>
        {config[safeStatus].icon}
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </Badge>
    );
  };

  // Handle order actions
  const handleOrderAction = async (orderId: string, action: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    switch (action) {
      case "view":
        navigate(`/order/${orderId}`);
        break;
      case "track":
        toast.info(`Tracking order ${order.orderNumber}`);
        break;
      case "cancel":
        if (window.confirm(`Cancel order ${order.orderNumber}? This action cannot be undone.`)) {
          try {
            const { error: updateError } = await supabase
              .from('orders')
              .update({ status: 'cancelled' })
              .eq('id', orderId)
              .eq('user_id', user?.id);

            if (updateError) throw updateError;

            const { data: verifyData, error: verifyError } = await supabase
              .from('orders')
              .select('status')
              .eq('id', orderId)
              .eq('user_id', user?.id)
              .single();

            if (verifyError) throw verifyError;

            const verifiedStatus = normalizeOrderStatus(verifyData?.status);
            if (verifiedStatus !== 'cancelled') {
              throw new Error('Order cancellation was not applied in database');
            }

            toast.success('Order cancelled successfully');
            loadOrders(); // Refresh orders
          } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Failed to cancel order');
          }
        }
        break;
      case "invoice":
        toast.info(`Downloading invoice for ${order.orderNumber}`);
        break;
      case "reorder":
        toast.info(`Adding items from ${order.orderNumber} to cart`);
        break;
      case "help":
        navigate("/contact", { state: { orderNumber: order.orderNumber } });
        break;
    }
  };

  // Real-time subscription for order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('customer-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Refresh orders when changes occur
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Loading state
  if (loading && orders.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{t.orders.loadingOrders}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-white to-green-50 py-4 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Header */}
          <div className="mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t.orders.pageTitle}</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{t.orders.pageDescription}</p>
              </div>
              <Link to="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="w-4 h-4" />
                  {t.orders.continueShoppingBtn}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-4 sm:mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">{t.orders.totalOrders}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{orders.length}</div>
                <p className="text-xs sm:text-sm text-gray-500">{t.orders.allPurchases}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">{t.orders.activeOrders}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">{t.orders.currentlyProcessing}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-gray-600">{t.orders.totalSpent}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </div>
                <p className="text-xs sm:text-sm text-gray-500">{t.orders.allTime}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-4 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 justify-between">
                {/* Search */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                      placeholder={t.orders.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder={t.orders.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.orders.allOrders}</SelectItem>
                      <SelectItem value="pending">{t.orders.pending}</SelectItem>
                      <SelectItem value="processing">{t.orders.processing}</SelectItem>
                      <SelectItem value="shipped">{t.orders.shipped}</SelectItem>
                      <SelectItem value="delivered">{t.orders.delivered}</SelectItem>
                      <SelectItem value="cancelled">{t.orders.cancelled}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full sm:w-[140px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder={t.orders.timePeriod} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t.orders.allTime}</SelectItem>
                      <SelectItem value="today">{t.orders.today}</SelectItem>
                      <SelectItem value="week">{t.orders.thisWeek}</SelectItem>
                      <SelectItem value="month">{t.orders.thisMonth}</SelectItem>
                      <SelectItem value="year">{t.orders.thisYear}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={loadOrders} className="gap-2 w-full sm:w-auto">
                    <RefreshCw className="w-4 h-4" />
                    {t.orders.refresh}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>{t.orders.cardTitle} ({filteredOrders.length})</CardTitle>
              <CardDescription>
                {t.orders.cardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t.orders.noOrdersTitle}</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? t.orders.noOrdersSearch
                      : t.orders.noOrdersDefault}
                  </p>
                  <Link to="/">
                    <Button className="bg-green-600 hover:bg-green-700">
                      {t.orders.startShopping}
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-3 sm:hidden">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border border-gray-200 bg-white p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                          <span className="text-gray-300">•</span>
                          <span>₹{order.total.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="text-xs text-gray-500 capitalize">
                            {order.paymentMethod}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOrderAction(order.id, "view")}
                              className="h-8 px-2 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {t.orders.details}
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t.orders.orderActions}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOrderAction(order.id, "invoice")}>
                                  <Download className="w-4 h-4 mr-2" />
                                  {t.orders.downloadInvoice}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrderAction(order.id, "track")}>
                                  <Truck className="w-4 h-4 mr-2" />
                                  {t.orders.trackOrder}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrderAction(order.id, "reorder")}>
                                  <ShoppingBag className="w-4 h-4 mr-2" />
                                  {t.account.reorder}
                                </DropdownMenuItem>
                                {order.status === 'pending' && (
                                  <DropdownMenuItem
                                    onClick={() => handleOrderAction(order.id, "cancel")}
                                    className="text-red-600"
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    {t.orders.cancelOrder}
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleOrderAction(order.id, "help")}>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  {t.orders.getHelp}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="hidden sm:block rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t.orders.orderNumber}</TableHead>
                          <TableHead>{t.orders.date}</TableHead>
                          <TableHead>{t.orders.items}</TableHead>
                          <TableHead>{t.orders.total}</TableHead>
                          <TableHead>{t.account.orderStatus}</TableHead>
                          <TableHead>{t.orders.paymentStatus}</TableHead>
                          <TableHead className="text-right">{t.orders.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow key={order.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-green-600" />
                                <div>
                                  <div>{order.orderNumber}</div>
                                  <div className="text-xs text-gray-500">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  {new Date(order.createdAt).toLocaleDateString('en-IN')}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                {order.items.slice(0, 2).map((item, index) => (
                                  <div key={index} className="text-sm flex items-center gap-2">
                                    <div className="w-6 h-6 rounded overflow-hidden">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium">{item.quantity} × {item.name}</div>
                                      {item.variant && (
                                        <div className="text-xs text-gray-500">{item.variant}</div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {order.items.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{order.items.length - 2} {t.orders.items_plural}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell className="font-semibold">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-gray-500" />
                                ₹{order.total.toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.shipping === 0 ? t.orders.freeShipping : `${t.orders.shipping}: ₹${order.shipping}`}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                {getStatusBadge(order.status)}
                                {order.status === 'shipped' && (
                                  <div className="text-xs text-gray-500 mt-1">
                                    {t.orders.estimatedDelivery}: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}
                                  </div>
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                {getPaymentBadge(order.paymentStatus)}
                                <div className="text-xs text-gray-500 capitalize">
                                  {order.paymentMethod}
                                </div>
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOrderAction(order.id, "view")}
                                  className="gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  {t.orders.details}
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t.orders.orderActions}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleOrderAction(order.id, "invoice")}>
                                      <Download className="w-4 h-4 mr-2" />
                                      {t.orders.downloadInvoice}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderAction(order.id, "track")}>
                                      <Truck className="w-4 h-4 mr-2" />
                                      {t.orders.trackOrder}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleOrderAction(order.id, "reorder")}>
                                      <ShoppingBag className="w-4 h-4 mr-2" />
                                      {t.account.reorder}
                                    </DropdownMenuItem>
                                    {order.status === 'pending' && (
                                      <DropdownMenuItem
                                        onClick={() => handleOrderAction(order.id, "cancel")}
                                        className="text-red-600"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        {t.orders.cancelOrder}
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem onClick={() => handleOrderAction(order.id, "help")}>
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      {t.orders.getHelp}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}

              {/* Pagination */}
              {filteredOrders.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 sm:mt-6">
                  <div className="text-xs sm:text-sm text-gray-500">
                    Showing {filteredOrders.length} of {orders.length} orders
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm">
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status Guide */}
          <Card className="mt-6 sm:mt-8">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Order Status Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs sm:text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs sm:text-sm">Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span className="text-xs sm:text-sm">Shipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm">Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs sm:text-sm">Cancelled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs sm:text-sm">Refunded</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support Information */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Need Help With Your Orders?</h3>
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">
              Our customer support team is here to help you with any questions about your orders.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
              <a
                href="mailto:support@biofactor.com"
                className="text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Email Support
              </a>
              <a
                href="tel:+911234567890"
                className="text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Call Support
              </a>
              <Link
                to="/contact"
                className="text-green-600 hover:text-green-700 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;