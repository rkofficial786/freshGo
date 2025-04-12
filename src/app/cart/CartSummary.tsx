import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  MinusCircle,
  Trash2,
  ShoppingBag,
  Tag,
  CreditCard,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LockClosedIcon } from "@radix-ui/react-icons";
import ButtonMain from "@/components/ButtonMain";
import CouponSelector from "./CuponSelector";
import { useDispatch, useSelector } from "react-redux";
import { proceedToCheckoutApi, setIsOrderProceed } from "@/lib/features/order";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserDetails } from "@/lib/features/auth";
import CheckoutModal from "./Checkout";

const CartSummary = ({
  cartProducts,
  subtotal,
  tax,
  discountAmount,
  finalTotal,
  onQuantityChange,
  onRemoveItem,
  onApplyCoupon,
  deliveryFee,
  checkoutLoading,
  setCheckoutLoading,
  cartItems,
  visibleCoupons,
  appliedCoupons,
  handleApplyCoupon,
  handleRemoveCoupon,
}) => {
  const dispatch = useDispatch<any>();
  const { token } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const [createdOrderDetails, setCreatedOrderDetails] = useState({});
  const [isCheckoutModal, setIsCheckoutModal] = useState(false);

  const callProceedToCheckoutApi = async () => {
    setCheckoutLoading(true);
    const payloadApi = {
      productDetails: cartItems.map((item) => {
        return {
          product: item.id,
          count: item.count,
          size: item?.size?.id,
        };
      }),
      couponCode: appliedCoupons[0]?.couponCode || null,
    };
    dispatch(setIsOrderProceed(false));
    try {
      const { payload }: any = await dispatch(proceedToCheckoutApi(payloadApi));

      if (payload.success) {
        setIsCheckoutModal(true);
        setCreatedOrderDetails(payload.orderDetails);
      } else {
        toast.error(payload.msg);
      }
      setCheckoutLoading(false);
    } catch (error) {
      setCheckoutLoading(false);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    const { payload } = await dispatch(getUserDetails());

    if (payload.success) {
      if (payload.user.defaultAddress) {
        callProceedToCheckoutApi();
      } else if (
        !payload.user.defaultAddress &&
        payload.user.address.length > 0
      ) {
        toast("Please mark one address as default for shipping");
        router.push("/profile?type=addresses");
      } else {
        toast("Please add a shipping address");
        router.push("/profile?type=addresses");
      }
    } else {
      toast.error("Something Went wrong");
    }
  };

  return (
    <div className="w-full lg:w-6/12 space-y-6">
      <CheckoutModal
        isOpen={isCheckoutModal}
        onClose={setIsCheckoutModal}
        orderDetails={createdOrderDetails}
      />
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <ScrollArea className=" p-4">
            {cartProducts?.map((item, index) => (
              <div
                onClick={() =>
                  window.open(
                    `/product-detail/${item.id}/${item.name
                      .split(" ")
                      .join("-")}`,
                    "_blank"
                  )
                }
                key={index}
                className="flex items-center flex-col sm:flex-row justify-between mb-4 pb-4 border-b last:border-b-0 transition-all duration-300 ease-in-out hover:bg-gray-50"
                style={{
                  opacity: 0,
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
                }}
              >
                <div className="flex items-center justify-start self-start sm:justify-normal">
                  <img
                    src={item?.images[0]}
                    alt={item.name}
                    className="rounded-md mr-4 object-cover min-w-[130px] max-w-[150px] max-h-[100px]"
                  />
                  <div className="mr-2">
                    <p className="font-semibold text-xs sm:text-lg line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size:{" "}
                      {item.size.type == "Others" ? "Default" : item.size.type}
                    </p>
                    <div className="flex items-center mt-1">
                      <p className="text-lg font-bold text-theme">
                        ₹{item.size.price.toFixed(2)}
                      </p>
                      {item.size.price < item.actualPrice && (
                        <p className="text-sm text-gray-500 line-through ml-2">
                          ₹{item.actualPrice.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row justify-start self-start sm:flex-col gap-4 mt-2 sm:mt-0">
                  <div className="flex items-center ">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuantityChange(item.id, item.size.id, "decrease");
                      }}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-semibold">
                      {" "}
                      {cartItems?.find(
                        (cartItem) =>
                          cartItem.id === item.id &&
                          cartItem.size.id == item.size.id
                      )?.count || 0}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuantityChange(item.id, item.size.id, "increase");
                      }}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id, item.size.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700 self-end"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <CreditCard className="mr-2" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span className="">Product Discounts</span>
              <span className="font-semibold">
                - ₹{subtotal - finalTotal + deliveryFee}
              </span>
            </div>
            <div className="flex justify-between items-center ">
              <span className="">Delivery Charges</span>
              <span className="font-semibold"> ₹{deliveryFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount</span>
                <span className="font-semibold">-₹{discountAmount}</span>
              </div>
            )}
            <Separator className="my-4" />
            <div className="flex justify-between items-center text-xl font-bold">
              <span>Total</span>
              <span className="text-theme">₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {/* <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={() => onApplyCoupon(couponCode)}
                variant="outline"
                className="whitespace-nowrap"
              >
                <Tag className="mr-2 h-4 w-4" /> Apply
              </Button>
            </div> */}
            <CouponSelector
              visibleCoupons={visibleCoupons}
              appliedCoupons={appliedCoupons}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              discountAmount={discountAmount}
            />
            <ButtonMain
              onClick={handleProceedToCheckout}
              className="w-full"
              icon={LockClosedIcon}
            >
              {checkoutLoading ? "Processing..." : " Proceed to Checkout"}
            </ButtonMain>
          </div>
        </CardContent>
      </Card>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CartSummary;
