// src/components/products/Probiotics.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from '@/contexts/LanguageContext';
import { Layout } from "@/components/layout/Layout";
import {
  Filter,
  ChevronDown,
  Grid,
  List,
  Search,
  X,
  ShoppingCart,
  Heart,
  Package,
  Clock,
  Sliders,
  ArrowUpDown,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Truck,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

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
};

type Product = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  collections: Collection | null;
  product_variants: ProductVariant[];
};

// Sort options
const sortOptions = [
  { value: "name-asc", label: "Alphabetically, A-Z" },
  { value: "name-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "created-desc", label: "Newest First" }
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
  return product.collections?.title || "Probiotics";
};

const isProductInStock = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.stock > 0;
};

const getProductImage = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.image_url || "/placeholder-probiotic.jpg";
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

const getRatingDisplay = () => {
  const defaultRating = 4.5;
  const stars = [];
  const fullStars = Math.floor(defaultRating);
  const hasHalfStar = defaultRating % 1 >= 0.5;

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
    features: string[];
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
    features: true,
    special: true
  });

  const featuresOptions = [
    { id: "powder", label: "Powder Formulation" },
    { id: "liquid", label: "Liquid Formulation" },
    { id: "granular", label: "Granular Formulation" },
    { id: "water", label: "Water Treatment" },
    { id: "disease", label: "Disease Control" },
    { id: "growth", label: "Growth Promoter" }
  ];

  const specialOptions = [
    { id: "top-selling", label: t.common.topSelling },
    { id: "top-deals", label: t.common.topDeals }
  ];

  const toggleSection = (section: 'price' | 'availability' | 'features' | 'special') => {
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
            placeholder="Search probiotics..."
            className="pl-10 border-cyan-200 focus:border-cyan-400"
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
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
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
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
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
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
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
                  className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>



      {/* Clear Filters Button */}
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.features.length > 0 || filters.special.length > 0 || searchQuery) && (
        <Button
          variant="outline"
          className="w-full border-cyan-200 text-cyan-700 hover:bg-cyan-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [], features: [], special: [] });
            setSearchQuery('');
            // Clear URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        >
          <X className="w-4 h-4 mr-2" />
          {t.common.clearFilters}
        </Button>
      )}
    </div>
  );
};

// Product Card Component - Grid View
const ProductCard = ({
  product,
  onClick,
  quantity,
  onQuantityChange,
  isTopSelling,
  isTopDeal,
  activeDiscounts
}: {
  product: Product;
  onClick: () => void;
  quantity: number;
  onQuantityChange: (productId: string, delta: number) => void;
  isTopSelling: boolean;
  isTopDeal: boolean;
  activeDiscounts: any[];
}) => {
  const t = useTranslation();
  const defaultVariant = getDefaultVariant(product);
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant!);
  const { addToCart } = useCart();

  const productImage = getProductImage(product, activeVariant);
  const productPrice = getProductPrice(product, activeVariant);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const productCategory = getProductCategory(product);
  // const badgeItems = [
  //   !isProductInStock(product, activeVariant)
  //     ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold" }
  //     : null,
  //   isTopSelling
  //     ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold" }
  //     : null,
  //   isTopDeal
  //     ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold" }
  //     : null
  // ]
  //   .filter((badge): badge is { label: string; className: string } => Boolean(badge))
  //   .slice(0, 2);
  const isInStock = isProductInStock(product, activeVariant);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const displayName = `${product.name} ${getVariantDisplay(activeVariant)}`.trim();

    try {
      await addToCart({
        productId: product.id,
        variantId: activeVariant.id,
        name: displayName,
        price: activeVariant.price,
        image: activeVariant.image_url || "/placeholder-probiotic.jpg",
        category: productCategory,
        quantity: quantity,
        stock: activeVariant.stock || 10
      });

      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    }
  };

  const badgeItems = [
    !isInStock
      ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold" }
      : null,
    isTopSelling
      ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold" }
      : null,
    isTopDeal
      ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold" }
      : null
  ]
    .filter((badge): badge is { label: string; className: string } => Boolean(badge))
    .slice(0, 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-50">
          <img
            src={productImage}
            alt={product.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          />

          {/* Variant Hover Dots */}
          {product.product_variants && product.product_variants.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {product.product_variants.map(v => (
                <button
                  key={v.id}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setActiveVariant(v);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-cyan-600 scale-110" : "bg-gray-300 hover:bg-cyan-400"
                    }`}
                />
              ))}
            </div>
          )}

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
          <h3 className="font-semibold text-gray-900 group-hover:text-cyan-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="hidden text-sm text-gray-500 line-clamp-1">{product.description}</p>

          {/* Rating */}
          <div className="hidden items-center">
            <div className="flex">
              {getRatingDisplay()}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              (4.5)
            </span>
          </div>

          <div className="hidden items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{productCategory}</span>
          </div>

          <div className="mt-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold text-cyan-600">
                  {(isTopDeal ? discountedPrice : productPrice).toFixed(2)}
                </div>
                {isTopDeal && (
                  <div className="text-sm text-gray-500 line-through">
                    {productPrice.toFixed(2)}
                  </div>
                )}
              </div>
              <div className="hidden sm:block text-sm text-gray-500 text-right">
                {getVariantDisplay(activeVariant)}
              </div>
            </div>

            <div className={`${!isInStock ? 'hidden' : 'flex flex-row'} gap-1 sm:gap-2 min-w-0`}>
              <div className="flex items-center border border-gray-300 rounded-lg text-xs shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, -1);
                  }}
                  className="px-1 py-0.5 text-gray-600 hover:text-cyan-700 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-1 py-0.5 border-x border-gray-300 min-w-6 text-center text-xs">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, 1);
                  }}
                  className="px-1 py-0.5 text-gray-600 hover:text-cyan-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button
                size="sm"
                className={`flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-none ${!isInStock
                  ? "bg-red-500 text-white-500 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
                  }`}
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                {!isInStock ? (
                  <>
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px] sm:text-xs whitespace-nowrap">{t.common.soldOut}</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="hidden sm:inline w-3 h-3" />
                    <span className="sm:hidden">Add</span><span className="hidden sm:inline">{t.common.addToCart}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Product Modal Component
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
        image: selectedVariant.image_url || "/placeholder-probiotic.jpg",
        category: getProductCategory(product),
        quantity: quantity,
        stock: selectedVariant.stock || 10
      });

      toast.success(`${product.name} added to cart!`);
      onClose();
    } catch (error) {
      console.error("Error adding to cart from modal:", error);
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
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

  // Get variant-specific image
  const variantImage = selectedVariant.image_url || "/placeholder-probiotic.jpg";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedVariant.id}
                  src={variantImage}
                  alt={product.name}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {!isProductInStock(product, selectedVariant) && (
                  <Badge className="bg-red-500 text-white">
                    Sold Out
                  </Badge>
                )}
              </div>
            </div>

            {/* Variant Thumbnails */}
            {product.product_variants && product.product_variants.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.product_variants.map((variantItem) => (
                  <button
                    key={variantItem.id}
                    onClick={() => setSelectedVariant(variantItem)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedVariant.id === variantItem.id
                      ? "border-cyan-600"
                      : "border-gray-200 hover:border-cyan-300"
                      }`}
                  >
                    <img
                      src={variantItem.image_url || "/placeholder-probiotic.jpg"}
                      alt={getVariantDisplay(variantItem)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Share Button */}
            <Button variant="outline" className="w-full border-cyan-200 hidden sm:block" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Price */}
            <div>
              {isTopDeal && product ? (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {selectedVariant.price.toFixed(2)}
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-cyan-600">
                      Rs. {getDiscountedPrice(selectedVariant.price, activeDiscounts, product).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Rs. {selectedVariant.price.toFixed(2)}
                </div>
              )}
              <div className="text-sm text-gray-500 mt-1">
                {getVariantDisplay(selectedVariant)}
              </div>
              <p className={`font-semibold mt-2 ${isProductInStock(product, selectedVariant) ? 'text-cyan-600' : 'text-red-600'
                }`}>
                {isProductInStock(product, selectedVariant) ? 'In Stock' : 'Sold Out'}
              </p>
            </div>

            {/* Variant Selection */}
            {product.product_variants && product.product_variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Available Sizes</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {product.product_variants.map((variantItem) => (
                    <button
                      key={variantItem.id}
                      onClick={() => setSelectedVariant(variantItem)}
                      className={`px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-2 ${selectedVariant.id === variantItem.id
                        ? "border-cyan-600 bg-cyan-50 text-cyan-700"
                        : "border-gray-300 hover:border-cyan-300"
                        }`}
                    >
                      {variantItem.image_url && (
                        <img
                          src={variantItem.image_url}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{getVariantDisplay(variantItem)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Rs. {variantItem.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-full border border-gray-300 hover:border-cyan-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:border-cyan-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {quantity} × Rs. {selectedVariant.price.toFixed(2)} = Rs. {(selectedVariant.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white h-12 text-lg"
                onClick={handleAddToCart}
                disabled={!isProductInStock(product, selectedVariant)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to cart
              </Button>
              <Button
                className="flex-1 border-cyan-600 text-cyan-600 hover:bg-cyan-50 h-12 text-lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={!isProductInStock(product, selectedVariant)}
              >
                Buy it now
              </Button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>

              {/* Key Features */}
              <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
              <ul className="space-y-2">
                {[
                  "Improves water quality and reduces ammonia",
                  "Enhances digestion and feed conversion ratio",
                  "Boosts immune system of aquatic species",
                  "Promotes beneficial bacterial growth",
                  "Safe for all fish and shrimp species"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// List View Item Component
const ListViewItem = ({
  product,
  onClick,
  quantity,
  onQuantityChange,
  isTopSelling,
  isTopDeal,
  activeDiscounts
}: {
  product: Product;
  onClick: () => void;
  quantity: number;
  onQuantityChange: (productId: string, delta: number) => void;
  isTopSelling: boolean;
  isTopDeal: boolean;
  activeDiscounts: any[];
}) => {
  const t = useTranslation();
  const defaultVariant = getDefaultVariant(product);
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant!);
  const { addToCart } = useCart();

  const productImage = getProductImage(product, activeVariant);
  const productPrice = getProductPrice(product, activeVariant);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const productCategory = getProductCategory(product);
  const isInStock = isProductInStock(product, activeVariant);

  const badgeItems = [
    !isInStock
      ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold" }
      : null,
    isTopSelling
      ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold" }
      : null,
    isTopDeal
      ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold" }
      : null
  ]
    .filter((badge): badge is { label: string; className: string } => Boolean(badge))
    .slice(0, 1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const displayName = `${product.name} ${getVariantDisplay(activeVariant)}`.trim();

    try {
      await addToCart({
        productId: product.id,
        variantId: activeVariant.id,
        name: displayName,
        price: activeVariant.price,
        image: activeVariant.image_url || "/placeholder-probiotic.jpg",
        category: productCategory,
        quantity: quantity,
        stock: activeVariant.stock || 10
      });

      toast.success(`${product.name} added to cart!`);
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
      className="bg-white rounded-lg border border-gray-200 hover:border-cyan-300 p-4 md:p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-1/4 relative">
          <img
            src={productImage}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />

          {/* Variant Hover Dots */}
          {product.product_variants && product.product_variants.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {product.product_variants.map(v => (
                <button
                  key={v.id}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setActiveVariant(v);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-cyan-600 scale-110" : "bg-gray-300 hover:bg-cyan-400"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="md:w-3/4 flex flex-col">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{product.name}</h3>
              {badgeItems.map((badge, index) => (
                <Badge key={`${product.id}-badge-${index}`} className={badge.className}>
                  {badge.label}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-1" />
                {productCategory}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="flex">
                  {getRatingDisplay()}
                </div>
                <span className="ml-1">(4.5)</span>
              </div>
            </div>
          </div>

          {/* Price, Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div>
                {isTopDeal ? (
                  <>
                    <div className="text-sm text-gray-500 line-through">
                      Rs. {productPrice.toFixed(2)}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-cyan-600">
                      Rs. {discountedPrice.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    Rs. {productPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {getVariantDisplay(activeVariant)}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, -1);
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-cyan-700 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-3 py-1 border-x border-gray-300 min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, 1);
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-cyan-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Button
                className={`w-full sm:w-auto ${!isInStock
                  ? "bg-red-500 text-white-500 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                {!isInStock ? t.common.soldOut : t.common.addToCart}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const ProbioticsProducts = () => {
  const t = useTranslation();
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    features: [] as string[],
    special: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSellingIds, setTopSellingIds] = useState<string[]>([]);
  const [topDealIds, setTopDealIds] = useState<string[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const { getCartCount } = useCart();

  // State for product quantities
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // Get location for URL parameters
  const location = useLocation();

  const productsPerPage = 12;

  // Parse URL parameters on component mount and URL changes
  useEffect(() => {
    // Parse search query from URL
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
    }

    // Handle highlighting a specific product
    const highlightId = urlParams.get('highlight');
    if (highlightId) {
      // Find and highlight the product
      const productToHighlight = products.find(p => p.id === highlightId);
      if (productToHighlight) {
        setSelectedProduct(productToHighlight);
      }
    }
  }, [location.search, products]);

  // Fetch probiotics products from Supabase - CORRECTED QUERY
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

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
              title
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

        // Filter data on the frontend
        const probioticsProducts = (data || [])
          .map(product => ({
            ...product,
            // Handle collections as single object (take first if array)
            collections: Array.isArray(product.collections) ? product.collections[0] : product.collections,
            // Filter out inactive variants
            product_variants: product.product_variants?.filter(
              (v: ProductVariant) => v.is_active === true
            ) || []
          }))
          .filter(product => {
            // Only include products with active variants
            if (product.product_variants.length === 0) return false;

            // Filter for probiotics
            const collectionName = product.collections?.title?.toLowerCase() || '';
            const productName = product.name.toLowerCase();
            const productDescription = product.description?.toLowerCase() || '';

            return collectionName.includes('probiotic') ||
              productName.includes('probiotic') ||
              productDescription.includes('probiotic') ||
              productName.includes('modiphy') ||
              productName.includes('e-vac') ||
              productName.includes('virban') ||
              productName.includes('kipper') ||
              productName.includes('v-vacc') ||
              productName.includes('dawn') ||
              productName.includes('regalis');
          });

        setProducts(probioticsProducts);

        // Initialize quantities for all products
        const initialQuantities: { [key: string]: number } = {};
        probioticsProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load probiotics products");
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

  // Apply filters and sorting with enhanced search
  const filteredAndSortedProducts = products
    .filter(product => {
      // Enhanced search filter - search in name, description, and variant titles
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);

        // Check if any variant title matches the search
        const variantMatch = product.product_variants?.some(variant =>
          variant.title?.toLowerCase().includes(query)
        ) || false;

        if (!nameMatch && !descMatch && !variantMatch) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const inStockFilter = filters.availability.includes('in-stock');
        const outOfStockFilter = filters.availability.includes('out-of-stock');

        if (inStockFilter && outOfStockFilter) {
          // Show both
        } else if (inStockFilter && !isProductInStock(product)) {
          return false;
        } else if (outOfStockFilter && isProductInStock(product)) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRanges.length > 0) {
        const productPrice = getProductPrice(product);
        const matchesPriceRange = filters.priceRanges.some(rangeId => {
          const range = priceRanges.find(r => r.id === rangeId);
          if (!range) return false;
          return productPrice >= range.min && productPrice <= range.max;
        });
        if (!matchesPriceRange) return false;
      }

      // Features filter
      if (filters.features.length > 0) {
        const variant = getDefaultVariant(product);
        if (!variant) return false;

        const variantType = variant.variant_type;
        const unit = variant.unit;
        const name = product.name.toLowerCase();

        const matchesFeature = filters.features.some(featureId => {
          switch (featureId) {
            case 'powder':
              return variantType === 'weight' && unit === 'g' || name.includes('powder');
            case 'liquid':
              return variantType === 'volume' && unit === 'ml' || name.includes('liquid');
            case 'granular':
              return variantType === 'weight' && unit === 'g' || name.includes('granular');
            case 'water':
              return name.includes('water') || product.description.toLowerCase().includes('water treatment');
            case 'disease':
              return name.includes('disease') || product.description.toLowerCase().includes('disease');
            case 'growth':
              return name.includes('growth') || product.description.toLowerCase().includes('growth promoter');
            default:
              return false;
          }
        });

        if (!matchesFeature) return false;
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
    })
    .sort((a, b) => {
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
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, searchQuery]);

  // Handle quantity change for a product
  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  if (loading) {
    return (
      // <Layout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
      /* </Layout> */
    );
  }

  return (
    // <Layout>
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-800 to-cyan-800 text-white py-4 md:py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-4">{t.pages.probiotics}</h1>
          <p className="text-cyan-100 text-xs md:text-base max-w-2xl mx-auto">
            {t.pages.probioticsDesc}
          </p>
        </div>
      </div>

      {/* Search Results Indicator */}
      {searchQuery && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-white rounded-xl border border-cyan-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Search Results</h3>
                <p className="text-gray-600 text-sm">
                  Showing {filteredAndSortedProducts.length} results for "{searchQuery}" in Probiotics
                </p>
              </div>
              <Button
                variant="outline"
                className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                onClick={() => {
                  setSearchQuery('');
                  // Clear the URL parameter
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear Search
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="lg:w-1/4 hidden lg:block">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl border border-cyan-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <Badge variant="secondary" className="bg-cyan-100 text-cyan-800">
                    {filteredAndSortedProducts.filter(p => isProductInStock(p)).length} in stock
                  </Badge>
                </div>
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Results Header */}
            <div className="sticky top-[108px] z-20 bg-white rounded-xl border border-cyan-200 p-4 mb-4 shadow-sm lg:static lg:p-6 lg:mb-8">
              <div>
                <div>
                  <p className="text-sm text-gray-600">
                    {totalProducts} {t.pages.productsFound}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">{t.pages.allProbiotics}</h2>
                </div>

                <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                  <Button
                    onClick={() => setMobileFiltersOpen(true)}
                    variant="outline"
                    className="h-10 px-3 border-cyan-200 text-cyan-700 hover:bg-cyan-50 lg:hidden"
                  >
                    <Sliders className="w-4 h-4 mr-1.5" />
                    Filter
                  </Button>

                  {/* Sort By */}
                  <div className="relative w-full">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 appearance-none bg-white border border-cyan-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 w-full"
                    >
                      <option value="name-asc">A-Z</option>
                      <option value="name-desc">a-z</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  {/* View Toggle */}
                  <div className="flex items-center border border-cyan-200 rounded-lg overflow-hidden h-10">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`w-10 h-10 text-center ${viewMode === "grid" ? "bg-cyan-50 text-cyan-700" : "text-gray-500"
                        }`}
                    >
                      <Grid className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`w-10 h-10 text-center ${viewMode === "list" ? "bg-cyan-50 text-cyan-700" : "text-gray-500"
                        }`}
                    >
                      <List className="w-5 h-5 inline" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

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
                      quantity={quantities[product.id] || 1}
                      onQuantityChange={handleQuantityChange}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  ) : (
                    <ListViewItem
                      key={product.id}
                      product={product}
                      onClick={() => setSelectedProduct(product)}
                      quantity={quantities[product.id] || 1}
                      onQuantityChange={handleQuantityChange}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      {products.length === 0
                        ? "No probiotics products found in database. Please add some products with 'probiotic' in the name or description."
                        : "No probiotics found matching your criteria."}
                    </p>
                    {products.length === 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500">Try adding products with names like:</p>
                        <ul className="text-sm text-gray-500 list-disc list-inside">
                          <li>Modiphy</li>
                          <li>E-Vac</li>
                          <li>Virban</li>
                          <li>Kipper</li>
                          <li>Or add 'Probiotics' to the collection title</li>
                        </ul>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="border-cyan-200 text-cyan-700 hover:bg-cyan-50"
                        onClick={() => {
                          setFilters({ availability: [], priceRanges: [], features: [], special: [] });
                          setSearchQuery('');
                        }}
                      >
                        Clear Filters
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
                  className="border-cyan-200"
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
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "border-cyan-200"
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
                  className="border-cyan-200"
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
                  <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                <Button
                  className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700"
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
            className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-cyan-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-shadow"
          >
            <ShoppingCart className="w-8 h-8" />
          </Link>
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold animate-pulse">
              {getCartCount()}
            </span>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-cyan-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our Probiotics?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Scientifically Formulated</h3>
              <p className="text-gray-600">Developed by aquaculture experts for maximum efficacy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Natural</h3>
              <p className="text-gray-600">100% natural ingredients, safe for all aquatic species</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Next-day delivery available across India</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    /* </Layout> */
  );
};
