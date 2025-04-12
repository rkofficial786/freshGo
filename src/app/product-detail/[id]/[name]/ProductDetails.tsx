"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addToCart, removeFromCart } from "@/lib/features/cart";
import { toggleItem } from "@/lib/features/wishlist";
import toast from "react-hot-toast";
import ProductImageGallery from "../../ImageGallery";
import ProductDetails from "../../ProductDetails";
// import { getProductById } from "@/lib/features/products";
import ProductSkeleton from "../../productSkeleton";

import { getProductsById } from "@/lib/features/products";
import Skeleton from "react-loading-skeleton";

import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";

const ProductPage = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<any>();

  const [selectedSize, setSelectedSize] = useState(null);
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const [product, setProduct] = useState<any>({});

  const isWishlist = wishlistItems.some((item) => item.id === product.id);
  const cartItems = useSelector((state: any) => state.cart.items);
  const isInCart = cartItems.some(
    (item) => item.id === product.id && item.size.id == selectedSize?.id
  );

  
  

  const callGetAllProductsById = async () => {
    try {
      setLoading(true);
      const { payload }: any = await dispatch(getProductsById(params?.id));

      if (payload?.success) {
        const item = payload.product;
        const data = {
          id: item._id,
          name: item.name,
          material: item.material,
          washCare: item.washCare,
          note: item.note,
          description: item.description,
          categories: item.categories,

          price: item.actualPrice,
          color: item.color,
          rating: item.rating.star || 4.5,
          reviewCount: item.rating.ratedBy || 30,
          images: item.img,
          sku: item.sku,
          sizes: item.sizes.map((size) => ({
            type: size.size,
            stock: size.stock,
            price: size.offerPrice,
            id: size._id,
          })),
          colors: item.colors.map((color) => ({
            name: color.color,
            class: `bg-[${color.color}]`,
            variantId: {
              id: color.varientId._id,
              name: color.varientId.name,
              image: color.varientId.img,
              color: color.varientId.color,
            },
            id: color._id,
          })),
          features: item.additionalFields || {},
        };

        setProduct(data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    callGetAllProductsById();
  }, []);

  const handleAddtoCart = (size: any, quantity: any) => {
    // console.log("hello");
    if (selectedSize.stock == 0) {
      toast(`No stocks left , Please try again later`);
      return;
    }

    if (isInCart) {
      dispatch(removeFromCart({ id: product.id, sizeId: size.id }));
      toast.success(`${product.name} remove from cart`);
    } else {
      dispatch(addToCart({ id: product.id, size: size, quantity }));
      toast.success(`${product.name} added to cart`);
    }
  };

  const toggleWishlist = () => {
    dispatch(
      toggleItem({
        id: product.id,
        name: product.name,
        description: product.description,
        amount: selectedSize?.price,
        colors: product.colors,
        img: product.images[0],
      })
    );

    if (isWishlist) {
      toast.success(`${product.name} Removed from wishlist`);
    } else {
      toast.success(`${product.name} Added to wishlist`);
    }
  };

  if (loading) {
    return (
      <Loader>
        <div className="p-4 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-start">
            {/* Skeleton for the product image */}
            <div className="md:w-2/4 w-full">
              <Skeleton height={800} width={"100%"} />
            </div>

            {/* Skeleton for product description */}
            <div className="md:w-2/3 w-full md:pl-6 mt-6 md:mt-0">
              {/* Skeleton for product title */}
              <Skeleton height={40} width={"70%"} />

              {/* Skeleton for product price */}
              <Skeleton
                height={130}
                width={"30%"}
                style={{ marginTop: "16px" }}
              />

              {/* Skeleton for product description */}
              <Skeleton
                count={5}
                height={50}
                width={"100%"}
                style={{ marginTop: "16px" }}
              />
              <Skeleton
                count={2}
                height={20}
                width={"100%"}
                style={{ marginTop: "16px" }}
              />
            </div>
          </div>
        </div>
      </Loader>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white text-gray-900 min-h-screen">
      {!loading && (
        <div className="flex flex-col lg:flex-row gap-12">
          {product?.images?.length > 0 && (
            <ProductImageGallery
              images={product?.images}
              name={product?.name}
            />
          )}

          <ProductDetails
            product={product}
            isInCart={isInCart}
            isWishlist={isWishlist}
            setSelectedSize={setSelectedSize}
            selectedSize={selectedSize}
            handleAddToCart={handleAddtoCart}
            toggleWishlist={toggleWishlist}
          />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
