import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Expand,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./swiper.css";

const ProductImageGallery = ({ images, name }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenIndex, setFullScreenIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const openFullScreen = (index) => {
    setFullScreenIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setFullScreenIndex((prevIndex) => (prevIndex + 1) % images.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setFullScreenIndex(
        (prevIndex) => (prevIndex - 1 + images.length) % images.length
      );
      setIsTransitioning(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isFullScreen) {
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") prevImage();
        if (event.key === "Escape") closeFullScreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullScreen]);

  return (
    <div className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start min-h-[100vh]">
      <div className="relative">
        <Swiper
          spaceBetween={10}
          navigation={images.length > 1} // Only show navigation if there's more than one image
          pagination={{ clickable: true }}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[Navigation, Pagination, Thumbs]}
          className="rounded-lg mb-4"
        >
          {images?.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                className="aspect-w-1 aspect-h-1 cursor-pointer h-[90vh]"
                onClick={() => openFullScreen(index)}
              >
                <img
                  src={src}
                  alt={`${name} image ${index + 1}`}
                  className="object-cover object-top "
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <button
          className="absolute z-10 top-4 right-4 bg-white/70 p-2 rounded-full hover:bg-white/90 transition-colors"
          onClick={() => openFullScreen(0)}
        >
          <Expand className="w-6 h-6" />
        </button>
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[Thumbs]}
        className="thumbs-swiper"
      >
        {images?.map((src, index) => (
          <SwiperSlide key={index}>
            <div className="aspect-w-1 aspect-h-1 cursor-pointer">
              <img
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="rounded-md object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {isFullScreen && (
        <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center">
          <style>
            {`
              .navbar-main {
                display: none;
              }
              .fullscreen-image {
                transition: opacity 0.3s ease-in-out;
              }
              .fullscreen-image.transitioning {
                opacity: 0;
              }
              .btn-add {
                z-index: -2;
              }
              .size-div {
                z-index: -2;
                opacity: 0;
              }
              .bottom-checkout {
                display: none;
              }
            `}
          </style>
          <div className="absolute top-4 left-4 text-white md:max-w-[30%] max-w-[80%]">
            <h2 className="text-xl font-semibold line-clamp-2">{name}</h2>
            <p>
              Image {fullScreenIndex + 1} of {images.length}
            </p>
          </div>
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={closeFullScreen}
          >
            <X className="w-8 h-8" />
          </button>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 z-40 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                onClick={prevImage}
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                className="absolute right-4 z-40 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                onClick={nextImage}
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </>
          )}
          <TransformWrapper>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent>
                  <img
                    src={images[fullScreenIndex]}
                    alt={`${name} full screen image ${fullScreenIndex + 1}`}
                    className={`max-h-screen max-w-full object-contain fullscreen-image ${
                      isTransitioning ? "transitioning" : ""
                    }`}
                  />
                </TransformComponent>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                  <button
                    className="bg-black/50 p-2 rounded-full hover:bg-black/30 transition-colors"
                    onClick={() => zoomIn()}
                  >
                    <ZoomIn className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="bg-black/50 p-2 rounded-full hover:bg-black/30 transition-colors"
                    onClick={() => zoomOut()}
                  >
                    <ZoomOut className="w-6 h-6 text-white" />
                  </button>
                  <button
                    className="bg-black/50 p-2 rounded-full hover:bg-black/30 transition-colors"
                    onClick={() => resetTransform()}
                  >
                    <Expand className="w-6 h-6 text-white" />
                  </button>
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
