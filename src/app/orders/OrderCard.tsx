"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import { OrderDetailsModal } from "./OrderModal";
import { formatDate } from "./utils";
import { StatusBadge } from "./Status";

interface OrderCardProps {
  order: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="w-full mb-4 sm:mb-6 border border-gray-200 hover:border-gray-400 transition-colors">
        <CardHeader className="p-3 sm:p-6 !pb-0">
          <div className="flex flex-col space-y-4">
            {/* Order Info and Status */}
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Order #{order.orderId}
                </CardTitle>
                <p className="text-sm text-gray-500 break-words">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-gray-500">
                  {order.items.length} items
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            {/* Delivery + Price + Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <span className="font-medium text-sm sm:text-base">
                  ₹{order.total.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-black hover:bg-gray-100 transition-colors"
                  onClick={() => setIsModalOpen(true)}
                >
                  <span className="mr-1">Details</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Optional preview of first item */}
        {order.items && order.items.length > 0 && (
          <CardContent className="p-3 sm:p-6 pt-0">
            <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-md">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded overflow-hidden">
                {order.items[0].img && (
                  <img
                    src={order.items[0].img}
                    alt={order.items[0].name}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm line-clamp-1">
                  {order.items[0].name}
                </h4>
                <p className="text-xs text-gray-600">
                  {order.items.length > 1
                    ? `+${order.items.length - 1} more item(s)`
                    : ""}
                </p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="font-medium text-sm">₹{order.total.toFixed(2)}</p>
                <p className="text-xs text-gray-500">
                  {order.paymentMethod}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Modal */}
      <OrderDetailsModal
        order={order}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
