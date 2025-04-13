"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { getCouponById } from "@/lib/features/cart";

const CouponSection = ({ totalAmount, onCouponApplied }) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const dispatch = useDispatch<any>();
  const { availableCoupons } = useSelector((state:any) => state.cart);

  console.log(availableCoupons, "avalable copuns");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    try {
      // Call API to check if coupon is valid
      // const response = await fetch(`/api/coupon/${couponCode}?totalPrice=${totalAmount}`);
      const { payload } = await dispatch(
        getCouponById({ amount: totalAmount, code: couponCode })
      );

      if (payload.success && payload.coupon.isValid) {
        setAppliedCoupon(payload.coupon);

        // Calculate discount based on coupon type
        if (payload.coupon.type === "percentage") {
          const discount = (totalAmount * payload.coupon.amount) / 100;
          const finalDiscount = Math.min(discount, payload.coupon.off);
          setCouponDiscount(finalDiscount);
          onCouponApplied(finalDiscount);
        } else {
          setCouponDiscount(payload.coupon.amount);
          onCouponApplied(payload.coupon.amount);
        }

        toast.success("Coupon applied successfully!");
        setCouponCode("");
      } else {
        toast.error("Coupon can not be applied");
      }
    } catch (error) {
      toast.error("Failed to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    onCouponApplied(0);
    toast.success("Coupon removed");
  };

  const handleSelectCoupon = (coupon) => {
    setCouponCode(coupon.couponCode);
    setIsDropdownOpen(false);
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium mb-3">Apply Coupon</h3>

      {appliedCoupon ? (
        <div className="flex items-center justify-between bg-green-50 p-3 rounded-md border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <Check size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{appliedCoupon.couponCode}</p>
              <p className="text-xs text-green-600">
                ₹{couponDiscount.toFixed(2)} discount applied
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div>
          <div className="flex space-x-2">
            <div className="flex-grow relative">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full"
              />
              {availableCoupons.length > 0 && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {isDropdownOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              )}

              {isDropdownOpen && availableCoupons.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectCoupon(coupon)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{coupon.couponCode}</span>
                        <span className="text-green-600 text-sm">
                          {coupon.type === "percentage"
                            ? `${coupon.amount}% off`
                            : `₹${coupon.amount} off`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {coupon.type === "percentage"
                          ? `Up to ₹${coupon.off} • `
                          : ""}
                        Min. order ₹{coupon.purchaseAmount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              onClick={handleApplyCoupon}
              disabled={isApplying}
              className="bg-black hover:bg-gray-800 text-white whitespace-nowrap"
            >
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          </div>

          {availableCoupons?.length > 0 && (
            <div className="mt-2">
              <div
                className="text-sm text-blue-600 cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {isDropdownOpen
                  ? "Hide available coupons"
                  : "View available coupons"}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouponSection;
