"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Showcase = () => {
  const router = useRouter();

  // Define the showcase items
  const showcaseItems = [
    {
      id: 1,
      name: "Seafood Collection",
      category: "Seafood",
      image: "/assets/images/fish.jpeg",
      colSpan: "col-span-2",
      rowSpan: "row-span-2",
      position: "center"
    },
    {
      id: 2,
      name: "Bakery Delights",
      category: "Bakery",
      image: "/assets/images/bread.webp",
      colSpan: "col-span-1",
      rowSpan: "row-span-2",
      position: "top"
    },
    {
      id: 3,
      name: "Meat Specials",
      category: "Meat",
      image: "/assets/images/meat.avif",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      position: "center"
    },
    {
      id: 4,
      name: "Dairy Products",
      category: "Dairy",
      image: "/assets/images/amul.jpg",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      position: "center"
    }
  ];

  // Second row items
  const mirroredItems = [
    {
      id: 5,
      name: "Sweet Delicacies",
      category: "Beverages",
      image: "/assets/images/Rasgulla.jpg",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      position: "center"
    },
    {
      id: 6,
      name: "Tasty Snacks",
      category: "Snacks",
      image: "/assets/images/snacks.avif",
      colSpan: "col-span-1",
      rowSpan: "row-span-1",
      position: "center"
    },
    {
      id: 7,
   
      name: "Fresh Fruits",
      category: "Fruits",
      image: "/assets/images/apples.jpg",
      colSpan: "col-span-2",
      rowSpan: "row-span-3",
      position: "center"
    },
    
    {
      id: 8,
      name: "Exotic Fruits",
      category: "Fruits",
      image: "/assets/images/mango.jpeg",
      colSpan: "col-span-2",
      rowSpan: "row-span-2",
      position: "center"
    }
  ];

  const handleItemClick = (category) => {
    router.push(`/products?category=${category}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of fresh and quality products organized by categories
          </p>
        </div>

        {/* Mobile view - simple stacked grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {[...showcaseItems, ...mirroredItems].map((item) => (
            <div
              key={item.id}
              className="relative h-48 overflow-hidden rounded-xl shadow-lg cursor-pointer"
              onClick={() => handleItemClick(item.category)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-80 transition-opacity duration-300 hover:opacity-90"></div>
              
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-110"
                style={{ objectPosition: item.position }}
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                <h3 className="text-white text-lg font-bold mb-1">
                  {item.name}
                </h3>
                <div className="flex items-center">
                  <div className="h-0.5 w-6 bg-white rounded mr-2"></div>
                  <p className="text-white text-xs font-medium">
                    Shop {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop view with grid layout */}
        <div className="hidden md:block">
          {/* First row */}
          <div className="grid grid-cols-4 auto-rows-[180px] gap-4 mb-4">
            {showcaseItems.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${item.colSpan} ${item.rowSpan}`}
                onClick={() => handleItemClick(item.category)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-80 transition-opacity duration-300 hover:opacity-90"></div>
                
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes={`(max-width: 768px) 100vw, ${item.colSpan === 'col-span-2' ? '50vw' : '25vw'}`}
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  style={{ objectPosition: item.position }}
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center">
                    <div className="h-0.5 w-8 bg-white rounded mr-3"></div>
                    <p className="text-white text-sm font-medium">
                      Shop {item.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - mirrored layout */}
          <div className="grid grid-cols-4 auto-rows-[180px] gap-4 mt-8">
            {mirroredItems.map((item) => (
              <div
                key={item.id}
                className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${item.colSpan} ${item.rowSpan}`}
                onClick={() => handleItemClick(item.category)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-80 transition-opacity duration-300 hover:opacity-90"></div>
                
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes={`(max-width: 768px) 100vw, ${item.colSpan === 'col-span-2' ? '50vw' : '25vw'}`}
                  className="object-cover transition-transform duration-700 hover:scale-110"
                  style={{ objectPosition: item.position }}
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform transition-transform duration-300">
                  <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold mb-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center">
                    <div className="h-0.5 w-8 bg-white rounded mr-3"></div>
                    <p className="text-white text-sm font-medium">
                      Shop {item.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Showcase;