import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Clock, Users, Leaf, Search, Filter, Heart, Star, Flame, Share2, ShoppingCart, TrendingUp, Award, Droplets, Shield, Sprout, ThermometerSun, CloudRain, TreePine, Wheat, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Enhanced BioFact products data with agricultural focus
const products = [
  {
    id: 1,
    name: "Bio-Organic Super Fertilizer",
    description: "Complete NPK fertilizer enriched with beneficial microbes for all crops",
    formulation: "Liquid",
    coverage: "1 acre",
    category: "Fertilizer",
    rating: 4.9,
    favorites: 267,
    image: "https://images.unsplash.com/photo-1597848212624-e82769e2d4f2?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Increases yield by 30-40%",
      "Improves soil fertility naturally",
      "Reduces chemical fertilizer dependency",
      "Enhances water retention capacity"
    ],
    usage: [
      "Mix 5ml per liter of water",
      "Apply during sowing or transplanting",
      "Use every 15 days during growth period",
      "Can be used with drip irrigation"
    ],
    specs: {
      npk: "8:3:6",
      organicContent: "85%",
      microbialCount: "10^8 CFU/g",
      shelfLife: "24 months",
      packaging: "1L, 5L, 20L"
    },
    tags: ["Organic", "Microbial", "Complete"],
    color: "from-green-500 to-emerald-600",
    price: "₹1,299"
  },
  {
    id: 2,
    name: "Plant Growth Promoter",
    description: "Concentrated plant growth hormones with micronutrients for vigorous growth",
    formulation: "Powder",
    coverage: "2 acres",
    category: "Growth Promoter",
    rating: 4.7,
    favorites: 198,
    image: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4a?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Stimulates root development",
      "Enhances flowering and fruiting",
      "Improves stress tolerance",
      "Boosts nutrient uptake"
    ],
    usage: [
      "Dissolve 10g in 10 liters of water",
      "Apply as foliar spray or soil drench",
      "Use during vegetative and flowering stages",
      "Avoid application in direct sunlight"
    ],
    specs: {
      composition: "Auxins, Cytokinins, Gibberellins",
      micronutrients: "Zn, Fe, Cu, Mn, B",
      solubility: "100% water soluble",
      shelfLife: "18 months",
      packaging: "250g, 500g, 1kg"
    },
    tags: ["Hormone", "Micronutrients", "Flowering"],
    color: "from-blue-500 to-cyan-600",
    price: "₹899"
  },
  {
    id: 3,
    name: "Bio-Pesticide Concentrate",
    description: "Natural pesticide derived from neem and other botanical extracts",
    formulation: "Liquid",
    coverage: "0.5 acre",
    category: "Pesticide",
    rating: 4.8,
    favorites: 312,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Controls 50+ insect pests",
      "Safe for beneficial insects",
      "No chemical residue",
      "Zero waiting period for harvest"
    ],
    usage: [
      "Mix 3ml per liter of water",
      "Spray thoroughly on both leaf surfaces",
      "Apply early morning or late evening",
      "Repeat every 7-10 days as needed"
    ],
    specs: {
      activeIngredients: "Azadirachtin 0.3%",
      otherIngredients: "Neem oil, Garlic extract",
      toxicity: "Non-toxic to humans & animals",
      shelfLife: "12 months",
      packaging: "250ml, 500ml, 1L"
    },
    tags: ["Organic", "Neem", "Safe"],
    color: "from-purple-500 to-violet-600",
    price: "₹749"
  },
  {
    id: 4,
    name: "Soil Conditioner Pro",
    description: "Advanced soil amendment to improve structure and fertility",
    formulation: "Granular",
    coverage: "1 acre",
    category: "Soil Amendment",
    rating: 4.6,
    favorites: 145,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Improves soil pH balance",
      "Increases organic matter content",
      "Enhances microbial activity",
      "Reduces soil compaction"
    ],
    usage: [
      "Apply 50kg per acre",
      "Mix thoroughly with top soil",
      "Best applied before sowing",
      "Can be used with existing fertilizers"
    ],
    specs: {
      organicMatter: "60%",
      moistureContent: "15%",
      ph: "6.5-7.5",
      shelfLife: "36 months",
      packaging: "5kg, 25kg, 50kg"
    },
    tags: ["Soil Health", "pH Balance", "Amendment"],
    color: "from-amber-500 to-orange-600",
    price: "₹1,899"
  },
  {
    id: 5,
    name: "Crop-Specific Nutrient Mix",
    description: "Customized nutrient formulation for different crop requirements",
    formulation: "Powder",
    coverage: "1 acre",
    category: "Specialty Fertilizer",
    rating: 4.9,
    favorites: 289,
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Tailored for specific crop needs",
      "Balanced nutrient delivery",
      "Improves crop quality",
      "Reduces nutrient wastage"
    ],
    usage: [
      "Available for 20+ major crops",
      "Follow crop-specific dosage",
      "Apply as basal and top dressing",
      "Consult agronomist for best results"
    ],
    specs: {
      variants: "Cereals, Pulses, Vegetables, Fruits",
      npkRange: "Customized per crop",
      solubility: "95% water soluble",
      shelfLife: "24 months",
      packaging: "5kg, 10kg, 25kg"
    },
    tags: ["Custom", "Balanced", "Crop-Specific"],
    color: "from-teal-500 to-green-600",
    price: "₹1,599"
  },
  {
    id: 6,
    name: "Microbial Inoculant",
    description: "Concentrated beneficial bacteria for nitrogen fixation and phosphorus solubilization",
    formulation: "Carrier-based",
    coverage: "2 acres",
    category: "Microbial",
    rating: 4.7,
    favorites: 167,
    image: "https://images.unsplash.com/photo-1592982537447-7444dc31f8e8?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Fixes atmospheric nitrogen",
      "Solubilizes locked phosphorus",
      "Produces growth hormones",
      "Suppresses soil pathogens"
    ],
    usage: [
      "Mix with seeds before sowing",
      "Can be used as soil application",
      "Apply with organic manure",
      "Store in cool, dry place"
    ],
    specs: {
      microbialCount: "10^9 CFU/g",
      strains: "Rhizobium, Azotobacter, PSB",
      carrier: "Lignite based",
      shelfLife: "12 months",
      packaging: "200g, 500g, 1kg"
    },
    tags: ["Microbes", "Nitrogen", "Phosphorus"],
    color: "from-rose-500 to-pink-600",
    price: "₹549"
  },
  {
    id: 7,
    name: "Water-Saving Granules",
    description: "Hydrogel granules that retain water and release it slowly to plants",
    formulation: "Granular",
    coverage: "0.25 acre",
    category: "Water Management",
    rating: 4.5,
    favorites: 98,
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Reduces irrigation by 40-50%",
      "Prevents water stress in plants",
      "Improves nutrient availability",
      "Works for 3-5 years"
    ],
    usage: [
      "Apply 2-4kg per acre",
      "Mix with soil near root zone",
      "Suitable for all crops",
      "Rehydrate before use in dry soils"
    ],
    specs: {
      waterRetention: "400 times its weight",
      particleSize: "0.5-3mm",
      composition: "Potassium polyacrylate",
      shelfLife: "60 months",
      packaging: "1kg, 5kg, 10kg"
    },
    tags: ["Water Saving", "Hydrogel", "Drought"],
    color: "from-cyan-500 to-blue-600",
    price: "₹2,499"
  },
  {
    id: 8,
    name: "Seed Treatment Formula",
    description: "Organic coating for seeds to improve germination and early growth",
    formulation: "Liquid",
    coverage: "100kg seeds",
    category: "Seed Treatment",
    rating: 4.8,
    favorites: 134,
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Improves germination rate by 20%",
      "Protects against soil-borne diseases",
      "Enhances early root development",
      "Safe for all seed types"
    ],
    usage: [
      "Mix 10ml per kg of seeds",
      "Coat seeds evenly and dry in shade",
      "Sow within 24 hours of treatment",
      "Use with all planting methods"
    ],
    specs: {
      activeIngredients: "Trichoderma, Pseudomonas",
      coatingMaterial: "Organic polymers",
      dryingTime: "2-3 hours",
      shelfLife: "18 months",
      packaging: "100ml, 250ml, 500ml"
    },
    tags: ["Seed", "Germination", "Protection"],
    color: "from-indigo-500 to-purple-600",
    price: "₹399"
  },
  {
    id: 9,
    name: "Compost Booster",
    description: "Microbial accelerator for faster composting of organic waste",
    formulation: "Powder",
    coverage: "1 ton compost",
    category: "Composting",
    rating: 4.4,
    favorites: 89,
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop&q=80",
    benefits: [
      "Reduces composting time by 50%",
      "Eliminates foul odor",
      "Produces nutrient-rich compost",
      "Kills pathogens and weed seeds"
    ],
    usage: [
      "Sprinkle 100g per layer of compost",
      "Maintain proper moisture (40-50%)",
      "Turn compost pile every 7 days",
      "Ready in 30-45 days"
    ],
    specs: {
      microbialCount: "10^8 CFU/g",
      temperature: "Raises to 60-70°C",
      composition: "Cellulolytic & lignolytic microbes",
      shelfLife: "24 months",
      packaging: "250g, 500g, 1kg"
    },
    tags: ["Compost", "Waste Management", "Microbial"],
    color: "from-brown-500 to-amber-700",
    price: "₹299"
  },
];

const categories = ["All", "Fertilizer", "Growth Promoter", "Pesticide", "Soil Amendment", "Specialty Fertilizer", "Microbial", "Water Management", "Seed Treatment", "Composting"];
const formulations = ["All", "Liquid", "Powder", "Granular", "Carrier-based"];
const coverageRanges = ["All", "Small (<1 acre)", "Medium (1-2 acres)", "Large (>2 acres)"];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormulation, setSelectedFormulation] = useState("All");
  const [selectedCoverage, setSelectedCoverage] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('productFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesFormulation = selectedFormulation === "All" || product.formulation === selectedFormulation;
    const matchesCoverage = selectedCoverage === "All" || 
      (selectedCoverage === "Small (<1 acre)" && (product.coverage.includes("0.5") || product.coverage.includes("0.25"))) ||
      (selectedCoverage === "Medium (1-2 acres)" && (product.coverage === "1 acre" || product.coverage === "2 acres")) ||
      (selectedCoverage === "Large (>2 acres)" && product.coverage.includes(">"));
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesFormulation && matchesCoverage && matchesSearch;
  });

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id];
      
      // Show toast notification
      const product = products.find(p => p.id === id);
      if (product) {
        if (newFavorites.includes(id)) {
          toast.success(`${product.name} added to favorites!`);
        } else {
          toast.info(`${product.name} removed from favorites`);
        }
      }
      
      return newFavorites;
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Add to cart function
  const addToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      // Get existing cart or initialize empty array
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Parse price from string (₹1,299 -> 1299)
      const price = parseFloat(product.price.replace('₹', '').replace(',', ''));
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: price,
          quantity: 1,
          image: product.image,
          category: product.category,
          formulation: product.formulation,
          coverage: product.coverage
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Dispatch custom event to update header cart count
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      
      // Show success toast
      toast.success(`${product.name} added to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => window.location.href = '/cart'
        },
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  // Add to cart from modal
  const addToCartFromModal = (product: any) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const price = parseFloat(product.price.replace('₹', '').replace(',', ''));
      
      const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
      
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: price,
          quantity: 1,
          image: product.image,
          category: product.category,
          formulation: product.formulation,
          coverage: product.coverage
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      const event = new CustomEvent('cartUpdated');
      window.dispatchEvent(event);
      
      toast.success(`${product.name} added to cart!`, {
        action: {
          label: "View Cart",
          onClick: () => {
            setShowProductModal(false);
            window.location.href = '/cart';
          }
        },
      });
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart. Please try again.');
    }
  };

  const ProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <AnimatePresence>
        {showProductModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-10 z-50 overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="flex justify-between items-center p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-10 rounded-full bg-gradient-to-b ${selectedProduct.color}`} />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                      <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-gray-100"
                      onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.includes(selectedProduct.id) 
                            ? "fill-red-500 text-red-500" 
                            : "text-gray-700"
                        }`}
                      />
                    </Button>
                    <Button
                      onClick={() => setShowProductModal(false)}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  {/* Left Column */}
                  <div className="md:col-span-2">
                    {/* Quote Section */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-6 h-6 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">Certified Organic & Sustainable</span>
                      </div>
                      <p className="text-gray-600 text-lg">
                        {selectedProduct.description}
                      </p>
                    </div>

                    {/* Product Details */}
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplets className="w-5 h-5 text-green-700" />
                          <span className="font-semibold text-gray-900">Formulation</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedProduct.formulation}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <TreePine className="w-5 h-5 text-green-700" />
                          <span className="font-semibold text-gray-900">Coverage</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedProduct.coverage}</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Award className="w-5 h-5 text-green-700" />
                          <span className="font-semibold text-gray-900">Rating</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{selectedProduct.rating}/5</div>
                      </div>
                    </div>

                    {/* Key Benefits */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        Key Benefits
                      </h3>
                      <div className="bg-green-50 rounded-2xl p-6">
                        <ul className="space-y-3">
                          {selectedProduct.benefits.map((benefit: string, index: number) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm"
                            >
                              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ✓
                              </div>
                              <span className="text-gray-700">{benefit}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Image */}
                  <div className="md:col-span-1">
                    <div className="sticky top-8">
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          <span className={`bg-gradient-to-r ${selectedProduct.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}>
                            {selectedProduct.category}
                          </span>
                          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-bold text-gray-900">{selectedProduct.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price & Action */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 mb-6">
                        <div className="flex items-center gap-2 mb-4">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-gray-900">Pricing</span>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-6">{selectedProduct.price}</div>
                        <div className="space-y-3">
                          <Button 
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            onClick={() => addToCartFromModal(selectedProduct)}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Add to Cart
                          </Button>
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => {
                              setShowProductModal(false);
                              window.location.href = '/cart';
                            }}
                          >
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Go to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Usage Instructions */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-green-500" />
                    Usage Instructions
                  </h3>
                  <div className="space-y-4">
                    {selectedProduct.usage.map((step: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-1">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Technical Specifications</h3>
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedProduct.specs).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex justify-between items-center p-3 bg-white rounded-xl"
                        >
                          <span className="font-medium text-gray-700">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
                          <span className="font-bold text-gray-900">{String(value)}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProduct.tags.map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-700 border border-green-300 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800 rounded-b-[60px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000')] opacity-10"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
                <span className="text-white">Premium Agricultural</span>
                <span className="block text-emerald-200">Products</span>
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 text-xl md:text-2xl font-serif italic leading-tight mb-8 max-w-3xl mx-auto"
              >
                "Sustainable solutions for higher yields, healthier soils, and prosperous farming"
              </motion.p>
            </motion.div>

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { icon: Wheat, label: "Crops Covered", value: "50+" },
                { icon: Users, label: "Happy Farmers", value: "10,000+" },
                { icon: Shield, label: "Certified Organic", value: "100%" },
                { icon: TrendingUp, label: "Yield Increase", value: "30-40%" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-emerald-200">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-b from-green-50 to-white border-t border-green-200 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Product Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <motion.button
                        key={category}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-green-50 border border-green-300 shadow-sm"
                        }`}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Formulation Type
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formulations.map((formulation) => (
                      <motion.button
                        key={formulation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedFormulation(formulation)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedFormulation === formulation
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-green-50 border border-green-300 shadow-sm"
                        }`}
                      >
                        {formulation}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                    Coverage Area
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {coverageRanges.map((coverage) => (
                      <motion.button
                        key={coverage}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCoverage(coverage)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedCoverage === coverage
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-green-50 border border-green-300 shadow-sm"
                        }`}
                      >
                        {coverage}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''} Available
                </h2>
                <p className="text-gray-600">
                  Organic solutions for sustainable agriculture
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {selectedCategory !== "All" && (
                  <span className="font-semibold text-green-600">Category: {selectedCategory}</span>
                )}
                {selectedFormulation !== "All" && ` • ${selectedFormulation}`}
                {selectedCoverage !== "All" && ` • ${selectedCoverage}`}
              </div>
            </div>

            {/* Search Bar Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search products, benefits, or crop types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-3 text-base rounded-full border-2 border-gray-300 bg-white shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                />
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-full"
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 30 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 100,
                    damping: 20
                  }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative"
                >
                  <div className="bg-white rounded-3xl overflow-hidden border-2 border-gray-200 shadow-lg group-hover:shadow-xl group-hover:border-green-300 relative h-full cursor-pointer transition-all duration-300">
                    {/* Image Container */}
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
                      
                      {/* Category Badge */}
                      <motion.span 
                        className={`absolute top-4 left-4 bg-gradient-to-r ${product.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      >
                        {product.category}
                      </motion.span>
                      
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleFavorite(product.id, e)}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      >
                        <Heart 
                          className={`w-5 h-5 transition-colors ${
                            favorites.includes(product.id) 
                              ? "fill-red-500 text-red-500" 
                              : "text-gray-700"
                          }`}
                        />
                      </motion.button>
                      
                      {/* Rating */}
                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {product.tags.map((tag: string) => (
                          <span 
                            key={tag}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-200 pt-4">
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <Droplets className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{product.formulation}</span>
                          </div>
                          <div className="text-xs text-gray-600">Formulation</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <TreePine className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{product.coverage}</span>
                          </div>
                          <div className="text-xs text-gray-600">Coverage</div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-center gap-1 text-gray-900 mb-1">
                            <Award className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-semibold">{product.rating}</span>
                          </div>
                          <div className="text-xs text-gray-600">Rating</div>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="mt-6 flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{product.price}</div>
                          <div className="text-sm text-gray-600">Starting price</div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={(e) => addToCart(product, e)}
                            className="border-green-300 hover:bg-green-50 hover:text-green-700"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Add
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            onClick={() => handleProductClick(product)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* No Results */}
          <AnimatePresence>
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-center py-16"
              >
                <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl mb-6">
                  <Search className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search or filters to find the agricultural solution you need.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="rounded-full border-green-300 hover:bg-green-50"
                  >
                    Clear Search
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSelectedFormulation("All");
                      setSelectedCoverage("All");
                      setSearchQuery("");
                    }}
                    className="rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Reset All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal />
    </Layout>
  );
};

export default Products;