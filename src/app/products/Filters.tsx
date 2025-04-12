import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown, ChevronUp, Check } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import ButtonMain from "@/components/ButtonMain";

const FilterComponent = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    sort: "",
    discount: { value: 0 },
    material: [],
    color: [],
    size: [],
    price: [0, 20000],
  });
  const [activeSections, setActiveSections] = useState({
    sort: false,
    discount: false,
    material: false,
    color: false,
    size: false,
    price: false,
  });
  const [showAllColors, setShowAllColors] = useState(false);
  const filterRef = useRef(null);
  const crossRef = useRef(null);

  const allColors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "black",
    "white",
    "orange",
    "brown",
    "gray",
    "cyan",
    "magenta",
    "lime",
    "teal",
    "indigo",
    "violet",
    "maroon",
    "navy",
    "olive",
    "silver",
    "gold",
    "beige",
    "turquoise",
    "coral",
    "crimson",
    "fuchsia",
    "khaki",
    "lavender",
    "plum",
    "salmon",
    "tan",
  ];

  const sizeOptions = [
    "M",
    "L",
    "XL",
    "XXL",
    "3XL",
    "4XL",
    "5XL",
    "6XL",
    "Others",
    "Freesize",
  ];

  const materialOptions = [
    "Cotton",
    "Jimmy-choo",
    "Roman Tissue",
    "Fansy pattu",
    "Semi pattu",
    "Kanchi pattu",
    "Banaras",
    "Silk",
    "Tissue",
    "Capsule",
  ];

  const sortOptions = [
    { value: "priceLowToHigh", label: "Price: Low to High" },
    { value: "priceHighToLow", label: "Price: High to Low" },
    { value: "newlyArrived", label: "Newly Arrived" },
  ];

  const handleSectionToggle = (section) => {
    setActiveSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
    setActiveSections((prev) => ({ ...prev, sort: false }));
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({ ...prev, price: value }));
  };

  const handleDiscountChange = (value) => {
    setFilters((prev) => ({ ...prev, discount: { value } }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      sort: "",
      discount: { value: 0 },
      material: [],
      color: [],
      size: [],
      price: [0, 100000],
    });
    onApplyFilters({
      sort: "",
      discount: { value: 0 },
      material: [],
      color: [],
      size: [],
      price: [0, 100000],
    });
    onClose();
  };

  useOnClickOutside(filterRef, crossRef, onClose);

  const visibleColors = showAllColors ? allColors : allColors.slice(0, 20);

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
        } transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
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
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("sort")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Sort By
                </span>
                {activeSections.sort ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
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
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Discount Section */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("discount")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Discount
                </span>
                {activeSections.discount ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {activeSections.discount && (
                <div className="mt-4">
                  <Slider
                    min={0}
                    max={100}
                    step={10}
                    value={filters.discount.value}
                    onChange={handleDiscountChange}
                    trackStyle={{ backgroundColor: "#3B82F6" }}
                    handleStyle={{
                      borderColor: "#3B82F6",
                      backgroundColor: "#3B82F6",
                    }}
                  />
                  <div className="text-sm text-gray-600 mt-2">
                    {filters.discount.value}% off or more
                  </div>
                </div>
              )}
            </div>

            {/* Size Section */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("size")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Size
                </span>
                {activeSections.size ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {activeSections.size && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {sizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`size-${size}`}
                        checked={filters.size.includes(size)}
                        onCheckedChange={() =>
                          handleCheckboxChange("size", size)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`size-${size}`}
                        className="text-sm text-gray-600"
                      >
                        {size}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Material Section */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("material")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Material
                </span>
                {activeSections.material ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {activeSections.material && (
                <div className="mt-2 space-y-2">
                  {materialOptions.map((material) => (
                    <div key={material} className="flex items-center space-x-2">
                      <Checkbox
                        id={`material-${material}`}
                        checked={filters.material.includes(material)}
                        onCheckedChange={() =>
                          handleCheckboxChange("material", material)
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`material-${material}`}
                        className="text-sm text-gray-600"
                      >
                        {material}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Section */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("color")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Color
                </span>
                {activeSections.color ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {activeSections.color && (
                <>
                  <div className="mt-2 grid grid-cols-6 gap-2">
                    {visibleColors.map((color) => (
                      <button
                        key={color}
                        title={color}
                        className={`
                          w-8 h-8 rounded-full cursor-pointer border-2 
                          ${
                            filters.color.includes(color)
                              ? "border-gray-800"
                              : "border-gray-300"
                          } 
                          hover:scale-110 transition-transform flex items-center justify-center
                        `}
                        style={{ backgroundColor: color }}
                        onClick={() => handleCheckboxChange("color", color)}
                      >
                        {filters.color.includes(color) && (
                          <Check
                            className={`h-4 w-4 ${
                              ["white", "yellow", "beige"].includes(color)
                                ? "text-black"
                                : "text-white"
                            }`}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                  {allColors.length > 20 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => setShowAllColors(!showAllColors)}
                    >
                      {showAllColors ? "Show Less" : "Show More"}
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Price Range Section */}
            <div className="border-b border-gray-200 pb-4">
              <button
                onClick={() => handleSectionToggle("price")}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-700">
                  Price Range
                </span>
                {activeSections.price ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {activeSections.price && (
                <div className="mt-4">
                  <Slider
                    range
                    min={0}
                    max={20000}
                    step={100}
                    value={filters.price}
                    onChange={handlePriceChange}
                    trackStyle={{ backgroundColor: "#3B82F6" }}
                    handleStyle={[
                      { borderColor: "#3B82F6", backgroundColor: "#3B82F6" },
                      { borderColor: "#3B82F6", backgroundColor: "#3B82F6" },
                    ]}
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>₹{filters.price[0]}</span>
                    <span>₹{filters.price[1]}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <ButtonMain className="w-full  text-white" onClick={handleApply}>
              Apply Filters
            </ButtonMain>
            <Button
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
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
