"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RefreshCw,
  Star,
  ChevronLeft,
} from "lucide-react";
import { addToCart } from "@/lib/features/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

const ProductPage = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const cartItems = useSelector((state: any) => state.cart.items);
  const isInCart = product
    ? cartItems.some((item) => item.productId === product._id)
    : false;

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          toast.error("Failed to load product");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleQuantityChange = (newQuantity) => {
    // Don't allow less than 1 or more than available stock
    if (newQuantity < 1 || (product && newQuantity > product.stockQuantity)) {
      return;
    }
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    if (product.stockQuantity === 0) {
      toast.error("This product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity,
      })
    );

    toast.success(`${product.name} added to cart`);
  };

  const calculateDiscount = () => {
    if (!product) return 0;
    return Math.round(((product.mrp - product.price) / product.mrp) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="md:w-1/2">
            <Skeleton height={400} width="100%" />
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <Skeleton height={40} width="80%" />
            <Skeleton height={30} width="40%" className="mt-4" />
            <Skeleton height={20} width="30%" className="mt-2" />
            <Skeleton height={120} className="mt-6" />
            <Skeleton height={50} width="60%" className="mt-6" />
            <Skeleton height={60} className="mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-gray-600">Product not found</p>
        <Button
          onClick={() => router.push("/products")}
          className="mt-4 bg-black hover:bg-gray-800 text-white"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-black mb-6"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Products
      </button>

      <div className="flex flex-col md:flex-row md:gap-8">
        {/* Product Image */}
        <div className="md:w-1/2 bg-white rounded-lg overflow-hidden flex items-start justify-start">
          <div className="relative w-full pt-[100%]">
            {product.img ? (
              <Image
                src={product.img}
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <ShoppingCart className="h-16 w-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          {/* Category */}
          <div className="mb-2">
            <Badge variant="outline" className="text-gray-500">
              {product.category}
            </Badge>
          </div>

          {/* Product Name */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {product.name}
          </h1>

          {/* SKU */}
          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">
                  {product.rating.avgRating || "New"}
                </span>
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                {product.rating.numReviews || 0} Reviews
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-4 flex items-center">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            {product.mrp > product.price && (
              <>
                <span className="ml-2 text-gray-500 line-through">
                  ₹{product.mrp}
                </span>
                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-sm rounded-md">
                  {calculateDiscount()}% OFF
                </span>
              </>
            )}
          </div>

          {/* Unit */}
          <p className="mt-1 text-sm text-gray-600">Price per {product.unit}</p>

          {/* Stock Status */}
          <div className="mt-4">
            {product.stockQuantity > 10 ? (
              <span className="text-green-600 font-medium">
                In Stock ({product.stockQuantity} available)
              </span>
            ) : product.stockQuantity > 0 ? (
              <span className="text-orange-500 font-medium">
                Low Stock (Only {product.stockQuantity} left)
              </span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Description */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Quantity Selector */}
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 border-t border-b border-gray-300 text-center min-w-[50px]">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                disabled={product.stockQuantity <= quantity}
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="ml-3 text-sm text-gray-500">{product.unit}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-6">
            <Button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0}
              className="w-full py-6 text-white bg-black hover:bg-gray-800 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-5 w-5" />
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </Button>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium">Free Delivery</h4>
                <p className="text-xs text-gray-500">On orders over ₹499</p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium">Quality Guarantee</h4>
                <p className="text-xs text-gray-500">Freshness you can trust</p>
              </div>
            </div>
            <div className="flex items-start">
              <RefreshCw className="h-5 w-5 text-gray-600 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium">Easy Returns</h4>
                <p className="text-xs text-gray-500">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
