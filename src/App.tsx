import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from './contexts/CartContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Recipes from "./pages/Recipes";
import Blog from "./pages/Blog";
import About from "./pages/About";
import KitchenGardening from "./pages/KitchenGardening";
import { LargeAnimalsProducts } from "./pages/large-animals";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import Account from "./pages/account/Account";
import Cart from "./pages/Cart";
import Probiotics from "./pages/Probiotics";
import DiseaseManagement from "./pages/DiseaseManagement";
import SpecialApplications from "./pages/SpecialApplications";
import SoilApplications from "./pages/SoilApplications";
import FoliarApplications from "./pages/FoliarApplications";
import DripApplications from "./pages/DripApplications";
import CropProtection from "./pages/CropProtection";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider> {/* Add CartProvider here */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />

            <Route path="/contact" element={<Contact />} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/aquaculture/probiotics" element={<Probiotics />} />
            <Route path="/aquaculture/disease-management" element={<DiseaseManagement />} />
            <Route path="/kitchen-gardening" element={<KitchenGardening />} />
            <Route path="/large-animals" element={<LargeAnimalsProducts />} />
            <Route path="/agriculture/soil-applications" element={<SoilApplications />} />
            <Route path="/agriculture/foliar-applications" element={<FoliarApplications />} />
            <Route path="/agriculture/drip-applications" element={<DripApplications />} />
            <Route path="/agriculture/crop-protection" element={<CropProtection />} />
            <Route path="/agriculture/special-products" element={<SpecialApplications />} />
            {/* Account Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/*" element={<Account />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider> {/* Close CartProvider */}
  </QueryClientProvider>
);

export default App;