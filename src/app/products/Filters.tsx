import React, { useState, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button } from "@/components/ui/button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import ButtonMain from "@/components/ButtonMain";

// Categories
export const categories = [
  'Fruits', 
  'Vegetables', 
  'Dairy', 
  'Bakery', 
  'Meat', 
  'Seafood', 
  'Snacks', 
  'Beverages', 
  'Frozen', 
  'Household', 
  'Other'
];

// Define types for filter state and active sections
interface Filters {
  sort: string;
  category: string;
  price: [number, number];
}

interface ActiveSections {
  sort: boolean;
  category: boolean;
  price: boolean;
}

const FilterComponent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Filters) => void;
}> = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState<Filters>({
    sort: "",
    category: "",
    price: [0, 2000],
  });

  const [activeSections, setActiveSections] = useState<ActiveSections>({
    sort: false,
    category: false,
    price: false,
  });

  const filterRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLButtonElement>(null);

  const sortOptions = [
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
    { value: "newlyArrived", label: "Newly Arrived" },
  ];

  const handleSectionToggle = (section: keyof ActiveSections) => {
    setActiveSections((prev) => {
      const newState = Object.keys(prev).reduce((acc, key) => ({
        ...acc, 
        [key]: key === section ? !prev[key as keyof ActiveSections] : false
      }), {} as ActiveSections);
      return newState;
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ 
      ...prev, 
      category: prev.category === category ? "" : category 
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setActiveSections((prev) => ({ ...prev, sort: false }));
  };

  const handlePriceChange = (value: [number, number]) => {
    setFilters((prev) => ({ ...prev, price: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const defaultFilters: Filters = {
      sort: "",
      category: "",
      price: [0, 2000],
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    onClose();
  };

  useOnClickOutside(filterRef, crossRef, onClose);

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-black bg-opacity-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        ref={filterRef}
        className={`absolute inset-y-0 left-0 w-96 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Filters</h2>
            <Button
              ref={crossRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className=""
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Sort By Section */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() => handleSectionToggle("sort")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-neutral-800">
                  Sort By
                </span>
                {activeSections.sort ? (
                  <ChevronUp className="h-5 w-5 text-neutral-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-600" />
                )}
              </button>
              {activeSections.sort && (
                <div className="mt-2 space-y-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full text-left py-2 px-3 rounded-md ${
                        filters.sort === option.value
                          ? "bg-neutral-200 text-neutral-900"
                          : "hover:bg-neutral-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Category Section */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() => handleSectionToggle("category")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-neutral-800">
                  Category
                </span>
                {activeSections.category ? (
                  <ChevronUp className="h-5 w-5 text-neutral-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-600" />
                )}
              </button>
              {activeSections.category && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`category-${category}`}
                        name="category"
                        checked={filters.category === category}
                        onChange={() => handleCategoryChange(category)}
                        className="text-neutral-900 focus:ring-neutral-900"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm text-neutral-700"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range Section */}
            <div className="border-b border-neutral-200 pb-4">
              <button
                onClick={() => handleSectionToggle("price")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-neutral-800">
                  Price Range
                </span>
                {activeSections.price ? (
                  <ChevronUp className="h-5 w-5 text-neutral-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-neutral-600" />
                )}
              </button>
              {activeSections.price && (
                <div className="mt-4">
                  <Slider
                    range
                    min={0}
                    max={2000}
                    step={100}
                    value={filters.price}
                    onChange={handlePriceChange as any}
                    trackStyle={{ backgroundColor: "#000" }}
                    handleStyle={[
                      { borderColor: "#000", backgroundColor: "#000" },
                      { borderColor: "#000", backgroundColor: "#000" },
                    ]}
                  />
                  <div className="flex justify-between text-sm text-neutral-600 mt-2">
                    <span>₹{filters.price[0]}</span>
                    <span>₹{filters.price[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Bottom Buttons */}
        <div className="p-6 border-t border-neutral-200 bg-white">
          <div className="space-y-4">
            <ButtonMain 
              className="w-full bg-black text-white hover:bg-neutral-800" 
              onClick={handleApply}
            >
              Apply Filters
            </ButtonMain>
            <Button
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900"
              onClick={handleClearFilters}
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;