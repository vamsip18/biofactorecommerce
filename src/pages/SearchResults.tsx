// src/pages/SearchResults.tsx
import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Search, Filter, ChevronRight, Package, Leaf, Droplets, Sprout, Loader2, X, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { searchProducts, getCollections, getCategories, getPriceRange, sortProducts, type Product } from "@/lib/supabase/products";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, React.ElementType> = {
  agriculture: Sprout,
  aquaculture: Droplets,
  'large-animals': Package,
  'kitchen-gardening': Leaf,
};

const categoryRoutes: Record<string, string> = {
  agriculture: "/agriculture",
  aquaculture: "/aquaculture",
  'large-animals': "/large-animals",
  'kitchen-gardening': "/kitchen-gardening",
};

const ITEMS_PER_PAGE = 12;

export default function SearchResults() {
  const t = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  
  // Initialize state from URL params
  const initialQuery = params.get('q') || '';
  const initialCategory = params.get('category') || undefined;
  const initialCollections = params.get('collections')?.split(',') || [];
  const initialPage = parseInt(params.get('page') || '1');
  const initialMinPrice = params.get('minPrice') ? parseInt(params.get('minPrice')!) : undefined;
  const initialMaxPrice = params.get('maxPrice') ? parseInt(params.get('maxPrice')!) : undefined;
  const initialInStock = params.get('inStock') === 'true';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [collections, setCollections] = useState<Array<{ id: string; name: string; category: string }>>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [availablePriceRange, setAvailablePriceRange] = useState<[number, number]>([0, 10000]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(initialCollections);
  const [minPrice, setMinPrice] = useState<number | undefined>(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialMaxPrice);
  const [inStockOnly, setInStockOnly] = useState(initialInStock);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest' | 'name'>('relevance');
  const [page, setPage] = useState(initialPage);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [collectionsData, categoriesData, priceRangeData] = await Promise.all([
        getCollections(),
        getCategories(),
        getPriceRange()
      ]);
      
      setCollections(collectionsData);
      setCategories(categoriesData);
      setAvailablePriceRange([priceRangeData.min, priceRangeData.max]);
      setPriceRange([priceRangeData.min, priceRangeData.max]);
      
      if (initialMinPrice === undefined) setMinPrice(priceRangeData.min);
      if (initialMaxPrice === undefined) setMaxPrice(priceRangeData.max);
    } catch (err) {
      console.error('Error initializing data:', err);
      setError('Failed to load filter options');
    }
  };

  // Build filters object
  const buildFilters = () => ({
    category: selectedCategory,
    collections: selectedCollections.length > 0 ? selectedCollections : undefined,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    inStock: inStockOnly || undefined,
  });

  // Update URL with current search state
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    
    if (debouncedSearchQuery) params.set('q', debouncedSearchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCollections.length > 0) params.set('collections', selectedCollections.join(','));
    if (debouncedMinPrice !== undefined) params.set('minPrice', debouncedMinPrice.toString());
    if (debouncedMaxPrice !== undefined) params.set('maxPrice', debouncedMaxPrice.toString());
    if (inStockOnly) params.set('inStock', 'true');
    if (page > 1) params.set('page', page.toString());
    
    navigate(`/search?${params.toString()}`, { replace: true });
  }, [debouncedSearchQuery, selectedCategory, selectedCollections, debouncedMinPrice, debouncedMaxPrice, inStockOnly, page, navigate]);

  // Perform search
  const performSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const filters = buildFilters();
      const { products: results, total } = await searchProducts(
        debouncedSearchQuery,
        filters,
        ITEMS_PER_PAGE,
        (page - 1) * ITEMS_PER_PAGE
      );

      setProducts(results);
      setTotalResults(total || 0);
      updateURL();
      
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search products. Please try again.');
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedCategory, selectedCollections, debouncedMinPrice, debouncedMaxPrice, inStockOnly, page, updateURL]);

  // Trigger search when dependencies change
  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, selectedCategory, selectedCollections, debouncedMinPrice, debouncedMaxPrice, inStockOnly]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setPage(1);
      performSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedCollections([]);
    setMinPrice(availablePriceRange[0]);
    setMaxPrice(availablePriceRange[1]);
    setInStockOnly(false);
    setSortBy('relevance');
    setPage(1);
  };

  const toggleCollection = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId)
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handlePriceRangeChange = (values: number[]) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
  };

  // Sort products locally
  const sortedProducts = sortProducts(products, sortBy);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  // Calculate display info
  const showingFrom = (page - 1) * ITEMS_PER_PAGE + 1;
  const showingTo = Math.min(page * ITEMS_PER_PAGE, totalResults);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products by name, description, SKU..."
                className="w-full pl-12 pr-4 py-6 text-lg rounded-xl border-2 focus:border-green-600 focus:ring-green-600"
                autoFocus
              />
              <Button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </form>
            
            {initialQuery && (
              <div className="mt-4 text-sm text-gray-600">
                Showing results for: <span className="font-semibold text-green-700">{initialQuery}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-green-700" />
                    <h3 className="text-lg font-semibold">{t.common.filter}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {t.search.clearAll}
                  </Button>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">{t.search.category}</h4>
                  <div className="space-y-2">
                    <Button
                      variant={!selectedCategory ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "w-full justify-start",
                        !selectedCategory && "bg-green-100 text-green-700"
                      )}
                      onClick={() => setSelectedCategory(undefined)}
                    >
                      All Categories
                    </Button>
                    {categories.map(category => {
                      const Icon = categoryIcons[category];
                      return (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start",
                            selectedCategory === category && "bg-green-100 text-green-700"
                          )}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {Icon && <Icon className="w-4 h-4 mr-2" />}
                          {category.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Collection Filter */}
                {collections.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3 text-gray-700">Collections</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {collections
                        .filter(c => !selectedCategory || c.category === selectedCategory)
                        .map(collection => (
                          <div key={collection.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`collection-${collection.id}`}
                              checked={selectedCollections.includes(collection.id)}
                              onCheckedChange={() => toggleCollection(collection.id)}
                              disabled={loading}
                            />
                            <Label
                              htmlFor={`collection-${collection.id}`}
                              className="text-sm cursor-pointer flex-1 truncate"
                            >
                              {collection.name}
                            </Label>
                            <Badge variant="outline" className="text-xs">
                              {collection.category}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3 text-gray-700">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={[minPrice || availablePriceRange[0], maxPrice || availablePriceRange[1]]}
                      onValueChange={handlePriceRangeChange}
                      min={availablePriceRange[0]}
                      max={availablePriceRange[1]}
                      step={100}
                      className="mb-4"
                      disabled={loading}
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{(minPrice || availablePriceRange[0]).toLocaleString()}</span>
                      <span>₹{(maxPrice || availablePriceRange[1]).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* In Stock Filter */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(checked === true)}
                      disabled={loading}
                    />
                    <Label htmlFor="in-stock" className="text-sm cursor-pointer">
                      In Stock Only
                    </Label>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Sort Options */}
                <div>
                  <h4 className="font-medium mb-3 text-gray-700">Sort By</h4>
                  <Select 
                    value={sortBy} 
                    onValueChange={(value: any) => setSortBy(value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Searching...
                    </div>
                  ) : (
                    `${totalResults.toLocaleString()} ${totalResults === 1 ? 'product' : 'products'} found`
                  )}
                </h2>
                {totalResults > 0 && (
                  <p className="text-gray-600 text-sm mt-1">
                    Showing {showingFrom.toLocaleString()} to {showingTo.toLocaleString()} of {totalResults.toLocaleString()} products
                  </p>
                )}
              </div>

              {/* Active Filters */}
              {(selectedCategory || selectedCollections.length > 0 || inStockOnly || 
                (minPrice !== undefined && minPrice > availablePriceRange[0]) ||
                (maxPrice !== undefined && maxPrice < availablePriceRange[1])) && (
                <div className="flex flex-wrap gap-2">
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      Category: {selectedCategory}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setSelectedCategory(undefined)}
                      />
                    </Badge>
                  )}
                  {selectedCollections.map(collectionId => {
                    const collection = collections.find(c => c.id === collectionId);
                    return collection ? (
                      <Badge key={collectionId} variant="secondary" className="gap-1">
                        {collection.name}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => toggleCollection(collectionId)}
                        />
                      </Badge>
                    ) : null;
                  })}
                  {inStockOnly && (
                    <Badge variant="secondary" className="gap-1">
                      In Stock
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setInStockOnly(false)}
                      />
                    </Badge>
                  )}
                  {(minPrice !== undefined && minPrice > availablePriceRange[0]) && (
                    <Badge variant="secondary" className="gap-1">
                      Min: ₹{minPrice}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setMinPrice(availablePriceRange[0])}
                      />
                    </Badge>
                  )}
                  {(maxPrice !== undefined && maxPrice < availablePriceRange[1]) && (
                    <Badge variant="secondary" className="gap-1">
                      Max: ₹{maxPrice}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => setMaxPrice(availablePriceRange[1])}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {debouncedSearchQuery ? 'No products found' : 'Start searching for products'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {debouncedSearchQuery
                    ? 'Try different keywords or adjust your filters'
                    : 'Enter a product name, description, or SKU to begin'}
                </p>
                {debouncedSearchQuery && (
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map(product => {
                    const Icon = categoryIcons[product.collections?.category || ''];
                    const activeVariants = product.variants.filter(v => v.is_active);
                    const minPrice = Math.min(...activeVariants.map(v => v.price));
                    const maxPrice = Math.max(...activeVariants.map(v => v.price));
                    const hasStock = activeVariants.some(v => v.stock > 0);
                    const productRoute = product.collections?.category 
                      ? `${categoryRoutes[product.collections.category]}/${product.collections.name.toLowerCase().replace(/\s+/g, '-')}`
                      : '/products';

                    return (
                      <Link 
                        to={productRoute} 
                        state={{ productId: product.id }}
                        key={product.id}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group border hover:border-green-300">
                          <CardContent className="p-6 h-full flex flex-col">
                            {/* Product Image */}
                            <div className="aspect-square rounded-lg bg-gray-100 mb-4 overflow-hidden flex items-center justify-center">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : (
                                <Package className="w-16 h-16 text-gray-400" />
                              )}
                              {!product.image_url && (
                                <Package className="w-16 h-16 text-gray-400 hidden" />
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex items-start justify-between mb-2">
                              {Icon && (
                                <div className="p-2 bg-green-50 rounded-lg">
                                  <Icon className="w-5 h-5 text-green-700" />
                                </div>
                              )}
                              {product.collections && (
                                <Badge variant="outline" className="text-xs">
                                  {product.collections.name}
                                </Badge>
                              )}
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2 min-h-[3.5rem]">
                              {product.name}
                            </h3>
                            
                            <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
                              {product.description || 'No description available'}
                            </p>
                            
                            <div className="space-y-3 mt-auto">
                              {/* Price */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xl font-bold text-green-700 flex items-center">
                                    <IndianRupee className="w-4 h-4" />
                                    {minPrice === maxPrice ? 
                                      minPrice.toLocaleString() : 
                                      `${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`
                                    }
                                  </span>
                                </div>
                                <div className="text-xs">
                                  {hasStock ? (
                                    <Badge variant="outline" className="text-green-600 border-green-200">
                                      In Stock
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-red-600 border-red-200">
                                      Out of Stock
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Variants Info */}
                              <div className="text-xs text-gray-500">
                                {activeVariants.length} variant{activeVariants.length !== 1 ? 's' : ''} available
                              </div>

                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700" 
                                size="sm"
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                      >
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={page === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className={page === pageNum ? "bg-green-600 hover:bg-green-700" : ""}
                              disabled={loading}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}