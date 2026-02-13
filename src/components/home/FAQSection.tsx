import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { HelpCircle, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Are all the products imperfect?",
    answer:
      "We celebrate nature's diversity! Our baskets include both 'imperfect' produce and perfect-looking items — all 100% organic and delicious. Imperfections are purely cosmetic and don't affect taste or nutrition.",
    icon: "🥕",
  },
  {
    question: "Where do the fruits and vegetables come from?",
    answer:
      "Primarily from local Swiss farmers within 200km. When local supply is limited, we source from trusted European organic partners. Every item is traceable to its origin farm.",
    icon: "🗺️",
  },
  {
    question: "Is everything organic?",
    answer:
      "Absolutely! 100% certified organic. We work exclusively with certified organic farmers who follow sustainable practices without synthetic pesticides or GMOs.",
    icon: "🌱",
  },
  {
    question: "How does the subscription work?",
    answer:
      "Choose your basket size and delivery frequency. You can pause, skip, or cancel anytime via your account. We'll deliver to your specified location on your chosen day.",
    icon: "📅",
  },
  {
    question: "What if I'm not home for delivery?",
    answer:
      "Specify a safe spot in your delivery notes! Our insulated boxes keep produce fresh for hours. You can also arrange delivery to a neighbor or workplace.",
    icon: "🏠",
  },
  {
    question: "Can I customize my basket?",
    answer:
      "While we don't offer full customization (to reduce waste), you can set preferences for items you'd like to receive less often. Our variety ensures pleasant surprises!",
    icon: "🎯",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #22c55e 1px, transparent 0)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-4"
              >
                <HelpCircle className="w-6 h-6 text-green-600" />
                <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">
                  Got Questions?
                </span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif font-bold text-green-900"
              >
                Frequently Asked
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Questions
                </span>
              </motion.h2>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Link to="/faq" className="flex items-center gap-3">
                  View Full FAQ
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ x: 5 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-2 border-green-200/50 rounded-2xl overflow-hidden bg-white hover:bg-green-50/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6 px-8 group">
                    <div className="flex items-center gap-4 w-full">
                      <motion.span 
                        className="text-2xl"
                        animate={{ 
                          rotate: [0, 10, 0],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {faq.icon}
                      </motion.span>
                      
                      <span className="text-lg font-bold text-green-900 group-hover:text-emerald-700 transition-colors">
                        {faq.question}
                      </span>
                      
                      <motion.div
                        className="ml-auto flex-shrink-0"
                        animate={{ 
                          rotate: [0, 5, 0],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity
                        }}
                      >
                        <ChevronDown className="w-5 h-5 text-green-600 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                      </motion.div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-8 pb-6">
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-green-700/80 leading-relaxed pl-12 border-l-2 border-green-200"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center"
          >
            
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};