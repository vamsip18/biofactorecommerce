// FoliarApplications.tsx
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
  ChevronLeft, ChevronRight, Droplets,
  Tag, BarChart3, Leaf, Zap, Sprout,
  Wind, Cloud, Sun, Moon
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
  sku?: string;
  cropTypes?: string[];
  organic?: boolean;
}

// Enhanced search function
const searchProducts = (products: Product[], query: string) => {
  if (!query.trim()) return products;
  
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  return products.filter(product => {
    const searchableFields = [
      product.name.toLowerCase(),
      product.description.toLowerCase(),
      product.category.toLowerCase(),
      product.formulation.toLowerCase(),
      ...product.features.map(f => f.toLowerCase()),
      ...(product.sizes?.map(s => s.toLowerCase()) || []),
      ...(product.cropTypes?.map(c => c.toLowerCase()) || []),
      product.sku?.toLowerCase() || '',
      product.dosage?.toLowerCase() || '',
      product.applicationTiming?.toLowerCase() || '',
      product.caution?.toLowerCase() || ''
    ].filter(Boolean);
    
    return searchTerms.every(term => 
      searchableFields.some(field => field.includes(term))
    );
  });
};

// Filter Section Component with Enhanced Search
const FilterSection = ({ 
  priceRange, 
  setPriceRange,
  availability,
  setAvailability,
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  setSelectedCategories,
  formulations,
  selectedFormulations,
  setSelectedFormulations,
  organicOnly,
  setOrganicOnly
}: { 
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  availability: string[];
  setAvailability: (availability: string[]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: string[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  formulations: string[];
  selectedFormulations: string[];
  setSelectedFormulations: (formulations: string[]) => void;
  organicOnly: boolean;
  setOrganicOnly: (value: boolean) => void;
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    categories: true,
    formulations: true,
    price: true,
    availability: true,
    organic: true
  });

  const toggleSection = (section: 'search' | 'categories' | 'formulations' | 'price' | 'availability' | 'organic') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const priceRanges = [
    { id: "range1", min: 0, max: 1000, label: "Under Rs. 1000" },
    { id: "range2", min: 1000, max: 2000, label: "Rs. 1000 - Rs. 2000" },
    { id: "range3", min: 2000, max: 3000, label: "Rs. 2000 - Rs. 3000" },
    { id: "range4", min: 3000, max: 4000, label: "Rs. 3000 - Rs. 4000" },
    { id: "range5", min: 4000, max: 5000, label: "Over Rs. 4000" }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Search */}
      <div>
        <button
          onClick={() => toggleSection('search')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Products
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.search ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.search && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, description, features, SKU, crop type..."
                className="w-full pl-10 pr-3 py-2 border border-green-200 rounded-lg focus:border-green-400 focus:outline-none focus:ring-1 focus:ring-green-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Search by: product name, description, category, features, sizes, crop types, SKU
            </p>
          </div>
        )}
      </div>

      {/* Categories Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Categories
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.categories ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.categories && categories.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <label key={category} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Formulations Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('formulations')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            Formulations
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.formulations ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.formulations && formulations.length > 0 && (
          <div className="space-y-2">
            {formulations.map((formulation) => (
              <label key={formulation} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedFormulations.includes(formulation)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFormulations([...selectedFormulations, formulation]);
                    } else {
                      setSelectedFormulations(selectedFormulations.filter(f => f !== formulation));
                    }
                  }}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{formulation}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Organic Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('organic')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            Organic
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.organic ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.organic && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(e) => setOrganicOnly(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <Leaf className="w-4 h-4 text-green-600" />
                Organic Certified Only
              </span>
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
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Price Range
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.price ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.price && (
          <div className="space-y-4">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Rs. {priceRange[0]}</span>
              <span>Rs. {priceRange[1]}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPriceRange([0, 1000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Under Rs. 1000
              </button>
              <button
                onClick={() => setPriceRange([1000, 2000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Rs. 1000-2000
              </button>
              <button
                onClick={() => setPriceRange([2000, 3000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Rs. 2000-3000
              </button>
              <button
                onClick={() => setPriceRange([3000, 5000])}
                className="px-3 py-1 text-sm border border-green-200 text-green-700 rounded hover:bg-green-50"
              >
                Over Rs. 3000
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="border-t pt-4">
        <button
          onClick={() => toggleSection('availability')}
          className="flex items-center justify-between w-full mb-3"
        >
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-4 h-4" />
            Availability
          </h3>
          <ChevronDown className={`w-4 h-4 transition-transform ${
            expandedSections.availability ? 'rotate-180' : ''
          }`} />
        </button>
        
        {expandedSections.availability && (
          <div className="space-y-2">
            {['In Stock', 'Sold Out'].map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
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

      {/* Clear Filters Button */}
      {(priceRange[1] !== 5000 || availability.length !== 1 || availability[0] !== 'In Stock' || searchQuery || selectedCategories.length > 0 || selectedFormulations.length > 0 || organicOnly) && (
        <button
          onClick={() => {
            setPriceRange([0, 5000]);
            setAvailability(['In Stock']);
            setSearchQuery('');
            setSelectedCategories([]);
            setSelectedFormulations([]);
            setOrganicOnly(false);
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

// Product Card Component - Grid View with Quantity Selector
const ProductCard = ({ 
  product, 
  onClick,
  quantity,
  updateQuantity
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: number, newQuantity: number) => void;
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage,
      quantity: quantity
    });
    toast.success(`${quantity} ${product.name} added to cart!`);
    updateQuantity(product.id, 1); // Reset quantity after adding
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
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
            {product.organic && (
              <span className="bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Organic
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

          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Droplets className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{product.formulation}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {renderStars(product.rating)}
            <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
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

            {/* Quantity Selector and Add to Cart Button */}
            <div className="flex items-center gap-2">
              {/* Quantity Selector */}
              {product.availability === 'In Stock' && (
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
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

              {/* Add to Cart Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleAddToCart}
                  disabled={product.availability === 'Sold Out'}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    product.availability === 'Sold Out'
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
      </div>
    </motion.div>
  );
};

// List View Item Component with Quantity Selector
const ListViewItem = ({ 
  product, 
  onClick,
  quantity,
  updateQuantity
}: { 
  product: Product;
  onClick: () => void;
  quantity: number;
  updateQuantity: (productId: number, newQuantity: number) => void;
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage,
      quantity: quantity
    });
    toast.success(`${quantity} ${product.name} added to cart!`);
    updateQuantity(product.id, 1); // Reset quantity after adding
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 hover:border-green-300 p-4 md:p-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="md:w-1/4 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 md:h-full object-cover rounded-lg"
          />
          {product.organic && (
            <span className="absolute top-2 left-2 bg-green-700 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Organic
            </span>
          )}
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
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Package className="w-4 h-4 mr-1" />
                {product.category}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Droplets className="w-4 h-4 mr-1" />
                {product.formulation}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                {renderStars(product.rating)}
                <span className="ml-1">({product.reviews})</span>
              </div>
            </div>
          </div>
          
          {/* Price, Quantity Selector and Add to Cart */}
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
              
              {/* Quantity Selector */}
              {product.availability === 'In Stock' && (
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
                disabled={product.availability === 'Sold Out'}
                className={`flex-1 sm:w-auto px-6 py-2 rounded-lg font-medium ${
                  product.availability === 'Sold Out'
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {product.availability === 'Sold Out' ? 'Sold Out' : `Add ${quantity}`}
              </button>
              {product.availability === 'In Stock' && (
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

const FoliarApplications = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState('bestSelling');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [availability, setAvailability] = useState<string[]>(['In Stock']);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormulations, setSelectedFormulations] = useState<string[]>([]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  const { addToCart, getCartCount } = useCart();

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
      organic: false,
      dosage: "2-3 ml per liter of water",
      applicationTiming: "Early morning or late evening when stomata are open",
      frequency: "Every 15 days during growth stages",
      caution: "Do not mix with alkaline solutions. Avoid application under direct sunlight.",
      sizes: ["250 ml", "500 ml", "1 liter"],
      sku: "FSS-2024-001",
      cropTypes: ["Vegetables", "Fruits", "Field Crops"]
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
      isNew: false,
      organic: false,
      dosage: "1.5-2 g per liter of water",
      applicationTiming: "Preventive application before disease onset",
      frequency: "As per disease pressure, typically 2-3 sprays per season",
      caution: "Maintain recommended dose. Use protective gear during application.",
      sizes: ["100 g", "250 g", "500 g"],
      sku: "LGP-2024-002",
      cropTypes: ["Vegetables", "Fruits", "Ornamentals"]
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
      isBestSeller: false,
      isNew: true,
      organic: true,
      dosage: "1-1.5 ml per liter of water",
      applicationTiming: "During flowering and fruiting stages",
      frequency: "2-3 applications at 15-day intervals",
      caution: "Store in cool place away from direct sunlight.",
      sizes: ["500 ml", "1 liter", "2 liters"],
      sku: "PGE-2024-003",
      cropTypes: ["Vegetables", "Fruits", "Organic Farms"]
    }
  ];

  const productsPerPage = 12;

  // Initialize quantities
  useEffect(() => {
    const initialQuantities: Record<number, number> = {};
    products.forEach(product => {
      initialQuantities[product.id] = 1;
    });
    setProductQuantities(initialQuantities);

    // Generate search suggestions
    const suggestions = [
      ...Array.from(new Set(products.flatMap(p => 
        p.name.split(' ').filter(word => word.length > 3)
      ))).slice(0, 5),
      ...Array.from(new Set(products.map(p => p.category))).slice(0, 3),
      ...Array.from(new Set(products.map(p => p.formulation))).slice(0, 2),
      'foliar spray',
      'organic',
      'nutrient absorption'
    ];
    setSearchSuggestions(suggestions);
  }, []);

  // Update product quantity
  const updateProductQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.min(newQuantity, 10) // Limit to 10 per product
    }));
  };

  // Get unique categories
  const allCategories = Array.from(new Set(products.map(p => p.category)));
  
  // Get unique formulations
  const allFormulations = Array.from(new Set(products.map(p => p.formulation)));

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const availabilityMatch = availability.length === 0 || availability.includes(product.availability);
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const formulationMatch = selectedFormulations.length === 0 || selectedFormulations.includes(product.formulation);
    const organicMatch = !organicOnly || product.organic === true;
    
    return priceInRange && availabilityMatch && categoryMatch && formulationMatch && organicMatch;
  });

  // Apply search to filtered products
  const searchedProducts = searchProducts(filteredProducts, searchQuery);

  // Sort products
  const sortedProducts = [...searchedProducts].sort((a, b) => {
    switch (sortBy) {
      case 'priceLowHigh':
        return a.price - b.price;
      case 'priceHighLow':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
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
  }, [priceRange, availability, searchQuery, sortBy, selectedCategories, selectedFormulations, organicOnly]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalQuantity(1);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    document.body.style.overflow = 'unset';
  };

  const handleAddToCart = (product: Product, qty?: number) => {
    const quantity = qty || productQuantities[product.id] || 1;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      formulation: product.formulation,
      coverage: product.coverage,
      quantity: quantity
    });
    toast.success(`${quantity} ${product.name} added to cart!`);
    if (!qty) {
      updateProductQuantity(product.id, 1); // Reset quantity after adding
    }
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product, modalQuantity);
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
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Enhanced Search */}
        <div className="bg-gradient-to-r from-green-900 to-green-900 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Foliar Applications</h1>
            <p className="text-green-100">
              Premium leaf-applied solutions for rapid nutrient absorption and plant protection
            </p>
            
            {/* Enhanced Search Bar in Header */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search foliar products by name, description, features, SKU..."
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
              
             
            </div>
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
                      {searchedProducts.length} products
                    </span>
                  </div>
                  <FilterSection 
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    availability={availability}
                    setAvailability={setAvailability}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    formulations={allFormulations}
                    selectedFormulations={selectedFormulations}
                    setSelectedFormulations={setSelectedFormulations}
                    organicOnly={organicOnly}
                    setOrganicOnly={setOrganicOnly}
                  />
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
                  Show Filters ({Object.values({price: priceRange[1] !== 5000, availability: availability.length !== 1 || availability[0] !== 'In Stock', search: !!searchQuery, categories: selectedCategories.length, formulations: selectedFormulations.length, organic: organicOnly}).filter(Boolean).length})
                </button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalProducts)} of {totalProducts} products
                      {searchQuery && (
                        <span className="text-green-600 ml-2">
                          for "{searchQuery}"
                        </span>
                      )}
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900">Foliar Solutions</h2>
                    
                    {/* Active Filters */}
                    {(priceRange[1] !== 5000 || availability.length !== 1 || availability[0] !== 'In Stock' || searchQuery || selectedCategories.length > 0 || selectedFormulations.length > 0 || organicOnly) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {searchQuery && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Search: {searchQuery}
                            <button
                              onClick={() => setSearchQuery('')}
                              className="ml-1.5 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {selectedCategories.map(category => (
                          <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            {category}
                            <button
                              onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                              className="ml-1.5 hover:text-blue-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {selectedFormulations.map(formulation => (
                          <span key={formulation} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                            {formulation}
                            <button
                              onClick={() => setSelectedFormulations(selectedFormulations.filter(f => f !== formulation))}
                              className="ml-1.5 hover:text-purple-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        {organicOnly && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                            Organic Only
                            <button
                              onClick={() => setOrganicOnly(false)}
                              className="ml-1.5 hover:text-green-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                        {priceRange[1] !== 5000 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-800">
                            Price: Rs. {priceRange[0]}-{priceRange[1]}
                            <button
                              onClick={() => setPriceRange([0, 5000])}
                              className="ml-1.5 hover:text-amber-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        )}
                      </div>
                    )}
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
                        <option value="name-asc">Name: A to Z</option>
                        <option value="name-desc">Name: Z to A</option>
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
                  currentProducts.map((product) => (
                    viewMode === "grid" ? (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={() => handleProductClick(product)}
                        quantity={productQuantities[product.id] || 1}
                        updateQuantity={updateProductQuantity}
                      />
                    ) : (
                      <ListViewItem
                        key={product.id}
                        product={product}
                        onClick={() => handleProductClick(product)}
                        quantity={productQuantities[product.id] || 1}
                        updateQuantity={updateProductQuantity}
                      />
                    )
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="max-w-md mx-auto">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <Droplets className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg mb-4">No products found matching your criteria.</p>
                      <button
                        onClick={() => {
                          setPriceRange([0, 5000]);
                          setAvailability(['In Stock']);
                          setSearchQuery('');
                          setSelectedCategories([]);
                          setSelectedFormulations([]);
                          setOrganicOnly(false);
                        }}
                        className="mt-4 px-4 py-2 border border-green-200 text-green-700 rounded-lg font-medium hover:bg-green-50"
                      >
                        Clear All Filters
                      </button>
                    </div>
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
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            currentPage === pageNum 
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
                      return <span key={index} className="px-2 text-gray-400">...</span>;
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
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    availability={availability}
                    setAvailability={setAvailability}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    categories={allCategories}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    formulations={allFormulations}
                    selectedFormulations={selectedFormulations}
                    setSelectedFormulations={setSelectedFormulations}
                    organicOnly={organicOnly}
                    setOrganicOnly={setOrganicOnly}
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
                      
                      {/* Sizes/Variants */}
                      {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                        <div className="mt-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Available Sizes:</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.sizes.map((size, index) => (
                              <span key={index} className="px-3 py-1 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                {size}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Foliar Application Icon */}
                      <div className="flex items-center justify-center gap-2 text-green-600 mt-4">
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
                        {selectedProduct.organic && (
                          <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Leaf className="w-4 h-4" />
                            ORGANIC
                          </span>
                        )}
                      </div>

                      <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {selectedProduct.name}
                      </h2>

                      {/* SKU */}
                      {selectedProduct.sku && (
                        <p className="text-sm text-gray-500 mb-2">SKU: {selectedProduct.sku}</p>
                      )}

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
                          {selectedProduct.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">
                              Rs. {selectedProduct.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <p className={`font-semibold mt-1 ${
                          selectedProduct.availability === 'In Stock' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {selectedProduct.availability}
                        </p>
                      </div>

                      {/* Crop Types */}
                      {selectedProduct.cropTypes && selectedProduct.cropTypes.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold text-gray-900 mb-2">Recommended for:</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.cropTypes.map((crop, index) => (
                              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {crop}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Shipping Info */}
                      <div className="bg-green-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-600">
                          <Truck className="inline w-5 h-5 mr-2" />
                          Free shipping on orders above Rs. 5000. Calculated at checkout.
                        </p>
                      </div>

                      {/* Quantity Selector */}
                      <div className="mb-8">
                        <p className="font-semibold text-gray-900 mb-3">Quantity</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                            disabled={selectedProduct.availability === 'Sold Out'}
                            className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="text-2xl font-bold w-12 text-center">{modalQuantity}</span>
                          <button
                            onClick={() => setModalQuantity(Math.min(modalQuantity + 1, 10))}
                            disabled={selectedProduct.availability === 'Sold Out' || modalQuantity >= 10}
                            className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                          <span className="text-gray-600 ml-4">
                            Total: Rs. {(selectedProduct.price * modalQuantity).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <button
                          onClick={() => {
                            handleAddToCart(selectedProduct, modalQuantity);
                            closeModal();
                          }}
                          className="py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          disabled={selectedProduct.availability === 'Sold Out'}
                        >
                          <ShoppingCart className="w-6 h-6" />
                          {selectedProduct.availability === 'Sold Out' ? 'Sold Out' : `Add ${modalQuantity} to Cart`}
                        </button>
                        <button
                          onClick={() => handleBuyNow(selectedProduct)}
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
                        .slice(0, 2)
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
                                      handleAddToCart(product, 1);
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

export default FoliarApplications;