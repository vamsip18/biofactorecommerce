import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Instagram, Youtube, Facebook, Linkedin } from "lucide-react";
import logo from "@/assets/logo.png"; // Adjust the path as needed

const footerLinks = {
  discover: [
    { name: "Our concept", href: "/about" },
    { name: "What does imperfect mean?", href: "/about" },
    { name: "The facts about food waste", href: "/about" },
    { name: "About", href: "/about" },
  ],
  more: [
    { name: "Home", href: "/" },
    { name: "Recipes", href: "/recipes" },
    { name: "FAQ", href: "/faq" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-lime-50 to-emerald-50 text-emerald-900 py-16 relative overflow-hidden border-t border-emerald-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-emerald-300/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <motion.div 
              className="flex items-center gap-2 mb-6 group"
              whileHover={{ scale: 1.05 }}
            >
              
                <img 
                  src={logo} 
                  alt="ADD LIFE Logo" 
                  className="h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
             
              
            </motion.div>
            <p className="text-emerald-700/80 text-sm leading-relaxed">
              Making organic accessible to all,<br />
              while reducing food waste.
            </p>
          </div>

          {/* Discover */}
          <div>
            <h4 className="font-semibold mb-4 text-emerald-800">Discover</h4>
            <ul className="space-y-3">
              {footerLinks.discover.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300 hover:pl-2 block group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-emerald-500 mr-2 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-semibold mb-4 text-emerald-800">More</h4>
            <ul className="space-y-3">
              {footerLinks.more.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300 hover:pl-2 block group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-emerald-500 mr-2 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-emerald-800">Contact Us</h4>
            <motion.div 
              className="text-emerald-700/70 text-sm space-y-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p>ADD LIFE SA</p>
              <p>Chemin des Cevins 4</p>
              <p>2096 Cressier, Switzerland</p>
              <p className="pt-2">
                <motion.a 
                  href="mailto:info@addlife.health" 
                  className="hover:text-emerald-800 transition-colors inline-block font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  info@addlife.health
                </motion.a>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Social Links */}
        <motion.div 
          className="mt-12 pt-8 border-t border-emerald-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Instagram */}
              <motion.a 
                href="https://instagram.com/addlife" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Instagram className="w-6 h-6" />
              </motion.a>

              {/* YouTube */}
              <motion.a 
                href="https://youtube.com/addlife" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <Youtube className="w-6 h-6" />
              </motion.a>

              {/* Facebook */}
              <motion.a 
                href="https://facebook.com/addlife" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: 5 }}
              >
                <Facebook className="w-6 h-6" />
              </motion.a>

              {/* LinkedIn */}
              <motion.a 
                href="https://linkedin.com/company/addlife" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700/70 hover:text-emerald-800 transition-all duration-300"
                whileHover={{ scale: 1.2, rotate: -5 }}
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-emerald-700/70">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/terms" className="hover:text-emerald-800 transition-colors">
                  Terms & conditions
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/privacy" className="hover:text-emerald-800 transition-colors">
                  Privacy policy
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/contact" className="hover:text-emerald-800 transition-colors">
                  Contact us
                </Link>
              </motion.div>
            </div>
          </div>
          
          <motion.p 
            className="text-center text-emerald-700/50 text-xs mt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} ADD LIFE. All rights reserved. Organic certified.
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};