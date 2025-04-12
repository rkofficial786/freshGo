"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Ribbon from "./Ribbon";
import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleItem } from "@/lib/features/wishlist";
import toast from "react-hot-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ProductCard = ({ product }) => {
  const {
    name,
    image = [],
    newArrival,
    featured,
    latest,
    actualPrice,
    offerPrice,
    description,
    stock,
  } = product;

  const getRibbonText = () => {
    if (stock === 0) return "No Stocks Left";
    if (stock < 10) return "Low Stock";
    if (latest) return "Latest";
    if (newArrival) return "New Arrival";
    return null;
  };

  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const dispatch = useDispatch<any>();

  const calculateDiscount = () => {
    if (actualPrice > offerPrice) {
      const discount = ((actualPrice - offerPrice) / actualPrice) * 100;
      return Math.round(discount);
    }
    return null;
  };

  const discount = calculateDiscount();
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(
      toggleItem({
        id: product.id,
        name: product.name,
        colors: product.color,
        img: image[0],
        description: product.description,
        amount: product.offerPrice,
      })
    );
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Card
      onClick={() =>
        window.open(
          `/product-detail/${product.id}/${product.name.split(" ").join("-")}`,
          "_blank"
        )
      }
      className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer"
      style={{ boxShadow: "none", border: "none" }}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {image && image.length > 0 ? (
                image.map((img, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square relative">
                      <img
                        src={img}
                        alt={`${name} - image ${index + 1}`}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <div className="aspect-square relative bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden group-hover:flex" />
            <CarouselNext className="hidden group-hover:flex" />
          </Carousel>
          {getRibbonText() && <Ribbon text={getRibbonText()} />}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md transition-colors duration-200 hover:bg-gray-100 z-10"
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist ? "text-red-500 fill-red-500" : "text-gray-400"
              }`}
            />
          </button>
          {discount && (
            <span className="md:hidden absolute bottom-2 right-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded z-10">
              {discount}% OFF
            </span>
          )}
        </div>
        <div className="p-2 md:p-4 bg-white">
          <h3 className="font-semibold text-md mb-1 text-gray-800 line-clamp-1">
            {name}
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900">
                ₹{offerPrice}
              </span>
              {actualPrice > offerPrice && (
                <span className="text-sm line-through ml-2 text-gray-500">
                  ₹{actualPrice}
                </span>
              )}
            </div>
            {discount && (
              <span className="hidden md:block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;