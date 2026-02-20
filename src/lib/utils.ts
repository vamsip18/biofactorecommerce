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
// Discount utility functions
interface Product {
  id: string;
  collections?: { id: string } | null;
  variants?: { id: string }[];
}

export const getDiscountScore = (discount: Record<string, any>): number => {
  const candidates = [
    discount.discount_percentage,
    discount.percentage,
    discount.percent,
    discount.value,
    discount.amount,
    discount.discount_amount
  ];
  const numericValue = candidates.find(value => typeof value === "number" && !Number.isNaN(value));
  if (!numericValue) return 0;

  const valueType = String(discount.value_type || discount.discount_type || discount.type || "").toLowerCase();
  if (valueType.includes("percent")) return numericValue;

  return numericValue;
};

export const getDiscountedPrice = (originalPrice: number, discounts: any[], product?: Product): number => {
  if (!discounts || discounts.length === 0) return originalPrice;

  let applicableDiscount = null;
  const collectionId = product?.collections?.id;
  const variantIds = product?.variants?.map(variant => variant.id) || [];

  for (const discount of discounts) {
    if (discount.applies_to === "all") {
      applicableDiscount = discount;
      break;
    }

    if (!discount.applies_ids || discount.applies_ids.length === 0) continue;

    if (discount.applies_to === "products" && product && discount.applies_ids.includes(product.id)) {
      applicableDiscount = discount;
      break;
    }

    if (discount.applies_to === "collections" && collectionId && discount.applies_ids.includes(collectionId)) {
      applicableDiscount = discount;
      break;
    }

    if (discount.applies_to === "variants" && variantIds.some(id => discount.applies_ids!.includes(id))) {
      applicableDiscount = discount;
      break;
    }
  }

  if (!applicableDiscount) return originalPrice;

  const discountValue = getDiscountScore(applicableDiscount);
  if (!discountValue) return originalPrice;

  const valueType = String(applicableDiscount.value_type || applicableDiscount.discount_type || applicableDiscount.type || "").toLowerCase();

  if (valueType.includes("percent")) {
    return originalPrice * (1 - discountValue / 100);
  } else {
    return Math.max(0, originalPrice - discountValue);
  }
};