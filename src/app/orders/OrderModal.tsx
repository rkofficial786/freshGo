// components/OrderDetailsModal.tsx
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  CreditCard, 
  Calendar 
} from 'lucide-react';
import { formatDate } from './utils';
import { StatusBadge } from './Status';
import { OrderStatusTimeline } from './Timeline';



interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ 
  order, 
  isOpen, 
  onOpenChange 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto z-[1000]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          {/* Order Header */}
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

         
          <OrderStatusTimeline status={order.status} />
        </div>
      </DialogContent>
    </Dialog>
  );
};