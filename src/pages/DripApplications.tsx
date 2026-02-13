// DripApplications.tsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Layout } from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
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

const DripApplications = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('bestSelling');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>(['In Stock']);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const { addToCart, getCartCount } = useCart();
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
    search: ''
  });


  const products: Product[] = [
    {
      id: 1,
      name: "IINM Chakra -",
      description: "Bacterial consortium in liquid form for efficient drip irrigation",
      price: 736.00,
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
      category: "Bacterial Consortium",
      formulation: "Liquid Formulation",
      coverage: "1-5 Liters per acre",
      features: [
        "1.5x10⁸ bacteria per millilitre",
        "Collects nitrogen from air",
        "Dissolves phosphorus and potash",
        "Increases soil fertility",
        "25-30% higher yields"
      ],
      availability: "In Stock",
      rating: 4.7,
      reviews: 156,
      isBestSeller: true,
      sizes: ["1 Ltr", "5 Ltr"],
      dosage: "1-5 liters per acre through drip irrigation",
      applicationTiming: "First stage (within 10-15 days after sowing)",
      frequency: "1 time for short-term crops, 2 times for mid-term crops, 2-3 times for perennial crops",
      caution: "Apply 5 days before or after chemical fertilizers through drip irrigation"
    },
    {
      id: 2,
      name: "Proceed -",
      description: "Advanced formulation for enhanced crop growth through drip systems",
      price: 1080.00,
      image: "https://images.unsplash.com/photo-1597848212624-e5f4b41d7f50?w=400&h=400&fit=crop",
      category: "Growth Enhancer",
      formulation: "Liquid Concentrate",
      coverage: "500 ml per acre",
      features: [
        "Improves nutrient uptake",
        "Enhances root development",
        "Increases stress tolerance",
        "Better water utilization",
        "Compatible with fertilizers"
      ],
      availability: "In Stock",
      rating: 4.5,
      reviews: 128,
      sizes: ["250 ml", "500 ml", "1 Ltr"],
      dosage: "500 ml per acre mixed with irrigation water",
      applicationTiming: "During critical growth stages",
      frequency: "Every 15-20 days during crop period"
    },
    {
      id: 3,
      name: "BOC - A Revolutionary Bio-Organic Carbon Product",
      description: "Bio-organic carbon for sustainable soil enrichment through drip",
      price: 1040.00,
      originalPrice: 1200.00,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c033a88e?w=400&h=400&fit=crop",
      category: "Organic Carbon",
      formulation: "Liquid Suspension",
      coverage: "From 2 liters per acre",
      features: [
        "Increases soil organic carbon",
        "Improves soil structure",
        "Enhances water retention",
        "Promotes microbial activity",
        "Sustainable alternative"
      ],
      availability: "In Stock",
      rating: 4.8,
      reviews: 203,
      isBestSeller: true,
      isNew: true,
      sizes: ["1 Ltr", "2 Ltr", "5 Ltr"],
      dosage: "2-5 liters per acre through drip system",
      applicationTiming: "At planting and during growing season",
      frequency: "2-3 applications per season"
    },
    {
      id: 4,
      name: "High-K Liquid Nutrient",
      description: "High potassium liquid formulation for drip irrigation systems",
      price: 1800.00,
      image: "https://images.unsplash.com/photo-1615485500607-1758f56c2c8a?w=400&h=400&fit=crop",
      category: "Potassium Nutrient",
      formulation: "Liquid Solution",
      coverage: "1 liter per acre",
      features: [
        "High potassium content",
        "Improves fruit quality",
        "Enhances stress tolerance",
        "Better water regulation",
        "Quick absorption"
      ],
      availability: "In Stock",
      rating: 4.6,
      reviews: 145,
      isBestSeller: true,
      sizes: ["500 ml", "1 Ltr", "5 Ltr"],
      dosage: "1 liter per acre through drip irrigation",
      applicationTiming: "During flowering and fruiting stages",
      frequency: "2-3 applications during critical stages"
    },
    {
      id: 5,
      name: "Nutrition & Virnix",
      description: "Combined nutrition and viral protection for drip application",
      price: 1716.00,
      image: "https://images.unsplash.com/photo-1581235720708-87e772807c71?w=400&h=400&fit=crop",
      category: "Nutrition & Protection",
      formulation: "Liquid Formulation",
      coverage: "750 ml per acre",
      features: [
        "Complete nutrition package",
        "Viral disease protection",
        "Systemic action",
        "Enhances plant immunity",
        "Compatible with drip systems"
      ],
      availability: "In Stock",
      rating: 4.7,
      reviews: 189,
      sizes: ["500 ml", "750 ml", "1 Ltr"],
      dosage: "750 ml per acre mixed with irrigation water",
      applicationTiming: "Preventive application and during stress periods",
      frequency: "Every 15 days during high-risk periods"
    }
  ];

  const productsPerPage = 12;

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const priceInRange = selectedPriceRanges.length === 0 || selectedPriceRanges.some(rangeId => {
      const range = priceRanges.find(r => r.id === rangeId);
      return range ? product.price >= range.min && product.price <= range.max : false;
    });
    const availabilityMatch = availability.length === 0 || availability.includes(product.availability);
    const searchMatch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());

    return priceInRange && availabilityMatch && searchMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
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
  }, [selectedPriceRanges, availability, searchQuery, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedSize(product.sizes?.[0] || "");
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = (product: Product, size?: string) => {
    addToCart({
      id: product.id,
      name: product.name + (size ? ` - ${size}` : ''),
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage,
      quantity: quantities[product.id] || 1
    });
    toast.success("Added to cart");

    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  const handleBuyNow = (product: Product, size?: string) => {
    handleAddToCart(product, size);
    window.location.href = "/cart";
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
      availability: true
    });

    const toggleSection = (section: 'price' | 'availability') => {
      setExpandedSections(prev => ({
        ...prev,
        [section]: !prev[section]
      }));
    };

    return (
      <div className="space-y-6">
        {/* Search */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Search</h3>
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
            <h3 className="font-semibold text-gray-900">Availability</h3>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.availability ? 'rotate-180' : ''
              }`} />
          </button>

          {expandedSections.availability && (
            <div className="space-y-2">
              {['In Stock', 'Sold Out'].map((status) => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availability.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAvailability([...availability, status]);
                      } else {
                        setAvailability(availability.filter(s => s !== status));
                      }
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
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
            <h3 className="font-semibold text-gray-900">Price</h3>
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

        {/* Clear Filters Button */}
        {(selectedPriceRanges.length > 0 || availability.length !== 1 || availability[0] !== 'In Stock' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedPriceRanges([]);
              setAvailability(['In Stock']);
              setSearchQuery('');
            }}
            className="w-full py-2 px-4 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </button>
        )}
      </div>
    );
  };

  // Product Card Component - Grid View
  const ProductCard = ({ product }: { product: Product }) => {
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
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {product.isNew && (
                <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  NEW
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  Best Seller
                </span>
              )}
              {product.availability === 'Sold Out' && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Sold Out
                </span>
              )}
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

            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Package className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{product.category}</span>
            </div>

            {/* Rating */}
            <div className="mb-3">
              {renderStars(product.rating)}
              <p className="text-sm text-gray-500 mt-1">{product.reviews} reviews</p>
            </div>

            <div className="flex items-center justify-between gap-4 mt-3">
              {/* Price Section */}
              <div className="flex-1">
                <div className="text-lg font-bold text-gray-900">
                  Rs. {product.price.toFixed(2)}
                </div>
                {product.originalPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    Rs. {product.originalPrice.toFixed(2)}
                  </div>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-2">
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
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${product.availability === 'Sold Out'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {product.availability === 'Sold Out' ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">Sold Out</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">Add</span>
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
  const ListViewItem = ({ product }: { product: Product }) => {
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
              className="w-full h-48 md:h-full object-cover rounded-lg"
            />
          </div>
          <div className="md:w-3/4 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">{product.name}</h3>
                <div className="flex gap-2">
                  {product.isNew && (
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
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
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    Rs. {product.price.toFixed(2)}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                      Rs. {product.originalPrice.toFixed(2)}
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
                  className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium ${product.availability === 'Sold Out'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                >
                  {product.availability === 'Sold Out' ? 'Sold Out' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Drip Applications</h1>
            <p className="text-green-100">
              Specialized formulations for efficient nutrient delivery through drip irrigation systems
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
                      Filters
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
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(true)}
                  className="w-full py-3 px-4 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  Show Filters
                </button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">Drip Irrigation Solutions</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    {/* Sort By */}
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-green-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400 w-full"
                      >
                        <option value="bestSelling">Best Selling</option>
                        <option value="priceLowHigh">Price: Low to High</option>
                        <option value="priceHighLow">Price: High to Low</option>
                        <option value="rating">Highest Rating</option>
                      </select>
                      <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center border border-green-200 rounded-lg overflow-hidden w-full sm:w-auto">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`flex-1 sm:flex-none p-2 text-center ${viewMode === "grid" ? "bg-green-50 text-green-700" : "text-gray-500"
                          }`}
                      >
                        <Grid className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">Grid</span>
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`flex-1 sm:flex-none p-2 text-center ${viewMode === "list" ? "bg-green-50 text-green-700" : "text-gray-500"
                          }`}
                      >
                        <List className="w-5 h-5 inline" />
                        <span className="ml-2 text-sm hidden sm:inline">List</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"} gap-6 mb-8`}>
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    viewMode === "grid" ? (
                      <ProductCard key={product.id} product={product} />
                    ) : (
                      <ListViewItem key={product.id} product={product} />
                    )
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    <button
                      onClick={() => {
                        setSelectedPriceRanges([]);
                        setAvailability(['In Stock']);
                        setSearchQuery('');
                      }}
                      className="mt-4 px-4 py-2 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination (hidden since only 5 products) */}
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
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)}>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterSection />
                  <button
                    className="w-full mt-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
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
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <X className="w-8 h-8" />
                  </button>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Product Images */}
                    <div>
                      <div className="rounded-xl overflow-hidden mb-4">
                        <img
                          src={selectedProduct.image}
                          alt={selectedProduct.name}
                          className="w-full h-96 object-cover"
                        />
                      </div>
                      {/* Drip Application Icon */}
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <Droplets className="w-6 h-6" />
                        <span className="text-lg font-semibold">Drip Irrigation Product</span>
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

                      <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h2>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        {renderStars(selectedProduct.rating)}
                        <span className="text-gray-600">({selectedProduct.reviews} reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl font-bold text-gray-900">
                            Rs. {selectedProduct.price.toFixed(2)}
                          </span>

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

                      {/* Size Selection */}
                      {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                        <div className="mb-6">
                          <p className="font-semibold text-gray-900 mb-3">Size</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-4 py-2 rounded-lg border ${selectedSize === size
                                  ? "border-green-600 bg-green-50 text-green-700"
                                  : "border-gray-300 hover:border-green-300"
                                  }`}
                              >
                                {size}
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
                            Total: Rs. {(selectedProduct.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct, selectedSize);
                            closeModal();
                          }}
                          className="py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          disabled={selectedProduct.availability === 'Sold Out'}
                        >
                          <ShoppingCart className="w-6 h-6" />
                          {selectedProduct.availability === 'Sold Out' ? 'Sold Out' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleBuyNow(selectedProduct, selectedSize)}
                          className="py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                          disabled={selectedProduct.availability === 'Sold Out'}
                        >
                          Buy it now
                        </button>
                      </div>

                      {/* Share Button */}
                      <button
                        onClick={handleShare}
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

                    {/* Special Description for IINM Chakra */}
                    {selectedProduct.id === 1 && (
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
                    {selectedProduct.id !== 1 && (
                      <p className="text-gray-600 mb-8 text-lg">{selectedProduct.description}</p>
                    )}

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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
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

                    {/* Special Instructions for IINM Chakra */}
                    {selectedProduct.id === 1 && (
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
                  {selectedProduct.id === 3 && (
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
                  {selectedProduct.id === 4 && (
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
    </Layout>
  );
};

export default DripApplications;