"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { X, ShoppingCart, Heart, Eye } from "lucide-react";
import { addToCart } from "@/lib/features/cart";
import { removeItem } from "@/lib/features/wishlist";
import ButtonMain from "@/components/ButtonMain";
import { Button } from "@/components/ui/button";

const WishList = () => {
  const wishlistItems = useSelector((state: any) => state.wishlist.items);
  const dispatch = useDispatch();
 

  const handleRemoveFromWishlist = (id: string) => {
    dispatch(removeItem(id));
  };

  const handleAddToCart = (item: any) => {
    window.open(
      `/product-detail/${item.id}/${item.name.split(" ").join("-")}`,
      "_blank"
    );
  };

  return (
    <div className="bg-primary-50">
      <div className="container mx-auto p-6 ">
        <h1 className="text-4xl font-bold mb-8 text-primary-900 text-center">
          My Wishlist
        </h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <Heart size={64} className="mx-auto text-primary-300 mb-4" />
            <p className="text-xl text-primary-700">Your wishlist is empty.</p>
            <p className="text-primary-500 mt-2">
              Add items to your wishlist to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlistItems.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-110"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="absolute top-2 right-2 bg-primary-100 p-2 rounded-full text-primary-950 hover:bg-primary-200 transition-colors duration-300"
                    aria-label="Remove from wishlist"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-2 text-primary-900 line-clamp-2">
                    {item.name}
                  </h2>
                  <p className="text-primary-600 mb-2">Color: {item.colors}</p>
                  <p className="text-2xl font-bold text-primary-950 mb-4">
                    ₹{item.amount.toLocaleString()}
                  </p>
                  <Button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-primary-950  text-white px-6 py-6 rounded-full hover:bg-primary-900 transition-colors duration-300 flex items-center justify-center text-lg font-semibold"
                  >
                    <Eye size={20} className="mr-2" />
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishList;
