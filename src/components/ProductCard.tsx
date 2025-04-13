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

  // Default image if product image is not available
  const imageUrl = product.image || "/assets/images/placeholder.jpg";

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to add to cart
  const addToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation

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
      {/* Product Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {/* Image with enhanced hover effect */}
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain"
            priority={false}
          />
        </div>

        {/* Category Badge with hover effect */}
        <Badge className="absolute top-2 left-2 bg-black text-white transition-all duration-300 group-hover:bg-gray-800 z-10">
          {product.category}
        </Badge>

        {/* Discount Badge with enhanced hover effect */}
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-white text-black border border-black transition-all duration-300 group-hover:scale-110 group-hover:bg-black group-hover:text-white z-10">
            {product.discount}% OFF
          </Badge>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-5 flex items-center justify-center">
          <div className="scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-10 h-10 p-0 bg-white border-black text-black hover:bg-black hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                navigateToProduct();
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details with improved spacing and design */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 group-hover:text-black transition-colors duration-300">
          {product.name}
        </h3>

        {/* Product Unit/Size */}
        <p className="text-sm text-gray-500 mb-2">{product.unit}</p>

        {/* Pricing with animation */}
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <span className="text-lg font-bold text-black transition-all duration-300 group-hover:text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm line-through text-gray-400">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          {/* Stock Status with improved visibility */}
          <p
            className={`text-xs mb-3 ${
              product.stockQuantity > 0
                ? "text-black font-medium group-hover:text-green-600"
                : "text-red-600"
            } transition-colors duration-300`}
          >
            {product.stockQuantity > 0
              ? `In Stock (${product.stockQuantity})`
              : "Out of Stock"}
          </p>

          {/* Add to Cart Button with enhanced hover effect */}
          <Button
            variant="default"
            size="sm"
            className="w-full bg-black hover:bg-gray-800 text-white transition-all duration-300 group-hover:shadow-md"
            onClick={addToCartClick}
            disabled={product.stockQuantity <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
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
