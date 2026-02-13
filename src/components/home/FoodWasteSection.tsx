import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Recycle, Target, Globe } from "lucide-react";
import farmerImage from "@/assets/farmer-portrait.jpg";

export const FoodWasteSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Animated leaves */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-200/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          >
            🍃
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image with 3D effect */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="relative perspective-1000"
          >
            <div className="relative group">
              {/* Main image with 3D transform */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ 
                  rotateY: 15,
                  rotateX: 5,
                  scale: 1.02
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <img
                  src={farmerImage}
                  alt="Local farmer with fresh produce"
                  className="w-full h-auto rounded-3xl transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 via-transparent to-transparent rounded-3xl" />
              </motion.div>

              {/* Floating stats */}
              <motion.div
                className="absolute -top-6 -left-6 bg-white p-4 rounded-2xl shadow-2xl border border-green-200"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">30%</div>
                  <div className="text-xs text-green-600 font-medium">Less Waste</div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -bottom-6 -right-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [5, -5, 5]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-xs font-medium">Local Farms</div>
                </div>
              </motion.div>

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-400/20 to-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info cards at bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <Link
                to="/about"
                className="flex-1 min-w-[200px] bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-xl text-green-900 font-medium hover:from-green-200 hover:to-emerald-200 transition-all duration-300 hover:scale-105 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Our Mission
                </div>
              </Link>
              <Link
                to="/about"
                className="flex-1 min-w-[200px] bg-gradient-to-r from-emerald-100 to-green-100 px-6 py-3 rounded-xl text-green-900 font-medium hover:from-emerald-200 hover:to-green-200 transition-all duration-300 hover:scale-105 shadow-md"
              >
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4" />
                  Zero Waste Journey
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
                  Sustainable Future
                </span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-green-900 mb-6">
                Fighting Food Waste,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  One Basket at a Time
                </span>
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200/50 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <Recycle className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-3 text-green-900">
                    Farmers see 30% of their harvest rejected for cosmetic reasons…
                  </h3>
                  <p className="text-green-800/80 text-lg font-medium">
                    Together, we're changing that narrative — embracing nature's diversity.
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.p 
                className="text-green-700/80 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                We champion the belief that every fruit and vegetable deserves appreciation. 
                By partnering directly with local farmers, we ensure fair compensation for 
                their harvest — celebrating uniqueness over uniformity.
              </motion.p>
              
              <motion.p 
                className="text-green-700/80 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Our streamlined approach eliminates intermediaries, reduces storage time, 
                and maximizes freshness — creating value for producers while minimizing 
                environmental impact throughout the supply chain.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="pt-6"
            >
              <Link
                to="/impact"
                className="inline-flex items-center gap-3 text-green-700 font-semibold group"
              >
                <span className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  ♻️
                </span>
                See Our Environmental Impact Report
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};