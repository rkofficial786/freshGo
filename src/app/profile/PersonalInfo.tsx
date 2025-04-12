import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { getUserDetails, updateUserDetails } from "@/lib/features/auth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Button } from "@/components/ui/button";

const ProfileInfo = ({setIsOtpModalOpen ,isOtpModalOpen}) => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    _id: "",
  });
  
  const [otp, setOtp] = useState("");
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const dispatch = useDispatch<any>();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const { payload } = await dispatch(getUserDetails());
      if (payload.success) {
        setPersonalInfo({
          name: payload.user.name,
          email: payload.user.email,
          phone: payload.user.phone,
          _id: payload.user._id,
        });
        setNewEmail(payload.user.email);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details");
    }
  };

  const handlePersonalInfoChange = (e) => {
    setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    if (personalInfo.email !== newEmail) {
      await updateProfile();
      setNewEmail(personalInfo.email);
      setIsOtpModalOpen(true);
    } else {
      await updateProfile();
    }
  };

  const updateProfile = async () => {
    setProfileUpdating(true);
    try {
      const payloadApi = {
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
      };
      const { payload } = await dispatch(updateUserDetails(payloadApi));
      if (payload.success) {
        toast.success(payload.msg);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    } finally {
      setProfileUpdating(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setProfileUpdating(true);
      const response = await fetch("/api/user/email-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newEmail, otp }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Email verified successfully");
        setIsOtpModalOpen(false);
      } else {
        toast.error(data.msg || "Email verification failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to verify email");
    } finally {
      setProfileUpdating(false);
    }
  };


  

  return (
    <Card className="bg-primary-50 border-primary-200 shadow-none border-none">
      <CardHeader className="bg-primary-100">
        <CardTitle className="text-2xl font-bold text-primary-800">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-primary-700">
              Full Name
            </Label>
            <div className="flex items-center space-x-2">
              <FiUser className="text-primary-500" />
              <Input
                id="name"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                placeholder="Your full name"
                className="border-primary-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-primary-700">
              Email Address
            </Label>
            <div className="flex items-center space-x-2">
              <FiMail className="text-primary-500" />
              <Input
                id="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                placeholder="Your email address"
                className="border-primary-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-primary-700">
              Phone Number
            </Label>
            <div className="flex items-center space-x-2">
              <FiPhone className="text-primary-500" />
              <Input
                id="phone"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                placeholder="Your phone number"
                className="border-primary-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleUpdateProfile}
          className="  text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
        >
          {profileUpdating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Personal Info"
          )}
        </Button>
      </CardContent>

      {/* OTP Dialog */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-primary-50">
          <DialogHeader>
            <DialogTitle className="text-primary-800">Verify Email</DialogTitle>
            <DialogDescription className="text-primary-600">
              Enter the 6-digit OTP sent to your email {personalInfo.email}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <InputOTP
              value={otp}
              onChange={(value) => setOtp(value)}
              maxLength={6}
              className="gap-2"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="border-primary-300 focus:border-primary-500 focus:ring-primary-500"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button
              onClick={handleVerifyEmail}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
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
      </Dialog>
    </Card>
  );
};

export default ProfileInfo;