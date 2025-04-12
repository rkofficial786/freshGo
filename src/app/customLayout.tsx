"use client";

import Navbar from "@/components/navbar/Navbar";
import { getUserDetails, logoutApi } from "@/lib/features/auth";
import { emptyCart, getCartItems } from "@/lib/features/cart";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useDispatch, useSelector } from "react-redux";
import Footer from "@/components/Footer";
import { getAllCategories } from "@/lib/features/catogary";

const CustomeLayout = ({ children }) => {
  const pathname = usePathname();
  const dispatch = useDispatch<any>();
  const { token } = useSelector((state: any) => state.auth);

  const callGetUser = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      

      if (payload.success) {
      } else {
        if (payload.msg == "Unauthorized") {
          await dispatch(logoutApi());
          dispatch(emptyCart());
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { payload } = await dispatch(getAllCategories());
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default CustomeLayout;
