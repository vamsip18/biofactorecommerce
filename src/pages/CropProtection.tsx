// CropProtection.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Layout } from '@/components/layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Filter, ChevronDown, X,
  Star, Truck, Shield, Check,
  Plus, Minus, Share2, Heart,
  Grid, List, Search, Clock,
  Package, Sliders, ArrowUpDown,
  ChevronLeft, ChevronRight, Bug,
  Leaf, Droplets, Sprout, Target,
  Loader2, Tag, BarChart3, TrendingUp,
  CheckCircle, Zap, CloudRain, Wind,
  Thermometer, Sun, Moon, AlertCircle,
  Eye, Database, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Types based on your Supabase schema
type ProductVariant = {
  id: string;
  title: string;
  variant_type: string;
  value: number | null;
  unit: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  sku: string;
};

type Collection = {
  id: string;
  title: string;
  products_count: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  collections: Collection | null;
  product_variants: ProductVariant[];
  // Add optional fields that might be missing
  category?: string;
  formulation?: string;
  coverage?: string;
  features?: string[];
  rating?: number;
  review_count?: number;
  dosage?: string;
  application_timing?: string;
  frequency?: string;
  advantages?: string[];
  mode_of_action?: string;
  target_pests?: string[];
  organic_certified?: boolean;
};

// Sort options
const sortOptions = [
  { value: "name-asc", label: "Alphabetically, A-Z" },
  { value: "name-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "created-desc", label: "Newest First" },
  { value: "best-selling", label: "Best Selling" }
];

const priceRanges = [
  { id: "range1", min: 0, max: 1000, label: "Under Rs. 1000" },
  { id: "range2", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
  { id: "range3", min: 2000, max: 3000, label: "Rs. 2000 - Rs. 3000" },
  { id: "range4", min: 3000, max: 4000, label: "Rs. 3000 - Rs. 4000" },
  { id: "range5", min: 4000, max: 5000, label: "Rs. 4000 - Rs. 5000" },
  { id: "range6", min: 5000, max: 10000, label: "Rs. 5000 - Rs. 10000" }
];

// Helper functions
const getDefaultVariant = (product: Product) => {
  return product.product_variants?.[0];
};

const getProductCategory = (product: Product) => {
  return product.collections?.title || product.category || "Crop Protection";
};

const isProductInStock = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.stock > 0;
};

const getProductImage = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.image_url || "https://images.unsplash.com/photo-1597848212624-e5f4b41d7f50?w=400&h=400&fit=crop";
};

const getProductPrice = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.price || 0;
};

const getVariantDisplay = (variant: ProductVariant) => {
  return `${variant.value || ''}${variant.unit || ''}`.trim();
};

const getRatingDisplay = (rating: number = 4.5) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 fill-gray-300 text-gray-300" />);
    }
  }
  
  return stars;
};

const isProductNew = (product: Product) => {
  if (product.created_at) {
    const createdDate = new Date(product.created_at);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return createdDate > thirtyDaysAgo;
  }
  return false;
};

const isProductBestSeller = (product: Product) => {
  const name = product.name.toLowerCase();
  return name.includes('proceed') || name.includes('neem') || 
         name.includes('nutrition') || name.includes('bsl4');
};

const getProductType = (product: Product) => {
  const name = product.name.toLowerCase();
  const desc = product.description?.toLowerCase() || '';
  
  if (name.includes('neem') || desc.includes('organic') || desc.includes('natural')) return 'organic';
  if (name.includes('micronutrient') || desc.includes('nutrition') || desc.includes('zinc') || desc.includes('iron')) return 'nutrition';
  if (name.includes('bsl4') || desc.includes('biosecurity') || desc.includes('advanced')) return 'advanced';
  if (desc.includes('insecticide') || desc.includes('pest')) return 'insecticide';
  if (desc.includes('fungicide') || desc.includes('fungal')) return 'fungicide';
  return 'general';
};

const getDefaultFeatures = (productType: string) => {
  switch (productType) {
    case 'organic':
      return ["100% natural and organic", "Broad-spectrum insect control", "Safe for beneficial insects", "No chemical residues"];
    case 'nutrition':
      return ["Complete micronutrient package", "Enhanced absorption", "Virus protection", "Improved plant immunity"];
    case 'advanced':
      return ["Advanced biosecurity technology", "Pathogen protection", "Systemic action", "Long-lasting effect"];
    case 'insecticide':
      return ["Effective pest control", "Multiple mode of action", "Systemic protection", "Compatible with IPM"];
    case 'fungicide':
      return ["Disease prevention", "Curative action", "Protects new growth", "Resistance management"];
    default:
      return ["Enhanced plant immunity", "Stress tolerance improvement", "Systemic protection", "Compatible with other products"];
  }
};

// Enhanced search function
const searchProducts = (products: Product[], query: string) => {
  if (!query.trim()) return products;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return products.filter(product => {
    const searchableFields = [
      product.name.toLowerCase(),
      product.description?.toLowerCase() || '',
      getProductCategory(product).toLowerCase(),
      ...getDefaultFeatures(getProductType(product)).map(f => f.toLowerCase()),
      ...(product.product_variants?.map(v => 
        `${v.title} ${getVariantDisplay(v)} ${v.sku}`
      ).join(' ').toLowerCase().split(' ') || [])
    ].filter(Boolean);
    
    return searchTerms.every(term => 
      searchableFields.some(field => field.includes(term))
    );
  });
};

// Filter Section Component with Enhanced Search
const FilterSection = ({ 
  filters, 
  setFilters,
  searchQuery,
  setSearchQuery,
  productTypes,
  selectedTypes,
  setSelectedTypes,
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange
}: { 
  filters: {
    availability: string[];
    priceRanges: string[];
  };
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  productTypes: string[];
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    productTypes: true,
    price: true,
    availability: true
  });

  const toggleSection = (section: 'price' | 'availability' | 'productTypes' | 'search' | 'categories') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const productTypeIcons: Record<string, JSX.Element> = {
    organic: <Leaf className="w-4 h-4" />,
    nutrition: <Sprout className="w-4 h-4" />,
    advanced: <Target className="w-4 h-4" />,
    insecticide: <Bug className="w-4 h-4" />,
    fungicide: <Droplets className="w-4 h-4" />,
    general: <Shield className="w-4 h-4" />
  };

  const productTypeLabels: Record<string, string> = {
    organic: "Organic Products",
    nutrition: "Nutrition & Micronutrients",
    advanced: "Advanced Protection",
    insecticide: "Insecticides",
    fungicide: "Fungicides",
    general: "General Protection"
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search */}
      <div>
        <button
          onClick={() => toggleSection('search')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Products
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.search ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.search && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, description, features, SKU..."
                className="pl-10 border-green-200 focus:border-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Search by: product name, description, features, specifications, SKU, or category
            </p>
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categories
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.categories ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.categories && categories.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      

      {/* Price Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Price Range
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.price ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Rs. {priceRange[0]}</span>
                <span>Rs. {priceRange[1]}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPriceRange([0, 1000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Under Rs. 1000
              </button>
              <button
                onClick={() => setPriceRange([1000, 2500])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Rs. 1000-2500
              </button>
              <button
                onClick={() => setPriceRange([2500, 4000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Rs. 2500-4000
              </button>
              <button
                onClick={() => setPriceRange([4000, 10000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Over Rs. 4000
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Availability
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.availability ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            {['In Stock', 'Sold Out'].map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters.availability.includes(status)}
                  onChange={(e) => {
                    const newAvailability = e.target.checked 
                      ? [...filters.availability, status]
                      : filters.availability.filter(s => s !== status);
                    setFilters({ ...filters, availability: newAvailability });
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        )}
      </div>

     

      {/* Clear Filters Button */}
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || selectedTypes.length > 0 || selectedCategories.length > 0 || searchQuery || priceRange[1] !== 10000) && (
        <Button
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [] });
            setSelectedTypes([]);
            setSelectedCategories([]);
            setSearchQuery('');
            setPriceRange([0, 10000]);
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
};

// Product Card Component - Grid View with Quantity Selector
const ProductCard = ({ 
  product, 
  onClick,
  quantity,
  updateQuantity
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
}) => {
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const productCategory = getProductCategory(product);
  const isInStock = isProductInStock(product);
  const productType = getProductType(product);

  const handleAddToCart = async (e: React.MouseEvent, qty?: number) => {
    e.stopPropagation();
    
    const displayName = `${product.name} ${getVariantDisplay(variant)}`.trim();
    const addQuantity = qty || quantity;
    
    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        name: displayName,
        price: variant.price,
        image: variant.image_url || productImage,
        category: productCategory,
        quantity: addQuantity,
        stock: variant.stock || 10
      });
      
      toast.success(`${addQuantity} ${product.name} added to cart!`);
      updateQuantity(product.id, 1); // Reset quantity after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const productTypeColors: Record<string, string> = {
    organic: 'bg-green-500',
    nutrition: 'bg-green-600',
    advanced: 'bg-green-700',
    insecticide: 'bg-green-800',
    fungicide: 'bg-green-900',
    general: 'bg-green-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {!isInStock && (
              <Badge className="bg-gray-500 text-white text-xs font-semibold">
                Sold Out
              </Badge>
            )}
            {isProductNew(product) && (
              <Badge className="bg-blue-500 text-white text-xs font-semibold">
                NEW
              </Badge>
            )}
            {isProductBestSeller(product) && (
              <Badge className="bg-green-600 text-white text-xs font-semibold">
                Best Seller
              </Badge>
            )}
            <Badge className={`${productTypeColors[productType]} text-white text-xs font-semibold`}>
              {productType.charAt(0).toUpperCase() + productType.slice(1)}
            </Badge>
          </div>
          
          {/* Wishlist Button */}
          <button 
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Added to wishlist");
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex">
              {getRatingDisplay(product.rating)}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.rating || 4.5})
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{productCategory}</span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3">
            {/* Price Section */}
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">
                Rs. {productPrice.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">
                {getVariantDisplay(variant)}
              </div>
            </div>

            {/* Quantity Selector and Add to Cart Button */}
            <div className="flex items-center gap-2">
              {/* Quantity Selector */}
              {isInStock && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, Math.max(1, quantity - 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, Math.min(quantity + 1, 10)); // Limit to 10
                    }}
                    className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex-shrink-0">
                <Button 
                  size="sm"
                  className={`${
                    !isInStock 
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                  disabled={!isInStock}
                  onClick={(e) => handleAddToCart(e, quantity)}
                >
                  {!isInStock ? (
                    <>
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="text-xs">Sold Out</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      <span className="text-xs">Add</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>  
      </div>
    </motion.div>
  );
};

// Product Modal Component - FIXED WITH VARIANT-AWARE IMAGES
const ProductModal = ({ 
  product, 
  isOpen, 
  onClose 
}: { 
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      const defaultVariant = getDefaultVariant(product);
      setSelectedVariant(defaultVariant || null);
    }
  }, [product]);

  if (!product || !selectedVariant) return null;

  const handleAddToCart = async () => {
    const displayName = `${product.name} ${getVariantDisplay(selectedVariant)}`.trim();
    
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        name: displayName,
        price: selectedVariant.price,
        image: selectedVariant.image_url || getProductImage(product),
        category: getProductCategory(product),
        quantity: quantity,
        stock: selectedVariant.stock || 10
      });
      
      toast.success(`${quantity} ${product.name} added to cart!`);
      onClose();
    } catch (error) {
      console.error("Error adding to cart from modal:", error);
      toast.error("Failed to add to cart");
    }
  };

  // FIXED: Proper Buy Now with login check
  const handleBuyNow = async () => {
    // First add to cart
    await handleAddToCart();
    
    // Check if user is logged in
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      toast.info("Please login to continue checkout");
      navigate("/login");
      return;
    }
    
    // User is logged in, proceed to checkout
    navigate("/checkout");
  };

  const productType = getProductType(product);
  const productFeatures = product.features || getDefaultFeatures(productType);

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Product Images */}
              <div>
                <div className="rounded-xl overflow-hidden mb-4">
                  {/* FIXED: Image now updates when variant changes */}
                  <motion.img
                    key={selectedVariant.id} // Key ensures re-render on variant change
                    src={selectedVariant.image_url || getProductImage(product)}
                    alt={product.name}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-96 object-cover"
                  />
                </div>
                {/* Variant Thumbnails */}
                {product.product_variants && product.product_variants.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.product_variants.map((variantItem) => (
                      <button
                        key={variantItem.id}
                        onClick={() => setSelectedVariant(variantItem)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                          selectedVariant.id === variantItem.id
                            ? "border-green-600"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={variantItem.image_url || getProductImage(product)}
                          alt={`${product.name} - ${getVariantDisplay(variantItem)}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
                {/* Crop Protection Icon */}
                <div className="flex items-center justify-center gap-2 text-green-600 mt-4">
                  <Shield className="w-6 h-6" />
                  <span className="text-lg font-semibold">Crop Protection Product</span>
                </div>
              </div>

              {/* Product Details */}
              <div>
                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {isProductNew(product) && (
                    <Badge className="bg-blue-500 text-white">
                      NEW
                    </Badge>
                  )}
                  {isProductBestSeller(product) && (
                    <Badge className="bg-green-600 text-white">
                      BEST SELLER
                    </Badge>
                  )}
                  <Badge className={`${
                    productType === 'organic' ? 'bg-green-500' :
                    productType === 'nutrition' ? 'bg-green-600' :
                    productType === 'advanced' ? 'bg-green-700' :
                    'bg-green-500'
                  } text-white`}>
                    {productType.charAt(0).toUpperCase() + productType.slice(1)}
                  </Badge>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {getRatingDisplay(product.rating)}
                  </div>
                  <span className="text-gray-600">({product.rating || 4.5} rating)</span>
                </div>

                {/* Price - FIXED: Now shows selected variant price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">
                      Rs. {selectedVariant.price.toFixed(2)}
                    </span>
                    {product.product_variants && product.product_variants.length > 1 && (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        Selected: {getVariantDisplay(selectedVariant)}
                      </Badge>
                    )}
                  </div>
                  {/* Stock - FIXED: Now shows selected variant stock */}
                  <p className={`font-semibold mt-1 ${
                    selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedVariant.stock > 0 
                      ? `${selectedVariant.stock} units in stock` 
                      : 'Sold Out'}
                  </p>
                  {selectedVariant.sku && (
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {selectedVariant.sku}
                    </p>
                  )}
                </div>

                {/* Shipping Info */}
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-700">Free Shipping</p>
                      <p className="text-sm text-gray-600">
                        Shipping calculated at checkout.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Variant Selection */}
                {product.product_variants && product.product_variants.length > 1 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {product.product_variants.map((variantItem) => (
                        <button
                          key={variantItem.id}
                          onClick={() => setSelectedVariant(variantItem)}
                          className={`px-4 py-3 rounded-lg border text-sm transition-all ${
                            selectedVariant.id === variantItem.id
                              ? "border-green-600 bg-green-50 text-green-700"
                              : variantItem.stock > 0
                                ? "border-gray-300 hover:border-green-300 hover:bg-green-50"
                                : "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={variantItem.stock <= 0}
                        >
                          <div className="font-medium">{getVariantDisplay(variantItem)}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Rs. {variantItem.price.toFixed(2)}
                          </div>
                          {variantItem.stock <= 0 && (
                            <div className="text-xs text-red-500 mt-1">Out of stock</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <p className="font-semibold text-gray-900 mb-3">Quantity</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={selectedVariant.stock <= 0}
                      className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => {
                        if (selectedVariant.stock > quantity) {
                          setQuantity(quantity + 1);
                        } else {
                          toast.info(`Only ${selectedVariant.stock} units available`);
                        }
                      }}
                      disabled={selectedVariant.stock <= 0 || quantity >= selectedVariant.stock}
                      className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <span className="text-gray-600 ml-4">
                      Total: Rs. {(selectedVariant.price * quantity).toFixed(2)}
                    </span>
                  </div>
                  {selectedVariant.stock > 0 && selectedVariant.stock < 10 && (
                    <p className="text-sm text-amber-600 mt-2">
                      Only {selectedVariant.stock} units left!
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <Button
                    onClick={handleAddToCart}
                    className="py-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                    disabled={selectedVariant.stock <= 0}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {selectedVariant.stock > 0 ? `Add ${quantity} to Cart` : 'Sold Out'}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="py-4 bg-gray-900 hover:bg-gray-800 text-white"
                    disabled={selectedVariant.stock <= 0}
                  >
                    Buy it now
                  </Button>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `${product.name} - ${getVariantDisplay(selectedVariant)}`,
                        text: product.description || '',
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link copied to clipboard!');
                    }
                  }}
                  className="py-3 px-6 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
              
              <p className="text-gray-600 mb-8 text-lg">{product.description}</p>

              <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                  <p className="text-gray-600">{getProductCategory(product)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Type</h4>
                  <p className="text-gray-600">{productType.charAt(0).toUpperCase() + productType.slice(1)}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Selected Size</h4>
                  <p className="text-gray-600">{getVariantDisplay(selectedVariant)}</p>
                </div>
              </div>
            </div>

            {/* All Variants Table */}
            {product.product_variants && product.product_variants.length > 1 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">All Available Variants</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="text-left p-3 border border-green-200">Size</th>
                        <th className="text-left p-3 border border-green-200">Price</th>
                        <th className="text-left p-3 border border-green-200">Stock</th>
                        <th className="text-left p-3 border border-green-200">SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.product_variants.map((variantItem) => (
                        <tr 
                          key={variantItem.id}
                          className={`hover:bg-green-50 cursor-pointer ${
                            selectedVariant.id === variantItem.id ? 'bg-green-100' : ''
                          }`}
                          onClick={() => setSelectedVariant(variantItem)}
                        >
                          <td className="p-3 border border-green-200">
                            {getVariantDisplay(variantItem)}
                          </td>
                          <td className="p-3 border border-green-200">
                            Rs. {variantItem.price.toFixed(2)}
                          </td>
                          <td className="p-3 border border-green-200">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              variantItem.stock > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {variantItem.stock > 0 ? `${variantItem.stock} in stock` : 'Out of stock'}
                            </span>
                          </td>
                          <td className="p-3 border border-green-200 text-sm text-gray-500">
                            {variantItem.sku}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// List View Item Component with Quantity Selector
const ListViewItem = ({ 
  product, 
  onClick,
  quantity,
  updateQuantity
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
}) => {
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const isInStock = isProductInStock(product);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const displayName = `${product.name} ${getVariantDisplay(variant)}`.trim();
    
    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        name: displayName,
        price: variant.price,
        image: variant.image_url || productImage,
        category: getProductCategory(product),
        quantity: quantity,
        stock: variant.stock || 10
      });
      
      toast.success(`${quantity} ${product.name} added to cart!`);
      updateQuantity(product.id, 1); // Reset quantity after adding
    } catch (error) {
      console.error("Error adding to cart from list view:", error);
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-green-300 p-4 md:p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-1/4">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-48 md:h-full object-cover rounded-lg"
          />
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{product.name}</h3>
              <div className="flex gap-2">
                {isProductNew(product) && (
                  <Badge className="bg-blue-500 text-white text-xs">NEW</Badge>
                )}
                {isProductBestSeller(product) && (
                  <Badge className="bg-green-600 text-white text-xs">Best Seller</Badge>
                )}
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-1" />
                {getProductCategory(product)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex">
                  {getRatingDisplay(product.rating)}
                </div>
                <span className="ml-1">({product.rating || 4.5})</span>
              </div>
            </div>
          </div>
          
          {/* Price, Quantity Selector and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  Rs. {productPrice.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {getVariantDisplay(variant)}
                </div>
              </div>
              
              {/* Quantity Selector */}
              {isInStock && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, Math.max(1, quantity - 1));
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(product.id, Math.min(quantity + 1, 10));
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="w-full sm:w-auto flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 sm:w-auto px-6 py-2 rounded-lg font-medium ${
                  !isInStock
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {!isInStock ? 'Sold Out' : `Add ${quantity}`}
              </button>
              {isInStock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = "/cart";
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hidden sm:block"
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const CropProtection = () => {
  const [sortBy, setSortBy] = useState("best-selling");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    availability: ['In Stock'] as string[],
    priceRanges: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  const { getCartCount } = useCart();

  const productsPerPage = 12;

  // Fetch crop protection products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching crop protection products from Supabase...");
        
        const { data, error } = await supabase
          .from("products")
          .select(`
            id,
            name,
            description,
            is_active,
            created_at,
            collections (
              id,
              title,
              products_count
            ),
            product_variants (
              id,
              title,
              variant_type,
              value,
              unit,
              price,
              stock,
              image_url,
              is_active,
              sku
            )
          `)
          .eq("is_active", true);

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        console.log("Raw data from Supabase:", data);

        if (!data || data.length === 0) {
          console.log("No data returned from Supabase");
          setProducts([]);
          return;
        }

        // Filter data on the frontend
        const cropProtectionProducts = data
          .map(product => ({
            ...product,
            // Filter out inactive variants
            product_variants: (product.product_variants || []).filter(
              (v: ProductVariant) => v.is_active === true
            ) || []
          }))
          .filter(product => {
            // Only include products with active variants
            if (!product.product_variants || product.product_variants.length === 0) {
              console.log(`Product ${product.name} has no active variants`);
              return false;
            }
            
            // Filter for crop protection products
            const collectionName = product.collections?.title?.toLowerCase() || '';
            const productName = product.name.toLowerCase();
            const productDescription = product.description?.toLowerCase() || '';
            
            // Check if this is a crop protection product
            const isCropProtection = 
              collectionName.includes('crop') || 
              collectionName.includes('protection') ||
              productName.includes('crop') ||
              productName.includes('protection') ||
              productName.includes('insecticide') ||
              productName.includes('fungicide') ||
              productName.includes('pesticide') ||
              productName.includes('neem') ||
              productName.includes('proceed') ||
              productName.includes('nutrition') ||
              productName.includes('bsl4') ||
              productDescription.includes('crop') ||
              productDescription.includes('protection') ||
              productDescription.includes('insecticide') ||
              productDescription.includes('fungicide') ||
              productDescription.includes('pesticide') ||
              productDescription.includes('neem') ||
              productDescription.includes('proceed');
            
            if (!isCropProtection) {
              console.log(`Product ${product.name} is not a crop protection product`);
            }
            
            return isCropProtection;
          });

        console.log("Filtered crop protection products:", cropProtectionProducts);
        setProducts(cropProtectionProducts);
        
        // Extract unique product types
        const types = new Set<string>();
        cropProtectionProducts.forEach(product => {
          types.add(getProductType(product));
        });
        setProductTypes(Array.from(types));
        
        // Extract unique categories
        const categories = Array.from(new Set(
          cropProtectionProducts.map(p => getProductCategory(p))
        ));
        setAllCategories(categories);
        
        // Initialize quantities
        const initialQuantities: Record<string, number> = {};
        cropProtectionProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setProductQuantities(initialQuantities);
        
        // Generate search suggestions
        const suggestions = [
          ...Array.from(new Set(cropProtectionProducts.flatMap(p => 
            p.name.split(' ').filter(word => word.length > 3)
          ))).slice(0, 5),
          ...categories.slice(0, 3),
          'crop protection',
          'organic pesticide',
          'fungicide',
          'insecticide',
          'micronutrients'
        ];
        setSearchSuggestions(suggestions);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load crop protection products");
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update product quantity
  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.min(newQuantity, 10) // Limit to 10 per product
    }));
  };

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    // Price range filter
    const productPrice = getProductPrice(product);
    const priceInRange = productPrice >= priceRange[0] && productPrice <= priceRange[1];
    
    // Product type filter
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(getProductType(product));
    
    // Category filter
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(getProductCategory(product));
    
    // Availability filter
    const availabilityMatch = filters.availability.length === 0 || 
      filters.availability.includes(isProductInStock(product) ? 'In Stock' : 'Sold Out');
    
    return priceInRange && typeMatch && categoryMatch && availabilityMatch;
  });

  // Apply search to filtered products
  const searchedProducts = searchProducts(filteredProducts, searchQuery);

  // Apply sorting
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return getProductPrice(a) - getProductPrice(b);
      case "price-desc":
        return getProductPrice(b) - getProductPrice(a);
      case "created-desc":
        if (a.created_at && b.created_at) {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.name.localeCompare(b.name);
      case "best-selling":
        return (isProductBestSeller(b) ? 1 : 0) - (isProductBestSeller(a) ? 1 : 0);
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalProducts = sortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchQuery, selectedTypes, selectedCategories, priceRange]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading crop protection products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        {/* Header with Enhanced Search */}
        <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Crop Protection</h1>
            <p className="text-green-100 text-lg max-w-2xl">
              Advanced solutions to protect your crops from pests, diseases, and nutrient deficiencies
            </p>
            
            {/* Enhanced Search Bar in Header */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crop protection by name, description, features, SKU..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-green-200 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="lg:w-1/4 hidden lg:block">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h2>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {searchedProducts.filter(p => isProductInStock(p)).length} in stock
                    </Badge>
                  </div>
                  <FilterSection 
                    filters={filters} 
                    setFilters={setFilters}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    productTypes={productTypes}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
                
                {/* Search Tips */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search Tips
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Search by product name, description, or SKU</li>
                    <li>• Try searching for specific features</li>
                    <li>• Use category names for filtering</li>
                    <li>• Search for specific nutrients or benefits</li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:w-3/4">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  variant="outline"
                  className="w-full justify-center border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  Show Filters ({Object.values(filters).flat().length + selectedTypes.length + selectedCategories.length + (searchQuery ? 1 : 0) + (priceRange[1] !== 10000 ? 1 : 0)})
                </Button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-xl border border-green-200 p-6 mb-8 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                      {searchQuery && (
                        <span className="text-green-600 ml-2">
                          for "{searchQuery}"
                        </span>
                      )}
                    </p>
                    <h2 className="text-2xl font-bold text-gray-900">Crop Protection Products</h2>
                    
                    {/* Active Filters */}
                    {(priceRange[1] !== 10000 || filters.availability.length !== 1 || filters.availability[0] !== 'In Stock' || searchQuery || selectedTypes.length > 0 || selectedCategories.length > 0) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {searchQuery && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Search: {searchQuery}
                            <button
                              onClick={() => setSearchQuery('')}
                              className="ml-1.5 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {selectedTypes.map(type => (
                          <span key={type} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {type}
                            <button
                              onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}
                              className="ml-1.5 hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {selectedCategories.map(category => (
                          <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                            {category}
                            <button
                              onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                              className="ml-1.5 hover:text-purple-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {priceRange[1] !== 10000 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                            Price: Rs. {priceRange[0]}-{priceRange[1]}
                            <button
                              onClick={() => setPriceRange([0, 10000])}
                              className="ml-1.5 hover:text-amber-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    {/* Sort By */}
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-green-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-green-200 rounded-lg overflow-hidden w-full sm:w-auto">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 sm:flex-none p-2 text-center ${
                          viewMode === "grid" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                      >
                        <Grid className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">Grid</span>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 sm:flex-none p-2 text-center ${
                          viewMode === "list" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                      >
                        <List className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-600">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 border-red-200 text-red-700 hover:bg-red-50"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              )}

              {/* Products Grid/List */}
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"} gap-6 mb-8`}>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => {
                    // Check if product has variants
                    if (!product.product_variants || product.product_variants.length === 0) {
                      console.log(`Product ${product.name} has no variants, skipping`);
                      return null;
                    }
                    
                    return viewMode === "grid" ? (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => setSelectedProduct(product)}
                        quantity={productQuantities[product.id] || 1}
                        updateQuantity={updateProductQuantity}
                      />
                    ) : (
                      <ListViewItem
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                        quantity={productQuantities[product.id] || 1}
                        updateQuantity={updateProductQuantity}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg mb-4">
                        {products.length === 0 
                          ? "No crop protection products found in database. Please add some products first."
                          : "No products found matching your criteria."}
                      </p>
                      {products.length === 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">Add products to your Supabase database:</p>
                          <ul className="text-sm text-gray-500 list-disc list-inside">
                            <li>Create a collection named "Crop Protection"</li>
                            <li>Add products with crop protection in name or description</li>
                            <li>Ensure products have active variants</li>
                          </ul>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          className="border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => {
                            setFilters({ availability: ['In Stock'], priceRanges: [] });
                            setSelectedTypes([]);
                            setSelectedCategories([]);
                            setSearchQuery('');
                            setPriceRange([0, 10000]);
                          }}
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="border-green-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={index}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${
                            currentPage === pageNum 
                              ? "bg-green-600 hover:bg-green-700" 
                              : "border-green-200"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={index} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="border-green-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween" }}
                className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setMobileFiltersOpen(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSection 
                    filters={filters} 
                    setFilters={setFilters}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    productTypes={productTypes}
                    selectedTypes={selectedTypes}
                    setSelectedTypes={setSelectedTypes}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                  <Button
                    className="w-full mt-6 bg-green-600 hover:bg-green-700"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />

        {/* Cart Count Indicator */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <Link
              to="/cart"
              className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-shadow"
            >
              <ShoppingCart className="w-8 h-8" />
            </Link>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold animate-pulse border border-green-300">
                {getCartCount()}
              </span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-green-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Crop Protection Solutions?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Proven Protection</h3>
                <p className="text-gray-600">Clinically tested solutions with proven results against pests and diseases</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly Formulas</h3>
                <p className="text-gray-600">Environmentally responsible formulas safe for crops, soil, and beneficial insects</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Enhanced Plant Health</h3>
                <p className="text-gray-600">Not just protection but also nutrition for stronger, healthier crops</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CropProtection;