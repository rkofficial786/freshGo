"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const navigateToProduct = () => {
    router.push(
      `/product-detail/${product.id}/${product.name.split(" ").join("-")}`
    );
  };
  
  const imageUrl = product.image || "/assets/images/placeholder.jpg";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const addToCartClick = (e) => {
    e.stopPropagation(); 
    dispatch(
      addToCart({
        productId: product.id,
        quantity: 1,
      })
    );

    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className="bg-white rounded-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl border border-gray-200 group cursor-pointer"
      onClick={navigateToProduct}
    >
      {/* Adjusted height for better mobile display - reduced fixed height and using aspect ratio */}
      <div className="relative w-full aspect-square sm:h-40 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover p-2"
            priority={false}
          />
        </div>

        <Badge className="absolute top-2 left-2 bg-green-600 text-white transition-all duration-300 group-hover:bg-green-700 z-10 text-xs">
          {product.category}
        </Badge>

        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-white text-green-600 border border-green-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-600 group-hover:text-white z-10 text-xs">
            {product.discount}% OFF
          </Badge>
        )}

        <div className="absolute inset-0 bg-green-900 bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-5 flex items-center justify-center">
          <div className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 bg-white border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigateToProduct();
              }}
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-1 group-hover:text-green-700 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{product.unit}</p>

        <div className="mt-auto">
          <div className="flex items-center mb-1 sm:mb-2">
            <span className="text-base sm:text-lg font-bold text-green-700 transition-all duration-300 group-hover:text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-xs sm:text-sm line-through text-gray-400">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          <p
            className={`text-xs mb-2 sm:mb-3 ${
              product.stockQuantity > 0
                ? "text-green-700 font-medium group-hover:text-green-600"
                : "text-red-600"
            } transition-colors duration-300`}
          >
            {product.stockQuantity > 0
              ? `In Stock (${product.stockQuantity})`
              : "Out of Stock"}
          </p>

          <Button
            variant="default"
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 group-hover:shadow-md text-xs sm:text-sm py-1 sm:py-2"
            onClick={addToCartClick}
            disabled={product.stockQuantity <= 0}
          >
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span className="transition-all duration-300 group-hover:tracking-wide">
              Add to Cart
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;