// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper function to get category route from collection
export const getCategoryRoute = (collection: { category: string; name: string; title?: string } | null | undefined): string => {
  if (!collection) return '/search';
  
  const category = collection.category?.toLowerCase() || '';
  const collectionName = collection.name || collection.title || '';
  const collectionSlug = collectionName.toLowerCase().replace(/\s+/g, '-');
  
  // Map categories to your existing routes
  const categoryRoutes: Record<string, string> = {
    'agriculture': `/agriculture/${collectionSlug}`,
    'aquaculture': `/aquaculture/${collectionSlug}`,
    'large-animals': '/large-animals',
    'kitchen-gardening': '/kitchen-gardening'
  };
  
  return categoryRoutes[category] || '/search';
};

// Helper function to get category icon
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    'agriculture': '🌱',
    'aquaculture': '🐟',
    'large-animals': '🐄',
    'kitchen-gardening': '🏡'
  };
  
  return icons[category.toLowerCase()] || '📦';
};

// Helper function to get collection slug from name
export const getCollectionSlug = (collectionName: string): string => {
  return collectionName.toLowerCase().replace(/\s+/g, '-');
};

// Helper function to parse search state from URL
export const parseSearchState = (): { searchQuery?: string; highlightProductId?: string } => {
  if (typeof window === 'undefined') return {};
  
  const url = new URL(window.location.href);
  const searchQuery = url.searchParams.get('q');
  const highlightProductId = url.searchParams.get('highlight');
  
  return {
    searchQuery: searchQuery || undefined,
    highlightProductId: highlightProductId || undefined
  };
};

// Helper function to navigate with search state
export const navigateWithSearch = (
  navigate: (to: string) => void,
  route: string,
  searchQuery?: string,
  highlightProductId?: string
) => {
  const url = new URL(route, window.location.origin);
  if (searchQuery) {
    url.searchParams.set('q', searchQuery);
  }
  if (highlightProductId) {
    url.searchParams.set('highlight', highlightProductId);
  }
  
  navigate(url.pathname + url.search);
};