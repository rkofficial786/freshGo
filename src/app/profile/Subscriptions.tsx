import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOrdersData } from "@/lib/features/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FiCalendar,
  FiClock,
  FiPackage,
  FiRepeat,
  FiTruck,
} from "react-icons/fi";

const Subscriptions = () => {
  const dispatch = useDispatch<any>();
  const [subscriptionOrders, setSubscriptionOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(getOrdersData());

      if (payload.success) {
        const formattedOrders = payload.orders.map((order) => ({
          orderId: order.orderId,
          id: order._id,
          date: new Date(order.createdAt).toLocaleDateString(),
          products: order.productDetails.map((item) => ({
            id: item.product._id,
            name: item.product.name,
            price: item?.measure?.offerPrice || 0,
            quantity: item.count,
            size: item?.measure?.measure || "N/A",
            unit: item?.measure?.unit || "N/A",
            orderType: item?.orderType,
          })),
          paymentStatus: order.paymentStatus,
          total: order.payablePrice,
          status: order.currentStatus,
          day: order.day,
          time: order.time,
          deliveryType: order.deliveryType,
        }));

        const actualOrders = formattedOrders.filter(
          (order) => order.paymentStatus === "PAID"
        );

      

        const subscriptions = actualOrders.filter((order) =>
          order.products.some(
            (product) =>
              product.orderType === "weekly" || product.orderType === "monthly"
          )
        );

     

        setSubscriptionOrders(subscriptions);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-yellow-800">
        My Subscriptions
      </h1>
      {subscriptionOrders.length === 0 ? (
        <p className="text-center text-gray-600">
          No active subscriptions found.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {subscriptionOrders.map((order) => (
            <Card key={order.id} className="bg-yellow-50 border-yellow-200">
              <CardHeader className="bg-yellow-100">
                <CardTitle className="text-yellow-800">
                  Order #{order.orderId}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center text-yellow-700">
                    <FiCalendar className="mr-2" />
                    <span>Ordered on: {order.date}</span>
                  </div>
                  <div className="flex items-center text-yellow-700">
                    <FiClock className="mr-2" />
                    <span>
                      Delivery : {order.day} , {order.time}
                    </span>
                  </div>

                  <div className="flex items-center text-yellow-700">
                    <FiTruck className="mr-2" />
                    <span>Delivery Type: {order.deliveryType}</span>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Products:
                    </h3>
                    {order.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between mb-2"
                      >
                        <span className="text-yellow-700">
                          {product.name} ({product.size} {product.unit}) x
                          {product.quantity}
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-yellow-200 text-yellow-800"
                        >
                          <FiRepeat className="mr-1" />
                          {product.orderType == "monthly"
                            ? "monthly"
                            : "quarterly"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <span className="font-semibold text-yellow-800">
                      Total: ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
