// FoliarApplications.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Layout } from '@/components/layout/Layout';
import { useTranslation } from '@/contexts/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Filter, ChevronDown, X,
  Star, Truck, Shield, Check,
  Plus, Minus, Share2, Heart,
  Grid, List, Search, Clock,
  Package, Sliders, ArrowUpDown,
  ChevronLeft, ChevronRight, Droplets
} from "lucide-react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  formulation: string;
  coverage: string;
  description: string;
  features: string[];
  availability: 'In Stock' | 'Sold Out';
  rating: number;
  reviews: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  dosage?: string;
  applicationTiming?: string;
  frequency?: string;
  caution?: string;
  sizes?: string[];
}

const priceRanges = [
  { id: "range1", min: 0, max: 500, label: "Under Rs. 500" },
  { id: "range2", min: 500, max: 1000, label: "Rs. 500 - Rs. 1000" },
  { id: "range3", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
  { id: "range4", min: 2000, max: 5000, label: "Rs. 2000 - Rs. 5000" },
  { id: "range5", min: 5000, max: Infinity, label: "Over Rs. 5000" }
];

const FoliarApplications = () => {
  const t = useTranslation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('nameAsc');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>(['In Stock']);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [specialFilters, setSpecialFilters] = useState<string[]>([]);
  const { addToCart, getCartCount } = useCart();
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    search: ''
  });


  // 3 Dummy Products for Foliar Applications
  const products: Product[] = [
    {
      id: 1,
      name: "Folio Spray Supreme",
      description: "Premium foliar spray for maximum nutrient absorption through leaves",
      price: 1899.00,
      originalPrice: 2299.00,
      image: "https://images.unsplash.com/photo-1597848212624-e5f4b41d7f50?w=400&h=400&fit=crop",
      category: "Foliar Nutrient Spray",
      formulation: "Liquid Concentrate",
      coverage: "200 liters per acre",
      features: [
        "Rapid nutrient absorption",
        "Enhanced chlorophyll production",
        "Improves photosynthesis efficiency",
        "Anti-evaporation formula",
        "Compatible with most pesticides"
      ],
      availability: "In Stock",
      rating: 4.8,
      reviews: 145,
      isBestSeller: true,
      isNew: true,
      dosage: "2-3 ml per liter of water",
      applicationTiming: "Early morning or late evening when stomata are open",
      frequency: "Every 15 days during growth stages",
      caution: "Do not mix with alkaline solutions. Avoid application under direct sunlight.",
      sizes: ["250 ml", "500 ml", "1 liter"]
    },
    {
      id: 2,
      name: "LeafGuard Pro",
      description: "Advanced foliar protection against fungal and bacterial diseases",
      price: 2450.00,
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
      category: "Foliar Protectant",
      formulation: "Wettable Powder",
      coverage: "150 liters per acre",
      features: [
        "Broad-spectrum protection",
        "Systemic action for longer duration",
        "Rainfast within 2 hours",
        "Safe for beneficial insects",
        "Resistance management technology"
      ],
      availability: "In Stock",
      rating: 4.6,
      reviews: 112,
      isBestSeller: true,
      dosage: "1.5-2 g per liter of water",
      applicationTiming: "Preventive application before disease onset",
      frequency: "As per disease pressure, typically 2-3 sprays per season",
      caution: "Maintain recommended dose. Use protective gear during application.",
      sizes: ["100 g", "250 g", "500 g"]
    },
    {
      id: 3,
      name: "PhytoGrowth Enhancer",
      description: "Organic plant growth regulator for foliar application",
      price: 1650.00,
      image: "https://images.unsplash.com/photo-1581235720708-87e772807c71?w=400&h=400&fit=crop",
      category: "Growth Regulator",
      formulation: "Soluble Liquid",
      coverage: "180 liters per acre",
      features: [
        "100% organic and biodegradable",
        "Enhances cell division and elongation",
        "Improves fruit setting",
        "Reduces flower and fruit drop",
        "Compatible with organic farming"
      ],
      availability: "In Stock",
      rating: 4.7,
      reviews: 98,
      dosage: "1-1.5 ml per liter of water",
      applicationTiming: "During flowering and fruiting stages",
      frequency: "2-3 applications at 15-day intervals",
      caution: "Store in cool place away from direct sunlight.",
      sizes: ["500 ml", "1 liter", "2 liters"]
    }
  ];

  const productsPerPage = 12;

  const topSellingIds = [...products]
    .sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviews - a.reviews)
    .slice(0, 4)
    .map(product => product.id);

  const topDealIds = [...products]
    .filter(product => typeof product.originalPrice === "number" && product.originalPrice > product.price)
    .sort((a, b) => {
      const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
      const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
      return discountB - discountA;
    })
    .slice(0, 4)
    .map(product => product.id);

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const priceInRange = selectedPriceRanges.length === 0 || selectedPriceRanges.some(rangeId => {
      const range = priceRanges.find(r => r.id === rangeId);
      return range ? product.price >= range.min && product.price <= range.max : false;
    });
    const availabilityMatch = availability.length === 0 || availability.includes(product.availability);
    const isTopSelling = topSellingIds.includes(product.id);
    const isTopDeal = topDealIds.includes(product.id);
    const wantsTopSelling = specialFilters.includes("top-selling");
    const wantsTopDeals = specialFilters.includes("top-deals");
    const specialMatch = specialFilters.length === 0
      || (wantsTopSelling && wantsTopDeals && (isTopSelling || isTopDeal))
      || (wantsTopSelling && !wantsTopDeals && isTopSelling)
      || (wantsTopDeals && !wantsTopSelling && isTopDeal);
    const searchMatch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return priceInRange && availabilityMatch && specialMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default: // bestSelling
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviews - a.reviews;
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
  }, [selectedPriceRanges, availability, searchQuery, sortBy, specialFilters]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage,
      quantity: quantities[product.id] || 1
    });
    toast.success(t.messages.addedToCart);

    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    navigate("/cart");
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
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
    const [expandedSections, setExpandedSections] = useState({
      price: true,
      availability: true,
      special: true
    });

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
                  checked={availability.includes('In Stock')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailability([...availability, 'In Stock']);
                    } else {
                      setAvailability(availability.filter(s => s !== 'In Stock'));
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t.common.inStock}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability.includes('Sold Out')}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailability([...availability, 'Sold Out']);
                    } else {
                      setAvailability(availability.filter(s => s !== 'Sold Out'));
                    }
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
                    checked={selectedPriceRanges.includes(range.id)}
                    onChange={(e) => {
                      const nextRanges = e.target.checked
                        ? [...selectedPriceRanges, range.id]
                        : selectedPriceRanges.filter(id => id !== range.id);
                      setSelectedPriceRanges(nextRanges);
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialFilters.includes('top-selling')}
                  onChange={(e) => {
                    const nextSpecial = e.target.checked
                      ? [...specialFilters, 'top-selling']
                      : specialFilters.filter(value => value !== 'top-selling');
                    setSpecialFilters(nextSpecial);
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t.common.topSelling}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialFilters.includes('top-deals')}
                  onChange={(e) => {
                    const nextSpecial = e.target.checked
                      ? [...specialFilters, 'top-deals']
                      : specialFilters.filter(value => value !== 'top-deals');
                    setSpecialFilters(nextSpecial);
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{t.common.topDeals}</span>
              </label>
            </div>
          )}
        </div>

        {/* Clear Filters Button */}
        {(selectedPriceRanges.length > 0 || availability.length !== 1 || availability[0] !== 'In Stock' || specialFilters.length > 0 || searchQuery) && (
          <button
            onClick={() => {
              setSelectedPriceRanges([]);
              setAvailability(['In Stock']);
              setSpecialFilters([]);
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

  // Product Card Component - Grid View
  const ProductCard = ({
    product,
    isTopSelling,
    isTopDeal
  }: {
    product: Product;
    isTopSelling: boolean;
    isTopDeal: boolean;
  }) => {
    const badgeItems = [
      product.availability === "Sold Out"
        ? { label: "Sold Out", className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      (isTopSelling || product.isBestSeller)
        ? { label: "Best Seller", className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      product.isNew
        ? { label: "NEW", className: "bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
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
        onClick={() => handleProductClick(product)}
      >
        <div className="relative flex-1">
          {/* Product Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
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
              <span className="truncate">{product.category}</span>
            </div>

            {/* Rating */}
            <div className="hidden sm:block">
              {renderStars(product.rating)}
              <p className="text-sm text-gray-500 mt-1">{product.reviews} reviews</p>
            </div>

            <div className="mt-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-lg font-bold text-green-600">
                    {product.price.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      {product.originalPrice.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              <div className={`${product.availability === 'Sold Out' ? 'hidden' : 'flex flex-col sm:flex-row'} gap-1 sm:gap-2 min-w-0`}>
                <div className="flex items-center border border-gray-300 rounded-lg text-xs shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, -1);
                    }}
                    className="px-1 py-0.5 text-gray-600 hover:text-green-700 hover:bg-gray-50"
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
                    className="px-1 py-0.5 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.availability === 'Sold Out'}
                  className={`flex-1 min-w-0 w-full sm:w-auto px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg font-medium flex items-center justify-center gap-1 sm:gap-2 text-[11px] sm:text-xs leading-none ${product.availability === 'Sold Out'
                    ? 'bg-red-500 text-white-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {product.availability === 'Sold Out' ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span className="text-[11px] sm:text-xs whitespace-nowrap">{t.common.soldOut}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="hidden sm:inline w-3 h-3" />
                      <span className="text-[11px] sm:text-xs whitespace-nowrap"><span className="sm:hidden">Add</span><span className="hidden sm:inline">{t.common.addToCart}</span></span>
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
  const ListViewItem = ({
    product,
    isTopSelling,
    isTopDeal
  }: {
    product: Product;
    isTopSelling: boolean;
    isTopDeal: boolean;
  }) => {
    const badgeItems = [
      product.availability === "Sold Out"
        ? { label: t.common.soldOut, className: "bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      (isTopSelling || product.isBestSeller)
        ? { label: t.common.bestSeller, className: "bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      isTopDeal
        ? { label: "Top Deal", className: "bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded-full" }
        : null,
      product.isNew
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
          <div className="md:w-1/4">
            <img
              src={product.image}
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
                  {product.category}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  {renderStars(product.rating)}
                  <span className="ml-1">({product.reviews})</span>
                </div>
              </div>
            </div>

            {/* Price and Add to Cart in same line */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
              <div className="w-full sm:w-auto flex items-center gap-4">
                <div>
                  {product.originalPrice ? (
                    <>
                      <div className="text-sm text-gray-500 line-through">
                        Rs. {product.originalPrice.toFixed(2)}
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-green-600">
                        Rs. {product.price.toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <div className="text-xl md:text-2xl font-bold text-gray-900">
                      Rs. {product.price.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full sm:w-auto flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, -1);
                    }}
                    className="px-2 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                    disabled={(quantities[product.id] || 1) <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 py-1 border-x border-gray-300 min-w-8 text-center text-sm">
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(product.id, 1);
                    }}
                    className="px-2 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  disabled={product.availability === 'Sold Out'}
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium flex items-center justify-center gap-1 ${product.availability === 'Sold Out'
                    ? 'bg-red-500 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {product.availability === 'Sold Out' ? (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>{t.common.soldOut}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="hidden sm:inline w-3 h-3" />
                      <span>{t.common.addToCart}</span>
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

  return (
    // <Layout>
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-4 md:py-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-xl md:text-4xl font-bold mb-1 md:mb-2">{t.pages.foliarApplications}</h1>
            <p className="text-xs md:text-base text-green-100">
              {t.pages.foliarDesc}
            </p>
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
                      {t.common.filter}
                    </h2>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      {filteredProducts.length} products
                    </span>
                  </div>
                  <FilterSection />
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
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">{t.pages.allFoliarApplications}</h2>
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
                  currentProducts.map((product) => {
                    const isTopSelling = topSellingIds.includes(product.id);
                    const isTopDeal = topDealIds.includes(product.id);

                    return viewMode === "grid" ? (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isTopSelling={isTopSelling}
                        isTopDeal={isTopDeal}
                      />
                    ) : (
                      <ListViewItem
                        key={product.id}
                        product={product}
                        isTopSelling={isTopSelling}
                        isTopDeal={isTopDeal}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedPriceRanges([]);
                        setAvailability(['In Stock']);
                        setSpecialFilters([]);
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination (hidden since only 3 products) */}
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
                    <h2 className="text-lg font-semibold">{t.common.filter}</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSection />
                  <button
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                    onClick={() => setShowFilters(false)}
                  >
                    {t.common.filter}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Product Modal */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl lg:max-w-6xl w-full max-h-[90vh] overflow-y-auto">
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
                      <div className="aspect-square max-w-sm mx-auto rounded-xl overflow-hidden mb-4 bg-gray-100">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Foliar Application Icon */}
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Droplets className="w-6 h-6" />
                        <span className="text-lg font-semibold">Foliar Application Product</span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div>
                      {/* Badges */}
                      <div className="flex gap-2 mb-4">
                        {selectedProduct.isNew && (
                          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            NEW
                          </span>
                        )}
                        {selectedProduct.isBestSeller && (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            BEST SELLER
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h2>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3">
                          {selectedProduct.originalPrice ? (
                            <div className="flex flex-col">
                              <span className="text-sm text-gray-500 line-through">
                                Rs. {selectedProduct.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-3xl font-bold text-green-600">
                                Rs. {selectedProduct.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                              Rs. {selectedProduct.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className="text-green-600 font-semibold mt-1">
                          {selectedProduct.availability}
                        </p>
                      </div>

                      {/* Shipping Info */}
                      <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-600">
                          <Truck className="inline w-5 h-5 mr-2" />
                          Shipping calculated at checkout.
                        </p>
                      </div>

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
                            Total: Rs. {(selectedProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct);
                            closeModal();
                          }}
                          className="py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          disabled={selectedProduct.availability === 'Sold Out'}
                        >
                          <ShoppingCart className="w-6 h-6" />
                          {selectedProduct.availability === 'Sold Out' ? t.common.soldOut : t.common.addToCart}
                        </button>
                        <button
                          onClick={() => handleBuyNow(selectedProduct)}
                          className="py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                          disabled={selectedProduct.availability === 'Sold Out'}
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
                        {t.product.shareProduct}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{t.common.description}</h3>
                    <p className="text-gray-600 mb-8 text-lg">{selectedProduct.description}</p>

                    <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specifications */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{t.common.specifications}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                        <p className="text-gray-600">{selectedProduct.category}</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Formulation</h4>
                        <p className="text-gray-600">{selectedProduct.formulation}</p>
                      </div>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">Coverage</h4>
                        <p className="text-gray-600">{selectedProduct.coverage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="mt-12 pt-8 border-t border-gray-200 space-y-6">
                    {selectedProduct.dosage && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Dosage:</h4>
                        <p className="text-gray-700">{selectedProduct.dosage}</p>
                      </div>
                    )}
                    {selectedProduct.applicationTiming && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Application Timing:</h4>
                        <p className="text-gray-700">{selectedProduct.applicationTiming}</p>
                      </div>
                    )}
                    {selectedProduct.frequency && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Frequency of Application:</h4>
                        <p className="text-gray-700">{selectedProduct.frequency}</p>
                      </div>
                    )}
                    {selectedProduct.caution && (
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">Caution:</h4>
                        <p className="text-gray-700">{selectedProduct.caution}</p>
                      </div>
                    )}
                  </div>

                  {/* Special for Folio Spray Supreme */}
                  {selectedProduct.id === 1 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Foliar Technology</h3>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-4">
                          Folio Spray Supreme utilizes nano-encapsulation technology that ensures maximum nutrient penetration through leaf stomata. The advanced formulation includes:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Stomata-targeted delivery system for 95% absorption</li>
                          <li>Anti-evaporation coating for extended leaf contact time</li>
                          <li>pH-balanced formula compatible with most foliar sprays</li>
                          <li>Rainfast within 30 minutes of application</li>
                          <li>Biodegradable surfactants for environmental safety</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Special for LeafGuard Pro */}
                  {selectedProduct.id === 2 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Disease Protection Technology</h3>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-4">
                          LeafGuard Pro features triple-action protection against foliar diseases:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li><strong>Contact Action:</strong> Forms protective film on leaf surface</li>
                          <li><strong>Systemic Action:</strong> Absorbed and translocated within plant</li>
                          <li><strong>Anti-sporulant:</strong> Inhibits fungal spore production</li>
                          <li>Resistance management with multiple modes of action</li>
                          <li>Safe for pollinators and beneficial insects</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Special for PhytoGrowth Enhancer */}
                  {selectedProduct.id === 3 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">Organic Growth Enhancement</h3>
                      <div className="bg-green-50 p-6 rounded-xl">
                        <p className="text-gray-700 mb-4">
                          PhytoGrowth Enhancer is certified organic and contains natural plant growth regulators:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Contains natural cytokinins and auxins</li>
                          <li>Enhances photosynthesis by 25-30%</li>
                          <li>Improves fruit setting and reduces flower drop</li>
                          <li>Increases fruit size and quality parameters</li>
                          <li>Compatible with organic certification standards</li>
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
                        .slice(0, 1)
                        .map(product => (
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
                                src={product.image}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                <p className="text-gray-600 text-sm">{product.category}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-bold text-gray-900">
                                    Rs. {product.price.toFixed(2)}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddToCart(product);
                                    }}
                                    className="px-4 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                                  >
                                    Add
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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


      </div>
    </>
    /* </Layout> */
  );
};

export default FoliarApplications;