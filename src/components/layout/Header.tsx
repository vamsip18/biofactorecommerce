import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const navLinks = [
  {
    name: "Understand",
    href: "#",
    dropdown: [
      { name: "Our Philosophy", href: "/about" },
      { name: "Why ADD LIFE", href: "/about" },
      { name: "Subscriptions", href: "/about" },
      { name: "Experience", href: "/about" },
    ],
  },
  { name: "Recipes", href: "/recipes" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const location = useLocation();

  // ✅ Detect home page
  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 transition-colors duration-500 ${
        isHomePage ? "bg-[#F9DD58]" : "bg-[#F9DD58]"
      }`}
    >
      {/* Top bar - Reduced padding */}
      <div
        className={`border-b ${
          isHomePage ? "border-yellow-600/20" : "border-yellow-600/20"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-1 text-sm"> {/* Reduced from py-2 */}
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-gray-800 hover:text-black transition-all duration-300 hover:scale-105"
              >
                At home
              </Link>
              <Link
                to="/office"
                className="text-gray-800 hover:text-black transition-all duration-300 hover:scale-105"
              >
                At the office
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/gift" className="text-gray-800 hover:text-black transition-all duration-300 hover:scale-105">
                Gift
              </Link>
              <Link to="/contact" className="text-gray-800 hover:text-black transition-all duration-300 hover:scale-105">
                Contact
              </Link>
              <span className="text-gray-800">EN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav - Reduced padding */}
      <div className="container mx-auto px-1">
        <nav className="flex items-center justify-between py-0.5">
 {/* Reduced from py-4 */}
          {/* Logo - Increased size */}
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src={logo}
              alt="ADD LIFE Logo"
              className="h-24 md:h-28 w-auto object-contain"
 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => link.dropdown && setDropdownOpen(link.name)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                {link.dropdown ? (
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium shadow-sm hover:shadow-md border"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.name}
                    <motion.div
                      animate={{ rotate: dropdownOpen === link.name ? 180 : 0 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </motion.button>
                ) : (
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Link
                      to={link.href}
                      className="px-6 py-3 rounded-full bg-white text-black font-medium shadow-sm hover:shadow-md border"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                )}

                <AnimatePresence>
                  {link.dropdown && dropdownOpen === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border overflow-hidden"
                    >
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-5 py-4 text-gray-900 hover:bg-gray-50 transition-all hover:pl-6 border-b last:border-b-0"
                          onClick={() => setDropdownOpen(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Button asChild className="rounded-full bg-white text-black">
              <Link to="/login" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                My account
              </Link>
            </Button>
            <Button asChild className="rounded-full bg-white text-black">
              <Link to="/baskets" className="flex items-center gap-2">
                View baskets
                <ChevronDown className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="lg:hidden p-3 rounded-full bg-white text-black shadow-sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </motion.button>
        </nav>
      </div>

      {/* Mobile Menu - Reduced padding */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-3"> 
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-gray-800 font-medium py-2" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};