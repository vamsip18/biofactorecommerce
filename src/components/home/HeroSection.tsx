import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Truck, Shield, Recycle } from "lucide-react";
import heroBasket from "@/assets/hero-basket.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50">
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
            <Leaf className="w-4 h-4 text-green-200/30" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
              >
                <Shield className="w-4 h-4" />
                100% Organic Certified
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight text-green-900">
                Fresh{" "}
                <motion.span 
                  className="text-emerald-600 inline-block"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  Organic
                </motion.span>
                <br />
                <span className="relative">
                  Harvest
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.5, duration: 1 }}
                  />
                </span>
                <br />
                Delivered Weekly
              </h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-green-800/80 max-w-lg"
              >
                <strong>Farm-fresh organic fruits and vegetables</strong>{" "}
                delivered to your doorstep across Switzerland. Support local farmers while enjoying nature's best.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6"
            >
              <Button variant="default" size="xl" asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl">
                <Link to="/baskets" className="flex items-center gap-3">
                  <Leaf className="w-5 h-5" />
                  Choose My Basket
                </Link>
              </Button>
              
              <div className="flex items-center gap-3 text-green-700">
                <Truck className="w-5 h-5 animate-bounce" />
                <span className="text-sm font-medium">
                  Free delivery • 7,900+ happy customers
                </span>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6"
            >
              {[
                { icon: Truck, text: "Free Delivery" },
                { icon: Shield, text: "100% Organic" },
                { icon: Recycle, text: "Zero Waste" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.text}
                  className="flex items-center gap-2 text-green-700"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                >
                  <div className="p-2 bg-green-100 rounded-lg">
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right image with 3D effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -30 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative perspective-1000"
          >
            <div className="relative transform-style-3d group">
              {/* Main image with 3D effect */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ rotateY: 10, rotateX: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={heroBasket}
                  alt="Fresh organic vegetable basket"
                  className="w-full h-auto rounded-3xl transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent rounded-3xl" />
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-6 -right-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-6 py-3 font-bold text-sm uppercase tracking-wider shadow-2xl rounded-lg"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                Direct from Farm
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -left-6 bg-white text-green-900 px-6 py-3 font-bold text-sm shadow-2xl rounded-lg border border-green-200"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [5, -5, 5] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                🥕 Seasonal Picks
              </motion.div>

              {/* Glowing effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Marquee */}
      <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 py-4 border-y border-green-200/50 overflow-hidden">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="inline-flex items-center gap-8 text-sm text-green-700 mx-8">
              {[
                { icon: "🥬", text: "Farm Fresh Daily" },
                { icon: "🚜", text: "Support Local Farmers" },
                { icon: "🌱", text: "100% Organic Certified" },
                { icon: "📦", text: "Zero Plastic Packaging" },
                { icon: "🔄", text: "Flexible Subscriptions" },
                { icon: "❤️", text: "Reduces Food Waste" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};