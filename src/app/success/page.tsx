"use client";

import { setIsOrderProceed, successOrder } from "@/lib/features/order";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useRouter, useSearchParams } from "next/navigation";

import { FaCheck, FaTimes } from "react-icons/fa";
import { emptyCart } from "@/lib/features/cart";

const SuccessOrder = () => {
  const { currentOrder } = useSelector((state: any) => state.order);
  const dispatch = useDispatch<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOrderProceed } = useSelector((state: any) => state.order);
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId") || "";

  useEffect(() => {
    const callGetSuccessApi = async () => {
      try {
        const { payload } = await dispatch(
          successOrder({
            id: currentOrder._id,
            transactionId,
          })
        );

        if (payload.success && payload.order.paymentStatus === "COMPLETED") {
          setIsSuccess(true);
          dispatch(emptyCart());
        } else {
          setIsSuccess(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsSuccess(false);
      } finally {
        dispatch(setIsOrderProceed(true));
      }
    };

    if (isOrderProceed) {
      router.push("/orders");
    } else {
      callGetSuccessApi();
    }
  }, []);
  const handleViewOrders = () => {
    router.push("/orders");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLoading ? (
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md flex items-center justify-center flex-col">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-500 font-medium mt-4">Verifying Payment...</p>
        </div>
      ) : isSuccess ? (
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
          <div className="flex items-center justify-center">
            <div className="bg-green-500 rounded-full p-6 inline-block">
              <FaCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-6 text-center">
            Payment Successful
          </h2>
          <p className="text-gray-500 mt-4 text-center">
            Congratulations! Your order has been processed successfully.
          </p>
          <div className="flex justify-center mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg"
              onClick={handleViewOrders}
            >
              View Orders
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Your order details have been emailed to you. If you have any
              questions, please don&apos;t hesitate to contact our customer
              service team.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-10 shadow-2xl w-full max-w-md text-center">
          <div className="flex justify-center">
            <div className="bg-red-500 rounded-full p-5  items-center ">
              <FaTimes className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-6">
            Payment Failed
          </h2>
          <p className="text-gray-500 mt-2">
            Unfortunately, your payment was not successful. Please contact our
            customer service for assistance.
          </p>
          <p className="text-gray-500 mt-4">
            Your money will be refunded in 3-5 working days. Don&apos;t worry,
            we&apos;re here to help.
          </p>
          {/* <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg mt-6"
            onClick={() => router.push("/contact")}
          >
            Contact Customer Service
          </button> */}
        </div>
      )}
    </div>
  );
};

export default SuccessOrder;
