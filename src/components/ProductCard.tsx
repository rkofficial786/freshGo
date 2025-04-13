"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/features/cart";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const dispatch = useDispatch<any>();
  const navigateToProduct = () => {
    router.push(
      `/product-detail/${product.id}/${product.name.split(" ").join("-")}`
    );
  };
  console.log(product, "prodycts");

  // Default image if product image is not available
  const imageUrl = product.image || "/assets/images/product-placeholder.jpg";

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Function to add to cart (you can implement this based on your cart functionality)
  const addToCartClick = (e) => {
    e.stopPropagation(); // Prevent card click navigation

    dispatch(
      addToCart({
        productId: product.id,

        quantity: 1,
      })
    );

    toast.success(`${product.name} is added to cart`);

    console.log("Added to cart:", product.name);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg border border-gray-100"
      onClick={navigateToProduct}
    >
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain hover:scale-105 transition-transform duration-300"
          priority={false}
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {product.discount}% OFF
          </Badge>
        )}

        {/* Category Badge */}
        <Badge className="absolute top-2 left-2 bg-green-600/90">
          {product.category}
        </Badge>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Unit */}
        <p className="text-sm text-gray-500 mb-2">{product.unit}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star
              className="h-4 w-4 text-yellow-400 fill-yellow-400"
              fill={product.rating > 0 ? "currentColor" : "none"}
            />
            <span className="ml-1 text-sm text-gray-600">
              {product.rating > 0 ? product.rating.toFixed(1) : "No rating"}
            </span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-sm text-gray-500">
            {product.numReviews > 0
              ? `${product.numReviews} reviews`
              : "No reviews"}
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-auto">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm line-through text-gray-400">
                {formatPrice(product.mrp)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <p
            className={`text-xs mb-3 ${
              product.stockQuantity > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stockQuantity > 0 ? `In Stock` : "Out of Stock"}
          </p>

          {/* Add to Cart Button */}
          <Button
            variant="default"
            size="sm"
            className="w-full "
            onClick={addToCartClick}
            disabled={product.stockQuantity <= 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
