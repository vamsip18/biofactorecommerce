// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Blog from "./pages/Blog";
import About from "./pages/About";
import KitchenGardening from "./pages/KitchenGardening";
import { LargeAnimalsProducts } from "./pages/large-animals";
import CustomerCare from "./pages/CustomerCare";
import NotFound from "./pages/NotFound";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import Account from "./pages/account/Account";
import Cart from "./pages/Cart";
import { ProbioticsProducts } from "./pages/Probiotics";
import DiseaseManagement from "./pages/DiseaseManagement";
import SpecialApplications from "./pages/SpecialApplications";
import SoilApplications from "./pages/SoilApplications";
import FoliarApplications from "./pages/FoliarApplications";
import DripApplications from "./pages/DripApplications";
import CropProtection from "./pages/CropProtection";
import Agriculture from "./pages/Agriculture";
import Aquaculture from "./pages/Aquaculture";
import Profile from "./pages/profile";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/orders";
import OrderDetails from "./pages/OrderDetails";
import path from "path/win32";
import SearchResults from "./pages/SearchResults";
// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/about" element={<About />} />
              <Route path="/customerCare" element={<CustomerCare />} />
              <Route path="/returns" element={<CustomerCare />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />

              {/* Agriculture Container with Tabs */}
              <Route path="/agriculture" element={<Agriculture />} />

              {/* Aquaculture Container with Tabs */}
              <Route path="/aquaculture" element={<Aquaculture />} />

              {/* Direct product page routes (for backwards compatibility) */}
              <Route path="/aquaculture/probiotics" element={<ProbioticsProducts />} />
              <Route path="/aquaculture/disease-management" element={<DiseaseManagement />} />
              <Route path="/kitchen-gardening" element={<KitchenGardening />} />
              <Route path="/large-animals" element={<LargeAnimalsProducts />} />
              <Route path="/agriculture/special-products" element={<SpecialApplications />} />
              <Route path="/agriculture/soil-applications" element={<SoilApplications />} />
              <Route path="/agriculture/foliar-applications" element={<FoliarApplications />} />
              <Route path="/agriculture/drip-applications" element={<DripApplications />} />
              <Route path="/agriculture/crop-protection" element={<CropProtection />} />
              <Route path="/search" element={<SearchResults />} />
              <Route
                path="/order/:id"
                element={<OrderDetails />}
              />
              {/* Account Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />

              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);
export default App;