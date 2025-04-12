"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useRouter } from "next/navigation";

const Category = () => {
  const [subCategories, setSubCategories] = useState([]);
  const { categories } = useSelector((state: any) => state.category);
  const router = useRouter();
  const getAllSubcategories = (categories) => {
    let allSubcategories = [];
    categories.forEach((category) => {
      if (category.subCategories && category.subCategories.length > 0) {
        allSubcategories = [...allSubcategories, ...category.subCategories];
      }
    });
    setSubCategories(allSubcategories);
  };

  useEffect(() => {
    getAllSubcategories(categories);
  }, [categories]);

  return (
    <div className="overflow-hidden container mx-auto relative pb-12">
      <h2 className="text-3xl  mb-8 mt-4 text-center">SHOP BY CATEGORY</h2>

      <div className="relative px-8 category-carousel">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
          }}
          className="relative"
        >
          {subCategories.map((category, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() =>
                  router.push(`/products?categoryId=${category.id}`)
                }
                className="flex cursor-pointer flex-col items-center transform transition-transform duration-300 hover:scale-105"
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-red-300 mb-4 shadow-lg hover:border-red-500 transition-colors duration-300">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <h3 className="text-center font-medium text-lg mb-2">
                  {category.name.toUpperCase()}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <button className="swiper-button-prev absolute !w-8 !h-8 left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-primary-100 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button className="swiper-button-next absolute !w-8 !h-8 right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-primary-100  rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110">
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <style jsx global>{`
        .category-carousel .swiper-button-prev::after,
        .category-carousel .swiper-button-next::after {
          display: none;
        }

        .category-carousel .swiper-button-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .category-carousel .swiper {
          padding: 10px;
        }

        @media (max-width: 640px) {
          .category-carousel .swiper-button-prev,
          .category-carousel .swiper-button-next {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Category;
