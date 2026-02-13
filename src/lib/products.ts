// src/lib/supabase/products.ts - UPDATED FOR YOUR SCHEMA
import { supabase } from './supabase';

export interface Product {
  id: string;
  collection_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants: ProductVariant[];
  collections?: {
    id: string;
    title: string;
    name: string;
    category: string;
    is_active: boolean;
    products_count: number;
    description?: string | null;
    image_url?: string | null;
  } | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  title: string;
  variant_type: 'simple' | 'volume' | 'weight' | 'sub_product';
  value: number | null;
  unit: string | null;
  price: number;
  stock: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  collections?: string[];
}

// Main search function
export const searchProducts = async (
  query: string,
  filters?: SearchFilters,
  limit: number = 20,
  offset: number = 0
): Promise<{ products: Product[]; total: number }> => {
  try {
    const searchQuery = query.trim().toLowerCase();
    
    if (!searchQuery) {
      return await getAllProducts(filters, limit, offset);
    }

    const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 0);
    
    if (searchTerms.length === 0) {
      return { products: [], total: 0 };
    }

    // Build search conditions
    const orConditions = searchTerms.map(term => 
      `name.ilike.%${term}%,description.ilike.%${term}%`
    ).join(',');

    // Build the query with proper collection joins
    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        collections:collection_id!inner(*)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('collections.is_active', true)
      .or(orConditions)
      .range(offset, offset + limit - 1);

    // Apply filters
    if (filters) {
      if (filters.category) {
        supabaseQuery = supabaseQuery.eq('collections.category', filters.category);
      }
      
      if (filters.collections && filters.collections.length > 0) {
        supabaseQuery = supabaseQuery.in('collection_id', filters.collections);
      }
    }

    const { data: products, error, count } = await supabaseQuery;

    if (error) {
      console.error('Supabase search error:', error);
      throw error;
    }

    // Apply post-fetch filters (price and stock)
    let filteredProducts = (products || []).filter(product => {
      const hasMatchingVariants = product.variants.some(variant => {
        if (!variant.is_active) return false;
        
        // Stock filter
        if (filters?.inStock && variant.stock <= 0) return false;
        
        // Price filter
        if (filters?.minPrice && variant.price < filters.minPrice) return false;
        if (filters?.maxPrice && variant.price > filters.maxPrice) return false;
        
        return true;
      });
      
      return hasMatchingVariants;
    });

    // Calculate relevance score
    const productsWithRelevance = filteredProducts.map(product => ({
      product,
      relevance: calculateRelevance(product, searchTerms)
    }));

    // Sort by relevance
    productsWithRelevance.sort((a, b) => b.relevance - a.relevance);

    return {
      products: productsWithRelevance.map(p => p.product),
      total: count || 0
    };

  } catch (error) {
    console.error('Error searching products:', error);
    return { products: [], total: 0 };
  }
};

// Get all products
export const getAllProducts = async (
  filters?: SearchFilters,
  limit: number = 20,
  offset: number = 0
): Promise<{ products: Product[]; total: number }> => {
  try {
    let supabaseQuery = supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        collections:collection_id!inner(*)
      `, { count: 'exact' })
      .eq('is_active', true)
      .eq('collections.is_active', true)
      .range(offset, offset + limit - 1);

    if (filters?.category) {
      supabaseQuery = supabaseQuery.eq('collections.category', filters.category);
    }

    if (filters?.collections && filters.collections.length > 0) {
      supabaseQuery = supabaseQuery.in('collection_id', filters.collections);
    }

    const { data: products, error, count } = await supabaseQuery;

    if (error) {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    // Apply post-fetch filters
    let filteredProducts = (products || []).filter(product => {
      const hasMatchingVariants = product.variants.some(variant => {
        if (!variant.is_active) return false;
        
        if (filters?.inStock && variant.stock <= 0) return false;
        
        if (filters?.minPrice && variant.price < filters.minPrice) return false;
        if (filters?.maxPrice && variant.price > filters.maxPrice) return false;
        
        return true;
      });
      
      return hasMatchingVariants;
    });

    return {
      products: filteredProducts,
      total: count || 0
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], total: 0 };
  }
};

// Calculate relevance score
const calculateRelevance = (product: Product, searchTerms: string[]): number => {
  let score = 0;
  const productName = product.name.toLowerCase();
  const productDescription = (product.description || '').toLowerCase();

  searchTerms.forEach(term => {
    // Exact name match
    if (productName === term) {
      score += 10;
    }
    // Name contains term
    else if (productName.includes(term)) {
      score += 5;
    }
    // Name starts with term
    else if (productName.startsWith(term)) {
      score += 3;
    }

    // Description contains term
    if (productDescription.includes(term)) {
      score += 2;
    }

    // Check variants SKU
    product.variants.forEach(variant => {
      if (variant.sku.toLowerCase().includes(term)) {
        score += 8;
      }
    });

    // Check collection name/title
    if (product.collections) {
      const collectionName = (product.collections.name || '').toLowerCase();
      const collectionTitle = (product.collections.title || '').toLowerCase();
      
      if (collectionName.includes(term) || collectionTitle.includes(term)) {
        score += 3;
      }
    }
  });

  // Bonus for active products with stock
  const hasStock = product.variants.some(v => v.stock > 0);
  if (hasStock) {
    score += 1;
  }

  return score;
};

// Get collections for filtering
export const getCollections = async (): Promise<Array<{ id: string; title: string; name: string; category: string }>> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('id, title, name, category')
      .eq('is_active', true)
      .order('title');

    if (error) throw error;
    
    // Ensure name field is populated
    const collections = (data || []).map(collection => ({
      ...collection,
      name: collection.name || collection.title // Use title if name is not set
    }));
    
    return collections;
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

// Get categories from collections
export const getCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null)
      .distinct()
      .order('category');

    if (error) throw error;
    
    const categories = (data || [])
      .map(item => item.category)
      .filter((category): category is string => category !== null && category !== undefined);
    
    return Array.from(new Set(categories)); // Remove duplicates
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get price range for products
export const getPriceRange = async (filters?: SearchFilters): Promise<{ min: number; max: number }> => {
  try {
    let supabaseQuery = supabase
      .from('product_variants')
      .select('price')
      .eq('is_active', true);

    // Apply collection filters if needed
    if (filters?.collections && filters.collections.length > 0) {
      // Get products in these collections first
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .in('collection_id', filters.collections);
      
      if (products && products.length > 0) {
        const productIds = products.map(p => p.id);
        supabaseQuery = supabaseQuery.in('product_id', productIds);
      }
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;

    const prices = (data || []).map(item => item.price);
    const min = prices.length > 0 ? Math.min(...prices) : 0;
    const max = prices.length > 0 ? Math.max(...prices) : 10000;

    return { min, max };
  } catch (error) {
    console.error('Error fetching price range:', error);
    return { min: 0, max: 10000 };
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        variants:product_variants(*),
        collections:collection_id(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// Sort products
export const sortProducts = (
  products: Product[],
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'name'
): Product[] => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => {
        const minPriceA = Math.min(...a.variants.filter(v => v.is_active).map(v => v.price));
        const minPriceB = Math.min(...b.variants.filter(v => v.is_active).map(v => v.price));
        return minPriceA - minPriceB;
      });
      
    case 'price-high':
      return sorted.sort((a, b) => {
        const maxPriceA = Math.max(...a.variants.filter(v => v.is_active).map(v => v.price));
        const maxPriceB = Math.max(...b.variants.filter(v => v.is_active).map(v => v.price));
        return maxPriceB - maxPriceA;
      });
      
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
      
    default: // relevance
      return sorted;
  }
};
