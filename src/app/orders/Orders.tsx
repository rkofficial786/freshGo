"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ChevronRight,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  Package,
} from "lucide-react";

import { useDispatch } from "react-redux";
import { getOrdersData } from "@/lib/features/order";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Status Badge component
const StatusBadge = ({ status }) => {
  let color;
  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800 border-yellow-200";
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case "shipped":
      color = "bg-purple-100 text-purple-800 border-purple-200";
      break;
    case "delivered":
      color = "bg-green-100 text-green-800 border-green-200";
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800 border-red-200";
      break;
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200";
  }

  return (
    <Badge variant="outline" className={`${color} capitalize`}>
      {status}
    </Badge>
  );
};

// Order Status Timeline component
const OrderStatus = ({ status }) => {
  const steps = [
    { id: "pending", label: "Order Placed", icon: <Package size={18} /> },
    { id: "processing", label: "Processing", icon: <Clock size={18} /> },
    { id: "shipped", label: "Shipped", icon: <Truck size={18} /> },
    { id: "delivered", label: "Delivered", icon: <CheckCircle size={18} /> },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Order Status</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`rounded-full p-2 ${
                index <= currentStepIndex
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`text-xs mt-2 ${
                index <= currentStepIndex ? "font-medium" : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-10 ${
                  index < currentStepIndex ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Details component for the modal
const OrderDetails = ({ order }) => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">Order #{order.orderId}</h3>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <Separator />

      {/* Shipping Address */}
      <div>
        <h3 className="font-medium flex items-center gap-2 mb-2">
          <MapPin size={16} /> Shipping Address
        </h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.address}
          </p>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.city} {order.shippingAddress.state},{" "}
            {order.shippingAddress.zipCode}
          </p>
          <p className="text-sm text-gray-600">
            Phone: {order.shippingAddress.mobile}
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h3 className="font-medium flex items-center gap-2 mb-2">
          <CreditCard size={16} /> Payment Information
        </h3>
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm">
            <span className="font-medium">Method:</span> {order.paymentMethod}
          </p>
          <p className="text-sm">
            <span className="font-medium">Status:</span> {order.paymentStatus}
          </p>
        </div>
      </div>

      {/* Product List */}
      <div>
        <h3 className="font-medium mb-2">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 bg-gray-50 p-3 rounded-md"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-md relative overflow-hidden">
                {item.img && (
                  <img
                    src={item.img}
                    alt={item.name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-600">
                    {item.quantity} x ₹{item.price}
                    <span className="text-xs ml-2">({item.unit})</span>
                  </p>
                  <p className="font-medium">₹{item.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h3 className="font-medium mb-2">Order Summary</h3>
        <div className="bg-gray-50 p-3 rounded-md space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          {order.productDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Product Discount:</span>
              <span className="text-green-600">
                -₹{order.productDiscount.toFixed(2)}
              </span>
            </div>
          )}
          {order.couponDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span>Coupon Discount:</span>
              <span className="text-green-600">
                -₹{order.couponDiscount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Shipping Fee:</span>
            {order.shippingCost > 0 ? (
              <span>₹{order.shippingCost.toFixed(2)}</span>
            ) : (
              <span className="text-green-600">Free</span>
            )}
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (GST):</span>
            <span>₹{order.tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Information */}
      {order.expectedDelivery && (
        <div>
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Calendar size={16} /> Delivery Information
          </h3>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm">
              <span className="font-medium">Expected Delivery:</span>{" "}
              {formatDate(order.expectedDelivery)}
            </p>
          </div>
        </div>
      )}

      {/* Order Status Timeline */}
      <OrderStatus status={order.status} />
    </div>
  );
};

// Order Card component
const OrderCard = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card className="w-full mb-6 hover:border-gray-400 transition-colors">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">Order #{order.orderId}</CardTitle>
              <p className="text-sm text-gray-500">
                Placed on {formatDate(order.createdAt)}
              </p>
              <p className="text-sm text-gray-500">{order.itemCount} items</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {order.expectedDelivery ? (
                <span className="text-sm text-gray-600">
                  Expected delivery: {formatDate(order.expectedDelivery)}
                </span>
              ) : (
                <span className="text-sm text-gray-600">Processing</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">₹{order.total.toFixed(2)}</span>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-black hover:bg-gray-100 transition-colors"
                  >
                    <span className="mr-1">Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto z-[1000]">
                  <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                  </DialogHeader>
                  <OrderDetails order={order} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {/* Preview of first item only */}
          {order.firstItem && (
            <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
              <div className="relative w-16 h-16 bg-gray-200 rounded overflow-hidden">
                {order.firstItem.img && (
                  <img
                    src={order.firstItem.img}
                    alt={order.firstItem.name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium line-clamp-1">
                  {order.firstItem.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {order.itemCount > 1
                    ? `+${order.itemCount - 1} more items`
                    : ""}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">₹{order.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{order.paymentMethod}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Orders component
const Orders = () => {
  const [sortBy, setSortBy] = useState("date");
  const dispatch = useDispatch<any>();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getOrdersData());
      console.log(orders, "orders");

      if (payload?.success) {
        setOrders(payload.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Skeleton loader
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-4 mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-20 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  // Sort orders
  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "status") {
      // Priority order: processing, pending, shipped, delivered, cancelled
      const statusOrder = {
        processing: 1,
        pending: 2,
        shipped: 3,
        delivered: 4,
        cancelled: 5,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded p-2 text-sm"
        >
          <option value="date">Sort by Date</option>
          <option value="status">Sort by Status</option>
        </select>
      </div>

      {loading ? (
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      ) : sortedOrders.length > 0 ? (
        sortedOrders.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No orders found
          </h2>
          <p className="text-gray-500 text-center max-w-sm mb-6">
            You haven't placed any orders yet. Browse our products and place
            your first order!
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="bg-black text-white hover:bg-gray-800"
          >
            Shop Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default Orders;
