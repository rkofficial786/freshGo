"use client";

import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  X,
  Menu,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getSearchSuggestion } from "@/lib/features/misc";
import useOnClickOutside from "@/hooks/useOnClickOutside";

// List of main categories for the dropdown
const mainCategories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Bakery",
  "Meat",
  "Seafood",
  "Snacks",
  "Beverages",
  "Frozen",
  "Household",
];

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cart.items);
  const inputRef = useRef<any>(null);
  const [loading, setIsLoading] = useState(false);
  const dropdownRef = useRef<any>(null);
  const categoryBtnRef = useRef<any>(null);
  const categoryDropdownRef = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<any>();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicks outside the category dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target) &&
        categoryBtnRef.current &&
        !categoryBtnRef.current.contains(event.target)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownRef, categoryBtnRef]);

  const navigateTo = (path: string) => {
    if ((path === "/profile" || path === "/cart") && !token) {
      router.push("/login");
    } else {
      router.push(path);
    }
  };

  const handleSearchClick = () => {
    setIsSearchActive(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Add this function to handle search submission
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setIsSearchActive(false);
    }
  };

  // Handle key press for search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchSearchSuggestions = useCallback(
    async (value: string) => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const { payload } = await dispatch(getSearchSuggestion(value));
        if (payload.success) {
          setSearchResults(payload.suggestions);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch]
  );

  useOnClickOutside(dropdownRef, inputRef, () => {
    setIsSearchActive(false);
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSearchSuggestions(value);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/products?category=${category}`);
    setIsCategoryDropdownOpen(false);
    setIsSheetOpen(false);
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav
      className={`sticky top-0 z-[200] w-full transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      {/* Top announcement bar - now in green */}
      <div className="bg-green-600 text-white py-2 text-center text-sm">
        <div className="container mx-auto">
          Free shipping on orders over ₹499 | Same-day delivery available
        </div>
      </div>

      {/* Main navbar */}
      <div
        className={`bg-white transition-all duration-300 ${
          isScrolled ? "py-1" : "py-2"
        }`}
      >
        <div className="container mx-auto px-4">
          {isSearchActive ? (
            <div className="flex flex-col items-center relative py-2">
              <div className="w-full flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  placeholder="Search for products..."
                  className="flex-grow bg-gray-100 text-gray-900 border-none rounded-l-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (searchTerm.trim()) {
                      handleSearch();
                    } else {
                      setIsSearchActive(false);
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-r-full h-[50px] rounded-l-none"
                >
                  {searchTerm.trim() ? (
                    <Search className="h-5 w-5" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {loading && (
                <div className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg z-10 p-4 mt-1">
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-6 w-full" />
                </div>
              )}

              {!loading && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 w-full bg-white rounded-b-lg shadow-lg z-10 mt-1 overflow-hidden"
                >
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-green-50 cursor-pointer border-b border-gray-100 flex items-center"
                      onClick={() => {
                        setSearchTerm(item.name);
                        router.push(`/products?search=${encodeURIComponent(item.name)}`);
                        setTimeout(() => {
                          setIsSearchActive(false);
                        }, 500);
                      }}
                    >
                      <Search className="h-4 w-4 text-green-600 mr-3" />
                      <span className="text-gray-800">{item.name}</span>
                      <span className="ml-auto text-xs text-gray-500 capitalize">
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-2">
                {/* Mobile menu button */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden text-gray-800"
                    >
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="left"
                    className="w-[300px] z-[200] sm:w-[350px]"
                  >
                    <div className="pt-6 pb-8">
                      <h3 className="text-2xl font-semibold text-green-600 mb-6 pl-4">
                        FreshGo
                      </h3>

                      <div className="space-y-6">
                        <div className="px-4">
                          <div className="text-sm font-semibold text-gray-500 mb-2">
                            CATEGORIES
                          </div>
                          {mainCategories.map((category) => (
                            <div
                              key={category}
                              className="py-2 px-2 hover:bg-green-50 rounded-md cursor-pointer"
                              onClick={() => handleCategoryClick(category)}
                            >
                              {category}
                            </div>
                          ))}
                        </div>

                        <div className="border-t border-gray-200 pt-4 px-4">
                          <div className="text-sm font-semibold text-gray-500 mb-2">
                            ACCOUNT
                          </div>
                          <div
                            className="py-2 px-2 hover:bg-green-50 rounded-md cursor-pointer"
                            onClick={() => {
                              navigateTo("/profile");
                              setIsSheetOpen(false);
                            }}
                          >
                            My Profile
                          </div>
                          <div
                            className="py-2 px-2 hover:bg-green-50 rounded-md cursor-pointer"
                            onClick={() => {
                              navigateTo("/orders");
                              setIsSheetOpen(false);
                            }}
                          >
                            My Orders
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Logo */}
                <div
                  onClick={() => router.push("/")}
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative w-16 h-16 mr-2 overflow-hidden">
                    <img
                      src="/assets/images/logo.png"
                      alt="logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop category dropdown */}
              <div className="hidden md:block relative">
                <Button
                  ref={categoryBtnRef}
                  variant="ghost"
                  className="text-gray-800 hover:bg-green-50 transition-colors flex items-center space-x-1"
                  onClick={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                >
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {isCategoryDropdownOpen && (
                  <div
                    ref={categoryDropdownRef}
                    className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg z-20 w-48 py-2 overflow-hidden border border-gray-100"
                  >
                    {mainCategories.map((category) => (
                      <div
                        key={category}
                        className="px-4 py-2 hover:bg-green-50 text-gray-800 cursor-pointer transition-colors"
                        onClick={() => handleCategoryClick(category)}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Search button (medium screens) */}
              <Button
                variant="ghost"
                className="hidden md:flex items-center space-x-2 text-gray-700 border border-gray-200 px-4 py-2 rounded-full hover:bg-green-50 flex-grow max-w-md mx-6"
                onClick={handleSearchClick}
              >
                <Search className="h-4 w-4 text-green-500" />
                <span className="text-gray-400 text-sm">
                  Search for products...
                </span>
              </Button>

              {/* Actions */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Search button (mobile only) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-800"
                  onClick={handleSearchClick}
                >
                  <Search className="h-5 w-5" />
                </Button>

                {/* User account */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-800"
                  onClick={() => navigateTo("/profile")}
                >
                  <User className="h-5 w-5" />
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-800"
                  onClick={() => navigateTo("/cart")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-0 -right-1 bg-green-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      
    </nav>
  );
};

export default Navbar;