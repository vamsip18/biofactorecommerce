// src/components/layout/Header.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Home,
  Headset,
  ChevronDown,
  Search,
  MapPin,
  Package,
  ShoppingCart,
  LogOut,
  Loader2,
  ChevronRight,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/Biofactor-Logo.png";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage, useTranslation } from "@/contexts/LanguageContext";
import { searchProducts, getCollections } from "@/lib/supabase/products";
import { getCategoryRoute, getCategoryIcon, navigateWithSearch } from "@/lib/utils";

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

export const Header = ({ theme = 'green' }: { theme?: 'green' | 'cyan' | 'amber' | 'lime' }) => {
  const { getCartCount } = useCart();
  const { user } = useAuth();
  const { language, setLanguage, languages: availableLanguages } = useLanguage();
  const t = useTranslation();

  // Helper function to get theme colors
  const getThemeColor = (colorName: string): string => {
    const themeColors: Record<string, Record<string, string>> = {
      green: {
        primary: 'green-700',
        primaryDark: 'green-800',
        primary50: 'green-50',
        primary800: 'green-800',
        bg900: 'bg-green-900',
      },
      cyan: {
        primary: 'cyan-700',
        primaryDark: 'cyan-800',
        primary50: 'cyan-50',
        primary800: 'cyan-800',
        bg900: 'bg-cyan-900',
      },
      amber: {
        primary: 'amber-700',
        primaryDark: 'amber-800',
        primary50: 'amber-50',
        primary800: 'amber-800',
        bg900: 'bg-amber-900',
      },
      lime: {
        primary: 'lime-700',
        primaryDark: 'lime-800',
        primary50: 'lime-50',
        primary800: 'lime-800',
        bg900: 'bg-lime-900',
      },
    };
    return themeColors[theme]?.[colorName] || themeColors.green[colorName];
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<string>(() => {
    return localStorage.getItem('userLocation') || "Fetching location...";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
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

  // Persist language when it changes - handled by LanguageContext now
  // LanguageContext already manages localStorage and document.documentElement.lang

  // Hide bottom nav when keyboard is open on small screens
  useEffect(() => {
    const shouldHandle = () => window.innerWidth < 768;

    const handleFocusIn = (event: FocusEvent) => {
      if (!shouldHandle()) return;
      const target = event.target as HTMLElement | null;
      const isInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT");
      if (isInput) {
        setIsKeyboardOpen(true);
        document.body.classList.add("keyboard-open");
      }
    };

    const handleFocusOut = () => {
      if (!shouldHandle()) return;
      window.setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT");
        if (!isInput) {
          setIsKeyboardOpen(false);
          document.body.classList.remove("keyboard-open");
        }
      }, 100);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.body.classList.remove("keyboard-open");
    };
  }, []);

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
  const handleLanguageChange = (langCode: typeof language) => {
    setLanguage(langCode);
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

  // Generate navigation links based on current language
  const navLinks = [
    {
      name: t.nav.agriculture,
      href: "/agriculture",
      dropdown: [
        { name: t.nav.soilApplications, href: "/agriculture/soil-applications" },
        { name: t.nav.foliarApplications, href: "/agriculture/foliar-applications" },
        { name: t.nav.dripApplications, href: "/agriculture/drip-applications" },
        { name: t.nav.cropProtection, href: "/agriculture/crop-protection" },
        { name: t.nav.specialApplications, href: "/agriculture/special-products" }
      ]
    },
    {
      name: t.nav.aquaculture,
      href: "/aquaculture",
      dropdown: [
        { name: t.nav.probiotics, href: "/aquaculture/probiotics" },
        { name: t.nav.diseaseManagement, href: "/aquaculture/disease-management" }
      ]
    },
    { name: t.nav.largeAnimals, href: "/large-animals" },
    { name: t.nav.kitchenGardening, href: "/kitchen-gardening" },
    { name: t.nav.blog, href: "/blog" },
    { name: t.nav.contact, href: "/customerCare" }
  ];

  const mobileSidebarSurface = theme === 'cyan'
    ? 'bg-cyan-50 border-cyan-200'
    : theme === 'amber'
      ? 'bg-amber-50 border-amber-200'
      : theme === 'lime'
        ? 'bg-lime-50 border-lime-200'
        : 'bg-green-50 border-green-200';

  const mobileSidebarHeading = theme === 'cyan'
    ? 'text-cyan-900'
    : theme === 'amber'
      ? 'text-amber-900'
      : theme === 'lime'
        ? 'text-lime-900'
        : 'text-green-900';

  const mobileSidebarLink = theme === 'cyan'
    ? 'text-cyan-800 hover:bg-cyan-100'
    : theme === 'amber'
      ? 'text-amber-800 hover:bg-amber-100'
      : theme === 'lime'
        ? 'text-lime-800 hover:bg-lime-100'
        : 'text-green-800 hover:bg-green-100';

  const mobileActiveText = theme === 'cyan'
    ? 'text-cyan-700'
    : theme === 'amber'
      ? 'text-amber-700'
      : theme === 'lime'
        ? 'text-lime-700'
        : 'text-green-700';

  const mobileActiveBg = theme === 'cyan'
    ? 'bg-cyan-50'
    : theme === 'amber'
      ? 'bg-amber-50'
      : theme === 'lime'
        ? 'bg-lime-50'
        : 'bg-green-50';

  const isHomeActive = location.pathname === '/';
  const isCartActive = location.pathname === '/cart';
  const isProfileActive = location.pathname === '/profile' || location.pathname === '/login' || location.pathname === '/account';
  const isCustomerCareActive = location.pathname === '/customerCare';

  return (
    <>
      {/* TOP HEADER BAR */}
      <div className={`sticky top-0 z-50 bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
          <div className="md:hidden w-full flex items-center gap-2">
            <Link to="/" className="flex items-center flex-shrink-0">
              <img
                src={logo}
                alt="Biofactor Logo"
                className="h-10 w-auto"
              />
            </Link>

            <form onSubmit={handleSearch} className="relative flex-1 min-w-0">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
                placeholder={t.nav.search}
                className={`w-full pl-8 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm ${theme === 'cyan' ? 'focus:ring-cyan-600' : theme === 'amber' ? 'focus:ring-amber-600' : theme === 'lime' ? 'focus:ring-lime-600' : 'focus:ring-green-600'}`}
              />
            </form>
          </div>

          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-2 flex-shrink-0">
            <img
              src={logo}
              alt="Biofactor Logo"
              className="h-16 w-auto md:h-20"
            />
          </Link>

          {/* Location */}
          <div
            className={`hidden md:flex items-center gap-1 text-sm text-gray-700 flex-shrink-0 transition-colors cursor-pointer ${theme === 'cyan' ? 'hover:text-cyan-700' : theme === 'amber' ? 'hover:text-amber-700' : theme === 'lime' ? 'hover:text-lime-700' : 'hover:text-green-700'
              }`}
            onClick={refreshLocation}
            title="Click to refresh location"
          >
            {theme === 'cyan' ? (
              <MapPin className="w-4 h-4 text-cyan-700 flex-shrink-0" />
            ) : theme === 'amber' ? (
              <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0" />
            ) : theme === 'lime' ? (
              <MapPin className="w-4 h-4 text-lime-700 flex-shrink-0" />
            ) : (
              <MapPin className="w-4 h-4 text-green-700 flex-shrink-0" />
            )}
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
                placeholder={t.nav.search}
                className={`w-full pl-10 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 text-sm ${theme === 'cyan' ? 'focus:ring-cyan-600' : theme === 'amber' ? 'focus:ring-amber-600' : theme === 'lime' ? 'focus:ring-lime-600' : 'focus:ring-green-600'
                  }`}
              />
              {searchLoading && (
                <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
              )}
              <button
                type="submit"
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 ${theme === 'cyan' ? 'hover:text-cyan-700' : theme === 'amber' ? 'hover:text-amber-700' : theme === 'lime' ? 'hover:text-lime-700' : 'hover:text-green-700'
                  }`}
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
                        className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 border-b last:border-b-0 ${theme === 'cyan' ? 'hover:bg-cyan-50' : theme === 'amber' ? 'hover:bg-amber-50' : theme === 'lime' ? 'hover:bg-lime-50' : 'hover:bg-green-50'
                          }`}
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
                    className={`w-full text-left px-4 py-3 transition-colors text-center text-sm font-medium border-t ${theme === 'cyan' ? 'hover:bg-cyan-50 text-cyan-600' : theme === 'amber' ? 'hover:bg-amber-50 text-amber-600' : theme === 'lime' ? 'hover:bg-lime-50 text-lime-600' : 'hover:bg-green-50 text-green-700'
                      }`}
                    onClick={handleSearch}
                  >
                    Search for "{searchQuery}"
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side icons */}
          <div className="hidden md:flex items-center gap-2 md:gap-4 ml-auto">

            {/* Language Selector */}
            <div className="relative hidden md:block" ref={languageMenuRef}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 text-sm text-gray-700 hover:text-white px-2 py-1 rounded transition-colors ${theme === 'cyan' ? 'hover:bg-cyan-700' : theme === 'amber' ? 'hover:bg-amber-700' : theme === 'lime' ? 'hover:bg-lime-700' : 'hover:bg-green-700'
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setLanguageDropdownOpen(!languageDropdownOpen);
                }}
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{availableLanguages.find(l => l.code === language)?.nativeName}</span>
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
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between ${language === lang.code
                          ? theme === 'cyan'
                            ? 'text-cyan-600 font-semibold bg-cyan-50'
                            : theme === 'amber'
                              ? 'text-amber-600 font-semibold bg-amber-50'
                              : theme === 'lime'
                                ? 'text-lime-600 font-semibold bg-lime-50'
                                : 'text-green-700 font-semibold bg-green-50'
                          : 'text-gray-700'
                          } ${theme === 'cyan' ? 'hover:bg-cyan-50' : theme === 'amber' ? 'hover:bg-amber-50' : theme === 'lime' ? 'hover:bg-lime-50' : 'hover:bg-green-50'}`}
                        onClick={() => handleLanguageChange(lang.code)}
                      >
                        <span>{lang.nativeName}</span>
                        {language === lang.code && (
                          <div className={`w-2 h-2 ${theme === 'cyan' ? 'bg-cyan-600' : theme === 'amber' ? 'bg-amber-600' : theme === 'lime' ? 'bg-lime-600' : 'bg-green-600'} rounded-full`}></div>
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
                  className={`flex items-center gap-2 text-gray-700 hover:text-white transition-colors ${theme === 'cyan' ? 'hover:bg-cyan-700' : theme === 'amber' ? 'hover:bg-amber-700' : theme === 'lime' ? 'hover:bg-lime-700' : 'hover:bg-green-700'
                    }`}
                >
                  <Link to="/login">
                    <User className="w-4 h-4" />
                    {t.nav.login}
                  </Link>
                </Button>
              ) : (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 text-gray-700 transition-colors p-1 rounded-full ${theme === 'cyan' ? 'hover:text-cyan-700' : theme === 'amber' ? 'hover:text-amber-700' : theme === 'lime' ? 'hover:text-lime-700' : 'hover:text-green-700'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${theme === 'cyan'
                      ? 'bg-cyan-100 border-cyan-200'
                      : theme === 'amber'
                        ? 'bg-amber-100 border-amber-200'
                        : theme === 'lime'
                          ? 'bg-lime-100 border-lime-200'
                          : 'bg-green-100 border-green-200'
                      }`}>
                      <span className={`text-sm font-semibold ${theme === 'cyan' ? 'text-cyan-700' : theme === 'amber' ? 'text-amber-700' : theme === 'lime' ? 'text-lime-700' : 'text-green-700'
                        }`}>
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
                        to="/account"
                        className={`block px-4 py-3 text-sm text-gray-700 transition-colors border-b ${theme === 'cyan'
                          ? 'hover:bg-cyan-50 hover:text-cyan-700'
                          : theme === 'amber'
                            ? 'hover:bg-amber-50 hover:text-amber-700'
                            : theme === 'lime'
                              ? 'hover:bg-lime-50 hover:text-lime-700'
                              : 'hover:bg-green-50 hover:text-green-700'
                          }`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t.account.profile}
                      </Link>
                      <Link
                        to="/orders"
                        className={`block px-4 py-3 text-sm text-gray-700 transition-colors border-b ${theme === 'cyan'
                          ? 'hover:bg-cyan-50 hover:text-cyan-700'
                          : theme === 'amber'
                            ? 'hover:bg-amber-50 hover:text-amber-700'
                            : theme === 'lime'
                              ? 'hover:bg-lime-50 hover:text-lime-700'
                              : 'hover:bg-green-50 hover:text-green-700'
                          }`}
                        onClick={() => setShowUserMenu(false)}
                      >
                        {t.account.orders}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.nav.logout}
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
                  className={`flex items-center gap-2 text-gray-700 hover:text-white transition-colors ${theme === 'cyan' ? 'hover:bg-cyan-700' : theme === 'amber' ? 'hover:bg-amber-700' : theme === 'lime' ? 'hover:bg-lime-700' : 'hover:bg-green-700'
                    }`}
                >
                  <Link to="/orders">
                    <Package className="w-4 h-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-xs hover:text-white transition-colors">{t.footer.returns}</span>
                      <span className="text-xs font-medium hover:text-white transition-colors">& {t.account.orders}</span>
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
                className={`relative flex items-center gap-2 text-gray-700 transition-colors ${theme === 'cyan' ? 'hover:text-cyan-700' : theme === 'amber' ? 'hover:text-amber-700' : theme === 'lime' ? 'hover:text-lime-700' : 'hover:text-green-700'
                  }`}
              >
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="hidden md:inline text-sm font-medium">{t.nav.cart}</span>
                  {getCartCount() > 0 && (
                    <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1 ${theme === 'cyan' ? 'bg-cyan-600' : theme === 'amber' ? 'bg-amber-600' : theme === 'lime' ? 'bg-lime-600' : 'bg-green-600'
                      }`}>
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Mobile Search Suggestions */}
        <div className="md:hidden px-4 pb-2">
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
                      className={`w-full text-left px-4 py-3 transition-colors flex items-center gap-3 border-b last:border-b-0 ${theme === 'cyan' ? 'hover:bg-cyan-50' : theme === 'amber' ? 'hover:bg-amber-50' : theme === 'lime' ? 'hover:bg-lime-50' : 'hover:bg-green-50'
                        }`}
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
                  className={`w-full text-left px-4 py-3 transition-colors text-center text-sm font-medium border-t ${theme === 'cyan' ? 'hover:bg-cyan-50 text-cyan-600' : theme === 'amber' ? 'hover:bg-amber-50 text-amber-600' : theme === 'lime' ? 'hover:bg-lime-50 text-lime-600' : 'hover:bg-green-50 text-green-700'
                    }`}
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
      <header className={`sticky top-[68px] md:top-[88px] z-40 shadow-lg ${theme === 'cyan' ? 'bg-cyan-900' : theme === 'amber' ? 'bg-amber-900' : theme === 'lime' ? 'bg-lime-900' : 'bg-green-900'
        }`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-end">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-end">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-3 font-medium transition-colors text-sm text-white ${location.pathname === link.href
                    ? theme === 'cyan' ? 'bg-cyan-800' : theme === 'amber' ? 'bg-amber-800' : theme === 'lime' ? 'bg-lime-800' : 'bg-green-800'
                    : theme === 'cyan' ? 'hover:bg-cyan-800' : theme === 'amber' ? 'hover:bg-amber-800' : theme === 'lime' ? 'hover:bg-lime-800' : 'hover:bg-green-800'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/40 z-[70]"
                onClick={() => setMobileMenuOpen(false)}
              />

              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className={`lg:hidden fixed top-0 left-0 h-full w-[85%] max-w-[320px] z-[80] shadow-2xl overflow-y-auto border-r ${mobileSidebarSurface}`}
              >
                <div className={`p-4 border-b flex items-center justify-between ${mobileSidebarSurface}`}>
                  <span className={`font-bold ${mobileSidebarHeading}`}>Menu</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`p-2 rounded-full ${mobileSidebarHeading} ${theme === 'cyan' ? 'hover:bg-cyan-100' : theme === 'amber' ? 'hover:bg-amber-100' : theme === 'lime' ? 'hover:bg-lime-100' : 'hover:bg-green-100'}`}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 space-y-4 text-sm">
                  <div>
                    <div className={`font-semibold mb-2 ${mobileSidebarHeading}`}>Categories</div>
                    <div className="space-y-1">
                      <Link to="/agriculture" onClick={() => setMobileMenuOpen(false)} className={`block py-2 px-2 rounded ${mobileSidebarLink}`}>Agriculture</Link>
                      <Link to="/aquaculture" onClick={() => setMobileMenuOpen(false)} className={`block py-2 px-2 rounded ${mobileSidebarLink}`}>Aquaculture</Link>
                      <Link to="/large-animals" onClick={() => setMobileMenuOpen(false)} className={`block py-2 px-2 rounded ${mobileSidebarLink}`}>Large Animals</Link>
                      <Link to="/kitchen-gardening" onClick={() => setMobileMenuOpen(false)} className={`block py-2 px-2 rounded ${mobileSidebarLink}`}>Kitchen Gardening</Link>
                    </div>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </header>

      <nav className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${isHomeActive ? `${mobileActiveText} ${mobileActiveBg}` : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${mobileMenuOpen ? `${mobileActiveText} ${mobileActiveBg}` : 'text-gray-600 hover:text-gray-900'}`}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-5 h-5" />
            <span>Menu</span>
          </button>

          <Link
            to="/cart"
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${isCartActive ? `${mobileActiveText} ${mobileActiveBg}` : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ShoppingCart className="w-5 h-5" />
            {getCartCount() > 0 && (
              <span className={`absolute top-1 right-7 text-white text-[10px] rounded-full min-w-4 h-4 flex items-center justify-center px-1 ${theme === 'cyan' ? 'bg-cyan-600' : theme === 'amber' ? 'bg-amber-600' : theme === 'lime' ? 'bg-lime-600' : 'bg-green-600'}`}>
                {getCartCount()}
              </span>
            )}
            <span>Cart</span>
          </Link>

          <Link
            to={user ? '/account' : '/login'}
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${isProfileActive ? `${mobileActiveText} ${mobileActiveBg}` : 'text-gray-600 hover:text-gray-900'}`}
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>

          <Link
            to="/customerCare"
            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${isCustomerCareActive ? `${mobileActiveText} ${mobileActiveBg}` : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Headset className="w-5 h-5" />
            <span>Customer Care</span>
          </Link>
        </div>
      </nav>
    </>
  );
};
