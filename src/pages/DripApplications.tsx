// src/pages/DripApplications.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from '@/contexts/LanguageContext';
import {
  ShoppingCart, Filter, ChevronDown, X,
  Star, Truck, Shield, Check,
  Plus, Minus, Share2, Heart,
  Grid, List, Search, Clock,
  Package, Sliders, ArrowUpDown,
  ChevronLeft, ChevronRight, Droplets,
  Tag, BarChart3, TrendingUp, Leaf,
  Zap, Droplet, Thermometer, CloudRain,
  Wind, Sun, Moon, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
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
  collections: Collection | Collection[] | null;
  product_variants: ProductVariant[];
};

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
  if (!product.collections) return "Drip Applications";

  if (Array.isArray(product.collections)) {
    return product.collections[0]?.title || "Drip Applications";
  }

  return product.collections.title || "Drip Applications";
};

const isProductInStock = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.stock > 0;
};

const getProductImage = (product: Product, variant?: ProductVariant) => {
  const targetVariant = variant || getDefaultVariant(product);
  return targetVariant?.image_url || "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop";
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

  let collectionId: string | undefined;
  if (product.collections) {
    if (Array.isArray(product.collections)) {
      collectionId = product.collections[0]?.id;
    } else {
      collectionId = product.collections.id;
    }
  }
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

const renderStars = (rating: number) => {
  const defaultRating = rating || 4.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < Math.floor(defaultRating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-300 text-gray-300'
            }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({defaultRating})</span>
    </div>
  );
};

// Determine if product is new based on created_at
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
  return name.includes('iim chakra') || name.includes('proceed') || name.includes('boc') || name.includes('virnix');
};

// Get product features based on product name
const getProductFeatures = (product: Product) => {
  const name = product.name.toLowerCase();

  if (name.includes('chakra')) {
    return [
      "1.5x10⁸ bacteria per millilitre",
      "Collects nitrogen from air",
      "Dissolves phosphorus and potash",
      "Increases soil fertility",
      "25-30% higher yields"
    ];
  } else if (name.includes('proceed')) {
    return [
      "Improves nutrient uptake",
      "Enhances root development",
      "Increases stress tolerance",
      "Better water utilization",
      "Compatible with fertilizers"
    ];
  } else if (name.includes('boc')) {
    return [
      "Increases soil organic carbon",
      "Improves soil structure",
      "Enhances water retention",
      "Promotes microbial activity",
      "Sustainable alternative"
    ];
  } else if (name.includes('high-k')) {
    return [
      "High potassium content",
      "Improves fruit quality",
      "Enhances stress tolerance",
      "Better water regulation",
      "Quick absorption"
    ];
  } else if (name.includes('virnix')) {
    return [
      "Complete nutrition package",
      "Viral disease protection",
      "Systemic action",
      "Enhances plant immunity",
      "Compatible with drip systems"
    ];
  }

  // Default features
  return [
    "Efficient nutrient delivery",
    "Drip system compatible",
    "Easy to apply",
    "Improves crop health",
    "Increases yield"
  ];
};

// Get product specifications
const getProductSpecifications = (product: Product) => {
  const variant = getDefaultVariant(product);
  const name = product.name.toLowerCase();

  if (name.includes('chakra')) {
    return {
      dosage: "1-5 liters per acre through drip irrigation",
      applicationTiming: "First stage (within 10-15 days after sowing)",
      frequency: "1 time for short-term crops, 2 times for mid-term crops, 2-3 times for perennial crops",
      caution: "Apply 5 days before or after chemical fertilizers through drip irrigation"
    };
  } else if (name.includes('proceed')) {
    return {
      dosage: "500 ml per acre mixed with irrigation water",
      applicationTiming: "During critical growth stages",
      frequency: "Every 15-20 days during crop period"
    };
  } else if (name.includes('boc')) {
    return {
      dosage: "2-5 liters per acre through drip system",
      applicationTiming: "At planting and during growing season",
      frequency: "2-3 applications per season"
    };
  } else if (name.includes('high-k')) {
    return {
      dosage: "1 liter per acre through drip irrigation",
      applicationTiming: "During flowering and fruiting stages",
      frequency: "2-3 applications during critical stages"
    };
  } else if (name.includes('virnix')) {
    return {
      dosage: "750 ml per acre mixed with irrigation water",
      applicationTiming: "Preventive application and during stress periods",
      frequency: "Every 15 days during high-risk periods"
    };
  }

  return {
    dosage: "As per manufacturer's recommendation",
    applicationTiming: "During crop growth stages",
    frequency: "Regular applications as needed"
  };
};

// Get product sizes from variants
const getProductSizes = (product: Product) => {
  return product.product_variants
    ?.filter(variant => variant.is_active)
    .map(variant => getVariantDisplay(variant))
    .filter((size, index, self) => self.indexOf(size) === index) || [];
};

// Enhanced search function that searches multiple fields
const searchProducts = (products: Product[], query: string) => {
  if (!query.trim()) return products;

  const searchTerms = query.toLowerCase().trim().split(/\s+/);

  return products.filter(product => {
    // Search in multiple fields
    const searchableFields = [
      product.name.toLowerCase(),
      product.description.toLowerCase(),
      getProductCategory(product).toLowerCase(),
      ...getProductFeatures(product).map(f => f.toLowerCase()),
      ...Object.values(getProductSpecifications(product)).map(v => v.toLowerCase()),
      ...product.product_variants?.map(v =>
        `${v.title} ${getVariantDisplay(v)} ${v.sku}`
      ).join(' ').toLowerCase().split(' ') || []
    ].filter(Boolean);

    // Check if ALL search terms are found in any of the fields
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
          <input
            type="text"
            placeholder={t.nav.search}
            className="w-full pl-10 pr-3 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
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
        <button
          onClick={() => {
            setFilters({ availability: [], priceRanges: [], special: [] });
            setSearchQuery('');
          }}
          className="w-full py-2 px-4 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
        >
          <X className="w-4 h-4 mr-2" />
          {t.common.clearFilters}
        </button>
      )}
    </div>
  );
};

const DripApplications = () => {
  const t = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('nameAsc');
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    special: [] as string[]
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [topSellingIds, setTopSellingIds] = useState<string[]>([]);
  const [topDealIds, setTopDealIds] = useState<string[]>([]);
  const [activeDiscounts, setActiveDiscounts] = useState<any[]>([]);
  const { addToCart, getCartCount } = useCart();

  // State for quantity selectors in product cards
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});

  const productsPerPage = 12;

  // Fetch drip applications products and meta data from Supabase
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

        if (error) throw error;

        // Filter data on the frontend
        const dripProducts = (data || [])
          .map(product => ({
            ...product,
            product_variants: product.product_variants?.filter(
              (v: ProductVariant) => v.is_active === true
            ) || []
          }))
          .filter(product => {
            if (product.product_variants.length === 0) return false;

            let collectionName = '';
            if (product.collections) {
              if (Array.isArray(product.collections)) {
                collectionName = (product.collections[0] as Collection)?.title?.toLowerCase() || '';
              } else {
                collectionName = (product.collections as Collection)?.title?.toLowerCase() || '';
              }
            }
            const productName = product.name.toLowerCase();
            const productDescription = product.description?.toLowerCase() || '';

            // Filter for drip applications products
            return collectionName.includes('drip') ||
              productName.includes('drip') ||
              productDescription.includes('drip') ||
              productName.includes('chakra') ||
              productName.includes('iim chakra') ||
              productName.includes('proceed') ||
              productName.includes('boc') ||
              productName.includes('high-k') ||
              productName.includes('virnix') ||
              productDescription.includes('drip irrigation') ||
              productDescription.includes('irrigation system') ||
              productDescription.includes('drip application');
          });

        const initialQuantities: Record<string, number> = {};
        dripProducts.forEach(product => {
          initialQuantities[product.id] = 1;
        });

        let nextTopSellingIds: string[] = [];
        let nextTopDealIds: string[] = [];

        if (dripProducts.length > 0) {
          const productIds = dripProducts.map(product => product.id);

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

            if (isMounted) {
              setActiveDiscounts(activeDiscounts);
            }

            const appliesToAll = activeDiscounts.some((discount: { applies_to: string }) => discount.applies_to === "all");
            const dealIds = new Set<string>();

            dripProducts.forEach((product) => {
              if (appliesToAll) {
                dealIds.add(product.id);
                return;
              }

              let collectionId: string | undefined;
              if (product.collections) {
                if (Array.isArray(product.collections)) {
                  collectionId = product.collections[0]?.id;
                } else {
                  collectionId = product.collections.id;
                }
              }
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

        setProducts(dripProducts);
        setProductQuantities(initialQuantities);
        setTopSellingIds(nextTopSellingIds);
        setTopDealIds(nextTopDealIds);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Failed to load drip applications products");
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

  // Filter products based on selected filters
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

  // Sort products
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'priceLowHigh':
        return getProductPrice(a) - getProductPrice(b);
      case 'priceHighLow':
        return getProductPrice(b) - getProductPrice(a);
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'rating':
        // For now using default rating, you can add rating field to your database
        return 0;
      default: // bestSelling
        const aBestSeller = isProductBestSeller(a);
        const bBestSeller = isProductBestSeller(b);
        return (bBestSeller ? 1 : 0) - (aBestSeller ? 1 : 0);
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
  }, [filters, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    const defaultVariant = getDefaultVariant(product);
    setSelectedVariant(defaultVariant || null);
    setQuantity(1);
    const sizes = getProductSizes(product);
    setSelectedSize(sizes[0] || "");
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setSelectedVariant(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant, size?: string, qty?: number) => {
    const targetVariant = variant || getDefaultVariant(product);
    const displayName = `${product.name}${size ? ` - ${size}` : ''}`.trim();
    const quantity = qty || productQuantities[product.id] || 1;

    addToCart({
      productId: product.id,
      variantId: targetVariant?.id || product.id.toString(),
      name: displayName,
      price: targetVariant?.price || getProductPrice(product),
      image: targetVariant?.image_url || getProductImage(product),
      category: getProductCategory(product),
      quantity: quantity,
      stock: targetVariant?.stock || 10
    });
    toast.success(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
  };

  const handleBuyNow = (product: Product, variant?: ProductVariant, size?: string) => {
    handleAddToCart(product, variant, size);
    window.location.href = "/cart";
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
      toast.success('Link copied to clipboard!');
    }
  };

  const updateProductQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.min(newQuantity, 10) // Limit to 10 per product
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Product Card Component - Grid View with Quantity Selector
  const ProductCard = ({
    product,
    isTopSelling,
    isTopDeal,
    activeDiscounts
  }: {
    product: Product;
    isTopSelling: boolean;
    isTopDeal: boolean;
    activeDiscounts: any[];
  }) => {
    const defaultVariant = getDefaultVariant(product);
    const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant!);

    const productImage = getProductImage(product, activeVariant);
    const productPrice = getProductPrice(product, activeVariant);
    const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
    const isInStock = isProductInStock(product, activeVariant);
    const reviews = 156;
    const rating = 4.5;
    const productQuantity = productQuantities[product.id] || 1;
    const badgeItems = [
      !isInStock
        ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      (isTopSelling || isProductBestSeller(product))
        ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isProductNew(product)
        ? { label: "NEW", className: "bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null
    ]
      .filter((badge): badge is { label: string; className: string } => Boolean(badge))
      .slice(0, 1);
    // const badgeItems = [
    //   !isInStock
    //     ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded" }
    //     : null,
    //   (isTopSelling || isProductBestSeller(product))
    //     ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded" }
    //     : null,
    //   isTopDeal
    //     ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded" }
    //     : null,
    //   isProductNew(product)
    //     ? { label: "NEW", className: "bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded" }
    //     : null
    // ]
    //   .filter((badge): badge is { label: string; className: string } => Boolean(badge))
    //   .slice(0, 2);


    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="group bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
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
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-green-600 scale-110" : "bg-gray-300 hover:bg-green-400"
                      }`}
                  />
                ))}
              </div>
            )}

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
                toast.info("Added to wishlist");
              }}
            >
              <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
            </button> */}
          </div>

          {/* Product Info */}
          <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2">
            <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
              {product.name}
            </h3>

            <p className="hidden sm:block text-sm text-gray-500 line-clamp-1">{product.description}</p>

            <div className="hidden sm:flex items-center text-sm text-gray-500">
              <Package className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{getProductCategory(product)}</span>
            </div>

            {/* Rating */}
            <div className="hidden sm:block">
              {renderStars(rating)}
              <p className="text-sm text-gray-500 mt-1">{reviews} reviews</p>
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

              <div className="flex items-center gap-2 min-w-0">
                {/* Quantity Selector */}
                {isInStock && (
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, productQuantity - 1);
                      }}
                      className="w-8 h-8 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {productQuantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, productQuantity + 1);
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product, activeVariant, '', productQuantity);
                    }}
                    disabled={!isInStock}
                    className={`w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs leading-none ${!isInStock
                      ? 'bg-red-500 text-white-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
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
        </div>
      </motion.div>
    );
  };

  // List View Item Component with Quantity Selector
  const ListViewItem = ({
    product,
    isTopSelling,
    isTopDeal,
    activeDiscounts
  }: {
    product: Product;
    isTopSelling: boolean;
    isTopDeal: boolean;
    activeDiscounts: any[];
  }) => {
    const defaultVariant = getDefaultVariant(product);
    const [activeVariant, setActiveVariant] = useState<ProductVariant>(defaultVariant!);

    const productImage = getProductImage(product, activeVariant);
    const productPrice = getProductPrice(product, activeVariant);
    const discountedPrice = getDiscountedPrice(productPrice, activeDiscounts, product);
    const isInStock = isProductInStock(product, activeVariant);
    const reviews = 156;
    const rating = 4.5;
    const productQuantity = productQuantities[product.id] || 1;
    const badgeItems = [
      !isInStock
        ? { label: t.common.soldOut, className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      (isTopSelling || isProductBestSeller(product))
        ? { label: t.common.bestSeller, className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isProductNew(product)
        ? { label: t.common.new, className: "bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null
    ]
      .filter((badge): badge is { label: string; className: string } => Boolean(badge))
      .slice(0, 1);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border border-gray-200 hover:border-green-300 p-4 md:p-6 cursor-pointer"
        onClick={() => handleProductClick(product)}
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
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${activeVariant.id === v.id ? "bg-green-600 scale-110" : "bg-gray-300 hover:bg-green-400"
                      }`}
                  />
                ))}
              </div>
            )}
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
                  {getProductCategory(product)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {renderStars(rating)}
                  <span className="ml-1">({reviews})</span>
                </div>
              </div>
            </div>

            {/* Price, Quantity Selector and Add to Cart in same line */}
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
                {isInStock && (
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, productQuantity - 1);
                      }}
                      className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center text-sm font-medium">
                      {productQuantity}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateProductQuantity(product.id, productQuantity + 1);
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product, activeVariant, '', productQuantity);
                  }}
                  disabled={!isInStock}
                  className={`flex-1 sm:w-auto px-6 py-2 rounded-lg font-medium ${!isInStock
                    ? 'bg-red-500 text-white-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {!isInStock ? t.common.soldOut : t.common.addToCart}
                </button>
                {isInStock && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyNow(product, activeVariant);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hidden sm:block"
                  >
                    {t.common.buyNow}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Search suggestions based on product data
  const categorySuggestions = Array.from(
    new Set(products.map(p => getProductCategory(p)))
  ).slice(0, 3);
  const searchSuggestions = [
    ...Array.from(new Set(products.flatMap(p =>
      p.name.split(' ').filter(word => word.length > 3)
    ))).slice(0, 5),
    ...categorySuggestions,
    'drip irrigation',
    'bacterial consortium',
    'high potassium'
  ];

  if (loading) {
    return (
      // <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading drip applications...</p>
        </div>
      </div>
      // </Layout>
    );
  }

  return (
    // <Layout>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-4 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t.pages.dripApplications}</h1>
          <p className="text-xs md:text-base text-green-100">
            {t.pages.dripDesc}
          </p>

          {/* Enhanced Search Bar in Header */}
          {/* <div className="mt-6 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drip applications by name, description, features, SKU..."
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
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </h2>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    {filteredProducts.length} products
                  </span>
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
            <div className="sticky top-[108px] z-20 bg-white rounded-lg border border-gray-200 p-3 mb-4 lg:static lg:p-4 lg:mb-6">
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
                  <h2 className="text-xl font-semibold text-gray-900">{t.pages.allDripApplications}</h2>

                </div>

                <div className="mt-3 grid grid-cols-[auto,1fr,auto] items-center gap-2">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="h-10 px-3 border border-green-200 text-green-700 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors inline-flex items-center justify-center whitespace-nowrap lg:hidden"
                  >
                    <Sliders className="w-4 h-4 mr-1.5" />
                    Filter
                  </button>

                  {/* Sort By */}
                  <div className="relative w-full">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 appearance-none bg-white border border-green-200 rounded-lg px-3 pr-9 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                    >
                      <option value="nameAsc">A-Z</option>
                      <option value="nameDesc">a-z</option>
                      <option value="priceLowHigh">Price: Low to High</option>
                      <option value="priceHighLow">Price: High to Low</option>
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

            {/* Products Grid/List */}
            <div className={`${viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4" : "flex flex-col"} gap-3 sm:gap-6 mb-8 min-h-[420px] sm:min-h-0`}>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  viewMode === "grid" ? (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  ) : (
                    <ListViewItem
                      key={product.id}
                      product={product}
                      isTopSelling={topSellingIds.includes(product.id)}
                      isTopDeal={topDealIds.includes(product.id)}
                      activeDiscounts={activeDiscounts}
                    />
                  )
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">No products found matching your criteria.</p>
                  <p className="text-gray-400 mb-4">Try different search terms or clear filters</p>
                  <button
                    onClick={() => {
                      setFilters({ availability: [], priceRanges: [], special: [] });
                      setSearchQuery('');
                    }}
                    className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Clear All Filters
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
                  className="px-4 py-2 border border-green-200 text-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" />
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show only first 3, last 3, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg ${currentPage === pageNum
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "border border-green-200 text-green-700 hover:bg-green-50"
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={index} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 border border-green-200 text-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline ml-1" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div >

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {
          showFilters && (
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
                    filters={filters}
                    setFilters={setFilters}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <button
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    onClick={() => setShowFilters(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </>
          )
        }
      </AnimatePresence >

      {/* Product Modal */}
      {
        isModalOpen && selectedProduct && selectedVariant && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <X className="w-8 h-8" />
                  </button>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
                    {/* Product Images */}
                    <div>
                      <div className="aspect-square max-w-lg mx-auto rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-green-50 to-green-100">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={selectedVariant.id}
                            src={selectedVariant.image_url || "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop"}
                            alt={selectedProduct.name}
                            initial={{ opacity: 0.4 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover"
                          />
                        </AnimatePresence>
                      </div>

                      {/* Variant Thumbnails */}
                      {selectedProduct.product_variants && selectedProduct.product_variants.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {selectedProduct.product_variants.map((variantItem) => (
                            <button
                              key={variantItem.id}
                              onClick={() => setSelectedVariant(variantItem)}
                              className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${selectedVariant.id === variantItem.id
                                ? "border-green-600"
                                : "border-gray-200 hover:border-green-300"
                                }`}
                            >
                              <img
                                src={variantItem.image_url || "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop"}
                                alt={getVariantDisplay(variantItem)}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Drip Application Icon */}
                      <div className="flex items-center justify-center gap-2 text-green-600 mt-4">
                        <Droplets className="w-6 h-6" />
                        <span className="text-lg font-semibold">Drip Irrigation Product</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      {/* Badges */}
                      <div className="flex gap-2 mb-4">
                        {isProductNew(selectedProduct) && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            NEW
                          </span>
                        )}
                        {isProductBestSeller(selectedProduct) && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            BEST SELLER
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-2">
                        {selectedProduct.name}
                      </h2>

                      {/* Rating - REMOVED */}

                      {/* Price */}
                      <div className="mb-4 sm:mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">
                            Rs. {selectedVariant.price.toFixed(2)}
                          </span>
                        </div>
                        <p className={`font-semibold mt-1 ${isProductInStock(selectedProduct, selectedVariant) ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {isProductInStock(selectedProduct, selectedVariant) ? 'In Stock' : 'Sold Out'}
                        </p>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-600">
                          <Truck className="inline w-5 h-5 mr-2" />
                          Shipping calculated at checkout.
                        </p>
                      </div>

                      {/* Variant Selection */}
                      {selectedProduct.product_variants && selectedProduct.product_variants.length > 1 && (
                        <div className="mb-6">
                          <p className="font-semibold text-gray-900 mb-3">Available Sizes</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.product_variants.map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${selectedVariant.id === variant.id
                                  ? "border-green-600 bg-green-50 text-green-700"
                                  : "border-gray-300 hover:border-green-300"
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
                                  {getVariantDisplay(variant)}
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
                          <span className="text-gray-600 ml-4">
                            Total: Rs. {(selectedVariant.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct, selectedVariant, selectedSize, quantity);
                            closeModal();
                          }}
                          className="py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          disabled={!isProductInStock(selectedProduct, selectedVariant)}
                        >
                          <ShoppingCart className="w-6 h-6" />
                          {!isProductInStock(selectedProduct, selectedVariant) ? 'Sold Out' : `Add ${quantity} to Cart`}
                        </button>
                        <button
                          onClick={() => handleBuyNow(selectedProduct, selectedVariant, selectedSize)}
                          className="py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                          disabled={!isProductInStock(selectedProduct, selectedVariant)}
                        >
                          Buy it now
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

                    {/* Special Description for IINM Chakra */}
                    {selectedProduct.name.toLowerCase().includes('chakra') && (
                      <>
                        <p className="text-gray-600 mb-4 text-lg">
                          IINM-Chakra introduces bacterial consortium encapsulated in liquid form, offering a stable source of essential nutrients such as nitrogen, phosphorus, and potassium to our region. This innovative bacterial consortium, existing in liquid form, comprises a minimum of 1.5x10⁸ bacteria per millilitre. Developed through advanced technology, this consortium is specially formulated in liquid form for easy application in the field. The liquid formulation is crafted using state-of-the-art methods, ensuring both stability and efficiency.
                        </p>

                        <h4 className="text-xl font-bold text-gray-900 mb-4">Key Benefits:</h4>
                        <ul className="space-y-3 mb-8">
                          <li className="flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">
                              <strong>Nutrient Collection:</strong> Collects nitrogen from the air, dissolves phosphorus, potash and other nutrients in a neutral state and returns them to the plant.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">
                              <strong>Soil Fertility:</strong> The number of good microorganisms increases and the soil becomes fertile.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <Check className="w-5 h-5 text-green-600 mr-2 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">
                              <strong>Yield Improvement:</strong> Increase yields and quality by 25-30% while reducing investments by 20-25%.
                            </span>
                          </li>
                        </ul>
                      </>
                    )}

                    {/* Standard Description for other products */}
                    {!selectedProduct.name.toLowerCase().includes('chakra') && (
                      <p className="text-gray-600 mb-8 text-lg">{selectedProduct.description}</p>
                    )}

                    <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getProductFeatures(selectedProduct).map((feature, index) => (
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
                        <p className="text-gray-600">{getProductCategory(selectedProduct)}</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Size</h4>
                        <p className="text-gray-600">{getVariantDisplay(selectedVariant)}</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Coverage</h4>
                        <p className="text-gray-600">1-5 Liters per acre</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mt-12 pt-8 border-t border-gray-200 space-y-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Dosage:</h4>
                      <p className="text-gray-700">{getProductSpecifications(selectedProduct).dosage}</p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Application Timing:</h4>
                      <p className="text-gray-700">{getProductSpecifications(selectedProduct).applicationTiming}</p>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Frequency of Application:</h4>
                      <p className="text-gray-700">{getProductSpecifications(selectedProduct).frequency}</p>
                    </div>

                    {getProductSpecifications(selectedProduct).caution && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Caution:</h4>
                        <p className="text-gray-700">{getProductSpecifications(selectedProduct).caution}</p>
                      </div>
                    )}

                    {/* Special Instructions for IINM Chakra */}
                    {selectedProduct.name.toLowerCase().includes('chakra') && (
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Special Instructions:</h4>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Five days before or after chemical fertilizers should be given through drip irrigation.</li>
                          <li>• Should be given by drip irrigation in the first stage (given within 10 - 15 days after sowing gives good results).</li>
                          <li>• 1 time for short term crops during crop period. 2 times should be given for mid term crop.</li>
                          <li>• 2 or 3 times a year for perennial crops.</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Technology Information */}
                  {selectedProduct.name.toLowerCase().includes('boc') && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Bio-Organic Carbon Technology</h3>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-4">
                          BOC represents a revolutionary approach to sustainable agriculture through advanced bio-organic carbon technology specifically designed for drip irrigation systems.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Enhances water infiltration and reduces soil compaction</li>
                          <li>Increases soil organic carbon by 1.5-2% per season</li>
                          <li>Improves nutrient retention and availability</li>
                          <li>Promotes beneficial soil microbial activity</li>
                          <li>Completely soluble and non-clogging for drip systems</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* High-K Special Info */}
                  {selectedProduct.name.toLowerCase().includes('high-k') && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">High Potassium Drip Technology</h3>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-4">
                          Specially formulated for drip irrigation systems to provide high potassium levels without clogging emitters or causing precipitation issues.
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Chelated potassium for maximum absorption</li>
                          <li>Non-reactive formula prevents emitter clogging</li>
                          <li>pH balanced for optimal nutrient availability</li>
                          <li>Compatible with all standard drip irrigation systems</li>
                          <li>Quick dissolution and uniform distribution</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* You May Also Like */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">You may also like</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products
                        .filter(p => p.id !== selectedProduct.id)
                        .slice(0, 3)
                        .map(product => {
                          const variant = getDefaultVariant(product);
                          return (
                            <div
                              key={product.id}
                              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer"
                              onClick={() => {
                                closeModal();
                                setTimeout(() => handleProductClick(product), 100);
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <img
                                  src={getProductImage(product, variant)}
                                  alt={product.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div>
                                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                  <p className="text-gray-600 text-sm">{getProductCategory(product)}</p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-gray-900">
                                      Rs. {getProductPrice(product, variant).toFixed(2)}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(product, variant);
                                      }}
                                      className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                    >
                                      Add
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Cart Count Indicator */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          <Link
            to="/cart"
            className="w-16 h-16 bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-green-700 transition-colors"
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
    </div >
    // </Layout>
  );
};

export default DripApplications;