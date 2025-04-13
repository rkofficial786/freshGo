"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CouponSection from "./CuponSelector";


const OrderSummary = ({ summary, onCheckout,couponDiscount ,setCouponDiscount }) => {

  
  // Calculate final total with coupon discount
  const finalTotal = (
    (summary.cartTotal || 0) +
    (summary.deliveryFee || 0) +
    (summary.tax || 0) -
    couponDiscount
  ).toFixed(2);

  return (
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
        
        {couponDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Coupon Discount</span>
            <span className="text-green-600">-₹{couponDiscount.toFixed(2)}</span>
          </div>
        )}

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{finalTotal}</span>
        </div>

        {summary.deliveryFee > 0 && (
          <div className="text-sm text-gray-500 mt-2">
            Add ₹{(499 - (summary.cartTotal || 0)).toFixed(2)} more to get
            free delivery
          </div>
        )}
      </div>

      {/* Coupon Section - Passing setCouponDiscount to update the discount */}
      <CouponSection 
        totalAmount={summary.cartTotal} 
        onCouponApplied={(discount) => setCouponDiscount(discount)}
      />

      <Button
        onClick={() => onCheckout(finalTotal)}
        className="w-full mt-6 bg-black hover:bg-gray-800 text-white py-3"
      >
        Proceed to Checkout
      </Button>

      <div className="mt-6 text-sm text-center text-gray-500">
        <p>We accept all major credit cards and UPI payments</p>
      </div>
    </div>
  );
};

export default OrderSummary;