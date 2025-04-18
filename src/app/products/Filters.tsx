import React, { useState, useRef } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button } from "@/components/ui/button";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { categories } from "@/constants/contsants";



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
      const newState = Object.keys(prev).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === section ? !prev[key as keyof ActiveSections] : false,
        }),
        {} as ActiveSections
      );
      return newState;
    });
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === category ? "" : category,
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
            <h2 className="text-2xl font-bold text-green-700">Filters</h2>
            <Button
              ref={crossRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-green-600 hover:text-green-800 hover:bg-green-50"
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
                <span className="text-lg font-semibold text-green-800">
                  Sort By
                </span>
                {activeSections.sort ? (
                  <ChevronUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-green-600" />
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
                          ? "bg-green-100 text-green-800"
                          : "hover:bg-green-50 text-gray-700"
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
                <span className="text-lg font-semibold text-green-800">
                  Category
                </span>
                {activeSections.category ? (
                  <ChevronUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-green-600" />
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
                        className="text-green-600 focus:ring-green-600"
                      />
                      <label
                        htmlFor={`category-${category}`}
                        className="text-sm text-gray-700"
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
                <span className="text-lg font-semibold text-green-800">
                  Price Range
                </span>
                {activeSections.price ? (
                  <ChevronUp className="h-5 w-5 text-green-600" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-green-600" />
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
                    trackStyle={{ backgroundColor: "#16a34a" }}
                    handleStyle={[
                      { borderColor: "#16a34a", backgroundColor: "#16a34a" },
                      { borderColor: "#16a34a", backgroundColor: "#16a34a" },
                    ]}
                    railStyle={{ backgroundColor: "#dcfce7" }}
                  />
                  <div className="flex justify-between text-sm text-green-700 mt-2">
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
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApply}
            >
              Apply Filters
            </Button>
            <Button
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
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
