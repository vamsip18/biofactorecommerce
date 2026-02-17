// src/components/home/BasketPreviewSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ArrowRight, ArrowUpRight, Shield, Target, Globe, Recycle, Leaf, Truck, Calendar, Star, Package, Clock, Check, Plus, Zap, Droplets, ShieldCheck, Brain, Thermometer, Users, Award, ShoppingCart, TrendingUp, Minus } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { getAllProducts, type Product, type ProductVariant } from "@/lib/supabase/products";
import { supabase } from "@/lib/supabase";
import 'swiper/css';
import 'swiper/css/autoplay';
// Import your images - update these with actual biofactor product images
import biofactorHero from "@/assets/biofactor-hero.png";
const MAX_CATEGORY_PRODUCTS = 6;

const getActiveVariants = (product: Product): ProductVariant[] => {
  return (product.variants || []).filter(variant => variant.is_active);
};

const getDefaultVariant = (product: Product): ProductVariant | null => {
  const activeVariants = getActiveVariants(product);
  if (activeVariants.length === 0) return null;

  return activeVariants.reduce((lowest, variant) =>
    variant.price < lowest.price ? variant : lowest
  );
};

const formatPrice = (price: number) => {
  if (!price || Number.isNaN(price)) return "Price on request";
  return `Rs. ${price.toLocaleString()}`;
};

const matchesKeywords = (value: string, keywords: string[]) => {
  return keywords.some(keyword => value.includes(keyword));
};

const productMatchesCategory = (product: Product, keywords: string[]) => {
  const collectionName = product.collections?.title?.toLowerCase() || "";
  const productName = product.name.toLowerCase();
  const productDescription = product.description?.toLowerCase() || "";

  return (
    matchesKeywords(collectionName, keywords) ||
    matchesKeywords(productName, keywords) ||
    matchesKeywords(productDescription, keywords)
  );
};

const getCategoryProducts = (products: Product[], keywords: string[]) => {
  return products
    .filter(product => productMatchesCategory(product, keywords))
    .slice(0, MAX_CATEGORY_PRODUCTS);
};

const agricultureKeywords = [
  "crop",
  "protection",
  "soil",
  "drip",
  "foliar",
  "special",
  "application",
  "insecticide",
  "fungicide",
  "pesticide",
  "neem",
  "proceed",
  "nutrition",
  "bsl4",
  "aadhar",
  "g-vam",
  "biofertilizer",
  "mycorrhiza",
  "k factor",
  "boc",
  "soil conditioner",
  "organic carbon",
  "chakra",
  "iim chakra",
  "high-k",
  "virnix",
  "agriseal",
  "stress",
  "carbon"
];

const aquacultureKeywords = [
  "aquaculture",
  "probiotic",
  "disease",
  "viral",
  "fungal",
  "bacterial",
  "preventive",
  "bio-enhancer",
  "modiphy",
  "e-vac",
  "virban",
  "kipper",
  "v-vacc",
  "dawn",
  "regalis"
];

const largeAnimalsKeywords = [
  "large animal",
  "large animals",
  "livestock",
  "cattle"
];

const kitchenGardeningKeywords = [
  "kitchen gardening",
  "home gardening",
  "home garden"
];

type CategoryKey = "agriculture" | "aquaculture" | "largeAnimals" | "kitchenGardening" | "other";

const categoryStyles: Record<CategoryKey, {
  label: string;
  badge: string;
  border: string;
  hoverBorder: string;
  price: string;
  nameHover: string;
  imageFrom: string;
  qtyHover: string;
  buttonGradient: string;
  buttonHover: string;
  solidButton: string;
}> = {
  agriculture: {
    label: "Agri",
    badge: "bg-green-600 text-white",
    border: "border-green-200",
    hoverBorder: "hover:border-green-300",
    price: "text-green-700",
    nameHover: "group-hover:text-green-700",
    imageFrom: "from-green-50",
    qtyHover: "hover:text-green-700",
    buttonGradient: "from-green-700 to-green-600",
    buttonHover: "hover:from-green-800 hover:to-green-700",
    solidButton: "bg-green-600 hover:bg-green-700"
  },
  aquaculture: {
    label: "Aqua",
    badge: "bg-cyan-600 text-white",
    border: "border-cyan-200",
    hoverBorder: "hover:border-cyan-300",
    price: "text-cyan-700",
    nameHover: "group-hover:text-cyan-700",
    imageFrom: "from-cyan-50",
    qtyHover: "hover:text-cyan-700",
    buttonGradient: "from-cyan-700 to-cyan-600",
    buttonHover: "hover:from-cyan-800 hover:to-cyan-700",
    solidButton: "bg-cyan-600 hover:bg-cyan-700"
  },
  largeAnimals: {
    label: "Large Animals",
    badge: "bg-amber-700 text-white",
    border: "border-amber-200",
    hoverBorder: "hover:border-amber-300",
    price: "text-amber-700",
    nameHover: "group-hover:text-amber-700",
    imageFrom: "from-amber-50",
    qtyHover: "hover:text-amber-700",
    buttonGradient: "from-amber-700 to-amber-600",
    buttonHover: "hover:from-amber-800 hover:to-amber-700",
    solidButton: "bg-amber-700 hover:bg-amber-800"
  },
  kitchenGardening: {
    label: "Kitchen Gardening",
    badge: "bg-lime-600 text-white",
    border: "border-lime-200",
    hoverBorder: "hover:border-lime-300",
    price: "text-lime-700",
    nameHover: "group-hover:text-lime-700",
    imageFrom: "from-lime-50",
    qtyHover: "hover:text-lime-700",
    buttonGradient: "from-lime-600 to-lime-500",
    buttonHover: "hover:from-lime-700 hover:to-lime-600",
    solidButton: "bg-lime-600 hover:bg-lime-700"
  },
  other: {
    label: "Biofactor",
    badge: "bg-green-600 text-white",
    border: "border-green-200",
    hoverBorder: "hover:border-green-300",
    price: "text-green-700",
    nameHover: "group-hover:text-green-700",
    imageFrom: "from-green-50",
    qtyHover: "hover:text-green-700",
    buttonGradient: "from-green-700 to-green-600",
    buttonHover: "hover:from-green-800 hover:to-green-700",
    solidButton: "bg-green-600 hover:bg-green-700"
  }
};

const getCategoryKey = (product: Product): CategoryKey => {
  const collectionName = product.collections?.title?.toLowerCase() || "";

  if (collectionName.includes("large animal")) return "largeAnimals";
  if (collectionName.includes("kitchen")) return "kitchenGardening";
  if (collectionName.includes("aqua")) return "aquaculture";
  if (collectionName.includes("agri") || collectionName.includes("crop") || collectionName.includes("soil")) {
    return "agriculture";
  }

  if (productMatchesCategory(product, largeAnimalsKeywords)) return "largeAnimals";
  if (productMatchesCategory(product, kitchenGardeningKeywords)) return "kitchenGardening";
  if (productMatchesCategory(product, aquacultureKeywords)) return "aquaculture";
  if (productMatchesCategory(product, agricultureKeywords)) return "agriculture";
  return "other";
};

const getDiscountScore = (discount: Record<string, any>): number => {
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

// Blog images
const blogImages = {
  blog1: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w-300&h=200&fit=crop",
  blog2: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=300&h=200&fit=crop",
  blog3: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w-300&h=200&fit=crop",
  blog4: "https://images.unsplash.com/photo-1557844352-761f16da8c67?w=300&h=200&fit=crop"
};

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-white to-teal-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-4xl lg:text-7xl font-bold leading-tight">
              <span className="text-white block">Next-Generation</span>
              <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent block">
                Biofactors
              </span>
              <span className="text-white block">for Optimal Health</span>
            </h1>

            <p className="text-xl text-gray-700 leading-relaxed">
              Scientifically-formulated biofactors that work at the cellular level to support energy,
              cognitive function, and overall vitality. Experience the difference of precision nutrition.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-gray-600">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">500+</div>
                <div className="text-sm text-gray-600">Clinical Studies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">Ecocert</div>
                <div className="text-sm text-gray-600">Certified</div>
              </div>
            </div>
          </motion.div>

          <img
            src={biofactorHero}
            alt="Biofactor supplements - advanced cellular nutrition"
            className="w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export const BestSellingProducts = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const defaultVariant = getDefaultVariant(product);
    if (!defaultVariant) {
      toast.error("This product is not available right now");
      return;
    }

    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      name: `${product.name} ${defaultVariant.title || ""}`.trim(),
      price: defaultVariant.price,
      image: defaultVariant.image_url || product.image_url || biofactorHero,
      category: product.collections?.title || "Home",
      stock: defaultVariant.stock,
      quantity: quantities[product.id] || 1
    });
    toast.success("Added to cart");

    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { products: allProducts } = await getAllProducts(undefined, 200, 0);
        const eligibleProducts = allProducts.filter(product =>
          productMatchesCategory(product, agricultureKeywords) ||
          productMatchesCategory(product, aquacultureKeywords) ||
          productMatchesCategory(product, largeAnimalsKeywords) ||
          productMatchesCategory(product, kitchenGardeningKeywords)
        );

        if (eligibleProducts.length === 0) {
          setProducts([]);
          return;
        }

        const productIds = eligibleProducts.map(product => product.id);
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

        const sortedProducts = [...eligibleProducts]
          .sort((a, b) => {
            const totalA = totals.get(a.id) || 0;
            const totalB = totals.get(b.id) || 0;
            if (totalA !== totalB) return totalB - totalA;
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
          .slice(0, 8);

        setProducts(sortedProducts);
      } catch (err) {
        console.error("Failed to load top selling products:", err);
        setError("Failed to load top selling products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  return (
    <section className="py-5 bg-green-50/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-700" />

            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-900">Top Selling Products</h2>
          </div>
        </div>

        <p className="text-gray-600 mb-12 max-w-2xl">
          Discover our most popular biofactor solutions for agriculture, aquaculture, and animal care
        </p>

        {/* Single Row Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4">
            {isLoading ? (
              <div className="w-full py-10 text-center text-gray-600">Loading top selling products...</div>
            ) : error ? (
              <div className="w-full py-10 text-center text-red-600">{error}</div>
            ) : (
              products.map((product, index) => {
                const defaultVariant = getDefaultVariant(product);
                if (!defaultVariant) return null;
                const categoryStyle = categoryStyles[getCategoryKey(product)];
                const imageUrl = defaultVariant.image_url || product.image_url || biofactorHero;
                const isSoldOut = defaultVariant.stock <= 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex-shrink-0 w-[280px] mx-2 group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${categoryStyle.border} ${categoryStyle.hoverBorder} flex flex-col`}
                  >
                    {/* Product Image */}
                    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${categoryStyle.imageFrom} to-white`}>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Tag Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle.badge}`}>
                          {categoryStyle.label}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      {/* <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-green-600" />
                  </button> */}

                      {/* Sold Out Overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info - Flex column with grow */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className={`font-semibold text-lg text-gray-900 ${categoryStyle.nameHover} transition-colors mb-2 line-clamp-2 min-h-[56px]`}>
                        {product.name}
                      </h3>

                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Package className="w-4 h-4 mr-1 flex-shrink-0" />
                        <span className="truncate">Vendor: {product.collections?.title || "Biofactor"}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className={`text-xl font-bold ${categoryStyle.price}`}>{formatPrice(defaultVariant.price)}</div>
                        </div>
                      </div>

                      {/* Quantity and Add to Cart Button */}
                      <div className="mt-auto flex items-center gap-2">
                        {!isSoldOut && (
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(product.id, -1);
                              }}
                              className={`px-2 py-1 text-gray-600 ${categoryStyle.qtyHover} hover:bg-gray-50`}
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
                              className={`px-2 py-1 text-gray-600 ${categoryStyle.qtyHover} hover:bg-gray-50`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <Button
                          className={`flex-1 ${isSoldOut
                            ? "bg-red-100 text-red-700 cursor-not-allowed"
                            : `bg-gradient-to-r ${categoryStyle.buttonGradient} ${categoryStyle.buttonHover} text-white`
                            }`}
                          disabled={isSoldOut}
                          onClick={() => !isSoldOut && handleAddToCart(product)}
                        >
                          {isSoldOut ? (
                            <>
                              <Clock className="w-4 h-4 mr-2" />
                              Sold Out
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* View All Button - Centered Below Products */}
        {/* <div className="text-center mt-12">
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300 px-8"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};


export const BestDealsProducts = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const defaultVariant = getDefaultVariant(product);
    if (!defaultVariant) {
      toast.error("This product is not available right now");
      return;
    }

    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      name: `${product.name} ${defaultVariant.title || ""}`.trim(),
      price: defaultVariant.price,
      image: defaultVariant.image_url || product.image_url || biofactorHero,
      category: product.collections?.title || "Deal",
      stock: defaultVariant.stock,
      quantity: quantities[product.id] || 1
    });
    toast.success("Added to cart");

    // Reset quantity for this product
    setQuantities(prev => ({
      ...prev,
      [product.id]: 1
    }));
  };

  useEffect(() => {
    const fetchBestDealsProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { products: allProducts } = await getAllProducts(undefined, 200, 0);
        const eligibleProducts = allProducts.filter(product =>
          productMatchesCategory(product, agricultureKeywords) ||
          productMatchesCategory(product, aquacultureKeywords) ||
          productMatchesCategory(product, largeAnimalsKeywords) ||
          productMatchesCategory(product, kitchenGardeningKeywords)
        );

        if (eligibleProducts.length === 0) {
          setProducts([]);
          return;
        }

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

        const appliesToAll = activeDiscounts.some((discount: { applies_to: string }) => discount.applies_to === "all");
        const dealIds = new Set<string>();
        const dealScores = new Map<string, number>();

        eligibleProducts.forEach((product) => {
          const collectionId = product.collections?.id;
          const variantIds = product.variants?.map(variant => variant.id) || [];

          activeDiscounts.forEach((discount: { applies_to: string; applies_ids: string[] | null }) => {
            if (appliesToAll) {
              dealIds.add(product.id);
            }

            if (!appliesToAll) {
              if (!discount.applies_ids || discount.applies_ids.length === 0) return;

              switch (discount.applies_to) {
                case "products":
                  if (!discount.applies_ids.includes(product.id)) return;
                  break;
                case "collections":
                  if (!collectionId || !discount.applies_ids.includes(collectionId)) return;
                  break;
                case "variants":
                  if (!variantIds.some(id => discount.applies_ids!.includes(id))) return;
                  break;
                default:
                  return;
              }

              dealIds.add(product.id);
            }

            const discountScore = getDiscountScore(discount as Record<string, any>);
            const currentScore = dealScores.get(product.id) || 0;
            if (discountScore > currentScore) {
              dealScores.set(product.id, discountScore);
            }
          });
        });

        const scoredDeals = eligibleProducts
          .filter(product => dealIds.has(product.id))
          .map(product => ({ product, score: dealScores.get(product.id) || 0 }));

        const dealsList = scoredDeals
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return new Date(b.product.created_at).getTime() - new Date(a.product.created_at).getTime();
          })
          .map(item => item.product);

        setProducts(dealsList);
      } catch (err) {
        console.error("Failed to load best deals:", err);
        setError("Failed to load best deals");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestDealsProducts();
  }, []);

  return (
    <section className="py-5 bg-green-50/40">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-900">
              🔥 Best Deals
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Explore our best deal products with exclusive limited-time discounts
            </p>
          </div>
        </div>

        {/* Single Row Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4">
            {isLoading ? (
              <div className="w-full py-10 text-center text-gray-600">Loading best deals...</div>
            ) : error ? (
              <div className="w-full py-10 text-center text-red-600">{error}</div>
            ) : (
              products.map((product, index) => {
                const defaultVariant = getDefaultVariant(product);
                if (!defaultVariant) return null;
                const categoryStyle = categoryStyles[getCategoryKey(product)];
                const imageUrl = defaultVariant.image_url || product.image_url || biofactorHero;
                const isSoldOut = defaultVariant.stock <= 0;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex-shrink-0 w-[280px] mx-2 group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border ${categoryStyle.border} ${categoryStyle.hoverBorder} flex flex-col`}
                  >
                    {/* Product Image */}
                    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${categoryStyle.imageFrom} to-white`}>
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${categoryStyle.badge}`}>
                          {categoryStyle.label}
                        </span>
                      </div>

                      {/* Sold Out Overlay */}
                      {isSoldOut && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                            Sold Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className={`font-semibold text-lg text-gray-900 ${categoryStyle.nameHover} transition-colors mb-2 line-clamp-2 min-h-[56px]`}>
                        {product.name}
                      </h3>

                      <div className="text-sm text-gray-500 mb-3">
                        Vendor: {product.collections?.title || "Biofactor"}
                      </div>

                      {/* Price Section */}
                      <div className="mb-4">
                        <div className={`text-xl font-bold ${categoryStyle.price}`}>
                          {formatPrice(defaultVariant.price)}
                        </div>
                      </div>

                      {/* Quantity and Grab Deal Button */}
                      <div className="mt-auto flex items-center gap-2">
                        {!isSoldOut && (
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(product.id, -1);
                              }}
                              className={`px-2 py-1 text-gray-600 ${categoryStyle.qtyHover} hover:bg-gray-50`}
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
                              className={`px-2 py-1 text-gray-600 ${categoryStyle.qtyHover} hover:bg-gray-50`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <Button
                          className={`flex-1 ${isSoldOut
                            ? "bg-red-100 text-red-700 cursor-not-allowed"
                            : `bg-gradient-to-r ${categoryStyle.buttonGradient} ${categoryStyle.buttonHover} text-white`
                            }`}
                          disabled={isSoldOut}
                          onClick={() => !isSoldOut && handleAddToCart(product)}
                        >
                          {isSoldOut ? "Sold Out" : "Grab Deal"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* View All Button */}
        {/* <div className="text-center mt-12">
          <Link to="/products">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-8"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div> */}
      </div>
    </section>
  );
};


// Blog Card Component
const BlogCard = ({ blog, index }: { blog: any; index: number }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-emerald-100 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="text-sm text-emerald-700">{blog.date}</span>
          <span className="w-1 h-1 bg-emerald-300 rounded-full"></span>
          <span className="text-sm text-emerald-700">{blog.readTime}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
          {blog.title}
        </h3>

        <p className="text-gray-700 mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>

        {/* Read More link at bottom */}
        <div className="mt-auto">
          <Link
            to={blog.url}
            className="inline-flex items-center text-emerald-700 hover:text-emerald-800 font-medium group/link"
          >
            Read More
            <ArrowUpRight className="w-4 h-4 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// Trending Topics Section
// export const TrendingTopics = () => {
//   const blogs = [
//     {
//       id: 1,
//       title: "The Science Behind Biofactors: How They Work at Cellular Level",
//       excerpt: "Explore the mechanism of action of biofactors and their impact on cellular health.",
//       date: "Mar 15, 2024",
//       readTime: "5 min read",
//       image: blogImages.blog1,
//       url: "/blog/science-behind-biofactors"
//     },
//     {
//       id: 2,
//       title: "Sustainable Agriculture with Biofactor Solutions",
//       excerpt: "Learn how biofactors are revolutionizing sustainable farming practices.",
//       date: "Mar 10, 2024",
//       readTime: "7 min read",
//       image: blogImages.blog2,
//       url: "/blog/sustainable-agriculture"
//     },
//     {
//       id: 3,
//       title: "Aquaculture Innovations: Biofactor's Impact on Fish Health",
//       excerpt: "Discover how biofactors are improving aquaculture productivity and health.",
//       date: "Mar 5, 2024",
//       readTime: "6 min read",
//       image: blogImages.blog3,
//       url: "/blog/aquaculture-innovations"
//     },
//     {
//       id: 4,
//       title: "Home Gardening Made Easy with Biofactor Products",
//       excerpt: "Tips and tricks for using biofactors in your home garden for better yields.",
//       date: "Feb 28, 2024",
//       readTime: "4 min read",
//       image: blogImages.blog4,
//       url: "/blog/home-gardening-guide"
//     }
//   ];

//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center mb-12">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               <TrendingUp className="w-6 h-6 text-green-500" />
//               <span className="text-sm font-semibold text-green-600">TRENDING NOW</span>
//             </div>
//             <h2 className="text-3xl md:text-4xl font-bold text-green-900">Latest Insights & Updates</h2>
//             <p className="text-gray-600 mt-2">Stay informed with the latest in biofactor technology</p>
//           </div>
//           <Link to="/blog">
//             <Button variant="outline" className="gap-2">
//               View All Articles
//               <ArrowRight className="w-4 h-4" />
//             </Button>
//           </Link>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {blogs.map((blog, index) => (
//             <BlogCard key={blog.id} blog={blog} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// Home category rows section
export const CategoryProductsSection = () => {
  const [categoryProducts, setCategoryProducts] = useState({
    agriculture: [] as Product[],
    aquaculture: [] as Product[],
    largeAnimals: [] as Product[],
    kitchenGardening: [] as Product[]
  });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { products } = await getAllProducts(undefined, 200, 0);

        const agriculture = getCategoryProducts(products, agricultureKeywords);
        const aquaculture = getCategoryProducts(products, aquacultureKeywords);
        const largeAnimals = getCategoryProducts(products, largeAnimalsKeywords);
        const kitchenGardening = getCategoryProducts(products, kitchenGardeningKeywords);

        setCategoryProducts({
          agriculture,
          aquaculture,
          largeAnimals,
          kitchenGardening
        });

        const initialQuantities: Record<string, number> = {};
        [...agriculture, ...aquaculture, ...largeAnimals, ...kitchenGardening].forEach(product => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Failed to load category products:", err);
        setError("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, []);

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = (product: Product) => {
    const defaultVariant = getDefaultVariant(product);
    if (!defaultVariant) {
      toast.error("This product is not available right now");
      return;
    }

    addToCart({
      productId: product.id,
      variantId: defaultVariant.id,
      name: `${product.name} ${defaultVariant.title || ""}`.trim(),
      price: defaultVariant.price,
      image: defaultVariant.image_url || product.image_url || "",
      category: product.collections?.title || "Home",
      stock: defaultVariant.stock,
      quantity: quantities[product.id] || 1
    });
    toast.success("Added to cart");
  };

  const renderProductsRow = (products: Product[], theme: {
    title: string;
    subtitle: string;
    icon: JSX.Element;
    link: string;
    sectionClass: string;
    badgeClass: string;
    iconClass: string;
    titleClass: string;
    accentText: string;
    buttonClass: string;
    outlineClass: string;
  }) => {
    return (
      <section className={`py-8 ${theme.sectionClass}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 border ${theme.badgeClass}`}>
              <span className={theme.iconClass}>{theme.icon}</span>
              <span className={`text-sm font-semibold ${theme.titleClass}`}>{theme.title}</span>
            </div>
            <h2 className={`text-2xl md:text-3xl font-bold ${theme.titleClass}`}>
              {theme.subtitle}
            </h2>
          </div>
          <Link to={theme.link}>
            <Button
              variant="outline"
              size="lg"
              className={`gap-2 ${theme.outlineClass}`}
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-6 -mx-4 px-4">
            {products.map((product, index) => {
              const defaultVariant = getDefaultVariant(product);
              const activeVariants = getActiveVariants(product);
              const isSoldOut = activeVariants.length === 0 || activeVariants.every(variant => variant.stock <= 0);
              const price = defaultVariant?.price || 0;
              const imageUrl = defaultVariant?.image_url || product.image_url || biofactorHero;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[280px] mx-2 group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-white to-gray-50">
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className={`font-semibold text-lg text-gray-900 ${theme.accentText} transition-colors mb-2 line-clamp-2 min-h-[56px]`}>
                      {product.name}
                    </h3>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Package className="w-4 h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{product.collections?.title || "Biofactor"}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{formatPrice(price)}</div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2">
                      {!isSoldOut && (
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleQuantityChange(product.id, -1);
                            }}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            disabled={(quantities[product.id] || 1) <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-1 border-x border-gray-300 min-w-8 text-center text-sm">
                            {quantities[product.id] || 1}
                          </span>
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              handleQuantityChange(product.id, 1);
                            }}
                            className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <Button
                        className={`flex-1 ${isSoldOut
                          ? "bg-red-100 text-red-700 cursor-not-allowed"
                          : theme.buttonClass
                          }`}
                        disabled={isSoldOut}
                        onClick={() => !isSoldOut && handleAddToCart(product)}
                      >
                        {isSoldOut ? (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Sold Out
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">Loading category products...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 space-y-10">
        {renderProductsRow(categoryProducts.agriculture, {
          title: "AGRICULTURE",
          subtitle: "Agriculture Best Sellers",
          icon: <Leaf className="w-5 h-5" />,
          link: "/agriculture",
          sectionClass: "bg-green-50/60",
          badgeClass: "bg-green-900/10 border-green-900/20",
          iconClass: "text-green-700",
          titleClass: "text-green-900",
          accentText: "group-hover:text-green-700",
          buttonClass: "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white",
          outlineClass: "border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300"
        })}

        {renderProductsRow(categoryProducts.aquaculture, {
          title: "AQUACULTURE",
          subtitle: "Aquaculture Best Sellers",
          icon: <Droplets className="w-5 h-5" />,
          link: "/aquaculture",
          sectionClass: "bg-cyan-50/60",
          badgeClass: "bg-cyan-900/10 border-cyan-900/20",
          iconClass: "text-cyan-700",
          titleClass: "text-cyan-900",
          accentText: "group-hover:text-cyan-700",
          buttonClass: "bg-gradient-to-r from-cyan-700 to-cyan-600 hover:from-cyan-800 hover:to-cyan-700 text-white",
          outlineClass: "border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-800 hover:border-cyan-300"
        })}

        {renderProductsRow(categoryProducts.largeAnimals, {
          title: "LARGE ANIMALS",
          subtitle: "Large Animal Best Sellers",
          icon: <Users className="w-5 h-5" />,
          link: "/large-animals",
          sectionClass: "bg-amber-50/70",
          badgeClass: "bg-amber-900/10 border-amber-900/20",
          iconClass: "text-amber-700",
          titleClass: "text-amber-900",
          accentText: "group-hover:text-amber-700",
          buttonClass: "bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white",
          outlineClass: "border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-300"
        })}

        {renderProductsRow(categoryProducts.kitchenGardening, {
          title: "KITCHEN GARDENING",
          subtitle: "Kitchen Gardening Best Sellers",
          icon: <Sparkles className="w-5 h-5" />,
          link: "/kitchen-gardening",
          sectionClass: "bg-green-50/60",
          badgeClass: "bg-lime-900/10 border-lime-900/20",
          iconClass: "text-lime-700",
          titleClass: "text-lime-900",
          accentText: "group-hover:text-lime-700",
          buttonClass: "bg-gradient-to-r from-lime-700 to-lime-600 hover:from-lime-800 hover:to-lime-700 text-white",
          outlineClass: "border-lime-200 text-lime-700 hover:bg-lime-50 hover:text-lime-800 hover:border-lime-300"
        })}
      </div>
    </section>
  );
};


// Main export
export const BasketPreviewSection = () => {
  return (
    <>
      <HeroSection />
      <BestSellingProducts />
      {/* <TrendingTopics /> */}
      <CategoryProductsSection />
    </>
  );
};