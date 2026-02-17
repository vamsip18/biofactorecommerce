// src/components/layout/Header.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  ChevronDown,
  Search,
  MapPin,
  Package,
  ShoppingCart,
  LogOut,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Biofactor-Logo.png";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { searchProducts, getCollections } from "@/lib/supabase/products";
import { getCategoryRoute, getCategoryIcon, navigateWithSearch } from "@/lib/utils";

// Updated navLinks with dropdowns
const navLinks = [
  {
    name: "Agriculture",
    href: "/agriculture",
    dropdown: [
      { name: "Soil Applications", href: "/agriculture/soil-applications" },
      { name: "Foliar Applications", href: "/agriculture/foliar-applications" },
      { name: "Drip Applications", href: "/agriculture/drip-applications" },
      { name: "Crop Protection", href: "/agriculture/crop-protection" },
      { name: "Special Products", href: "/agriculture/special-products" }
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
  { name: "Customer Care", href: "/customerCare" }
];

const languages = [
  { code: "en", name: "English", locale: "en-US" },
  { code: "hi", name: "हिंदी", locale: "hi-IN" },
  { code: "te", name: "తెలుగు", locale: "te-IN" }
];

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const Header = () => {
  const { getCartCount } = useCart();
  const { user } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const saved = localStorage.getItem('preferredLanguage') || 'en';
    return languages.find(l => l.code === saved) || languages[0];
  });
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem('userLocation') || "Fetching location...";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{
    id: string;
    name: string;
    category: string;
    collection?: string;
    collection_name?: string;
    collection_slug?: string;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [collections, setCollections] = useState<Array<{ id: string; name: string; category: string }>>([]);

  const location = useLocation();
  const navigate = useNavigate();

  // Refs for click outside detection
  const userMenuRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search query for suggestions
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Fetch collections on mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();

        // Transform data to ensure we have the right structure
        const transformedData = data.map(collection => ({
          ...collection,
          name: collection.name || collection.title // Fallback to title
        }));

        setCollections(transformedData);
      } catch (err) {
        console.error('Error fetching collections:', err);
        // Continue without collections - search will still work
      }
    };
    fetchCollections();
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      const query = debouncedSearchQuery.trim();
      if (query.length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSearchLoading(true);
      try {
        const { products } = await searchProducts(query, {}, 5, 0);

        const suggestions = products.slice(0, 5).map(product => ({
          id: product.id,
          name: product.name,
          category: product.collections?.category || 'product',
          collection: product.collections?.name,
          collection_name: product.collections?.name,
          collection_slug: product.collections?.name?.toLowerCase().replace(/\s+/g, '-')
        }));

        setSearchSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSearchSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    if (debouncedSearchQuery) {
      fetchSuggestions();
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close user menu if clicked outside
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }

      // Close language menu if clicked outside
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setLanguageDropdownOpen(false);
      }

      // Close search suggestions if clicked outside
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }

      // Close navigation dropdowns
      if (openDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Persist location when it changes
  useEffect(() => {
    if (userLocation !== "Fetching location..." && userLocation !== "Location not supported") {
      localStorage.setItem('userLocation', userLocation);
    }
  }, [userLocation]);

  // Persist language when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', selectedLanguage.code);
    document.documentElement.lang = selectedLanguage.code;
  }, [selectedLanguage]);

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
              const locationStr = city && state ? `${city}, ${state}` : "Location found";
              setUserLocation(locationStr);
            } catch (error) {
              console.error("Error getting location:", error);
              setUserLocation("Location access granted");
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setUserLocation("Location access required");
          },
          { timeout: 10000, enableHighAccuracy: false }
        );
      } else {
        setUserLocation("Location not supported");
      }
    };

    // Only get location if not already set
    if (!localStorage.getItem('userLocation')) {
      getLocation();
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setShowUserMenu(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle search functionality - Navigates to category page with search query
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      // If we have suggestions, navigate to the first suggestion's category page
      if (searchSuggestions.length > 0) {
        const firstSuggestion = searchSuggestions[0];
        // Create a mock collection object for routing
        const mockCollection = {
          category: firstSuggestion.category,
          name: firstSuggestion.collection_name || firstSuggestion.collection || ''
        };
        const route = getCategoryRoute(mockCollection);

        navigateWithSearch(navigate, route, trimmedQuery);
      } else {
        // Otherwise, navigate to generic search page
        navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
      setSearchQuery("");
      setShowSuggestions(false);
      if (mobileMenuOpen) setMobileMenuOpen(false);
    }
  };

  // Handle suggestion click - Navigate to category page with search query
  const handleSuggestionClick = (suggestion: typeof searchSuggestions[0]) => {
    const mockCollection = {
      category: suggestion.category,
      name: suggestion.collection_name || suggestion.collection || ''
    };
    const route = getCategoryRoute(mockCollection);

    navigateWithSearch(navigate, route, suggestion.name, suggestion.id);
    setSearchQuery("");
    setShowSuggestions(false);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  // Handle language change
  const handleLanguageChange = (lang: typeof languages[0]) => {
    setSelectedLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  // Handle dropdown toggle
  const handleDropdownToggle = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Refresh location
  const refreshLocation = () => {
    setUserLocation("Fetching location...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
        },
        () => setUserLocation("Location unavailable")
      );
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.user_metadata?.full_name || user.email || "";
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* TOP HEADER BAR */}
      <div className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              src={logo}
              alt="Biofactor Logo"
              className="h-16 w-auto md:h-20"
            />
          </Link>

          {/* Location */}
          <div
            className="hidden md:flex items-center gap-1 text-sm text-gray-700 flex-shrink-0 hover:text-green-700 transition-colors cursor-pointer"
            onClick={refreshLocation}
            title="Click to refresh location"
          >
            <MapPin className="w-4 h-4 text-green-700 flex-shrink-0" />
            <span className="max-w-[120px] truncate">{userLocation}</span>
            <ChevronDown className="w-3 h-3 flex-shrink-0" />
          </div>

          {/* Search Bar with Suggestions */}
          <div className="hidden md:flex relative flex-1 max-w-2xl mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Search products by name, description..."
                className="w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
              />
              {searchLoading && (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && searchSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                  {searchSuggestions.map((suggestion) => {
                    const mockCollection = {
                      category: suggestion.category,
                      name: suggestion.collection_name || suggestion.collection || ''
                    };
                    const route = getCategoryRoute(mockCollection);
                    const isCategoryPage = !route.includes('/search');

                    return (
                      <button
                        key={suggestion.id}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3 border-b last:border-b-0"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                          {suggestion.collection && (
                            <p className="text-xs text-gray-500">
                              {isCategoryPage ? `Go to ${suggestion.collection}` : suggestion.collection}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                  <button
                    className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-center text-sm font-medium text-green-700 border-t"
                    onClick={handleSearch}
                  >
                    Search for "{searchQuery}"
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4 ml-auto">

            {/* Language Selector */}
            <div className="relative hidden md:block" ref={languageMenuRef}>
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
                        className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center justify-between ${selectedLanguage.code === lang.code ? "text-green-700 font-semibold bg-green-50" : "text-gray-700"
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

            {/* User Authentication Section - Desktop */}
            <div className="hidden md:flex items-center">
              {!user ? (
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
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors p-1 rounded-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border border-green-200">
                      <span className="text-sm font-semibold text-green-700">
                        {getUserInitials()}
                      </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
                    >
                      <div className="p-3 border-b">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-3 text-sm hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors border-b"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-3 text-sm hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors border-b"
                        onClick={() => setShowUserMenu(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders - Only show if user is logged in */}
            {user && (
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
            )}

            {/* Cart - Always visible */}
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors"
              >
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">Cart</span>
                  {getCartCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
                      {getCartCount()}
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
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.length >= 2) {
                  setShowSuggestions(true);
                } else {
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
            />
            {searchLoading && (
              <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
            )}
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Search Suggestions */}
          <AnimatePresence>
            {showSuggestions && searchSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border rounded-lg shadow-lg mt-1 overflow-hidden"
              >
                {searchSuggestions.map((suggestion) => {
                  const mockCollection = {
                    category: suggestion.category,
                    name: suggestion.collection_name || suggestion.collection || ''
                  };
                  const route = getCategoryRoute(mockCollection);
                  const isCategoryPage = !route.includes('/search');

                  return (
                    <button
                      key={suggestion.id}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors flex items-center gap-3 border-b last:border-b-0"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{suggestion.name}</p>
                        {suggestion.collection && (
                          <p className="text-xs text-gray-500">
                            {isCategoryPage ? `Go to ${suggestion.collection}` : suggestion.collection}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
                <button
                  className="w-full text-left px-4 py-3 hover:bg-green-50 transition-colors text-center text-sm font-medium text-green-700 border-t"
                  onClick={handleSearch}
                >
                  Search for "{searchQuery}"
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* MAIN NAV HEADER */}
      <header className={`sticky top-[68px] md:top-[88px] z-40 bg-green-900 shadow-lg`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-end">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-end">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 font-medium transition-colors text-sm ${location.pathname === link.href
                    ? "text-white bg-green-800"
                    : "text-white hover:bg-green-800"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button for Second Nav */}
            <button
              className="lg:hidden w-full py-3 text-white text-center font-medium bg-green-800 hover:bg-green-700 transition-colors"
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
                    <Link
                      to={link.href}
                      className="block text-white font-medium py-3 hover:bg-green-800 px-2 rounded transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}

                {/* Additional Mobile Options */}
                <div className="pt-4 border-t border-green-800 space-y-3 mt-3">
                  {/* Mobile Authentication */}
                  {!user ? (
                    <Link
                      to="/login"
                      className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Login
                    </Link>
                  ) : (
                    <>
                      <div className="p-2 bg-green-800 rounded-lg mb-2">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.user_metadata?.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-green-200 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Package className="w-4 h-4" />
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-2 text-red-300 py-3 hover:bg-green-800 px-2 rounded w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  )}

                  {/* Mobile Location */}
                  <div
                    className="flex items-center gap-2 text-white py-3 hover:bg-green-800 px-2 rounded transition-colors cursor-pointer"
                    onClick={refreshLocation}
                  >
                    <MapPin className="w-4 h-4 flex-shrink-0" />
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
