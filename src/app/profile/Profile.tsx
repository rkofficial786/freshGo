"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  MapPin,
  ShoppingBag,
  LogOut,
  Menu,
  ChevronRight,
  CircleUser,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { getUserDetails, logoutApi } from "@/lib/features/auth";

import ProfileInfo from "./PersonalInfo";
import ShippingAddresses from "./Address";
import Orders from "../orders/Orders";

const Profile = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "personal";
  const dispatch = useDispatch<any>();
  const router = useRouter();
  
  const [userDetails, setUserDetails] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    _id: "",
  });
  
  const [activeTab, setActiveTab] = useState(type);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const menuItems = [
    { 
      id: "personal", 
      icon: CircleUser, 
      label: "Personal Information",
      description: "Manage your personal details and preferences" 
    },
    { 
      id: "addresses", 
      icon: MapPin, 
      label: "Addresses",
      description: "Manage your delivery locations" 
    },
    { 
      id: "orders", 
      icon: ShoppingBag, 
      label: "Order History",
      description: "View your past orders and track deliveries" 
    },
  ];

  const fetchUserData = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload?.user?.address || []);
        setPersonalInfo({
          name: payload?.user?.name || "",
          email: payload.user.email || "",
          phone: payload.user.phone || "",
          _id: payload.user._id,
        });
        setUserDetails(payload.user);
        
        if (payload?.user?.defaultAddress) {
          setDefaultAddress(payload?.user?.defaultAddress?._id);
        }
      } else {
        toast.error(payload.msg || "Failed to load user details");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Something went wrong while loading your profile");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const { payload } = await dispatch(logoutApi());
      if (payload.success) {
        toast.success("Successfully logged out");
        router.push("/");
      } else {
        toast.error(payload.msg || "Failed to logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header with mobile menu toggle */}
      <div className="bg-green-600 text-white py-4 px-6 md:hidden flex items-center justify-between">
        <h1 className="text-xl font-bold">My Account</h1>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-green-700"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-6 relative">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar / Navigation */}
          <aside
            ref={sidebarRef}
            className={`
              md:w-1/4 lg:w-1/5 
              bg-white rounded-lg shadow-sm border border-gray-200
              md:sticky top-[120px] md:h-[calc(100vh-3rem)]
              transition-all duration-300 ease-in-out
              ${isSidebarOpen ? "fixed inset-y-0 right-0 z-50 w-3/4 sm:w-1/2 translate-x-0" : "fixed inset-y-0 right-0 z-50 w-3/4 sm:w-1/2 translate-x-full md:translate-x-0 md:static md:z-0"}
              p-5 overflow-y-auto
            `}
          >
            {/* User Profile Summary */}
            <div className="mb-6 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                {personalInfo.name ? (
                  <span className="text-2xl font-bold text-green-700">
                    {personalInfo.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-10 h-10 text-green-500" />
                )}
              </div>
              <h2 className="mt-3 font-bold text-lg text-gray-900">
                {personalInfo.name || "Guest User"}
              </h2>
              <p className="text-sm text-gray-500">{personalInfo.email || ""}</p>
            </div>

            <Separator className="my-4" />

            {/* Navigation Menu */}
            <nav>
              <ul className="space-y-1">
                {menuItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full p-3 flex items-center rounded-md transition-all duration-200 
                        ${
                          activeTab === item.id
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                        }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 ${
                        activeTab === item.id ? "" : "text-green-600"
                      }`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}

                {/* Logout Button */}
                <li className="mt-6">
                  <button
                    onClick={handleLogout}
                    className="w-full p-3 flex items-center text-red-600 hover:bg-red-50 rounded-md transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Section Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {menuItems.find(item => item.id === activeTab)?.label || "My Account"}
              </h1>
              <p className="text-gray-500">
                {menuItems.find(item => item.id === activeTab)?.description || "Manage your account"}
              </p>
            </div>

            {/* Content Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <div className="p-6">
                  {activeTab === "personal" && (
                    <ProfileInfo userDetails={personalInfo} />
                  )}
                  {activeTab === "addresses" && (
                    <ShippingAddresses />
                  )}
                  {activeTab === "orders" && (
                    <Orders />
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;