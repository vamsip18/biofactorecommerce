// src/components/home/BasketPreviewSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, ArrowRight, ArrowUpRight, Shield, Target, Globe, Recycle, Leaf, Truck, Calendar, Star, Package, Clock, Check, Plus, Zap, Droplets, ShieldCheck, Brain, Thermometer, Users, Award, ShoppingCart, TrendingUp } from "lucide-react";

// Import your images - update these with actual biofactor product images
import biofactorHero from "@/assets/biofactor-hero.png";
import virban from "@/assets/virban.webp";
import vVacc from "@/assets/vVacc.webp";
import modiphy from "@/assets/modiphy.webp";
// Mock images - replace with actual imports
const productImages = {
  agriseal: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=400&fit=crop",
  eightPetals: "https://images.unsplash.com/photo-1597848212624-e5f4b41d7f50?w-400&h=400&fit=crop",
  highKLiquid: "https://images.unsplash.com/photo-1615485500607-1758f56c2c8a?w=400&h=400&fit=crop",
  gallant: "https://images.unsplash.com/photo-1557735938-cb4b0d11c73a?w=400&h=400&fit=crop",
  nativeNeem: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4c?w=400&h=400&fit=crop",
  kFactor: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
  eVac: "https://images.unsplash.com/photo-1573497019940-1c28c033a88e?w=400&h=400&fit=crop",
  highKAqua: "https://images.unsplash.com/photo-1615485500607-1758f56c2c8a?w=400&h=400&fit=crop",
  virban: virban,
  vVacc: vVacc,
  modiphy: modiphy
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
                <div className="text-2xl font-bold text-teal-600">50+</div>
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

// Best Selling Products Section
export const BestSellingProducts = () => {
  const products = [
    {
      id: 1,
      name: "AgriSeal - Protect Crops from Biotic Stress",
      vendor: "Biofactor",
      price: "Rs. 1,800.00",
      image: productImages.agriseal,
      tag: "Best Seller"
    },
    {
      id: 2,
      name: "Eight Petals - Home Gardening Kit",
      vendor: "Biofactor",
      price: "Rs. 1,200.00",
      originalPrice: "Rs. 1,500.00",
      image: productImages.eightPetals,
      tag: "Popular"
    },
    {
      id: 3,
      name: "High-K Liquid Nutrient",
      vendor: "Biofactor",
      price: "Rs. 950.00",
      image: productImages.highKLiquid,
      tag: "New"
    },
    {
      id: 4,
      name: "Gallant | A high potency iron tonic for animals",
      vendor: "Biofactor",
      price: "Rs. 2,300.00",
      image: productImages.gallant,
      soldOut: true
    },
    {
      id: 5,
      name: "Native Neem - Natural Insecticide",
      vendor: "Biofactor",
      price: "Rs. 850.00",
      image: productImages.nativeNeem
    },
    {
      id: 6,
      name: "K Factor – Potassium Mobilising Bacteria",
      vendor: "Biofactor",
      price: "Rs. 1,500.00",
      image: productImages.kFactor
    },
    {
      id: 7,
      name: "E- Vac - EHP Remedy",
      vendor: "Biofactor",
      price: "Rs. 3,200.00",
      image: productImages.eVac
    },
    {
      id: 8,
      name: "High- K Aqua",
      vendor: "Biofactor",
      price: "Rs. 1,750.00",
      image: productImages.highKAqua
    }
  ];

  return (
    <section className="py-5 bg-white">
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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] mx-2 group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-50 to-white">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Tag Badge */}
                  {product.tag && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.tag === "Best Seller" 
                          ? "bg-green-600 text-white" 
                          : product.tag === "Popular"
                          ? "bg-green-500 text-white"
                          : "bg-emerald-400 text-white"
                      }`}>
                        {product.tag}
                      </span>
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-green-600" />
                  </button>
                  
                  {/* Sold Out Overlay */}
                  {product.soldOut && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <span className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info - Flex column with grow */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-700 transition-colors mb-2 line-clamp-2 min-h-[56px]">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Package className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Vendor: {product.vendor}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xl font-bold text-gray-900">{product.price}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{product.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button - At bottom of card */}
                  <div className="mt-auto">
                    <Button 
                      className={`w-full ${
                        product.soldOut 
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed" 
                          : "bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white"
                      }`}
                      disabled={product.soldOut}
                    >
                      {product.soldOut ? (
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
            ))}
          </div>
        </div>

        {/* View All Button - Centered Below Products */}
        <div className="text-center mt-12">
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
        </div>
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
export const TrendingTopics = () => {
  const blogs = [
    {
      id: 1,
      title: "The Science Behind Biofactors: How They Work at Cellular Level",
      excerpt: "Explore the mechanism of action of biofactors and their impact on cellular health.",
      date: "Mar 15, 2024",
      readTime: "5 min read",
      image: blogImages.blog1,
      url: "/blog/science-behind-biofactors"
    },
    {
      id: 2,
      title: "Sustainable Agriculture with Biofactor Solutions",
      excerpt: "Learn how biofactors are revolutionizing sustainable farming practices.",
      date: "Mar 10, 2024",
      readTime: "7 min read",
      image: blogImages.blog2,
      url: "/blog/sustainable-agriculture"
    },
    {
      id: 3,
      title: "Aquaculture Innovations: Biofactor's Impact on Fish Health",
      excerpt: "Discover how biofactors are improving aquaculture productivity and health.",
      date: "Mar 5, 2024",
      readTime: "6 min read",
      image: blogImages.blog3,
      url: "/blog/aquaculture-innovations"
    },
    {
      id: 4,
      title: "Home Gardening Made Easy with Biofactor Products",
      excerpt: "Tips and tricks for using biofactors in your home garden for better yields.",
      date: "Feb 28, 2024",
      readTime: "4 min read",
      image: blogImages.blog4,
      url: "/blog/home-gardening-guide"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-green-500" />
              <span className="text-sm font-semibold text-green-600">TRENDING NOW</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-900">Latest Insights & Updates</h2>
            <p className="text-gray-600 mt-2">Stay informed with the latest in biofactor technology</p>
          </div>
          <Link to="/blog">
            <Button variant="outline" className="gap-2">
              View All Articles
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blogs.map((blog, index) => (
            <BlogCard key={blog.id} blog={blog} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Aqua Culture Section
export const AquaCultureSection = () => {
  const aquaProducts = [
    {
      id: 1,
      name: "Virban 2.0",
      vendor: "Biofactor",
      price: "Rs. 2,499.00",
      image: productImages.virban,
      description: "Advanced viral protection for aquatic species"
    },
    {
      id: 2,
      name: "V-Vacc",
      vendor: "Biofactor",
      price: "Rs. 2,799.00",
      image: productImages.vVacc,
      description: "Vaccine support for fish health"
    },
    {
      id: 3,
      name: "Modiphy",
      vendor: "Biofactor",
      price: "Rs. 1,568.00",
      image: productImages.modiphy,
      description: "Growth promoter for aquatic organisms"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50/80 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-900/10 rounded-full mb-4 border border-emerald-900/20">
            <Droplets className="w-5 h-5 text-emerald-800" />
            <span className="text-sm font-semibold text-emerald-900">AQUACULTURE SOLUTIONS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">Specialized Aqua Products</h2>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Premium biofactor formulations designed specifically for aquaculture and fish farming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aquaProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-emerald-200 flex flex-col"
            >
              <div className="p-8 flex flex-col flex-grow">
                <div className="relative h-48 mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 bg-emerald-800 text-white text-xs font-semibold rounded-full shadow-sm">
                      Aqua Care
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-emerald-800 transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-gray-700 flex-grow">{product.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-700" />
                    <span>Vendor:</span>
                    <span className="font-medium ml-1 text-emerald-800">{product.vendor}</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-emerald-100 mt-auto">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{product.price}</div>
                      <div className="text-sm text-emerald-700">per unit</div>
                    </div>
                    <Button className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 text-white gap-2 shadow-sm hover:shadow-md">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/aquaculture">
            <Button variant="outline" size="lg" className="gap-2 border-emerald-300 hover:bg-emerald-50 text-emerald-800 hover:text-emerald-900 hover:border-emerald-400">
              Explore All Aqua Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
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
      <TrendingTopics />
      <AquaCultureSection />
    </>
  );
};