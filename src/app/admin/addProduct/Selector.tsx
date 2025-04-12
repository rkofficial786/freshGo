import React, { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export const CategorySelector = ({
  categories,
  selectedCategories,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCategoryChange = (categoryId) => {
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onChange(updatedCategories);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label>Categories</Label>
      <div className="relative">
        <Button
          type="button"
          onClick={toggleDropdown}
          className="w-full justify-between"
          variant="outline"
        >
          {selectedCategories?.length > 0
            ? `${selectedCategories?.length} categories selected`
            : "Select categories"}
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </Button>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {categories.map((category) => (
              <div key={category._id}>
                {/* Parent category */}
                <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 bg-gray-50">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={selectedCategories.includes(category._id)}
                    onCheckedChange={() => handleCategoryChange(category._id)}
                  />
                  <label
                    htmlFor={`category-${category._id}`}
                    className="flex-grow cursor-pointer font-medium"
                  >
                    {category.name}
                  </label>
                </div>
                {/* Child categories */}
                {category.childCategory?.map((childCategory) => (
                  <div
                    key={childCategory._id}
                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 pl-8"
                  >
                    <Checkbox
                      id={`category-${childCategory._id}`}
                      checked={selectedCategories.includes(childCategory._id)}
                      onCheckedChange={() =>
                        handleCategoryChange(childCategory._id)
                      }
                    />
                    <label
                      htmlFor={`category-${childCategory._id}`}
                      className="flex-grow cursor-pointer"
                    >
                      {childCategory.name}
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategorySelector;
