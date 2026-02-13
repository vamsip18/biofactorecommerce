import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Truck, Calendar, Heart } from "lucide-react";

const valueProps = [
  {
    title: "Tired of bland supermarket food?",
    description:
      "Discover fresh organic products with unforgettable flavor! One bite, and you'll taste the difference.",
    cta: "Discover our farms",
    link: "/about",
    icon: Sparkles,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Want fresh produce without the hassle?",
    description:
      "We deliver for free right to your door whenever it suits you. Pause deliveries with one click. All you have to do is enjoy.",
    cta: null,
    highlight: true,
    icon: Truck,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Seasonal variety every week",
    description:
      "Experience 8 to 12 different varieties each week with matching recipes. Never get bored with your basket!",
    cta: "Explore this week's basket",
    link: "/baskets",
    icon: Calendar,
    color: "from-lime-400 to-green-500",
  },
];

export const ValuePropsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-green-50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #22c55e 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-green-500" />
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-green-900 mb-6">
            Farm to Table,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Simplified
            </span>
          </h2>
          <p className="text-green-700/70 text-lg max-w-2xl mx-auto">
            We're reimagining how you access fresh, organic produce while supporting sustainable agriculture.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              className="relative"
            >
              {/* Card */}
              <div className={`p-8 rounded-3xl ${
                prop.highlight
                  ? "bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-200 shadow-xl"
                  : "bg-white border border-green-200/50 shadow-lg"
              } h-full relative overflow-hidden group`}>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${prop.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div 
                  className={`inline-flex p-4 rounded-2xl mb-6 ${
                    prop.highlight 
                      ? "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
                      : "bg-green-50 text-green-600"
                  }`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <prop.icon className="w-8 h-8" />
                </motion.div>

                <h3 className="text-xl font-bold mb-4 text-green-900">
                  {prop.title}
                </h3>
                
                <motion.p 
                  className="text-green-700/80 mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 + 0.2 }}
                >
                  {prop.description}
                </motion.p>
                
                {prop.cta && (
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link
                      to={prop.link || "#"}
                      className="inline-flex items-center gap-2 text-green-600 font-semibold group"
                    >
                      {prop.cta}
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                )}
              </div>

              {/* Decorative element */}
              {prop.highlight && (
                <motion.div
                  className="absolute -top-3 -right-3 bg-gradient-to-br from-green-400 to-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut" 
                  }}
                >
                  Most Popular
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-16"
        >
          <Button 
            variant="default" 
            size="lg" 
            asChild
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl"
          >
            <Link to="/baskets" className="flex items-center gap-3">
              See What's in a Basket
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Link to="/baskets" className="flex items-center gap-3">
              Create My Basket
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};