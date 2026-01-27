import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ChevronDown, Search, MapPin, Package, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Biofactor-Logo.png";

// Updated navLinks with dropdowns
const navLinks = [
  { 
    name: "Agriculture", 
    href: "/agriculture",
    dropdown: [
      { name: "Soil Applications", href: "/agriculture/soil" },
      { name: "Foliar Applications", href: "/agriculture/foliar" },
      { name: "Drip Applications", href: "/agriculture/drip" },
      { name: "Crop Protection", href: "/agriculture/crop-protection" },
      { name: "Special Products", href: "/agriculture/special" }
    ]
  },
  { 
    name: "Aquaculture", 
    href: "/aquaculture",
    dropdown: [
      { name: "Probiotics", href: "/aquaculture/probiotics" },
      { name: "Disease Management", href: "/aquaculture/disease-management" }
    ]
  },
  { name: "Large Animals", href: "/large-animals" },
  { name: "Kitchen Gardening", href: "/kitchen-gardening" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" }
];

const languages = [
  { code: "en", name: "English", locale: "en-US" },
  { code: "hi", name: "हिंदी", locale: "hi-IN" },
  { code: "te", name: "తెలుగు", locale: "te-IN" }
];

// Define cart item type
interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  formulation: string;
  coverage: string;
}

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>("Fetching location...");
  const location = useLocation();
  const navigate = useNavigate();

  // Get user's location
  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const city = data.address.city || data.address.town || data.address.village;
              const state = data.address.state;
              setUserLocation(city && state ? `${city}, ${state}` : "Location found");
            } catch (error) {
              console.error("Error getting location:", error);
              setUserLocation("Location access granted");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setUserLocation("Allow location access");
          },
          { timeout: 10000 }
        );
      } else {
        setUserLocation("Location not supported");
      }
    };

    getLocation();
  }, []);

  // Handle search functionality
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  // Handle language change
  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLanguage(lang);
    setLanguageDropdownOpen(false);
    
    localStorage.setItem('preferredLanguage', lang.code);
    document.documentElement.lang = lang.code;
  };

  // Calculate total cart items
  const calculateCartCount = (cartItems: CartItem[]) => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Load cart from localStorage and calculate count
  useEffect(() => {
    const loadCartCount = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const cartItems: CartItem[] = JSON.parse(savedCart);
          const count = calculateCartCount(cartItems);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartCount(0);
      }
    };

    // Load preferred language from localStorage
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage);
      if (lang) setSelectedLanguage(lang);
    }

    // Initial load
    loadCartCount();

    // Listen for cart updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        loadCartCount();
      }
    };

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    // Poll for cart updates
    const intervalId = setInterval(loadCartCount, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(intervalId);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
      setLanguageDropdownOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle dropdown toggle
  const handleDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <>
      {/* ===================== */}
      {/* TOP HEADER BAR */}
      {/* ===================== */}
      <div className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          
          {/* Logo - Increased size */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img 
              src={logo} 
              alt="Biofactor Logo" 
              className="h-16 w-auto md:h-20" 
            />
          </Link>
    {/* Location */}
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-700 flex-shrink-0 hover:text-green-700 transition-colors cursor-pointer"
              title="Click to refresh location"
              onClick={() => {
                setUserLocation("Fetching location...");
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    setUserLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`);
                  },
                  () => setUserLocation("Location unavailable")
                );
              }}
            >
              <MapPin className="w-4 h-4 text-green-700" />
              <span className="max-w-[120px] truncate">{userLocation}</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          {/* Search Bar - Moved to center */}
          <form onSubmit={handleSearch} className="hidden md:flex relative flex-1 max-w-2xl mx-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, blogs..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            

            {/* Language Selector */}
            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-white hover:bg-green-700 px-2 py-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguageDropdownOpen(!languageDropdownOpen);
                }}
              >
                <span className="font-medium">{selectedLanguage.name}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
              </Button>
              
              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center justify-between ${
                          selectedLanguage.code === lang.code ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"
                        }`}
                        onClick={() => handleLanguageChange(lang)}
                      >
                        <span>{lang.name}</span>
                        {selectedLanguage.code === lang.code && (
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Login */}
            <div className="hidden md:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2 text-gray-700 hover:text-white hover:bg-green-700 transition-colors"
              >
                <Link to="/login">
                  <User className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            </div>

            {/* Returns & Orders */}
            <div className="hidden md:flex items-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex items-center gap-2 text-gray-700 hover:text-white hover:bg-green-700 transition-colors"
              >
                <Link to="/orders">
                  <Package className="w-4 h-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs hover:text-white transition-colors">Returns</span>
                    <span className="text-xs font-medium hover:text-white transition-colors">& Orders</span>
                  </div>
                </Link>
              </Button>
            </div>

            {/* Cart */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative flex items-center gap-2 text-gray-700 hover:text-white transition-colors"
              >
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-full text-green-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, blogs..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
          </form>
        </div>
      </div>

      {/* ===================== */}
      {/* MAIN NAV HEADER - ALIGNED TO RIGHT */}
      {/* ===================== */}
      <header className={`sticky top-[68px] md:top-[88px] z-40 bg-green-900 shadow-lg`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-end"> {/* Changed from justify-center to justify-end */}
            {/* Desktop Navigation - Aligned to right */}
            <div className="hidden lg:flex items-center justify-end"> {/* Added justify-end */}
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={(e) => handleDropdownToggle(link.name, e)}
                        className={`flex items-center px-4 py-3 font-medium transition-colors text-sm ${
                          location.pathname.startsWith(link.href)
                            ? "text-white bg-green-800"
                            : "text-white hover:bg-green-800"
                        }`}
                      >
                        {link.name}
                        <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${
                          openDropdown === link.name ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {openDropdown === link.name && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-0 w-56 bg-white border rounded-lg shadow-lg z-50" /* Changed left-0 to right-0 */
                          >
                            {link.dropdown.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors border-b last:border-b-0 text-sm"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {item.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      className={`px-4 py-3 font-medium transition-colors text-sm ${
                        location.pathname === link.href
                          ? "text-white bg-green-800"
                          : "text-white hover:bg-green-800"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button for Second Nav */}
            <button
              className="lg:hidden w-full py-3 text-white text-center font-medium bg-green-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "Close Menu" : "Browse Categories"}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-green-900 border-t border-green-800 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-3 space-y-1">
                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <div key={link.name} className="border-b border-green-800 last:border-b-0">
                    {link.dropdown ? (
                      <div className="space-y-1">
                        <button
                          onClick={(e) => handleDropdownToggle(link.name, e)}
                          className="flex items-center justify-between w-full text-white font-medium py-3 hover:bg-green-800 px-2 rounded transition-colors"
                        >
                          {link.name}
                          <ChevronDown className={`w-4 h-4 transition-transform ${
                            openDropdown === link.name ? 'rotate-180' : ''
                          }`} />
                        </button>
                        
                        <AnimatePresence>
                          {openDropdown === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 space-y-1 overflow-hidden"
                            >
                              {link.dropdown.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="block text-gray-200 font-medium py-2 hover:bg-green-800 px-2 rounded transition-colors text-sm"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  • {item.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={link.href}
                        className="block text-white font-medium py-3 hover:bg-green-800 px-2 rounded transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Additional Mobile Options */}
                <div className="pt-4 border-t border-green-800 space-y-3 mt-3">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4" />
                    Returns & Orders
                  </Link>
                  
                  {/* Mobile Location */}
                  <div 
                    className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors cursor-pointer"
                    onClick={() => {
                      setUserLocation("Fetching location...");
                      navigator.geolocation.getCurrentPosition(
                        (pos) => {
                          setUserLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lon: ${pos.coords.longitude.toFixed(4)}`);
                        },
                        () => setUserLocation("Location unavailable")
                      );
                    }}
                  >
                    <MapPin className="w-4 h-4" />
                    <span className="truncate text-sm">{userLocation}</span>
                  </div>
                  
                  {/* Mobile Language Selector */}
                  <div className="flex items-center gap-2 text-white py-3 px-2">
                    <span className="text-sm">Language:</span>
                    <select 
                      className="border rounded px-2 py-1 text-gray-700 text-sm flex-1"
                      value={selectedLanguage.code}
                      onChange={(e) => {
                        const lang = languages.find(l => l.code === e.target.value);
                        if (lang) handleLanguageChange(lang);
                      }}
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};