"use client";

import React, { useEffect, useState } from "react";

const EcommerceParallaxHero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroContent: any = document.querySelector(".hero-content");
      const heroOverlay: any = document.querySelector(".hero-overlay");
      const parallaxBg: any = document.querySelector(".parallax-bg");
      const patternLayer: any = document.querySelector(".pattern-layer");
      const glowLayer: any = document.querySelector(".glow-layer");

      if (parallaxBg) {
        parallaxBg.style.transform = `translate3d(0, ${
          scrollPosition * 0.4
        }px, 0)`;
      }

      if (patternLayer) {
        patternLayer.style.transform = `translate3d(0, ${
          scrollPosition * 0.2
        }px, 0)`;
      }

      if (heroContent) {
        heroContent.style.transform = `translate3d(0, ${
          scrollPosition * -0.15
        }px, 0)`;

        heroContent.style.opacity = Math.max(0, 1 - scrollPosition * 0.0015);
      }

      if (heroOverlay) {
        heroOverlay.style.opacity = Math.min(
          0.95,
          0.7 + scrollPosition * 0.001
        );
      }

      if (glowLayer) {
        glowLayer.style.transform = `translate3d(0, ${
          scrollPosition * -0.3
        }px, 0)`;
        glowLayer.style.opacity = Math.max(0.1, 0.5 - scrollPosition * 0.001);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    setTimeout(() => {
      const heroContent = document.querySelector(".hero-content");
      if (heroContent) {
        heroContent.classList.add("visible");
      }
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative w-full h-[calc(100vh-80px)] overflow-hidden z-10 perspective-1000">
      <div
        className="parallax-bg absolute top-[-20%] left-0 w-full h-[140%] bg-cover bg-center bg-no-repeat will-change-transform z-[1] transform translate-z-0 backface-hidden"
        style={{ backgroundImage: "url('/assets/images/Grocieries.jpg')" }}
      ></div>

      <div className="pattern-layer absolute top-0 left-0 w-full h-full opacity-[0.08] z-[2] mix-blend-overlay will-change-transform transform translate-z-0"></div>

      <div className="hero-overlay absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-700/90 to-green-500/80 z-[3] opacity-70 will-change-opacity transition-opacity duration-50"></div>

      <div className="glow-layer absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-radial-gradient z-[4] mix-blend-screen opacity-50 transform translate-z-0 will-change-transform"></div>

      {mounted && (
        <div className="absolute top-0 left-0 w-full h-full z-[5] overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-[6px] h-[6px] rounded-full bg-white/40 animate-float-particle will-change-transform ${
                i % 2 === 0 ? "w-[8px] h-[8px] bg-green-200/30" : ""
              } ${i % 3 === 0 ? "w-[4px] h-[4px] bg-green-100/30" : ""}`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${3 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: 0.1 + Math.random() * 0.4,
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="hero-content flex flex-col items-center justify-center text-center w-full h-full px-8 relative z-10 opacity-0 translate-y-[30px] transition-all duration-1000 ease-out will-change-transform">
        <div className="max-w-[1200px] mx-auto transform-style-3d">
          <h1 className="text-5xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight relative text-shadow-lg transform translate-z-[60px]">
            Fresh Groceries Delivered
            <span className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[120px] h-[8px] bg-green-300 rounded-md -z-10 opacity-80 shadow-green"></span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-[800px] mx-auto opacity-95 font-light transform translate-z-[40px] text-shadow-md">
            Quality products from farm to your doorstep, making healthy living
            easier
          </p>
          <div className="flex gap-4 flex-wrap justify-center mb-16 transform translate-z-[20px]">
            {[
              "Fruits & Vegetables",
              "Dairy",
              "Bakery",
              "Meat & Seafood",
              "Beverages",
              "Snacks",
            ].map((category, index) => (
              <div
                key={index}
                className="py-2 px-5 bg-white/15 backdrop-blur-md rounded-full text-white text-base font-medium tracking-wide transition-all duration-300 border border-white/20 shadow-xl opacity-0 translate-y-5 animate-fade-in-up hover:translate-y-[-5px] hover:scale-105 hover:bg-green-400/25 hover:border-white/40 cursor-pointer"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                {category}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-2 md:bottom-12 left-0 right-0 mx-auto flex flex-col items-center justify-center animate-fade-in-up-delay w-[180px] text-center transform translate-z-[10px] z-10">
          <div className="w-[30px] h-[50px] border-2 border-white rounded-[25px] relative mx-auto mb-[10px] inline-block shadow-glow">
            <div className="w-[4px] h-[10px] bg-white absolute top-[10px] left-1/2 -translate-x-1/2 rounded-[2px] animate-scroll-wheel"></div>
          </div>
          <span className="text-white text-sm tracking-wider opacity-90 text-center block w-full text-shadow">
            Explore Our Products
          </span>
        </div>
      </div>
    </section>
  );
};

export default EcommerceParallaxHero;