"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiShoppingBag,
} from "react-icons/fi";
import { Badge, Loader, MapPin, Menu, User } from "lucide-react";
import toast from "react-hot-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  getAllAddress,
  makeDefaultAddress,
  updateAddress,
  deleteAddress,
  AddNewAddress,
} from "@/lib/features/address";

import {
  getUserDetails,
  logoutApi,
  updateUserDetails,
} from "@/lib/features/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import ButtonMain from "@/components/ButtonMain";

import { IoMdExit } from "react-icons/io";
import ProfileInfo from "./PersonalInfo";
import ShippingAddresses from "./Address";
// import Orders from "../orders/Orders";
import { FaShoppingBag } from "react-icons/fa";
import Subscriptions from "./Subscriptions";
import { emptyCart } from "@/lib/features/cart";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import Orders from "../orders/Orders";

const Profile = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    _id: "",
  });

  const searchParams = useSearchParams();

  const type = searchParams.get("type") || "personal";
  const dispatch = useDispatch<any>();
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [defaultAddress, setDefaultAddress] = useState("");
  const [userDetails, setUserDetails] = useState({});
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const cartItems = useSelector((state: any) => state.cart.items);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState(type);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarRef = useRef(null);

  const initialAddressState = {
    address: "",
    mobile: "",
    country: "India",
    state: "",
    name: "",
    addressType: "Home",
    zipCode: "",
  };

  const [newAddress, setNewAddress] = useState(initialAddressState);

  const callGetAllAddress = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());

      if (payload.success) {
        setAddresses(payload?.user?.address);
        setPersonalInfo({
          name: payload?.user?.name,
          email: payload.user.email,
          phone: payload.user.phone,
          _id: payload.user._id,
        });
        setNewEmail(payload.user.email);
        setUserDetails(payload.user);
        if (payload?.user?.defaultAddress) {
          setDefaultAddress(payload?.user?.defaultAddress?._id);
        }
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    callGetAllAddress();
  }, []);

  const handleLogout = async () => {
    const { payload }: any = await dispatch(logoutApi());
    if (payload.success) {
      toast.success("Logout Success");
      dispatch(emptyCart());
      router.push("/");
    } else {
      toast.error(payload.msg);
    }
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
  }, [setIsSidebarOpen]);
  

  return (
    <div className="bg-primary-50">
      <div className="container mx-auto p-6 space-y-6 pt-16 flex min-h-screen relative ">
        {/* Sidebar toggle button */}
        <button
          className="md:hidden fixed top-34 right-4 z-[600] p-2 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
          fixed md:sticky top-0 left-0 h-[100vh] z-0
          w-64 p-4 mr-8 border-r border-primary-700
          ${isSidebarOpen ? "z-[600]" : isOtpModalOpen ? "z-[10]" : "z-[100]"}
          transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 bg-white" : "-translate-x-full"}
          md:translate-x-0 md:bg-transparent
          shadow-lg md:shadow-none
        `}
        >
          <h2 className="text-2xl font-bold mb-6 text-primary-800">
            My Profile
          </h2>
          <ul className="space-y-2">
            {[
              { id: "personal", icon: User, label: "Personal Information" },
              { id: "addresses", icon: MapPin, label: "Shipping Addresses" },
              { id: "orders", icon: FiShoppingBag, label: "Orders" },
              {
                id: "logout",
                icon: IoMdExit,
                label: "Logout",
                onClick: handleLogout,
              },
            ].map((item) => (
              <li key={item.id}>
                <button
                  className={`w-full text-left flex items-center p-2 rounded transition-colors ${
                    activeTab === item.id
                      ? "bg-primary-100 text-primary-950"
                      : "text-primary-900 hover:bg-primary-50"
                  }`}
                  onClick={() =>
                    item.onClick ? item.onClick() : setActiveTab(item.id)
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1  p-6 rounded-lg shadow-md">
          {activeTab === "personal" && (
            <ProfileInfo
              isOtpModalOpen={isOtpModalOpen}
              setIsOtpModalOpen={setIsOtpModalOpen}
            />
          )}
          {activeTab === "addresses" && <ShippingAddresses />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "subscriptions" && <Subscriptions />}
        </div>

        {/* OTP Dialog */}
        {/* <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-primary-50">
            <DialogHeader>
              <DialogTitle className="text-primary-800">
                Verify Email
              </DialogTitle>
              <DialogDescription className="text-primary-600">
                Enter the 6-digit OTP sent to your email {personalInfo.email}.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
              >
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="border-primary-300 focus:border-primary-500"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button
                onClick={handleVerifyEmail}
                className="w-full bg-primary-600 text-white hover:bg-primary-700"
              >
                {profileUpdating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>
    </div>
  );
};

export default Profile;
