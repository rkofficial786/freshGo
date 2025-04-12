"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getCartItems,
  removeFromCart,
  updateQuantity,
} from "@/lib/features/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CartPage = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const { items, products, summary, loading, error } = useSelector(
    (state) => state.cart
  );
  const { token } = useSelector((state) => state.auth);

  // Fetch product details whenever cart items change
  useEffect(() => {
    if (items.length > 0) {
      dispatch(getCartItems({ cartItems: items }));
    }
  }, [items, dispatch]);

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleCheckout = () => {
    if (!token) {
      router.push("/login?redirect=checkout");
    } else {
      router.push("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading cart: {error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
        <div className="flex flex-col items-center justify-center py-16">
          <ShoppingCart size={64} className="text-gray-300 mb-6" />
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="bg-black hover:bg-gray-800 text-white"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-2">Your Cart</h1>
      <p className="text-gray-500 mb-8">
        {summary.totalQuantity} items in your cart
      </p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="lg:w-2/3">
          {/* Back to shopping link */}
          <Link
            href="/products"
            className="inline-flex items-center text-gray-600 hover:text-black mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>

          {/* Cart items list */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {products.map((product) => {
              // Find corresponding cart item to get quantity
              const cartItem = items.find(
                (item) => item.productId === product._id
              );
              const quantity = cartItem ? cartItem.quantity : 0;

              return (
                <div
                  key={product._id}
                  className="p-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    {/* Product image */}
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden relative">
                      {product.img ? (
                        <Image
                          src={product.img}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product details */}
                    <div className="ml-4 flex-grow">
                      <h3 className="text-base font-medium text-gray-900">
                        {product.name}
                      </h3>

                      {product.unit && (
                        <p className="text-sm text-gray-500 mt-1">
                          {product.unit}
                        </p>
                      )}

                      <div className="mt-1 flex items-center">
                        <span className="text-lg font-semibold">
                          ₹{product.price}
                        </span>
                        {product.mrp && product.mrp > product.price && (
                          <>
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{product.mrp}
                            </span>
                            <span className="ml-2 text-sm text-green-600">
                              {Math.round(
                                ((product.mrp - product.price) / product.mrp) *
                                  100
                              )}
                              % off
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center ml-4">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, quantity - 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1">{quantity}</span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, quantity + 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveItem(product._id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Subtotal ({summary.totalQuantity} items)
                </span>
                <span>₹{summary.mrpTotal?.toFixed(2) || 0}</span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -₹{summary.discount?.toFixed(2) || 0}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                {summary.deliveryFee > 0 ? (
                  <span>₹{summary.deliveryFee?.toFixed(2) || 0}</span>
                ) : (
                  <span className="text-green-600">Free</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax (GST)</span>
                <span>₹{summary.tax?.toFixed(2) || 0}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  ₹
                  {(
                    (summary.cartTotal || 0) +
                    (summary.deliveryFee || 0) +
                    (summary.tax || 0)
                  ).toFixed(2)}
                </span>
              </div>

              {summary.deliveryFee > 0 && (
                <div className="text-sm text-gray-500 mt-2">
                  Add ₹{(499 - (summary.cartTotal || 0)).toFixed(2)} more to get
                  free delivery
                </div>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3"
            >
              Proceed to Checkout
            </Button>

            <div className="mt-6 text-sm text-center text-gray-500">
              <p>We accept all major credit cards and UPI payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
