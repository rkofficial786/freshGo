"use client";

import Navbar from "@/components/navbar/Navbar";
import { getUserDetails, logoutApi } from "@/lib/features/auth";
import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useDispatch, useSelector } from "react-redux";
import Footer from "@/components/Footer";
import { clearCart } from "@/lib/features/cart";

const CustomeLayout = ({ children }) => {
  const dispatch = useDispatch<any>();
  const { token } = useSelector((state: any) => state.auth);

  const callGetUser = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
      } else {
        if (payload.msg == "Unauthorized") {
          await dispatch(logoutApi());
          dispatch(clearCart());
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token) {
      callGetUser();
    }
  }, []);

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default CustomeLayout;
