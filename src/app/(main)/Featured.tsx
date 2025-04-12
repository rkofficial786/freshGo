"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { getAllProducts } from "@/lib/features/products";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useRouter } from "next/navigation";

const Featured = () => {
  const dispatch = useDispatch<any>();
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
    if (window.innerWidth > 1024) {
      return Math.min(4, itemCount);
    } else if (window.innerWidth > 768) {
      return Math.min(3, itemCount);
    } else if (window.innerWidth > 480) {
      return Math.min(2, itemCount);
    }
    return 1;
  };

  const callGetProducts = async () => {
    const queryParams = new URLSearchParams({
      limit: "8",
      featureProduct: "true",
    });
    try {
      setIsLoading(true);
      const { payload } = await dispatch(getAllProducts(queryParams));
      if (payload.success) {
        const items = payload.products.map((item) => ({
          id: item._id,
          name: item.name,
          rating: item.rating.star,
          offerPrice: item.sizes[0].offerPrice,
          actualPrice: item.actualPrice,
          reviewCount: item.rating.ratedBy,
          brand: item.brand || "Brand",
          image: item.img,
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
    callGetProducts();
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
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl text-center">FEATURED PRODUCTS</h2>
        <Button
          onClick={() => router.push(`/products?featureProduct=true`)}
          variant="link"
          className="text-primary hover:bg-none group"
        >
          View All{" "}
          <ChevronRight
            className="ml-2 group-hover:translate-x-1 transition-all ease-in-out duration-300"
            size={20}
          />
        </Button>
      </div>

      <div className="relative">
        <Slider ref={sliderRef} {...sliderSettings} className="featured-slider">
          {productsData.items.map((product) => (
            <div key={product.id} className="px-2">
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>

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

export default Featured;
