// src/components/home/BasketPreviewSection.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart,ArrowRight,ArrowUpRight,Shield, Target, Globe, Recycle, Leaf, Truck, Calendar, Star, Package, Clock, Check, Plus } from "lucide-react";

// Import your images
import freshProduce from "@/assets/fresh-produce.jpg";
import farmerImage from "@/assets/farmer-portrait.png";
import heroBasket from "@/assets/hero-basket.png";
import luxuryProduce from "@/assets/hero-basket.png";
import familyWellness from "@/assets/family-wellness.png";

// Color palette inspired by uglyfruits.ch
const COLORS = {
  vibrant: {
    purple: '#8B5CF6',
    pink: '#EC4899',
    orange: '#F97316',
    teal: '#0D9488',
    emerald: '#10B981',
    yellow: '#EAB308',
    blue: '#3B82F6',
    red: '#EF4444'
  },
  pastel: {
    purple: '#EDE9FE',
    pink: '#FCE7F3',
    orange: '#FFEDD5',
    teal: '#CCFBF1',
    emerald: '#D1FAE5',
    yellow: '#FEF3C7',
    blue: '#DBEAFE',
    red: '#FEE2E2'
  },
  gradient: {
    purplePink: 'from-purple-500 to-pink-500',
    orangeYellow: 'from-orange-500 to-yellow-500',
    tealEmerald: 'from-teal-500 to-emerald-500',
    bluePurple: 'from-blue-500 to-purple-500',
    pinkOrange: 'from-pink-500 to-orange-500',
    emeraldBlue: 'from-emerald-500 to-blue-500'
  }
};



const experienceImage = "https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const impactImage = "https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const lifestyleImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const valueCards = [
  {
    title: "The Experience",
    features: [
      {
        title: "Uncompromised Nutrition",
        description: "Nutrition that works deep within the body."
      },
      {
        title: "Freshness That Goes Beyond",
        description: "Each bite tastes as fresh as the first."
      },
      {
        title: "Flavor, Elevated Beyond Ordinary",
        description: "This is flavor, grown—not engineered."
      }
    ],
    color: COLORS.gradient.purplePink,
    bgColor: "from-purple-50 to-pink-50",
    icon: "✨",
    image: experienceImage,
    imageAlt: "Fresh vibrant vegetables showcasing quality and nutrition",
    accentColor: COLORS.vibrant.purple
  },
  {
    title: "The Impact",
    features: [
      {
        title: "Anti-Aging Power",
        description: "Nature at work inside you."
      },
      {
        title: "Wellness Rooted in Nature",
        description: "Cellular-level protection."
      },
      {
        title: "Systemic Wellness Beyond Compare",
        description: "Nature's pharmacy in every bite."
      },
      {
        title: "Beyond Physical Health",
        description: "Cultivating joy and longevity."
      }
    ],
    color: COLORS.gradient.tealEmerald,
    bgColor: "from-teal-50 to-emerald-50",
    icon: "💫",
    image: impactImage,
    imageAlt: "Healthy lifestyle and wellness through nutrition",
    accentColor: COLORS.vibrant.teal
  },
  {
    title: "The Lifestyle",
    features: [
      {
        title: "More Than Vegetables",
        description: "ADD LIFE isn't merely vegetables."
      },
      {
        title: "A Lifestyle Transformation",
        description: "For families who value health, beauty, and longevity."
      },
      {
        title: "Beyond Ordinary",
        description: "Why settle for ordinary when you can experience the extraordinary?"
      }
    ],
    color: COLORS.gradient.orangeYellow,
    bgColor: "from-orange-50 to-yellow-50",
    icon: "🌅",
    image: lifestyleImage,
    imageAlt: "Family enjoying healthy lifestyle and meals together",
    accentColor: COLORS.vibrant.orange
  }
];

const benefits = [
  "100% biologically alive soils",
  "Chemical-free cultivation",
  "Support regenerative farming",
  "Limited volume production",
  "Carbon-positive delivery",
  "Weekly vitality insights"
];

const features = [
  {
    title: "Vitality",
    description: "Nutrition that works deep within the body, fueling cellular vitality.",
    icon: "💎",
    color: COLORS.gradient.purplePink,
    bgColor: "bg-gradient-to-r from-purple-50 to-pink-50",
    textColor: "text-purple-700"
  },
  {
    title: "Taste",
    description: "Each bite tastes as fresh as the first—flavor grown, not engineered.",
    icon: "👑",
    color: COLORS.gradient.orangeYellow,
    bgColor: "bg-gradient-to-r from-orange-50 to-yellow-50",
    textColor: "text-orange-700"
  },
  {
    title: "Extended Freshness",
    description: "Nature's preservation at work—stays fresh days longer.",
    icon: "🕰️",
    color: COLORS.gradient.tealEmerald,
    bgColor: "bg-gradient-to-r from-teal-50 to-emerald-50",
    textColor: "text-teal-700"
  }
];

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#F9DD58] rounded-b-[60px]">

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-600/20" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-14 relative z-10">

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight"
>
  <span className="text-black block text-left">Redefining</span>

  <span className="text-white block text-right">
    Freshness,
  </span>

  <span className="text-black block text-left">
    Nutrition,
  </span>

  <span className="text-white block text-right">
    and Luxury
  </span>
</motion.h1>


              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  Food that nourishes life itself.
                </h2>
                
                <p className="text-gray-800 text-lg leading-relaxed">
                  Imagine a world where every bite does more than satisfy hunger. 
                  A world where food nourishes the body, fuels vitality, and 
                  quietly protects long-term health.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <Button 
                variant="default" 
                size="xl" 
                asChild 
                className="bg-gray-900 hover:bg-gray-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0"
              >
                <Link to="/baskets" className="flex items-center gap-3 text-lg font-semibold">
                  <Plus className="w-6 h-6" />
                  Choose ADD LIFE
                </Link>
              </Button>
              
              <p className="text-gray-800 text-sm font-medium">
                Living nutrition, delivered thoughtfully.
              </p>
            </motion.div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative perspective-1000"
          >
            <div className="relative transform-style-3d group">
              
                <img
                  src={luxuryProduce}
                  alt="ADD LIFE luxury produce"
                  className="w-full h-auto rounded-3xl transform group-hover:scale-110 transition-transform duration-700"
                />
                
               

              

              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-gray-900/10 to-white/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export const FarmingEvolutionSection = () => {
  const farmingCards = [
    {
      title: "Conventional Farming",
      description: "Conventional farming driven by scale and speed, often leaves behind chemical residues that threaten our well-being.",
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      borderColor: "border-green-200",
      icon: "⚠️",
      accentColor: "text-orange-500"
    },
    {
      title: "Organic Farming",
      description: "Organic farming, while a step toward purity, frequently struggles to deliver true nutrition when soils are depleted of vitality.",
      color: "from-emerald-700 to-green-700",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
      borderColor: "border-emerald-200",
      icon: "🌿",
      accentColor: "text-teal-500"
    },
    {
      title: "Beyond Ordinary (ADD LIFE)",
      description: "At ADD LIFE, we blend the wisdom of nature with modern biological science—cultivating food in biologically alive soils, built not on chemicals, but on life itself.",
      color: "from-green-700 to-emerald-700",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50", // Changed to light green
      borderColor: "border-green-300",
      icon: "🌟",
      highlight: true,
      accentColor: "text-green-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-emerald-50 overflow-hidden relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
          The Farming Evolution Journey
        </h2>
        
        {/* Static grid - removed scrolling */}
        <div className="grid md:grid-cols-3 gap-8">
          {farmingCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className={`p-8 rounded-3xl ${card.bgColor} border ${card.borderColor} shadow-lg h-full relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}>
                
                
                <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}>
                  {card.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {card.description}
                </p>

                {card.highlight && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-600 animate-gradient-shift" />
                )}
                
                {/* Optional decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              </div>

              {card.highlight && (
                <motion.div
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg z-10"
                  
                >
                  A Journey Beyond Ordinary
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export const EditorialSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#E0C4F4] to-[#E0C4F4] rounded-[60px]">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
  Food,{" "}
  <span className="text-[#F9A825]">
    Reimagined
  </span>
</h2>





            
            
            <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
              <p>
                Clean food was not enough, because living nutrition was 
                missing—and conventional farming, driven by scale and 
                speed, often leaves behind chemical residues that threaten 
                long-term well-being.
              </p>
              <p>
                There had to be a better way, one that blends the wisdom 
                of nature with modern biological science to go beyond the 
                ordinary. What emerges is not just food, but life itself: 
                rich in nutrients, bursting with flavor, and full of vitality.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50">
              <img
                src={familyWellness}
                alt="Family embracing wellness through nutrition"
                className="w-full h-auto rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent rounded-3xl" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-purple-300/30 to-pink-300/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-tr from-purple-200/20 to-pink-200/10 rounded-full blur-2xl" />
          </motion.div>
        </div>
        
        {/* Optional decorative border */}
        <div className="mt-20 pt-8 border-t border-purple-200/40">
          <div className="flex items-center justify-center gap-4 text-purple-700/70">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-purple-400" />
            <span className="text-sm font-medium">Nourishing Generations • Beyond Ordinary • Life-Enhancing</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-purple-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const StatementDivider = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
            Designed exclusively for families who care deeply about their health.
          </h3>
          <p className="text-gray-700 text-lg">
            ADD LIFE is grown in limited volumes to preserve soil vitality 
            and nutritional integrity. Subscriptions are offered in limited slots only.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export const BasketPreviewSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-emerald-700">Exclusive Offering</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6">
            For Those Who{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Seek More
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full" />
            </span>
          </h2>
          
          <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Curated exclusively for discerning families who value nourishment, purity, 
            and the profound connection between soil vitality and well-being.
          </p>

          {/* Feature Chips - Enhanced */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`group relative px-5 py-3 rounded-full backdrop-blur-sm bg-white/80 border ${feature.borderColor} shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{feature.icon}</span>
                  <span className="font-medium text-gray-800">{feature.title}</span>
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Product Display - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto"
        >
          <div className="relative rounded-4xl overflow-hidden shadow-2xl shadow-emerald-200/50">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-green-50/10" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-green-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-emerald-200/10 to-green-200/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            
            <div className="relative p-8 md:p-12">
              {/* Product Image - Enhanced */}
              <div className="mb-12">
                <div className="relative rounded-3xl overflow-hidden shadow-lg">
                  <img
                    src={freshProduce}
                    alt="ADD LIFE produce basket - Vibrant, nutrient-rich vegetables grown in living soils"
                    className="w-full h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent" />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 right-6">
                    <motion.div
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                    >
                      <Star className="w-4 h-4" />
                      <span>Featured Collection</span>
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12">
                {/* Left Column - Details */}
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center">
                        <Leaf className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        ADD LIFE Weekly Basket
                      </h3>
                    </div>
                    
                    <p className="text-gray-700 text-lg leading-relaxed mb-8">
                      A thoughtfully curated selection of vegetables and herbs, grown 
                      in biologically active soils and harvested at peak vitality. 
                      Each basket delivers not just food, but living nutrition.
                    </p>
                    
                    {/* Benefits Grid - Enhanced */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={benefit}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-emerald-100 hover:border-emerald-200 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-gray-800 font-medium">{benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Pricing & CTA */}
                <div className="space-y-8">
                  {/* Pricing Card - Enhanced */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-200/20 to-green-200/20 rounded-full -translate-y-16 translate-x-16" />
                    
                    <div className="relative">
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 mb-3">
                          <span className="text-xs font-semibold text-emerald-700">EXCLUSIVE SUBSCRIPTION</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-bold text-gray-900">$85</span>
                          <div className="flex flex-col">
                            <span className="text-gray-700">per week</span>
                            <span className="text-sm text-emerald-600 font-medium">Limited slots available</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 text-sm font-medium border border-emerald-200">
                          🍃 Limited Volume
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm font-medium border border-green-200">
                          🌱 Living Soils
                        </span>
                        <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-200 to-green-200 text-emerald-800 text-sm font-medium">
                          🎯 Peak Nutrition
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA Section - Enhanced */}
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg shadow-emerald-200/50 text-white text-lg font-semibold py-6 rounded-xl"
                        asChild
                      >
                        <Link to="/baskets" className="flex items-center justify-center gap-3">
                          <Sparkles className="w-5 h-5" />
                          Experience ADD LIFE
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                      </Button>
                    </motion.div>
                    
                    <div className="text-center p-4 rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 border border-emerald-100">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">Commitment to Quality</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Grown in limited volumes to preserve soil vitality and nutritional integrity. 
                        Subscriptions are offered exclusively to ensure personalized care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid - Enhanced */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-3xl bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  
                  {/* Hover Indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-24 flex justify-center">
          <div className="flex items-center gap-4 text-emerald-700/60">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-emerald-300" />
            <span className="text-sm font-medium">Nourishment • Vitality • Legacy</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-emerald-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export const ValuePropsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Why This Is{" "}
            <span className="text-orange-600">
  Different
</span>

          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Discover what sets ADD LIFE apart—where every aspect of our produce 
            contributes to a holistic experience of health and vitality.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {valueCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                {/* Image section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-20`} />
                  <div className="absolute top-4 right-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} text-white shadow-lg`}>
                      <span className="text-xl">{card.icon}</span>
                    </div>
                  </div>
                </div>

                {/* Content section */}
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    {card.title}
                  </h3>
                  
                  <ul className="space-y-4">
                    {card.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-2 h-2 rounded-full mt-2 bg-gradient-to-r ${card.color}`} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Card-specific CTA */}
                  {card.title === "The Lifestyle" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-6 pt-6 border-t border-gray-100"
                    >
                      <p className="text-sm text-gray-700 italic">
                        "Why settle for ordinary when you can experience the extraordinary?"
                      </p>
                    </motion.div>
                  )}

                  {/* Background gradient effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500 -z-10 rounded-3xl`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Experience the ADD LIFE Difference
            </h3>
            <p className="text-gray-700 mb-6">
              Join families who have transformed their approach to nutrition and wellness.
            </p>
            <Button 
  variant="default" 
  size="lg" 
  asChild
  className="bg-[#F9A825] hover:bg-[#F57F17] text-white shadow-lg transition-colors duration-300"
>
  <Link to="/baskets" className="flex items-center gap-3 text-lg font-semibold">
    <Sparkles className="w-5 h-5" />
    Start Your Journey
  </Link>
</Button>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const FooterSection = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 text-gray-900 py-16">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            Your food should nourish more than hunger.
            <br />
            <span className="text-[#F9A825]">
  It should nourish life itself.
</span>

          </h2>
          
          <Button
  variant="default"
  size="lg"
  asChild
  className="bg-[#F9A825] hover:bg-[#F57F17] text-white shadow-xl transition-all duration-300"
>
  <Link to="/baskets" className="text-lg font-semibold text-white tracking-wide">
    Choose ADD LIFE
  </Link>
</Button>


        </motion.div>
      </div>
    </footer>
  );
};