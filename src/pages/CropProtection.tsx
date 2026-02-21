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
import { useTranslation } from '@/contexts/LanguageContext';

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
  { id: "range1", min: 0, max: 500, label: "Under Rs. 500" },
  { id: "range2", min: 500, max: 1000, label: "Rs. 500 - Rs. 1000" },
  { id: "range3", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
  { id: "range4", min: 2000, max: 5000, label: "Rs. 2000 - Rs. 5000" },
  { id: "range5", min: 5000, max: Infinity, label: "Over Rs. 5000" }
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

const getDiscountValue = (discount: Record<string, any>): number => {
  const candidates = [
    discount.discount_percentage,
    discount.percentage,
    discount.percent,
    discount.value,
    discount.amount,
    discount.discount_amount
  ];
  const numericValue = candidates.find(value => typeof value === "number" && !Number.isNaN(value));
  return numericValue || 0;
};

const getDiscountedPrice = (originalPrice: number, discounts: any[], product: Product): number => {
  if (!discounts || discounts.length === 0) return originalPrice;

  const collectionId = product.collections?.id;
  const variantIds = product.product_variants?.map(variant => variant.id) || [];

  // Find applicable discount
  const applicableDiscount = discounts.find((discount: any) => {
    if (discount.applies_to === "all") return true;
    if (!discount.applies_ids || discount.applies_ids.length === 0) return false;

    switch (discount.applies_to) {
      case "products":
        return discount.applies_ids.includes(product.id);
      case "collections":
        return collectionId ? discount.applies_ids.includes(collectionId) : false;
      case "variants":
        return variantIds.some(id => discount.applies_ids!.includes(id));
      default:
        return false;
    }
  });

  if (!applicableDiscount) return originalPrice;

  const discountValue = getDiscountValue(applicableDiscount);
  const valueType = String(applicableDiscount.value_type || applicableDiscount.discount_type || applicableDiscount.type || "").toLowerCase();

  if (valueType.includes("percent")) {
    return originalPrice - (originalPrice * discountValue / 100);
  }

  return Math.max(0, originalPrice - discountValue);
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

// Filter Section Component
const FilterSection = ({
  filters,
  setFilters,
  searchQuery,
  setSearchQuery
}: {
  filters: {
    availability: string[];
    priceRanges: string[];
    special: string[];
  };
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const t = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    availability: true,
    special: true
  });

  const specialOptions = [
    { id: "top-selling", label: t.common.topSelling },
    { id: "top-deals", label: t.common.topDeals }
  ];

  const toggleSection = (section: 'price' | 'availability' | 'special') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">{t.common.search}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10 border-green-200 focus:border-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">{t.common.availability}</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.availability ? 'rotate-180' : ''
            }`} />
        </button>

        {expandedSections.availability && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes('in-stock')}
                onChange={(e) => {
                  const newAvailability = e.target.checked
                    ? [...filters.availability, 'in-stock']
                    : filters.availability.filter(v => v !== 'in-stock');
                  setFilters({ ...filters, availability: newAvailability });
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{t.common.inStock}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.availability.includes('out-of-stock')}
                onChange={(e) => {
                  const newAvailability = e.target.checked
                    ? [...filters.availability, 'out-of-stock']
                    : filters.availability.filter(v => v !== 'out-of-stock');
                  setFilters({ ...filters, availability: newAvailability });
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{t.common.outOfStock}</span>
            </label>
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">{t.common.price}</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''
            }`} />
        </button>

        {expandedSections.price && (
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.priceRanges.includes(range.id)}
                  onChange={(e) => {
                    const newPriceRanges = e.target.checked
                      ? [...filters.priceRanges, range.id]
                      : filters.priceRanges.filter(v => v !== range.id);
                    setFilters({ ...filters, priceRanges: newPriceRanges });
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Special Filters */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('special')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900">{t.common.special}</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.special ? 'rotate-180' : ''
            }`} />
        </button>

        {expandedSections.special && (
          <div className="space-y-2">
            {specialOptions.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.special.includes(option.id)}
                  onChange={(e) => {
                    const nextSpecial = e.target.checked
                      ? [...filters.special, option.id]
                      : filters.special.filter(value => value !== option.id);
                    setFilters({ ...filters, special: nextSpecial });
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.special.length > 0 || searchQuery) && (
        <Button
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [], special: [] });
            setSearchQuery('');
          }}
        >
          <X className="w-4 h-4 mr-2" />
          {t.common.clearFilters}
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
  updateQuantity,
  isTopSelling,
  isTopDeal,
  activeDiscounts
}: {
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  isTopSelling: boolean;
  isTopDeal: boolean;
  activeDiscounts: any[];
}) => {
  const t = useTranslation();
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
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
  const badgeItems = [
    !isInStock
      ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold" }
      : null,
    (isTopSelling || isProductBestSeller(product))
      ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold" }
      : null,
    isTopDeal
      ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold" }
      : null,
    isProductNew(product)
      ? { label: "NEW", className: "bg-blue-500 text-white text-xs font-semibold" }
      : null
  ]
    .filter((badge): badge is { label: string; className: string } => Boolean(badge))
    .slice(0, 1);

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
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {badgeItems.map((badge, index) => (
              <Badge key={`${product.id}-badge-${index}`} className={badge.className}>
                {badge.label}
              </Badge>
            ))}
          </div>

          {/* Wishlist Button */}
          {/* <button
            className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Added to wishlist");
            }}
          >
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button> */}
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="hidden text-sm text-gray-500 line-clamp-1">{product.description}</p>

          {/* Rating */}
          <div className="hidden items-center">
            <div className="flex">
              {getRatingDisplay(product.rating)}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.rating || 4.5})
            </span>
          </div>

          <div className="hidden items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{productCategory}</span>
          </div>

          <div className="mt-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold text-green-600">
                  {(isTopDeal ? discountedPrice : productPrice).toFixed(2)}
                </div>
                {isTopDeal && (
                  <div className="text-sm text-gray-500 line-through">
                    {productPrice.toFixed(2)}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-sm text-gray-500 text-right">
                {getVariantDisplay(variant)}
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              {/* Quantity Selector */}
              {isInStock && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
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
              {!isInStock && (
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                  <span className="px-3 py-2 text-xs text-gray-500">Qty</span>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="flex-1 sm:flex-none min-w-0">
                <Button
                  size="sm"
                  className={`w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-none ${!isInStock
                    ? "bg-red-500 text-white-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  disabled={!isInStock}
                  onClick={(e) => handleAddToCart(e, quantity)}
                >
                  {!isInStock ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px] sm:text-xs whitespace-nowrap">{t.common.soldOut}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="hidden sm:inline w-3 h-3" />
                      <span className="sm:hidden">Add</span><span className="hidden sm:inline">Add to Cart</span>
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
  onClose,
  activeDiscounts,
  isTopDeal
}: {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  activeDiscounts: any[];
  isTopDeal: boolean;
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
    navigate("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} - ${product.description}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
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
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
              {/* Product Images */}
              <div>
                <div className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden mb-4 bg-gray-100">
                  {/* FIXED: Image now updates when variant changes */}
                  <motion.img
                    key={selectedVariant.id} // Key ensures re-render on variant change
                    src={selectedVariant.image_url || getProductImage(product)}
                    alt={product.name}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Variant Thumbnails */}
                {product.product_variants && product.product_variants.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.product_variants.map((variantItem) => (
                      <button
                        key={variantItem.id}
                        onClick={() => setSelectedVariant(variantItem)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${selectedVariant.id === variantItem.id
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
              <div className="space-y-4 sm:space-y-6">
                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {[
                    !isProductInStock(product, selectedVariant)
                      ? { label: "Sold Out", className: "bg-gray-500 text-white" }
                      : null,
                    isProductBestSeller(product)
                      ? { label: "Best Seller", className: "bg-amber-500 text-white" }
                      : null,
                    isProductNew(product)
                      ? { label: "NEW", className: "bg-blue-500 text-white" }
                      : null
                  ]
                    .filter((badge): badge is { label: string; className: string } => Boolean(badge))
                    .slice(0, 1)
                    .map((badge, index) => (
                      <Badge key={`${product.id}-modal-badge-${index}`} className={badge.className}>
                        {badge.label}
                      </Badge>
                    ))}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h2>

                {/* Price - FIXED: Now shows selected variant price */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    {isTopDeal && product ? (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="text-lg text-gray-500 line-through">
                            Rs. {selectedVariant.price.toFixed(2)}
                          </span>
                          <span className="text-2xl sm:text-3xl font-bold text-green-600">
                            Rs. {getDiscountedPrice(selectedVariant.price, activeDiscounts, product).toFixed(2)}
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Rs. {selectedVariant.price.toFixed(2)}
                      </span>
                    )}
                    {product.product_variants && product.product_variants.length > 1 && (
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        Selected: {getVariantDisplay(selectedVariant)}
                      </Badge>
                    )}
                  </div>
                  {/* Stock - FIXED: Now shows selected variant stock */}
                  <p className={`font-semibold mt-1 ${selectedVariant.stock > 0 ? 'text-green-600' : 'text-red-600'
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
                          className={`px-4 py-3 rounded-lg border text-sm transition-all ${selectedVariant.id === variantItem.id
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
                    className="py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 text-base sm:text-lg"
                    disabled={selectedVariant.stock <= 0}
                  >
                    <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
                    {selectedVariant.stock > 0 ? `Add ${quantity} to Cart` : 'Sold Out'}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="py-3 sm:py-4 bg-gray-900 hover:bg-gray-800 text-white text-base sm:text-lg"
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
                  className="py-3 px-6 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto hidden sm:flex"
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
                          className={`hover:bg-green-50 cursor-pointer ${selectedVariant.id === variantItem.id ? 'bg-green-100' : ''
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
                            <span className={`px-2 py-1 rounded-full text-xs ${variantItem.stock > 0
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
  updateQuantity,
  isTopSelling,
  isTopDeal,
  activeDiscounts
}: {
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  isTopSelling: boolean;
  isTopDeal: boolean;
  activeDiscounts: any[];
}) => {
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const isInStock = isProductInStock(product);
  const badgeItems = [
    !isInStock
      ? { label: "Sold Out", className: "bg-red-500 text-white text-xs" }
      : null,
    (isTopSelling || isProductBestSeller(product))
      ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs" }
      : null,
    isTopDeal
      ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs" }
      : null,
    isProductNew(product)
      ? { label: "NEW", className: "bg-blue-500 text-white text-xs" }
      : null
  ]
    .filter((badge): badge is { label: string; className: string } => Boolean(badge))
    .slice(0, 1);

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
            className="w-full aspect-square object-cover rounded-lg"
          />
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{product.name}</h3>
              <div className="flex gap-2">
                {badgeItems.map((badge, index) => (
                  <Badge key={`${product.id}-badge-${index}`} className={badge.className}>
                    {badge.label}
                  </Badge>
                ))}
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
                {isTopDeal ? (
                  <>
                    <div className="text-sm text-gray-500 line-through">
                      Rs. {productPrice.toFixed(2)}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-green-600">
                      Rs. {discountedPrice.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    Rs. {productPrice.toFixed(2)}
                  </div>
                )}
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
                className={`flex-1 sm:w-auto px-6 py-2 rounded-lg font-medium ${!isInStock
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
  const t = useTranslation();
  const [sortBy, setSortBy] = useState("best-selling");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    special: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSellingIds, setTopSellingIds] = useState<string[]>([]);
  const [topDealIds, setTopDealIds] = useState<string[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
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

        if (!data || data.length === 0) {
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

            return isCropProtection;
          });

        setProducts(cropProtectionProducts);

        // Initialize quantities
        const initialQuantities: Record<string, number> = {};
        cropProtectionProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setProductQuantities(initialQuantities);

        // Generate search suggestions
        const categorySuggestions = Array.from(new Set(
          cropProtectionProducts.map(p => getProductCategory(p))
        )).slice(0, 3);
        const suggestions = [
          ...Array.from(new Set(cropProtectionProducts.flatMap(p =>
            p.name.split(' ').filter(word => word.length > 3)
          ))).slice(0, 5),
          ...categorySuggestions,
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

  useEffect(() => {
    const fetchTopMeta = async () => {
      if (products.length === 0) {
        setTopSellingIds([]);
        setTopDealIds([]);
        return;
      }

      const productIds = products.map(product => product.id);

      try {
        const { data: orderItems, error: orderItemsError } = await supabase
          .from("order_items")
          .select("product_id, quantity")
          .in("product_id", productIds);

        if (orderItemsError) {
          throw orderItemsError;
        }

        const totals = new Map<string, number>();
        (orderItems || []).forEach((item: { product_id: string | null; quantity: number | null }) => {
          if (!item.product_id) return;
          totals.set(item.product_id, (totals.get(item.product_id) || 0) + (item.quantity || 0));
        });

        const topIds = [...totals.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
          .map(([id]) => id);

        setTopSellingIds(topIds);
      } catch (error) {
        console.error("Error loading top selling products:", error);
        setTopSellingIds([]);
      }

      try {
        const { data: discounts, error: discountsError } = await supabase
          .from("discounts")
          .select("*");

        if (discountsError) {
          throw discountsError;
        }

        const now = new Date();
        const activeDiscounts = (discounts || []).filter((discount: {
          status: string;
          starts_at: string;
          ends_at: string | null;
        }) => {
          const startsAt = new Date(discount.starts_at);
          const endsAt = discount.ends_at ? new Date(discount.ends_at) : null;
          return discount.status === "active" && startsAt <= now && (!endsAt || endsAt >= now);
        });

        // Store active discounts in state
        setActiveDiscounts(activeDiscounts);

        const appliesToAll = activeDiscounts.some((discount: { applies_to: string }) => discount.applies_to === "all");
        const dealIds = new Set<string>();

        products.forEach((product) => {
          if (appliesToAll) {
            dealIds.add(product.id);
            return;
          }

          const collectionId = product.collections?.id;
          const variantIds = product.product_variants?.map(variant => variant.id) || [];

          const hasDeal = activeDiscounts.some((discount: {
            applies_to: string;
            applies_ids: string[] | null;
          }) => {
            if (!discount.applies_ids || discount.applies_ids.length === 0) return false;

            switch (discount.applies_to) {
              case "products":
                return discount.applies_ids.includes(product.id);
              case "collections":
                return collectionId ? discount.applies_ids.includes(collectionId) : false;
              case "variants":
                return variantIds.some(id => discount.applies_ids!.includes(id));
              default:
                return false;
            }
          });

          if (hasDeal) {
            dealIds.add(product.id);
          }
        });

        setTopDealIds([...dealIds]);
      } catch (error) {
        console.error("Error loading active discounts:", error);
        setTopDealIds([]);
      }
    };

    fetchTopMeta();
  }, [products]);

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
    if (filters.availability.length > 0) {
      const inStockFilter = filters.availability.includes('in-stock');
      const outOfStockFilter = filters.availability.includes('out-of-stock');
      const isInStock = isProductInStock(product);

      if (inStockFilter && outOfStockFilter) {
        // Show both
      } else if (inStockFilter && !isInStock) {
        return false;
      } else if (outOfStockFilter && isInStock) {
        return false;
      }
    }

    if (filters.priceRanges.length > 0) {
      const productPrice = getProductPrice(product);
      const matchesPriceRange = filters.priceRanges.some(rangeId => {
        const range = priceRanges.find(r => r.id === rangeId);
        if (!range) return false;
        return productPrice >= range.min && productPrice <= range.max;
      });
      if (!matchesPriceRange) return false;
    }

    if (filters.special.length > 0) {
      const isTopSelling = topSellingIds.includes(product.id);
      const isTopDeal = topDealIds.includes(product.id);

      if (filters.special.includes("top-selling") && !isTopSelling) {
        return false;
      }

      if (filters.special.includes("top-deals") && !isTopDeal) {
        return false;
      }
    }

    return true;
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
  }, [filters, sortBy, searchQuery]);

  if (loading) {
    return (
      // <Layout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading crop protection products...</p>
        </div>
      </div>
      // </Layout>
    );
  }

  return (
    // <Layout>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header with Enhanced Search */}
      <div className="bg-gradient-to-r from-green-800 to-green-900 text-white py-4 md:py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-4">{t.pages.cropProtection}</h1>
          <p className="text-green-100 text-xs md:text-base max-w-2xl mx-auto">
            {t.pages.cropDesc}
          </p>

          {/* Enhanced Search Bar in Header */}
          {/* <div className="mt-8 max-w-2xl mx-auto">
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


            </div> */}
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
            {/* Results Header */}
            <div className="sticky top-[108px] z-20 bg-white rounded-xl border border-green-200 p-4 mb-4 shadow-sm lg:static lg:p-6 lg:mb-8">
              <div>
                <div>
                  <p className="text-sm text-gray-600">
                    {totalProducts} {t.pages.productsFound}
                    {searchQuery && (
                      <span className="text-green-600 ml-2">
                        for "{searchQuery}"
                      </span>
                    )}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">{t.pages.allCropProtection}</h2>

                </div>

                <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                  <Button
                    onClick={() => setMobileFiltersOpen(true)}
                    variant="outline"
                    className="h-10 px-3 border-green-200 text-green-700 hover:bg-green-50 lg:hidden"
                  >
                    <Sliders className="w-4 h-4 mr-1.5" />
                    Filter
                  </Button>

                  {/* Sort By */}
                  <div className="relative w-full">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 appearance-none bg-white border border-green-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                    >
                      <option value="name-asc">A-Z</option>
                      <option value="name-desc">a-z</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center border border-green-200 rounded-lg overflow-hidden h-10">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`w-10 h-10 text-center ${viewMode === "grid" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                    >
                      <Grid className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`w-10 h-10 text-center ${viewMode === "list" ? "bg-green-50 text-green-700" : "text-gray-500"
                        }`}
                    >
                      <List className="w-5 h-5 inline" />
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
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4" : "flex flex-col"} gap-3 sm:gap-6 mb-8 min-h-[420px] sm:min-h-0`}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => {
                  // Check if product has variants
                  if (!product.product_variants || product.product_variants.length === 0) {
                    return null;
                  }

                  return viewMode === "grid" ? (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      quantity={productQuantities[product.id] || 1}
                      updateQuantity={updateProductQuantity}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  ) : (
                    <ListViewItem
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      quantity={productQuantities[product.id] || 1}
                      updateQuantity={updateProductQuantity}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-4">
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
                          setFilters({ availability: [], priceRanges: [], special: [] });
                          setSearchQuery('');
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
                        className={`${currentPage === pageNum
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
        activeDiscounts={activeDiscounts}
        isTopDeal={selectedProduct ? topDealIds.includes(selectedProduct.id) : false}
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
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-200">
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
    // </Layout>
  );
};

export default CropProtection;