import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from '@/contexts/LanguageContext';
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Share2,
  X,
  CheckCircle,
  Minus,
  Plus,
  Filter,
  Star,
  Truck,
  Shield,
  Leaf,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Search,
  Clock,
  Package,
  Sliders,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Check
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";

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

const priceRanges = [
  { id: "range1", min: 0, max: 500, label: "Under Rs. 500" },
  { id: "range2", min: 500, max: 1000, label: "Rs. 500 - Rs. 1000" },
  { id: "range3", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
  { id: "range4", min: 2000, max: 5000, label: "Rs. 2000 - Rs. 5000" },
  { id: "range5", min: 5000, max: Infinity, label: "Over Rs. 5000" }
];

const KitchenGardening = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('nameAsc');
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    special: [] as string[]
  });
  const [topSellingIds, setTopSellingIds] = useState<string[]>([]);
  const [topDealIds, setTopDealIds] = useState<string[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Use the real CartContext
  const { addToCart, getCartCount } = useCart();

  // Get location for URL parameters
  const location = useLocation();

  const highlightIdRef = useRef<string | null>(null);
  const hasAppliedHighlightRef = useRef(false);

  // Parse URL parameters on component mount and URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('q') || '';
    setSearchQuery(query);

    const highlightId = urlParams.get('highlight');
    highlightIdRef.current = highlightId;
    if (!highlightId) {
      hasAppliedHighlightRef.current = false;
    }
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;

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

        const kitchenGardeningProducts = (data || []).filter(product =>
          product.collections?.title === "Kitchen Gardening"
        );

        let nextTopSellingIds: string[] = [];
        let nextTopDealIds: string[] = [];

        if (kitchenGardeningProducts.length > 0) {
          const productIds = kitchenGardeningProducts.map(product => product.id);

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

            nextTopSellingIds = [...totals.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([id]) => id);
          } catch (metaError) {
            console.error("Error loading top selling products:", metaError);
            nextTopSellingIds = [];
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

            kitchenGardeningProducts.forEach((product) => {
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

            nextTopDealIds = [...dealIds];
          } catch (metaError) {
            console.error("Error loading active discounts:", metaError);
            nextTopDealIds = [];
          }
        }

        if (!isMounted) return;

        setProducts(kitchenGardeningProducts);
        setTopSellingIds(nextTopSellingIds);
        setTopDealIds(nextTopDealIds);

        const highlightId = highlightIdRef.current;
        if (highlightId && !hasAppliedHighlightRef.current) {
          const productToHighlight = kitchenGardeningProducts.find(p => p.id === highlightId);
          if (productToHighlight) {
            hasAppliedHighlightRef.current = true;
            handleProductClick(productToHighlight);
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper function to get default variant
  const getDefaultVariant = (product: Product) => {
    return product.product_variants?.[0];
  };

  // Helper function to get category from collections
  const getProductCategory = (product: Product) => {
    return product.collections?.title || "Uncategorized";
  };

  // Helper function to check if product is in stock
  const isProductInStock = (product: Product) => {
    const variant = getDefaultVariant(product);
    return variant?.stock > 0;
  };

  // Helper function to get product image
  const getProductImage = (product: Product) => {
    const variant = getDefaultVariant(product);
    return variant?.image_url || "/placeholder.jpg";
  };

  // Helper function to get product price
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

  // Helper function to get variant display name
  const getVariantDisplay = (variant: ProductVariant) => {
    return `${variant.value || ''}${variant.unit || ''}`.trim();
  };

  // Get image for selected variant or use default
  const getSelectedVariantImage = () => {
    if (selectedVariant?.image_url) {
      return selectedVariant.image_url;
    }
    return getProductImage(selectedProduct!);
  };

  const productsPerPage = 12;

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const variant = getDefaultVariant(product);
    if (!variant) return false;

    if (filters.availability.length > 0) {
      const inStockFilter = filters.availability.includes('in-stock');
      const outOfStockFilter = filters.availability.includes('out-of-stock');
      const isInStock = variant.stock > 0;

      if (inStockFilter && outOfStockFilter) {
        // Show both
      } else if (inStockFilter && !isInStock) {
        return false;
      } else if (outOfStockFilter && isInStock) {
        return false;
      }
    }

    if (filters.priceRanges.length > 0) {
      const productPrice = variant.price;
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

    // Search filtering
    const searchMatch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const variantA = getDefaultVariant(a);
    const variantB = getDefaultVariant(b);
    const priceA = variantA?.price || 0;
    const priceB = variantB?.price || 0;

    switch (sortBy) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'priceLowHigh':
        return priceA - priceB;
      case 'priceHighLow':
        return priceB - priceA;
      case 'rating':
        return 0;
      default: // bestSelling
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
  }, [filters, searchQuery]);

  const handleProductClick = (product: Product) => {
    const variant = getDefaultVariant(product);
    if (!variant) return;

    setSelectedProduct(product);
    setSelectedVariant(variant);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = (
    product: Product,
    e?: React.MouseEvent,
    qty?: number
  ) => {
    if (e) e.stopPropagation();

    const variant = getDefaultVariant(product);
    if (!variant) {
      alert("This product variant is not available");
      return;
    }

    const displayName = `${product.name} ${getVariantDisplay(variant)}`.trim();

    addToCart({
      productId: product.id,
      variantId: variant.id,
      name: displayName,
      price: variant.price,
      image: variant.image_url || "/placeholder.jpg",
      category: getProductCategory(product),
      stock: variant.stock,
      quantity: qty ?? quantities[product.id] ?? 1
    });

    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleModalAddToCart = () => {
    if (!selectedProduct || !selectedVariant) return;

    const displayName = `${selectedProduct.name} ${getVariantDisplay(selectedVariant)}`.trim();

    addToCart({
      productId: selectedProduct.id,
      variantId: selectedVariant.id,
      name: displayName,
      price: selectedVariant.price,
      image: selectedVariant.image_url || "/placeholder.jpg",
      category: getProductCategory(selectedProduct),
      stock: selectedVariant.stock,
      quantity: quantity
    });
    closeModal();
  };

  const handleBuyNow = () => {
    handleModalAddToCart();
    navigate("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct?.name,
        text: `Check out ${selectedProduct?.name} - ${selectedProduct?.description}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : 'fill-gray-300 text-gray-300'
              }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Filter Section Component
  const FilterSection = () => {
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
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 border border-lime-200 rounded-lg focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
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
                  className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
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
                  className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
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
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
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
                    className="w-4 h-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(filters.priceRanges.length > 0 || filters.availability.length > 0 || filters.special.length > 0 || searchQuery) && (
          <button
            onClick={() => {
              setFilters({ availability: [], priceRanges: [], special: [] });
              setSearchQuery('');
              // Clear the URL parameter
              window.history.replaceState({}, document.title, window.location.pathname);
            }}
            className="w-full py-2 px-4 border border-lime-200 text-lime-700 rounded-lg font-medium hover:bg-lime-50 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            {t.common.clearFilters}
          </button>
        )}
      </div>
    );
  };

  // Product Card Component - Grid View
  const ProductCard = ({ product, activeDiscounts }: { product: Product; activeDiscounts: any[] }) => {
    const variant = getDefaultVariant(product);
    if (!variant) return null;

    const productImage = getProductImage(product);
    const productPrice = getProductPrice(product);
    const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
    const productCategory = getProductCategory(product);
    const isInStock = variant.stock > 0;
    const isTopSelling = topSellingIds.includes(product.id);
    const isTopDeal = topDealIds.includes(product.id);
    const badgeItems = [
      !isInStock
        ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopSelling
        ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null
    ]
      .filter((badge): badge is { label: string; className: string } => Boolean(badge))
      .slice(0, 1);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group bg-white rounded-lg border border-gray-200 hover:border-lime-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
        onClick={() => handleProductClick(product)}
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
                <span key={`${product.id}-badge-${index}`} className={badge.className}>
                  {badge.label}
                </span>
              ))}
            </div>

            {/* Wishlist Button */}
            {/* <button
              className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                alert("Added to wishlist");
              }}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button> */}
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-lime-700 transition-colors line-clamp-2">
              {product.name}
            </h3>

            <p className="hidden sm:block text-sm text-gray-500 line-clamp-1">{product.description}</p>

            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <Package className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">Kitchen Gardening</span>
            </div>

            <div className="mt-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-bold text-lime-600">
                    {(isTopDeal ? discountedPrice : productPrice).toFixed(2)}
                  </div>
                  {isTopDeal && (
                    <div className="text-sm text-gray-500 line-through">
                      {productPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${!isInStock ? 'hidden' : 'flex flex-col sm:flex-row'} gap-1 sm:gap-2 min-w-0`}>
                <div className="flex items-center border border-gray-300 rounded-lg text-xs shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, -1);
                    }}
                    className="px-1 py-0.5 text-gray-600 hover:text-lime-700 hover:bg-gray-50"
                    disabled={(quantities[product.id] || 1) <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-1 py-0.5 border-x border-gray-300 min-w-6 text-center text-xs">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, 1);
                    }}
                    className="px-1 py-0.5 text-gray-600 hover:text-lime-700 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product, e);
                  }}
                  disabled={!isInStock}
                  className={`flex-1 min-w-0 w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-1 text-[11px] sm:text-xs leading-none ${!isInStock
                    ? 'bg-red-500 text-white-500 cursor-not-allowed'
                    : 'bg-lime-600 hover:bg-lime-700 text-white'
                    }`}
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // List View Item Component
  const ListViewItem = ({ product, activeDiscounts }: { product: Product; activeDiscounts: any[] }) => {
    const variant = getDefaultVariant(product);
    if (!variant) return null;

    const productImage = getProductImage(product);
    const productPrice = getProductPrice(product);
    const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
    const isInStock = variant.stock > 0;
    const isTopSelling = topSellingIds.includes(product.id);
    const isTopDeal = topDealIds.includes(product.id);
    const badgeItems = [
      !isInStock
        ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopSelling
        ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null
    ]
      .filter((badge): badge is { label: string; className: string } => Boolean(badge))
      .slice(0, 1);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 hover:border-lime-300 p-4 md:p-6 cursor-pointer"
        onClick={() => handleProductClick(product)}
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
                    <span key={`${product.id}-badge-${index}`} className={badge.className}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Package className="w-4 h-4 mr-1" />
                  Kitchen Gardening
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
                      <div className="text-xl md:text-2xl font-bold text-lime-600">
                        Rs. {discountedPrice.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      Rs. {productPrice.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, -1);
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-lime-700 hover:bg-gray-50"
                    disabled={(quantities[product.id] || 1) <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300 min-w-8 text-center">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, 1);
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-lime-700 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product, e);
                  }}
                  disabled={!isInStock}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium ${!isInStock
                    ? 'bg-red-500 text-white-500 cursor-not-allowed'
                    : 'bg-lime-600 hover:bg-lime-700 text-white'
                    }`}
                >
                  {!isInStock ? t.common.soldOut : t.common.addToCart}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Kitchen Gardening products...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-lime-900 to-lime-900 text-white py-4 md:py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t.pages.kitchenGardening}</h1>
            <p className="text-xs md:text-base text-lime-100">
              {t.pages.kitchenDesc}
            </p>
          </div>
        </div>

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="container mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg border border-lime-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Search Results</h3>
                  <p className="text-gray-600 text-sm">
                    Showing {filteredProducts.length} results for "{searchQuery}" in Kitchen Gardening
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    // Clear the URL parameter
                    window.history.replaceState({}, document.title, window.location.pathname);
                  }}
                  className="px-4 py-2 border border-lime-200 text-lime-700 rounded-lg font-medium hover:bg-lime-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear Search
                </button>
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
                    <span className="bg-lime-100 text-lime-800 text-sm font-medium px-3 py-1 rounded-full">
                      {filteredProducts.length} products
                    </span>
                  </div>
                  <FilterSection
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
                      {totalProducts} {t.pages.productsFound}
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">{t.pages.allKitchenGardening}</h2>
                  </div>

                  <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                    <button
                      onClick={() => setShowFilters(true)}
                      className="h-10 px-3 border border-lime-200 text-lime-700 rounded-lg text-sm font-medium hover:bg-lime-50 transition-colors inline-flex items-center justify-center whitespace-nowrap lg:hidden"
                    >
                      <Sliders className="w-4 h-4 mr-1.5" />
                      Filter
                    </button>

                    {/* Sort By */}
                    <div className="relative w-full">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="h-10 appearance-none bg-white border border-lime-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-lime-400 focus:outline-none focus:ring-1 focus:ring-lime-400 w-full"
                      >
                        <option value="nameAsc">A-Z</option>
                        <option value="nameDesc">a-z</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-lime-200 rounded-lg overflow-hidden h-10">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`w-10 h-10 text-center ${viewMode === "grid" ? "bg-lime-50 text-lime-700" : "text-gray-500"
                          }`}
                      >
                        <Grid className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`w-10 h-10 text-center ${viewMode === "list" ? "bg-lime-50 text-lime-700" : "text-gray-500"
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
                    if (!product.product_variants || product.product_variants.length === 0) {
                      return null;
                    }

                    return viewMode === "grid" ? (
                      <ProductCard key={product.id} product={product} activeDiscounts={activeDiscounts} />
                    ) : (
                      <ListViewItem key={product.id} product={product} activeDiscounts={activeDiscounts} />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No Kitchen Gardening products found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setFilters({ availability: [], priceRanges: [], special: [] });
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 border border-lime-200 text-lime-700 rounded-lg font-medium hover:bg-lime-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="px-4 py-2 border border-lime-200 text-lime-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-50"
                  >
                    <ChevronLeft className="w-4 h-4 inline mr-1" />
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                          ? "bg-lime-600 text-white hover:bg-lime-700"
                          : "border border-lime-200 text-lime-700 hover:bg-lime-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="px-4 py-2 border border-lime-200 text-lime-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-lime-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 inline ml-1" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50"
                onClick={() => setShowFilters(false)}
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
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSection
                  />
                  <button
                    className="w-full mt-6 py-3 bg-lime-600 text-white rounded-lg font-medium hover:bg-lime-700"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeModal}
              />

              {/* Modal Content */}
              <div className="relative min-h-screen flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative bg-white rounded-2xl shadow-2xl max-w-2xl lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                >
                  <div className="p-6">
                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                    >
                      <X className="w-8 h-8" />
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                      {/* Product Images */}
                      <div>
                        <div className="rounded-xl overflow-hidden mb-4 relative">
                          <AnimatePresence mode="wait">
                            <motion.img
                              key={selectedVariant?.id || getProductImage(selectedProduct!)}
                              src={getSelectedVariantImage()}
                              alt={selectedProduct.name}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="w-full h-64 sm:h-96 object-cover"
                            />
                          </AnimatePresence>
                          {selectedVariant?.stock === 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold">
                              Sold Out
                            </div>
                          )}
                        </div>

                        {/* Variant Thumbnails */}
                        {selectedProduct.product_variants.length > 1 && (
                          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {selectedProduct.product_variants.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${selectedVariant?.id === variant.id
                                  ? "border-lime-600"
                                  : "border-gray-200 hover:border-lime-400"
                                  }`}
                              >
                                <img
                                  src={variant.image_url || "/placeholder.jpg"}
                                  alt={variant.title}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Gardening Icon */}
                        <div className="flex items-center justify-center gap-2 text-lime-600 mt-4">
                          <Leaf className="w-6 h-6" />
                          <span className="text-lg font-semibold">Kitchen Gardening Product</span>
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-4 sm:space-y-6">
                        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                          {selectedProduct.name}
                        </h2>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-center gap-3">
                            {topDealIds.includes(selectedProduct.id) && selectedVariant ? (
                              <>
                                <div className="flex flex-col gap-1">
                                  <span className="text-lg text-gray-500 line-through">
                                    Rs. {selectedVariant.price.toFixed(2)}
                                  </span>
                                  <span className="text-2xl sm:text-3xl font-bold text-lime-600">
                                    Rs. {getDiscountedPrice(selectedVariant.price, activeDiscounts, selectedProduct).toFixed(2)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                                Rs. {selectedVariant ? selectedVariant.price.toFixed(2) : "0.00"}
                              </span>
                            )}
                          </div>
                          <p className={`font-semibold mt-1 ${selectedVariant?.stock && selectedVariant.stock > 0 ? 'text-lime-600' : 'text-red-600'
                            }`}>
                            {selectedVariant?.stock && selectedVariant.stock > 0 ? 'In Stock' : 'Sold Out'}
                          </p>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-lime-50 rounded-xl p-4 mb-6">
                          <p className="text-gray-600">
                            <Truck className="inline w-5 h-5 mr-2" />
                            {selectedVariant && selectedVariant.price > 999 ? "Free shipping" : "Shipping calculated at checkout"}
                          </p>
                        </div>

                        {/* Variant Selection */}
                        {selectedProduct.product_variants && selectedProduct.product_variants.length > 1 && (
                          <div className="mb-6">
                            <p className="font-semibold text-gray-900 mb-3">Options</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedProduct.product_variants.map((variant) => (
                                <button
                                  key={variant.id}
                                  onClick={() => setSelectedVariant(variant)}
                                  className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${selectedVariant?.id === variant.id
                                    ? "border-lime-600 bg-lime-50 text-lime-700"
                                    : "border-gray-300 hover:border-lime-300"
                                    }`}
                                >
                                  {variant.image_url && (
                                    <img
                                      src={variant.image_url}
                                      alt=""
                                      className="w-8 h-8 rounded object-cover"
                                    />
                                  )}
                                  <span>
                                    {getVariantDisplay(variant)} – Rs. {variant.price}
                                  </span>
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
                              className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Minus className="w-5 h-5" />
                            </button>
                            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                            <button
                              onClick={() => setQuantity(quantity + 1)}
                              className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            {selectedVariant && (
                              <span className="text-gray-600 ml-4">
                                Total: Rs. {(selectedVariant.price * quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                          <button
                            onClick={handleModalAddToCart}
                            className="py-4 bg-lime-600 text-white rounded-xl font-semibold hover:bg-lime-700 transition-colors flex items-center justify-center gap-2"
                            disabled={!selectedVariant || selectedVariant.stock === 0}
                          >
                            <ShoppingCart className="w-6 h-6" />
                            {!selectedVariant || selectedVariant.stock === 0 ? t.common.soldOut : t.common.addToCart}
                          </button>
                          <button
                            onClick={handleBuyNow}
                            className="py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                            disabled={!selectedVariant || selectedVariant.stock === 0}
                          >
                            {t.common.buyNow}
                          </button>
                        </div>

                        {/* Share Button */}
                        <button
                          onClick={handleShare}
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
                      <p className="text-gray-600 mb-8 text-lg">{selectedProduct.description}</p>
                    </div>

                    {/* Specifications */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-lime-50 p-6 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                          <p className="text-gray-600">Kitchen Gardening</p>
                        </div>
                        {selectedVariant && (
                          <div className="bg-lime-50 p-6 rounded-xl">
                            <h4 className="font-semibold text-gray-900 mb-2">Available Size</h4>
                            <p className="text-gray-600">
                              {getVariantDisplay(selectedVariant)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* You May Also Like */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products
                          .filter(p => p.id !== selectedProduct.id)
                          .slice(0, 3)
                          .map(product => {
                            const variant = getDefaultVariant(product);
                            if (!variant) return null;

                            return (
                              <motion.div
                                key={product.id}
                                whileHover={{ y: -5 }}
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => {
                                  closeModal();
                                  setTimeout(() => handleProductClick(product), 100);
                                }}
                              >
                                <div className="flex items-start gap-4">
                                  <img
                                    src={getProductImage(product)}
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-lg"
                                  />
                                  <div>
                                    <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                    <p className="text-gray-600 text-sm">Kitchen Gardening</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <span className="font-bold text-gray-900">
                                        Rs. {getProductPrice(product).toFixed(2)}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddToCart(product, e);
                                        }}
                                        className="px-4 py-1 bg-lime-600 text-white rounded-lg text-sm hover:bg-lime-700"
                                      >
                                        Add
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cart Count Indicator */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <Link
              to="/cart"
              className="w-16 h-16 bg-lime-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-lime-700 transition-colors"
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

export default KitchenGardening;