import React from "react";
import { ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSelector } from "react-redux";
import Link from "next/link";

const Sidebar = ({ onCategoryClick }) => {
  const { categories } = useSelector((state: any) => state.category);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center mb-6">
        <img
          src="/assets/logo/logo.png"
          alt=""
          className="w-16 object-contain"
        />
      </div>

      <Accordion type="single" collapsible className="w-full">
        {categories.map((category, index) => (
          <AccordionItem value={`item-${index}`} key={category.name}>
            <AccordionTrigger
              className={`text-black hover:text-primary-900 ${
                !category.subCategories || category.subCategories.length === 0
                  ? "no-arrow"
                  : ""
              }`}
            >
              {category.name}
            </AccordionTrigger>
            {category.subCategories && category.subCategories.length > 0 && (
              <AccordionContent onClick={onCategoryClick}>
                <ul className="pl-4">
                  {category.subCategories.map((subCategory) => (
                    <li key={subCategory.name} className="py-2">
                      <Link
                        href={`/products?categoryId=${subCategory.id}`}
                        className="text-gray-800 hover:text-primary-900 transition-colors"
                      >
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Sidebar;
