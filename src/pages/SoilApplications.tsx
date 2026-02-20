// src/pages/SoilApplications.tsx
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
  Shield,
  Sprout,
  Droplets,
  Leaf,
  Trees,
  CloudRain
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
  return product.collections?.title || "Soil Applications";
};

const isProductInStock = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.stock > 0;
};

const getProductImage = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.image_url || "/placeholder-soil.jpg";
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

// Determine soil type for product
const getSoilType = (product: Product) => {
  const name = product.name.toLowerCase();
  const desc = product.description?.toLowerCase() || '';

  if (name.includes('aadhar') || desc.includes('biofertilizer')) return 'biofertilizer';
  if (name.includes('g-vam') || desc.includes('mycorrhiza')) return 'mycorrhiza';
  if (name.includes('k factor') || desc.includes('bacterial')) return 'bacterial';
  if (name.includes('proceed') || desc.includes('conditioner')) return 'conditioner';
  if (name.includes('boc') || desc.includes('organic carbon')) return 'organic';
  return 'general';
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
    soilTypes: string[];
    special: string[];
  };
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    availability: true,
    soilTypes: true,
    special: true
  });

  const t = useTranslation();

  const soilTypeOptions = [
    { id: "biofertilizer", label: t.common.biofertilizers, icon: <Sprout className="w-4 h-4" /> },
    { id: "mycorrhiza", label: t.common.mycorrhiza, icon: <Trees className="w-4 h-4" /> },
    { id: "bacterial", label: t.common.bacterialInoculants, icon: <Leaf className="w-4 h-4" /> },
    { id: "conditioner", label: t.common.soilConditioners, icon: <CloudRain className="w-4 h-4" /> },
    { id: "organic", label: t.common.organicCarbon, icon: <Droplets className="w-4 h-4" /> }
  ];

  const specialOptions = [
    { id: "top-selling", label: t.common.topSelling },
    { id: "top-deals", label: t.common.topDeals }
  ];

  const toggleSection = (section: 'price' | 'availability' | 'soilTypes' | 'special') => {
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
            placeholder={t.common.search}
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
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.soilTypes.length > 0 || filters.special.length > 0 || searchQuery) && (
        <Button
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [], soilTypes: [], special: [] });
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
  const defaultVariant = getDefaultVariant(product);
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant!);
  const { addToCart } = useCart();

  const productImage = getProductImage(product, activeVariant);
  const productPrice = getProductPrice(product, activeVariant);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const productCategory = getProductCategory(product);
  const badgeItems = [
    !isProductInStock(product, activeVariant)
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
        image: activeVariant.image_url || "/placeholder-soil.jpg",
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

  const soilType = getSoilType(product);
  const soilTypeColors: Record<string, string> = {
    biofertilizer: 'bg-brown-500',
    mycorrhiza: 'bg-green-600',
    bacterial: 'bg-blue-500',
    conditioner: 'bg-amber-500',
    organic: 'bg-teal-500',
    general: 'bg-gray-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-brown-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-brown-50 to-green-50">
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
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-brown-600 scale-110" : "bg-gray-300 hover:bg-brown-400"
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
        <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-brown-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="hidden sm:block text-sm text-gray-500 line-clamp-1">{product.description}</p>

          <div className="hidden sm:flex items-center text-sm text-gray-500">
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
                {getVariantDisplay(activeVariant)}
              </div>
            </div>

            {!isInStock ? null : (
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 min-w-0">
                <div className="flex items-center border border-gray-300 rounded-lg text-xs shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuantityChange(product.id, -1);
                    }}
                    className="px-1 py-0.5 text-gray-600 hover:text-brown-700 hover:bg-gray-50"
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
                    className="px-1 py-0.5 text-gray-600 hover:text-brown-700 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <Button
                  size="sm"
                  className={`flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-none ${!isInStock
                    ? "bg-red-500 text-white-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
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
                      <span className="text-[11px] sm:text-xs whitespace-nowrap"><span className="sm:hidden">Add</span><span className="hidden sm:inline">Add to cart</span></span>
                    </>
                  )}
                </Button>
              </div>
            )}
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
        image: selectedVariant.image_url || "/placeholder-soil.jpg",
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

  const handleBuyNow = async () => {
    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        name: `${product.name} ${getVariantDisplay(selectedVariant)}`.trim(),
        price: selectedVariant.price,
        image: selectedVariant.image_url || "/placeholder-soil.jpg",
        category: getProductCategory(product),
        quantity: quantity,
        stock: selectedVariant.stock || 10
      });
      toast.success(`${product.name} added to cart!`);
      navigate("/cart");
    } catch (error) {
      console.error("Error with buy now:", error);
      toast.error("Failed to process order");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} - ${product.description}`,
        url: window.location.href
      }).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  // Get variant-specific image
  const variantImage = selectedVariant.image_url || "/placeholder-soil.jpg";

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
            <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-gradient-to-br from-brown-50 to-green-50">
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
                      ? "border-brown-600"
                      : "border-gray-200 hover:border-brown-300"
                      }`}
                  >
                    <img
                      src={variantItem.image_url || "/placeholder-soil.jpg"}
                      alt={getVariantDisplay(variantItem)}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Share Button */}
            <Button variant="outline" className="w-full border-brown-200 hidden sm:block" onClick={handleShare}>
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
                  <div className="text-lg text-gray-500 line-through">
                    Rs. {selectedVariant.price.toFixed(2)}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    Rs. {getDiscountedPrice(selectedVariant.price, activeDiscounts, product).toFixed(2)}
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
              <p className={`font-semibold mt-2 ${isProductInStock(product, selectedVariant) ? 'text-green-600' : 'text-red-600'
                }`}>
                {isProductInStock(product, selectedVariant) ? 'In Stock' : 'Sold Out'}
              </p>
            </div>

            {/* Shipping Info */}
            <div className="p-4 bg-brown-50 rounded-lg">
              <div className="flex items-start gap-3 mb-3">
                <Truck className="w-5 h-5 text-brown-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-brown-700">Free Shipping</p>
                  <p className="text-sm text-gray-600">
                    Free shipping on orders over ₹500
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-brown-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-brown-700">Quality Guarantee</p>
                  <p className="text-sm text-gray-600">
                    100% satisfaction guaranteed or your money back
                  </p>
                </div>
              </div>
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
                        ? "border-brown-600 bg-brown-50 text-brown-700"
                        : "border-gray-300 hover:border-brown-300"
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
                    className="p-2 rounded-full border border-gray-300 hover:border-brown-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:border-brown-300"
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
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-lg"
                onClick={handleAddToCart}
                disabled={!isProductInStock(product, selectedVariant)}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to cart
              </Button>
              <Button
                className="flex-1 border-brown-600 text-brown-600 hover:bg-brown-50 h-12 text-lg"
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
                  "Enhances soil structure and fertility",
                  "Improves nutrient availability and uptake",
                  "Promotes beneficial microbial activity",
                  "Increases water retention capacity",
                  "Sustainable and eco-friendly solution"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-brown-600 mt-0.5 flex-shrink-0" />
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
    !isProductInStock(product, activeVariant)
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
        image: activeVariant.image_url || "/placeholder-soil.jpg",
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
      className="bg-white rounded-lg border border-gray-200 hover:border-brown-300 p-4 md:p-6 cursor-pointer"
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
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-brown-600 scale-110" : "bg-gray-300 hover:bg-brown-400"
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
                  className="px-3 py-1 text-gray-600 hover:text-brown-700 hover:bg-gray-50"
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
                  className="px-3 py-1 text-gray-600 hover:text-brown-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {!isInStock ? null : (
              <div className="w-full sm:w-auto">
                <Button
                  className={`w-full sm:w-auto ${!isInStock
                    ? "bg-red-500 text-white-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  disabled={!isInStock}
                  onClick={handleAddToCart}
                >
                  {!isInStock ? t.common.soldOut : <><span className="sm:hidden">Add</span><span className="hidden sm:inline">{t.common.addToCart}</span></>}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SoilApplications = () => {
  const t = useTranslation();
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    soilTypes: [] as string[],
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

  // Fetch soil applications products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("Fetching soil applications products from Supabase...");

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

        console.log("Raw data from Supabase:", data);

        // Filter data on the frontend
        const soilApplicationsProducts = (data || [])
          .map((product: any) => ({
            ...product,
            // Normalize collections to single object or null
            collections: Array.isArray(product.collections) && product.collections.length > 0
              ? product.collections[0]
              : null,
            // Filter out inactive variants
            product_variants: product.product_variants?.filter(
              (v: ProductVariant) => v.is_active === true
            ) || []
          }))
          .filter((product: any) => {
            // Only include products with active variants
            if (product.product_variants.length === 0) return false;

            // Filter for soil applications products
            const collectionName = product.collections?.title?.toLowerCase() || '';
            const productName = product.name.toLowerCase();
            const productDescription = product.description?.toLowerCase() || '';

            return collectionName.includes('soil') ||
              productName.includes('soil') ||
              productDescription.includes('soil') ||
              productName.includes('aadhar') ||
              productName.includes('g-vam') ||
              productName.includes('biofertilizer') ||
              productName.includes('mycorrhiza') ||
              productName.includes('k factor') ||
              productName.includes('proceed') ||
              productName.includes('boc') ||
              productDescription.includes('biofertilizer') ||
              productDescription.includes('mycorrhiza') ||
              productDescription.includes('soil conditioner') ||
              productDescription.includes('organic carbon');
          }) as Product[];

        console.log("Filtered soil applications products:", soilApplicationsProducts);
        setProducts(soilApplicationsProducts);

        // Initialize quantities for all products
        const initialQuantities: { [key: string]: number } = {};
        soilApplicationsProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load soil applications products");
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

      // Soil types filter
      if (filters.soilTypes.length > 0) {
        const soilType = getSoilType(product);
        if (!filters.soilTypes.includes(soilType)) return false;
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
      const priceA = getProductPrice(a);
      const priceB = getProductPrice(b);

      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "created-desc":
          const dateA = new Date(a.created_at || 0).getTime();
          const dateB = new Date(b.created_at || 0).getTime();
          return dateB - dateA;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / productsPerPage);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t.common.loading}</p>
        </div>
      </div>
      // </Layout>
    );
  }

  return (
    // <Layout>
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-4 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t.pages.soilApplications}</h1>
          <p className="text-xs md:text-base text-green-100">
            {t.pages.soilDesc}
          </p>
        </div>
      </div>

      {/* Search Results Indicator */}
      {searchQuery && (
        <div className="container mx-auto px-4 pt-6">
          <div className="bg-white rounded-lg border border-green-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{t.common.searchResults}</h3>
                <p className="text-gray-600 text-sm">
                  {t.common.showing} {filteredAndSortedProducts.length} {t.common.resultsFor} "{searchQuery}" {t.nav.soilApplications.toLowerCase()}
                </p>
              </div>
              <Button
                variant="outline"
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  setSearchQuery('');
                  // Clear the URL parameter
                  window.history.replaceState({}, document.title, window.location.pathname);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                {t.common.clearSearch}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <FilterSection
                  filters={filters}
                  setFilters={setFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-9">
            {/* Products Header */}
            <div className="sticky top-[108px] z-20 bg-gray-50 mb-4 pb-2 lg:static lg:mb-6 lg:pb-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t.pages.allSoilApplications}
                </h2>
                <p className="text-gray-600 text-sm">
                  {filteredAndSortedProducts.length} {t.pages.productsFound}
                </p>
              </div>

              <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  variant="outline"
                  className="h-10 px-3 border-brown-200 text-brown-700 hover:bg-brown-50 lg:hidden"
                >
                  <Sliders className="w-4 h-4 mr-1.5" />
                  Filter
                  {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.soilTypes.length > 0) && (
                    <Badge className="ml-1.5 bg-brown-600 text-white">
                      {filters.priceRanges.length + filters.availability.length + filters.soilTypes.length + filters.special.length}
                    </Badge>
                  )}
                </Button>

                {/* Sort Dropdown */}
                <div className="w-full">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 pr-9 text-sm focus:border-brown-500 focus:ring-1 focus:ring-brown-500"
                    >
                      <option value="name-asc">A-Z</option>
                      <option value="name-desc">a-z</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg h-10 overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`w-10 h-10 text-center ${viewMode === "grid"
                      ? "bg-brown-50 text-brown-700"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`w-10 h-10 text-center ${viewMode === "list"
                      ? "bg-brown-50 text-brown-700"
                      : "text-gray-500 hover:text-gray-700"
                      }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => {
                    setFilters({ availability: [], priceRanges: [], soilTypes: [], special: [] });
                    setSearchQuery('');
                  }}
                  variant="outline"
                  className="border-brown-600 text-brown-600 hover:bg-brown-50"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 min-h-[420px] sm:min-h-0">
                    <AnimatePresence>
                      {currentProducts.map((product) => (
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
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <AnimatePresence>
                      {currentProducts.map((product) => (
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
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="border-gray-300 hover:border-brown-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={
                        currentPage === pageNum
                          ? "bg-brown-600 hover:bg-brown-700"
                          : "border-gray-300 hover:border-brown-300"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="border-gray-300 hover:border-brown-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Dialog */}
      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Filters</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ availability: [], priceRanges: [], soilTypes: [], special: [] });
                  setSearchQuery('');
                }}
              >
                Clear all
              </Button>
            </DialogTitle>
          </DialogHeader>
          <FilterSection
            filters={filters}
            setFilters={setFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        activeDiscounts={activeDiscounts}
        isTopDeal={selectedProduct ? topDealIds.includes(selectedProduct.id) : false}
      />
    </>
    /* </Layout> */
  );
};

export default SoilApplications;