import React, { useCallback, useRef, useState } from "react";
import { Search, ShoppingCart, User, Heart, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryMenu from "./Category";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getSearchSuggestion } from "@/lib/features/misc";
import useOnClickOutside from "@/hooks/useOnClickOutside";

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const cartItems = useSelector((state: any) => state.cart.items);
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setIsLoading] = useState(false);
  const dropdownRef = useRef<any>();
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch<any>();
  const [searchResults, setSearchResults] = useState([]);

  const navigateTo = (path) => {
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

  const fetchSearchSuggestions = useCallback(
    async (value) => {
      if (!value.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const { payload } = await dispatch(getSearchSuggestion(value));
        if (payload.success) {
          setSearchResults(payload.suggestion);
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSearchSuggestions(value);
  };

  const handleCategoryClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav className="bg-gray-50 text-gray-900 sticky top-0 z-[200] navbar-main">
      <div className="container mx-auto p-2">
        {isSearchActive ? (
          <div className="mt-2 flex flex-col items-center relative">
            <div className="w-full flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                placeholder="Search..."
                className="flex-grow bg-gray-200 text-gray-900 border-none rounded-l-md py-2 px-4 ring-[1px] ring-gray-300 focus:outline-none focus:ring-[1px] focus:ring-primary-500"
                onChange={handleInputChange}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchActive(false)}
                className="bg-primary-500 hover:bg-primary-600 rounded-r-md h-[42px] rounded-none"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {loading && (
              <div className="absolute top-full left-0 w-full bg-gray-300 rounded-b-md shadow-lg z-10 p-2">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            )}
            {!loading && searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute top-full left-0 w-full bg-gray-50 rounded-b-md shadow-xl z-10"
              >
                {searchResults.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-400 cursor-pointer"
                    onClick={() => {
                      setSearchTerm(item.name);
                      router.push(`/products/?search=${item.name}`);
                      setTimeout(() => {
                        setIsSearchActive(false);
                      }, 500);
                    }}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div
              onClick={() => router.push("/")}
              className="md:flex-1 flex items-center"
            >
              <h3 className="text-xl md:text-3xl font-samarkan text-[#D9251C] cursor-pointer">
                Shreya Collection
              </h3>
            </div>

            <div
              className="flex-1 flex md:justify-center justify-start"
              onClick={() => navigateTo("/")}
            >
              <img
                src="/assets/logo/logo.png"
                alt=""
                className="w-16 object-contain cursor-pointer"
              />
            </div>

            <div className="flex-1 flex justify-end space-x-2 lg:space-x-4">
              <Button variant="ghost" size="icon" onClick={handleSearchClick}>
                <Search className="h-5 w-5 lg:h-6 lg:w-6 " />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=" lg:inline-flex relative"
                onClick={() => navigateTo("/wishlist")}
              >
                <Heart className="h-6 w-6" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1 right-1 bg-red-700 w-2 h-2 rounded-full flex justify-center items-center shadow-xl"></span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=" lg:inline-flex relative"
                onClick={() => navigateTo("/cart")}
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute text-white -top-1 left-4 bg-red-700 w-6 h-6 rounded-full flex justify-center items-center shadow-xl">
                    {cartItems.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className=" lg:inline-flex"
                onClick={() => navigateTo("/profile")}
              >
                <User className="h-6 w-6" />
              </Button>

              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] z-[200] sm:w-[400px]"
                >
                  <Sidebar onCategoryClick={handleCategoryClick} />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        )}
      </div>

      <div className="hidden lg:block bg-gray-100 border-t-[1px] border-gray-900">
        <div className="container mx-auto py-2">
          <CategoryMenu onCategoryClick={handleCategoryClick} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
