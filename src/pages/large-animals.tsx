import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Link, useLocation } from "react-router-dom";
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
  };
  setFilters: (filters: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) => {
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
          <h3 className="font-semibold text-gray-900">Availability</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.availability ? 'rotate-180' : ''
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
              <span className="text-sm text-gray-700">In Stock</span>
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
              <span className="text-sm text-gray-700">Out of Stock</span>
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
          <h3 className="font-semibold text-gray-900">Price</h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.price ? 'rotate-180' : ''
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

      {/* Clear Filters Button */}
      {(filters.priceRanges.length > 0 || filters.availability.length > 0 || searchQuery) && (
        <Button
          variant="outline"
          className="w-full border-green-200 text-green-700 hover:bg-green-50"
          onClick={() => {
            setFilters({ availability: [], priceRanges: [] });
            setSearchQuery('');
            // Clear URL parameter
            window.history.replaceState({}, document.title, window.location.pathname);
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
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
  onQuantityChange
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  onQuantityChange: (productId: string, delta: number) => void;
}) => {
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const productCategory = getProductCategory(product);
  const isInStock = variant.stock > 0;

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
              <Badge className="bg-red-500 text-white text-xs font-semibold">
                Sold Out
              </Badge>
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
          
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <Package className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">Large Animals</span>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3">
            {/* Price Section */}
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900">
                Rs. {productPrice.toFixed(2)}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, -1);
                  }}
                  className="px-2 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 py-1 border-x border-gray-300 min-w-8 text-center text-sm">
                  {quantity}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(product.id, 1);
                  }}
                  className="px-2 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              <Button 
                size="sm"
                className={`${
                  !isInStock 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
                disabled={!isInStock}
                onClick={handleAddToCart}
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
    </motion.div>
  );
};

// Product Modal Component
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
    window.location.href = "/cart";
  };

  // Get image for selected variant or use default
  const getSelectedVariantImage = () => {
    return selectedVariant.image_url || "/placeholder.jpg";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <Package className="w-4 h-4" />
              <span className="text-sm text-gray-600">Category: Large Animals</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-white">
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
            <Button variant="outline" className="w-full border-green-200">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <div className="text-3xl font-bold text-gray-900">
                Rs. {selectedVariant.price.toFixed(2)}
              </div>
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
                      className={`px-4 py-2 rounded-lg border text-sm ${
                        selectedVariant.id === variantItem.id
                          ? "border-green-600 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-green-300"
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
                    className="p-2 rounded-full border border-gray-300 hover:border-green-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-full border border-gray-300 hover:border-green-300"
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
                disabled={selectedVariant.stock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to cart
              </Button>
              <Button 
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50 h-12 text-lg" 
                variant="outline"
                onClick={handleBuyNow}
                disabled={selectedVariant.stock === 0}
              >
                Buy it now
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
  onQuantityChange
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  onQuantityChange: (productId: string, delta: number) => void;
}) => {
  const variant = getDefaultVariant(product);
  if (!variant) return null;

  const { addToCart } = useCart();
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const isInStock = variant.stock > 0;

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
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          </div>
          
          {/* Price, Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t">
            <div className="w-full sm:w-auto flex items-center gap-4">
              <div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">
                  Rs. {productPrice.toFixed(2)}
                </div>
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
                  className="px-3 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
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
                  className="px-3 py-1 text-gray-600 hover:text-green-700 hover:bg-gray-50"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            <div className="w-full sm:w-auto">
              <Button 
                className={`w-full sm:w-auto ${
                  !isInStock 
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={!isInStock}
                onClick={handleAddToCart}
              >
                {!isInStock ? "Sold Out" : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LargeAnimalsProducts = () => {
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    availability: [] as string[],
    priceRanges: [] as string[],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Large Animal Products</h1>
            <p className="text-green-100">
              Premium biofactor solutions for large animal health and care
            </p>
          </div>
        </div>

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="container mx-auto px-4 pt-6">
            <div className="bg-white rounded-lg border border-green-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Search Results</h3>
                  <p className="text-gray-600 text-sm">
                    Showing {filteredAndSortedProducts.length} results for "{searchQuery}" in Large Animals
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
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
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
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <Button
                  onClick={() => setMobileFiltersOpen(true)}
                  variant="outline"
                  className="w-full justify-center border-green-200 text-green-700"
                >
                  <Sliders className="w-4 h-4 mr-2" />
                  Show Filters ({Object.values(filters).flat().length + (searchQuery ? 1 : 0)})
                </Button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">Large Animal Products</h2>
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

              {/* Products Grid/List */}
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "flex flex-col"} gap-6 mb-8`}>
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
                      />
                    ) : (
                      <ListViewItem
                        key={product.id}
                        product={product}
                        onClick={() => setSelectedProduct(product)}
                        quantity={quantities[product.id] || 1}
                        onQuantityChange={handleQuantityChange}
                      />
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-500 text-lg">No Large Animal products found matching your criteria.</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-green-200 text-green-700"
                      onClick={() => {
                        setFilters({ availability: [], priceRanges: [] });
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
                    className="border-green-200"
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