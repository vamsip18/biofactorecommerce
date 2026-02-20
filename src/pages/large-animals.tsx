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
  collections: Collection | null;
  product_variants: ProductVariant[];
};

// Sort options
const sortOptions = [
  { value: "name-asc", label: "Alphabetically, A-Z" },
  { value: "name-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "in-stock", label: "In Stock First" }
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
  return product.collections?.title || "Uncategorized";
};

const isProductInStock = (product: Product) => {
  const variant = getDefaultVariant(product);
  return variant?.stock > 0;
};

const getProductImage = (product: Product) => {
  const variant = getDefaultVariant(product);
  return variant?.image_url || "/placeholder.jpg";
};

const getProductPrice = (product: Product) => {
  const variant = getDefaultVariant(product);
  return variant?.price || 0;
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
            placeholder={t.common.search}
            className="pl-10 border-amber-200 focus:border-amber-400"
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
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
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
                className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
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
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
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
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
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
          className="w-full border-amber-200 text-amber-700 hover:bg-amber-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [], special: [] });
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
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const t = useTranslation();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const productCategory = getProductCategory(product);
  const isInStock = variant.stock > 0;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const displayName = `${product.name} ${getVariantDisplay(variant)}`.trim();

    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: displayName,
      price: variant.price,
      image: variant.image_url || "/placeholder.jpg",
      category: productCategory,
      stock: variant.stock,
      quantity: quantity
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative flex-1">
        {/* Product Image */}
        <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-amber-50 to-white">
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
        <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="hidden sm:block text-sm text-gray-500 line-clamp-1">{product.description}</p>

          <div className="hidden sm:flex items-center text-sm text-gray-500">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Large Animals</span>
          </div>

          <div className="mt-1 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <div className="text-lg font-bold text-amber-600">
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

            <div className={`${!isInStock ? 'hidden' : 'flex flex-col sm:flex-row'} gap-1 sm:gap-2 min-w-0`}>
              <div className="flex items-center border border-gray-300 rounded-lg text-xs shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, -1);
                  }}
                  className="px-1 py-0.5 text-gray-600 hover:text-amber-700 hover:bg-gray-50"
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
                  className="px-1 py-0.5 text-gray-600 hover:text-amber-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button
                size="sm"
                className={`flex-1 min-w-0 px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs leading-none ${!isInStock
                  ? "bg-red-500 text-white-500 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
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
  const t = useTranslation();
  const navigate = useNavigate();

  // Auto-select first variant when modal opens
  useEffect(() => {
    if (product?.product_variants?.length) {
      setSelectedVariant(product.product_variants[0]);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;
  if (!selectedVariant) return null;

  const handleAddToCart = () => {
    const displayName = `${product.name} ${getVariantDisplay(selectedVariant)}`.trim();

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      name: displayName,
      price: selectedVariant.price,
      image: selectedVariant.image_url || "/placeholder.jpg",
      category: getProductCategory(product),
      stock: selectedVariant.stock,
      quantity: quantity
    });
    onClose();
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
      }).catch(err => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  // Get image for selected variant or use default
  const getSelectedVariantImage = () => {
    return selectedVariant.image_url || "/placeholder.jpg";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Package className="w-4 h-4" />
              <span className="text-sm text-gray-600">Category: Large Animals</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-white">
              <img
                src={getSelectedVariantImage()}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {selectedVariant.stock === 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                  Sold Out
                </Badge>
              )}
            </div>

            {/* Share Button */}
            <Button variant="outline" className="w-full border-amber-200 hidden sm:block" onClick={handleShare}>
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
                    <span className="text-2xl sm:text-3xl font-bold text-amber-600">
                      Rs. {getDiscountedPrice(selectedVariant.price, activeDiscounts, product).toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Rs. {selectedVariant.price.toFixed(2)}
                </div>
              )}
              <p className="text-sm text-gray-500 mt-1">
                Shipping calculated at checkout.
              </p>
            </div>

            {/* Variant Selection */}
            {product.product_variants && product.product_variants.length > 1 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Options</h3>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((variantItem) => (
                    <button
                      key={variantItem.id}
                      onClick={() => setSelectedVariant(variantItem)}
                      className={`px-4 py-2 rounded-lg border text-sm ${selectedVariant.id === variantItem.id
                        ? "border-amber-600 bg-amber-50 text-amber-700"
                        : "border-gray-300 hover:border-amber-300"
                        }`}
                    >
                      {getVariantDisplay(variantItem)} - Rs. {variantItem.price}
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
                    className="p-2 rounded-full border border-gray-300 hover:border-amber-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:border-amber-300"
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
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white h-12 text-lg"
                onClick={handleAddToCart}
                disabled={selectedVariant.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t.common.addToCart}
              </Button>
              <Button
                className="flex-1 border-amber-600 text-amber-600 hover:bg-amber-50 h-12 text-lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={selectedVariant.stock === 0}
              >
                {t.common.buyNow}
              </Button>
            </div>

            {/* Product Details */}
            <div className="pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
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
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const t = useTranslation();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
  const isInStock = variant.stock > 0;
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    const displayName = `${product.name} ${getVariantDisplay(variant)}`.trim();

    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: displayName,
      price: variant.price,
      image: variant.image_url || "/placeholder.jpg",
      category: getProductCategory(product),
      stock: variant.stock,
      quantity: quantity
    });
  };

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-amber-300 p-4 md:p-6 cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">{product.name}</h3>
              {badgeItems.map((badge, index) => (
                <Badge key={`${product.id}-badge-${index}`} className={badge.className}>
                  {badge.label}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
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
                    <div className="text-xl md:text-2xl font-bold text-amber-600">
                      Rs. {discountedPrice.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    Rs. {productPrice.toFixed(2)}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  Category: Large Animals
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, -1);
                  }}
                  className="px-3 py-1 text-gray-600 hover:text-amber-700 hover:bg-gray-50"
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
                  className="px-3 py-1 text-gray-600 hover:text-amber-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <Button
                className={`w-full sm:w-auto ${!isInStock
                  ? "bg-red-500 text-white-500 cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700"
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

export const LargeAnimalsProducts = () => {
  const t = useTranslation();
  const [sortBy, setSortBy] = useState("name-asc");
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

  // Fetch products from Supabase
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
              is_active
            )
          `)
          .eq("is_active", true)
          .eq("product_variants.is_active", true);

        if (error) throw error;

        // Filter products to only show "Large Animal" collection
        const largeAnimalProducts = (data || []).filter(product =>
          product.collections?.title === "Large Animals"
        );

        console.log("Large Animal products:", largeAnimalProducts);
        setProducts(largeAnimalProducts);

        // Initialize quantities for all products
        const initialQuantities: { [key: string]: number } = {};
        largeAnimalProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Fetch error:", err);
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

  // Apply filters and sorting
  const filteredAndSortedProducts = products
    .filter(product => {
      // Search filter - search in name and description
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = product.name.toLowerCase().includes(query);
        const descMatch = product.description.toLowerCase().includes(query);
        if (!nameMatch && !descMatch) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const inStockFilter = filters.availability.includes('in-stock');
        const outOfStockFilter = filters.availability.includes('out-of-stock');
        const variant = getDefaultVariant(product);
        const isInStock = variant?.stock > 0;

        if (inStockFilter && outOfStockFilter) {
          // Show both - no filtering needed
        } else if (inStockFilter && !isInStock) {
          return false;
        } else if (outOfStockFilter && isInStock) {
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
        case "in-stock":
          const variantA = getDefaultVariant(a);
          const variantB = getDefaultVariant(b);
          const stockA = variantA?.stock || 0;
          const stockB = variantB?.stock || 0;
          return stockB - stockA;
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
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Large Animal products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900 to-amber-900 text-white py-4 md:py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t.pages.largeAnimalProducts}</h1>
            <p className="text-xs md:text-base text-amber-100">
              {t.pages.largeAnimalDesc}
            </p>
          </div>
        </div>

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="container mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg border border-amber-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.pages.allLargeAnimals}</h3>
                  <p className="text-gray-600 text-sm">
                    {filteredAndSortedProducts.length} {t.pages.productsFound}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="border-amber-200 text-amber-700 hover:bg-amber-50"
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
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filters
                    </h2>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {filteredAndSortedProducts.filter(p => getDefaultVariant(p)?.stock || 0 > 0).length} in stock
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
              <div className="sticky top-[70px] z-20 bg-white rounded-lg border border-gray-200 p-3 mb-4 lg:static lg:p-4 lg:mb-6">
                <div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">{t.pages.allLargeAnimals}</h2>
                  </div>

                  <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                    <Button
                      onClick={() => setMobileFiltersOpen(true)}
                      variant="outline"
                      className="h-10 px-3 border-amber-200 text-amber-700 lg:hidden"
                    >
                      <Sliders className="w-4 h-4 mr-1.5" />
                      Filter
                    </Button>

                    {/* Sort By */}
                    <div className="relative w-full">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 appearance-none bg-white border border-amber-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 w-full"
                      >
                        <option value="name-asc">A-Z</option>
                        <option value="name-desc">a-z</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-amber-200 rounded-lg overflow-hidden h-10">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`w-10 h-10 text-center ${viewMode === "grid" ? "bg-amber-50 text-amber-700" : "text-gray-500"
                          }`}
                      >
                        <Grid className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`w-10 h-10 text-center ${viewMode === "list" ? "bg-amber-50 text-amber-700" : "text-gray-500"
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
                    <p className="text-gray-500 text-lg">No Large Animal products found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-amber-200 text-amber-700"
                      onClick={() => {
                        setFilters({ availability: [], priceRanges: [], special: [] });
                        setSearchQuery('');
                      }}
                    >
                      Clear Filters
                    </Button>
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
                    className="border-amber-200"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show only first, last, and pages around current
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
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "border-amber-200"
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
                    className="border-amber-200"
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
                    className="w-full mt-6 bg-amber-600 hover:bg-amber-700"
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
              className="w-16 h-16 bg-amber-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-amber-700 transition-colors"
            >
              <ShoppingCart className="w-8 h-8" />
            </Link>
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {getCartCount()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};