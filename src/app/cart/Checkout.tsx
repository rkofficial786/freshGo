"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  Check,
  ChevronDown,
  MapPin,
  Home,
  Briefcase,
  ClipboardList,
  Loader,
} from "lucide-react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { getUserDetails } from "@/lib/features/auth";
import { clearCart } from "@/lib/features/cart";
import { makeDefaultAddress } from "@/lib/features/address";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: any;
  products: any[];
  cartItems: any[];
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  summary,
  products,
  cartItems,
}) => {
  const dispatch = useDispatch<any>();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showAddressList, setShowAddressList] = useState(false);

  // Fetch user details and addresses
  useEffect(() => {
    if (isOpen) {
      fetchUserDetails();
      console.log("Summary in checkout modal:", summary);
    }
  }, [isOpen]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload.user.address || []);

        if (payload.user.defaultAddress) {
          setDefaultAddressId(payload.user.defaultAddress._id);
          setSelectedAddressId(payload.user.defaultAddress._id);
        } else if (payload.user.address && payload.user.address.length > 0) {
          setSelectedAddressId(payload.user.address[0]._id);
        }
      } else {
        toast.error("Failed to load address information");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    try {
      const { payload } = await dispatch(
        makeDefaultAddress({
          addressId: id,
        })
      );

      if (payload.success) {
        toast.success(payload.msg || "Default address updated");
        setDefaultAddressId(id);
        setSelectedAddressId(id);
        setShowAddressList(false);
      } else {
        toast.error(payload.msg || "Failed to update default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setSubmitting(true);

      // Prepare order items
      const items = cartItems.map((item) => {
        const product = products.find((p) => p._id === item.productId);
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        };
      });

      // Place order API call
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingAddressId: selectedAddressId,
          paymentMethod,
          couponDiscount: summary.couponDiscount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        onClose();
        // Redirect to order confirmation page
        window.location.href = `/profile?type=orders`;
      } else {
        toast.error(data.msg || "Failed to place your order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Something went wrong while placing your order");
    } finally {
      setSubmitting(false);
    }
  };

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "Home":
        return <Home className="w-4 h-4" />;
      case "Work":
        return <Briefcase className="w-4 h-4" />;
      default:
        return <ClipboardList className="w-4 h-4" />;
    }
  };

  const selectedAddress = addresses.find(
    (addr) => addr._id === selectedAddressId
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-xl z-[1000] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Delivery Address Section */}
            <div>
              <h3 className="font-medium mb-2">Delivery Address</h3>

              {addresses.length === 0 ? (
                <div className="border border-gray-200 rounded-md p-4 text-center">
                  <p className="text-gray-500">No addresses found</p>
                  <Button
                    className="mt-2 bg-black text-white hover:bg-gray-800"
                    onClick={() => {
                      window.location.href = "/profile?type=addresses";
                    }}
                  >
                    Add a New Address
                  </Button>
                </div>
              ) : (
                <>
                  {/* Selected Address Preview */}
                  {selectedAddress && (
                    <div className="border border-gray-200 hover:border-black rounded-md p-4 relative">
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              {selectedAddress.name}
                            </h4>
                            <Badge
                              variant="outline"
                              className="flex items-center gap-1 text-xs text-gray-600 border-gray-200"
                            >
                              {getAddressTypeIcon(selectedAddress.addressType)}{" "}
                              {selectedAddress.addressType}
                            </Badge>
                            {selectedAddress._id === defaultAddressId && (
                              <Badge className="bg-black text-white">
                                Default
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mt-1">
                            {selectedAddress.address}
                          </p>
                          <p className="text-sm text-gray-700">
                            {selectedAddress.city} {selectedAddress.state},{" "}
                            {selectedAddress.country} -{" "}
                            {selectedAddress.zipCode}
                          </p>
                          <p className="text-sm text-gray-700">
                            Phone: {selectedAddress.mobile}
                          </p>
                        </div>
                      </div>

                      <button
                        className="absolute top-4 right-4 flex items-center text-sm text-gray-600 hover:text-black"
                        onClick={() => setShowAddressList(!showAddressList)}
                      >
                        Change <ChevronDown className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Address selection list */}
                  {showAddressList && (
                    <div className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-100 max-h-60 overflow-auto">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`p-3 flex items-start gap-3 hover:bg-gray-50 ${
                            addr._id === selectedAddressId ? "bg-gray-50" : ""
                          }`}
                        >
                          <div
                            className="flex-shrink-0 mt-1 cursor-pointer"
                            onClick={() => {
                              setSelectedAddressId(addr._id);
                              setShowAddressList(false);
                            }}
                          >
                            {addr._id === selectedAddressId ? (
                              <Check className="h-4 w-4 text-black" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                            )}
                          </div>
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              setSelectedAddressId(addr._id);
                              setShowAddressList(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">
                                {addr.name}
                              </h4>
                              <Badge variant="outline" className="text-xs">
                                {addr.addressType}
                              </Badge>
                              {addr._id === defaultAddressId && (
                                <Badge className="bg-black text-white text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-0.5">
                              {addr.address}
                            </p>
                            <p className="text-xs text-gray-600">
                              {addr.mobile}
                            </p>
                          </div>
                          {addr._id !== defaultAddressId && (
                            <button
                              type="button"
                              className="text-xs text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefaultAddress(addr._id);
                              }}
                            >
                              Set as default
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <Separator />

            {/* Order Summary Section */}
            <div>
              <h3 className="font-medium mb-2">Order Summary</h3>
              <div className="border border-gray-200 rounded-md p-4 space-y-4">
                {/* Item count */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Items ({summary.totalQuantity || 0})
                  </span>
                  <span>₹{(summary.mrpTotal || 0).toFixed(2)}</span>
                </div>

                {/* Discount */}
                {(summary.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">
                      -₹{(summary.discount || 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Coupon discount */}
                {(summary.couponDiscount || 0) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="text-green-600">
                      -₹{(summary.couponDiscount || 0).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Delivery fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  {(summary.deliveryFee || 0) > 0 ? (
                    <span>₹{(summary.deliveryFee || 0).toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600">Free</span>
                  )}
                </div>

                {/* Tax */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span>₹{(summary.tax || 0).toFixed(2)}</span>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    ₹
                    {(
                      (summary.cartTotal || 0) +
                      (summary.deliveryFee || 0) +
                      (summary.tax || 0) -
                      (summary.couponDiscount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Method Section */}
            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="border border-gray-200 rounded-md p-4 mb-2 flex items-center space-x-3">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label
                    htmlFor="cod"
                    className="flex items-center cursor-pointer"
                  >
                    <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitOrder}
                className="bg-black hover:bg-gray-800 text-white"
                disabled={submitting || !selectedAddressId}
              >
                {submitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
