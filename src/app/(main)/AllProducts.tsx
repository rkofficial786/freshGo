"use client";

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const AllProducts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productsData, setProductsData] = useState({ items: [] });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNavigation, setShowNavigation] = useState(false);
  const sliderRef = useRef(null);
  const router = useRouter();

  const getResponsiveSettings = (itemCount) => {
    return [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, itemCount),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, itemCount),
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ];
  };

  const getSlidesToShow = (itemCount) => {
    if (typeof window !== "undefined") {
      if (window.innerWidth > 1024) {
        return Math.min(4, itemCount);
      } else if (window.innerWidth > 768) {
        return Math.min(3, itemCount);
      } else if (window.innerWidth > 480) {
        return Math.min(2, itemCount);
      }
      return 1;
    }
    return 4; // Default for SSR
  };

  const fetchFeaturedProducts = async () => {
    const queryParams = new URLSearchParams({
      limit: "8",
      isFeatured: "true",
    });

    try {
      setIsLoading(true);
      const response = await fetch(`/api/products`);
      const data = await response.json();

      if (data.success) {
        const items = data.products.map((item) => ({
          id: item._id,
          name: item.name,
          description: item.description,
          price: item.price,
          mrp: item.mrp,
          discount:
            item.discountPercentage ||
            Math.round(((item.mrp - item.price) / item.mrp) * 100),
          stockQuantity: item.stockQuantity,
          category: item.category,
          unit: item.unit,
          image: item.img,
          rating: item.rating?.avgRating || 0,
          numReviews: item.rating?.numReviews || 0,
        }));

        setProductsData({ items });

        // Check if navigation should be shown
        const slidesToShow = getSlidesToShow(items.length);
        setShowNavigation(items.length > slidesToShow);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    swipeToSlide: true,
    autoplay: false,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    responsive: getResponsiveSettings(productsData.items.length),
  };

  const goToNext = () => {
    sliderRef.current?.slickNext();
  };

  const goToPrev = () => {
    sliderRef.current?.slickPrev();
  };

  const isLastSlide = () => {
    const slidesToShow = getSlidesToShow(productsData.items.length);
    return currentSlide >= productsData.items.length - slidesToShow;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">ALL PRODUCTS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg h-80 animate-pulse"
            >
              <div className="bg-gray-200 h-40 w-full rounded-md mb-4"></div>
              <div className="bg-gray-200 h-6 w-3/4 rounded-md mb-2"></div>
              <div className="bg-gray-200 h-4 w-1/2 rounded-md mb-4"></div>
              <div className="bg-gray-200 h-8 w-full rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">ALL PRODUCTS</h2>
        <Button
          onClick={() => router.push(`/products`)}
          variant="link"
          className="text-black hover:bg-none group"
        >
          View All{" "}
          <ChevronRight
            className="ml-2 group-hover:translate-x-1 transition-all ease-in-out duration-300"
            size={20}
          />
        </Button>
      </div>

      <div className="relative">
        {productsData.items.length > 0 ? (
          <Slider
            ref={sliderRef}
            {...sliderSettings}
            className="featured-slider"
          >
            {productsData.items.map((product) => (
              <div key={product.id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}

        {showNavigation && (
          <>
            <Button
              variant="outline"
              size="icon"
              className={`absolute top-1/2 -left-4 transform -translate-y-1/2 z-10 transition-opacity ${
                currentSlide === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "opacity-100"
              }`}
              onClick={goToPrev}
              disabled={currentSlide === 0}
            >
              <ChevronLeft size={24} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={`absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 transition-opacity ${
                isLastSlide() ? "opacity-50 cursor-not-allowed" : "opacity-100"
              }`}
              onClick={goToNext}
              disabled={isLastSlide()}
            >
              <ChevronRight size={24} />
            </Button>
          </>
        )}
      </div>
      <style jsx global>{`
        .featured-slider .slick-list {
          margin: 0 -10px;
        }

        .featured-slider .slick-slide > div {
          padding: 0 10px;
        }

        .featured-slider .slick-track {
          display: flex !important;
        }

        .featured-slider .slick-slide {
          height: inherit !important;
        }

        .featured-slider .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default AllProducts;
