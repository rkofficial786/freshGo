"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const router = useRouter();

  const fetchBanners = async () => {
    try {
      const response = await axios.get("/api/banner");
      const data = response.data.banners;
      const banner = data.map((p) => ({
        id: p._id,
        title: p.title,
        description: p.description,
        position: p.position,
        media: p.img,
        type: p.type,
        url: p.url,
      }));
      setBanners(banner);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1 && !isDragging) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length, isDragging]);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleDragMove = (e) => {
    if (!isDragging || dragStart === null) return;

    const currentPosition = e.clientX;
    const difference = currentPosition - dragStart;
    setDragOffset(difference);
  };

  const handleDragEnd = () => {
    if (!isDragging || dragStart === null) return;

    const threshold = 100; // minimum drag distance to trigger slide change

    if (dragOffset < -threshold) {
      // Dragged left -> next slide
      nextSlide();
    } else if (dragOffset > threshold) {
      // Dragged right -> previous slide
      prevSlide();
    }

    // Reset drag states
    setIsDragging(false);
    setDragStart(null);
    setDragOffset(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (url) => {
    if (url) {
      // Check if it's an external URL or internal route
      if (url.startsWith("http") || url.startsWith("https")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        router.push(url);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="relative h-[600px] w-full overflow-hidden group cursor-pointer"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(calc(${-currentSlide * 100}% + ${
            isDragging ? dragOffset : 0
          }px))`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full w-full h-full flex-shrink-0 relative"
            onClick={() => handleBannerClick(slide.url)}
          >
            {slide.type === "video" ? (
              <video
                className="w-full h-full object-top object-cover pointer-events-none"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={slide.media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={slide.media}
                alt={slide.title}
                className="w-full h-full object-cover object-top pointer-events-none"
              />
            )}
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
            aria-label="Next slide"
          >
            <ArrowRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white scale-125" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Banner;
