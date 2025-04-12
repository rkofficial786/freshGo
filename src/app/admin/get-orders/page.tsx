"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaBox,
  FaCreditCard,
  FaMapMarkerAlt,
  FaSearch,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/api/admin/order", {
        params: {
          search: searchTerm,
          paymentStatus: paymentStatus !== "all" ? paymentStatus : undefined,
          orderStatus: orderStatus !== "all" ? orderStatus : undefined,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast(response.data.msg);
      }
    } catch (error) {
      console.log(error);
      toast("Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, paymentStatus, orderStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.patch(`/api/admin/order/${orderId}`, {
        status: newStatus,
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchOrders();
      } else {
        toast.error(response.data.msg);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      <div className="flex space-x-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <Select value={orderStatus} onValueChange={setOrderStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <TableRow>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>₹ {order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "Completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.orderStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order._id ? null : order._id
                          )
                        }
                      >
                        {expandedOrder === order._id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedOrder === order._id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Card className="mt-4">
                          <CardContent className="space-y-6 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <Card className="shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center">
                                    <FaUser className="mr-2" /> User Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p>
                                      <span className="font-semibold">
                                        Name:
                                      </span>{" "}
                                      {order?.user?.name}
                                    </p>
                                    <p>
                                      <span className="font-semibold">
                                        Email:
                                      </span>{" "}
                                      {order?.user?.email}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center">
                                    <FaMapMarkerAlt className="mr-2" /> Shipping
                                    Address
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p>{order?.shippingAddress?.name}</p>
                                    <p>{order?.shippingAddress?.address}</p>
                                    <p>
                                      {order?.shippingAddress?.state},{" "}
                                      {order?.shippingAddress?.zipCode}
                                    </p>
                                    <p>{order?.shippingAddress?.country}</p>
                                    <p>{order?.shippingAddress?.phone}</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-lg flex items-center">
                                    <FaCreditCard className="mr-2" /> Payment
                                    Details
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p>
                                      <span className="font-semibold">
                                        Status:
                                      </span>{" "}
                                      {order?.paymentStatus}
                                    </p>
                                    <p>
                                      <span className="font-semibold">
                                        Method:
                                      </span>{" "}
                                      {order?.paymentMethod}
                                    </p>
                                    <p>
                                      <span className="font-semibold">
                                        Total:
                                      </span>{" "}
                                      ₹ {order?.totalPrice?.toFixed(2)}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <Card className="shadow-sm">
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                  <FaBox className="mr-2" /> Order Details
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-semibold">Order Date:</p>
                                    <p>
                                      {new Date(
                                        order?.createdAt
                                      ).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">Order ID:</p>
                                    <p>{order.orderId}</p>
                                  </div>
                                  <div>
                                    <p className="font-semibold">
                                      Total Price:
                                    </p>
                                    <p>₹ {order.totalPrice.toFixed(2)}</p>
                                  </div>
                                </div>
                                <Separator className="my-4" />
                                <h4 className="font-semibold mb-2">Products</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {order.products.map((item) => (
                                    <div
                                      key={item._id}
                                      className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                                    >
                                      <img
                                        src={item.product.img}
                                        alt={item.product.name}
                                        className="w-20 h-20 object-cover rounded"
                                      />
                                      <div className="flex-grow">
                                        <p className="font-medium">
                                          {item.product.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Quantity: {item.quantity}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Unit Price: ₹{" "}
                                          {item.price.toFixed(2)}
                                        </p>
                                        <p className="text-sm font-semibold mt-1">
                                          Subtotal: ₹{" "}
                                          {(item.quantity * item.price).toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                              <Card className="shadow-sm">
                                <CardHeader>
                                  <CardTitle className="text-lg">
                                    Update Order Status
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <Select
                                    defaultValue={order.orderStatus}
                                    onValueChange={setNewStatus}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">
                                        Pending
                                      </SelectItem>
                                      <SelectItem value="Processing">
                                        Processing
                                      </SelectItem>
                                      <SelectItem value="Shipped">
                                        Shipped
                                      </SelectItem>
                                      <SelectItem value="Delivered">
                                        Delivered
                                      </SelectItem>
                                      <SelectItem value="Cancelled">
                                        Cancelled
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    className="w-full"
                                    onClick={() =>
                                      handleStatusChange(order._id, newStatus)
                                    }
                                  >
                                    Update Status
                                  </Button>
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdersPage;