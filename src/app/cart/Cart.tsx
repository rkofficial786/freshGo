"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Trash2, ShoppingCart } from "lucide-react";
import {
  decreaseCount,
  getCartItems,
  getCouponById,
  getVisibleCoupons,
  increaseCount,
  removeFromCart,
  setTotalAmount,
} from "@/lib/features/cart";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "@/hooks/useWindowSize";
import { useRouter } from "next/navigation";

import AddressManagement from "./AddressManage";
import CartSummary from "./CartSummary";
import ButtonMain from "@/components/ButtonMain";
import Loader from "@/components/Loader";
import Skeleton from "react-loading-skeleton";

const CartPage = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main St",
      city: "Anytown",
      zip: "12345",
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
  });

  const dispatch = useDispatch<any>();
  const cartItems = useSelector((state: any) => state.cart.items);
  const [cartProducts, setCartProducts] = useState([]);
  const [visibleCoupons, setVisibleCoupons] = useState<any[]>([]);
  const [appliedCoupons, setAppliedCoupons] = useState<any>([]);
  const { currentOrder } = useSelector((state: any) => state.order);
  const [discountAmount, setDiscountAmount] = useState(0);

  const { totalAmount } = useSelector((state: any) => state.cart);
  const latestTotalRef = useRef(0);
  const { width } = useWindowSize();

  const { token } = useSelector((state: any) => state.auth);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [showCouponSelector, setShowCouponSelector] = useState(false);

  const handleCouponToggle = () => setShowCouponSelector(!showCouponSelector);

  const callGetCartItems = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(
        getCartItems({
          carts: cartItems.map((item: any) => item.id),
        })
      );

      if (payload.success) {
        setCartProducts(
          cartItems
            .map((cartItem: any) => {
              const product = payload.products.find(
                (p: any) => p._id === cartItem.id
              );

              if (!product) {
                console.error(
                  `Product not found for cart item: ${cartItem.id}`
                );
                return null;
              }

              const matchedSize = product.sizes.find(
                (size: any) => size._id === cartItem.size.id
              );

              return {
                id: product._id,
                name: product?.name,
                images: product?.img,
                color: product?.color,
                actualPrice: product?.actualPrice,
                size: matchedSize
                  ? {
                      id: matchedSize?._id,
                      type: matchedSize?.size,
                      stock: matchedSize?.stock,
                      price: matchedSize?.offerPrice,
                      comboPrice: matchedSize?.comboPrice,
                      shippingPrice: matchedSize?.shippingPrice,
                    }
                  : null,
                count: cartItem?.count || 1,
              };
            })
            .filter(Boolean) // Remove any null entries
        );
        if (cartItems.length > 3) {
          toast(
            "Courier and transportation charges are extra. Please contact Shreya Collection for more information.",
            {
              position: "top-right",
              duration: 7000,
            }
          );
        }
      } else {
        toast.error(payload.msg);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const callGetVisibleCoupons = async () => {
    try {
      const { payload }: any = await dispatch(getVisibleCoupons());

      if (payload.success) {
        setVisibleCoupons(payload.coupons);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateProductTotal = (product: any, quantity: number) => {
    const { price: offerPrice, comboPrice } = product.size;

    // If comboPrice is 0, null, or undefined, use regular offer price for all items
    if (!comboPrice) {
      return quantity * offerPrice;
    }

    const completeSets = Math.floor(quantity / 4);
    const remainingItems = quantity % 4;
    const totalPrice = completeSets * comboPrice + remainingItems * offerPrice;

    return totalPrice;
  };

  const calculateDeliveryFee = (cartItems, cartProducts) => {
    // Calculate total quantity across all items
    const totalQuantity =
      cartItems?.reduce((sum, item) => sum + Number(item.count), 0) || 0;
    console.log(totalQuantity, "total");
    // Base price is 45 for the first item
    // Each additional item adds 24
    const shippingPrice =
      totalQuantity === 0 ? 0 : 45 + 24 * (totalQuantity - 1);

    return shippingPrice;
  };

  const { subtotal, tax, finalTotal, promotions, deliveryFee } = useMemo(() => {
    const subtotal = cartItems?.reduce((sum, item) => {
      const product = cartProducts.find(
        (p) => p?.id === item?.id && p?.size?.id === item?.size?.id
      );
      return sum + (product?.actualPrice || 0) * item.count;
    }, 0);

    const offerPrice = cartItems?.reduce((sum, item) => {
      const product = cartProducts?.find(
        (p) => p.id === item?.id && p?.size?.id === item?.size?.id
      );
      if (!product) return sum;

      return sum + calculateProductTotal(product, item.count);
    }, 0);

    const totalQuantity = cartItems?.reduce(
      (sum, item) => sum + item?.count,
      0
    );

    const promotions = subtotal - offerPrice;

    const tax = 0;

    const deliveryFee = calculateDeliveryFee(cartItems, cartProducts);

    const finalTotal =
      subtotal + deliveryFee + tax - discountAmount - promotions;
    latestTotalRef.current = finalTotal;
    dispatch(setTotalAmount(finalTotal));

    return { subtotal, tax, finalTotal, promotions, deliveryFee };
  }, [cartItems, cartProducts, discountAmount]);

  const calculateDiscountAmount = (coupon, totalOfferPrice) => {
    let discount = 0;
    if (coupon.type === "percentage") {
      const calculatedPercent = (totalOfferPrice * coupon.off) / 100;
      discount = Math.min(calculatedPercent, coupon.amount);
    } else if (coupon.type === "flat") {
      discount = coupon.off;
    }

    return discount;
  };

  const handleApplyCoupon = async (code) => {
    try {
      const { payload }: any = await dispatch(
        getCouponById({ code: code, amount: finalTotal })
      );

      if (payload.success && payload.coupon.isValid) {
        const discountAmount = calculateDiscountAmount(
          payload.coupon,
          finalTotal
        );
        setAppliedCoupons([payload.coupon]);
        setDiscountAmount(discountAmount);
        toast.success("Coupon applied successfully!");
      } else {
        toast.error("Coupon is not valid for the current user");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply coupon.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupons([]);
    setDiscountAmount(0);
    toast.success("Coupon removed successfully!");
  };

  useEffect(() => {
    if (token) {
      callGetVisibleCoupons();
      callGetCartItems();
    } else {
      toast("Please Login to checkout");
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    // Remove applied coupons when cart changes
    setAppliedCoupons([]);
    setDiscountAmount(0);

    // Recheck coupon validity if there was a previously applied coupon
    if (appliedCoupons.length > 0) {
      handleApplyCoupon(appliedCoupons[0].couponCode);
    }
  }, [cartItems]);

  const handleRemoveItem = (id, sizeId) => {
    dispatch(removeFromCart({ id, sizeId }));

    setCartProducts((prevProducts: any) =>
      prevProducts.filter(
        (product) => !(product.id === id && product.size.id === sizeId)
      )
    );
  };
  const handleQuantityChange = (id, sizeId, action) => {
    const currentProduct: any = cartProducts.find(
      (product: any) => product.id === id && product.size.id == sizeId
    );
    const currentItem = cartItems.find(
      (item) => item.id === id && item.size.id == sizeId
    );
    if (action === "decrease") {
      if (currentItem && currentItem.count === 1) {
        handleRemoveItem(id, sizeId);
        return;
      }
    } else if (action === "increase") {
      // Check if increasing would exceed the stock
      if (currentItem.count >= currentProduct.size.stock) {
        toast.error(
          `Sorry, only ${currentProduct.size.stock} item(s) available in stock.`
        );
        return;
      }
    }

    dispatch(
      action === "increase"
        ? increaseCount({ id, sizeId })
        : decreaseCount({ id, sizeId })
    );

    setCartProducts((prevProducts: any) =>
      prevProducts.map((product) => {
        if (product.id === id) {
          const newQuantity =
            action === "increase"
              ? Math.min(product.quantity + 1, product.stock)
              : Math.max(product.quantity - 1, 0);
          return {
            ...product,
            quantity: newQuantity,
          };
        }
        return product;
      })
    );
  };
  // ordres

  const handleAddAddress = () => {
    setAddresses([...addresses, { id: addresses.length + 1, ...newAddress }]);
    setNewAddress({ name: "", street: "", city: "", zip: "" });
    setShowAddressForm(false);
  };

  if (loading) {
    return (
      <Loader>
        {" "}
        <div className="p-4 container mx-auto">
          <div className="flex flex-col md:flex-row md:items-start">
            {/* Skeleton for the product image */}
            <div className="md:w-2/4 w-full">
              <Skeleton height={800} width={"100%"} />
            </div>

            {/* Skeleton for product description */}
            <div className="md:w-2/3 w-full md:pl-6 mt-6 md:mt-0">
              {/* Skeleton for product title */}
              <Skeleton height={300} width={"100%"} />

              {/* Skeleton for product price */}
              <Skeleton
                height={500}
                width={"100%"}
                style={{ marginTop: "16px" }}
              />

              {/* Skeleton for product description */}
            </div>
          </div>
        </div>
      </Loader>
    );
  }

  return (
    <div className="bg-primary-50">
      <div className="container mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 xl:mx-[140px]">
            {/* Left side - Addresses */}
            <div className="w-full lg:w-6/12 ">
              <AddressManagement />
            </div>

            {/* Right side - Cart items and Order Summary */}
            <CartSummary
              setCheckoutLoading={setCheckoutLoading}
              cartProducts={cartProducts}
              subtotal={subtotal}
              tax={tax}
              deliveryFee={deliveryFee}
              checkoutLoading={checkoutLoading}
              discountAmount={discountAmount}
              finalTotal={finalTotal}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              cartItems={cartItems}
              onApplyCoupon={handleApplyCoupon}
              visibleCoupons={visibleCoupons}
              appliedCoupons={appliedCoupons}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[80vh] gap-6   px-4">
            <div className="relative flex items-center justify-center">
              <div
                className=" bg-blue-200 rounded-full opacity-20 flex items-center justify-center animate-pulse"
                style={{ width: "180px", height: "180px" }}
              >
                <ShoppingCart
                  size={100}
                  className="text-blue-600 relative z-10"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              It looks like you have not added any items to your cart yet. Start
              shopping to fill it with amazing products!
            </p>
            <ButtonMain onClick={() => router.push("/")} className=" w-fit">
              Start Shopping
            </ButtonMain>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
