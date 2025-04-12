import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Category = ({ onCategoryClick }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { categories } = useSelector((state: any) => state.category);
  const router = useRouter();
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-center space-x-4 mb-2">
        {categories?.map((category, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => setActiveCategory(index)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <button className="px-4 py-2 text-lg font-semibold hover:text-blue-600 transition-colors flex items-center">
              <span
                onClick={() =>
                  router.push(`/products?parentCategoryId=${category.id}`)
                }
              >
                {category?.name.toUpperCase()}
              </span>
              {category?.subCategories?.length > 0 && (
                <ChevronDown className="ml-1 w-4 h-4" />
              )}
            </button>
            {activeCategory === index &&
              category?.subCategories?.length > 0 && (
                <div
                  onClick={onCategoryClick}
                  className="absolute left-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top-left z-[100]"
                >
                  {category?.subCategories?.map((subcategory, subIndex) => (
                    <Link
                      key={subIndex}
                      href={`/products?categoryId=${subcategory.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:border-l-4 hover:border-l-primary-500 hover:pl-3 transition-all duration-200 border-l-4 border-l-transparent"
                    >
                      {subcategory?.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
