
"use client";

import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { getOrdersData } from "@/lib/features/order";
import { sortOrders } from "./utils";
import { OrderCard } from "./OrderCard";


const OrdersPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<"date" | "status">("date");
  const dispatch = useDispatch<any>();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getOrdersData());

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

  const sortedOrders = sortOrders(orders, sortBy);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "date" | "status")}
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
        sortedOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))
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

export default OrdersPage;