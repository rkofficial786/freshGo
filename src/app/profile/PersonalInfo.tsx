"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Mail, User, Phone, Loader } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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



const ProfileInfo: React.FC<any> = ({
  setIsOtpModalOpen,
  isOtpModalOpen,
}) => {
  const [personalInfo, setPersonalInfo] = useState<any>({
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
          name: payload.user.name || "",
          email: payload.user.email || "",
          phone: payload.user.phone || "",
          _id: payload.user._id,
        });
        setNewEmail(payload.user.email || "");
      } else {
        toast.error(payload.msg || "Failed to load user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        toast.success(payload.msg || "Profile updated successfully");
      } else {
        toast.error(payload.msg || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
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
      console.error("Error verifying email:", error);
      toast.error("Failed to verify email");
    } finally {
      setProfileUpdating(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              Full Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="name"
                name="name"
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
                placeholder="Your full name"
                className="pl-10 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="email"
                name="email"
                type="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                placeholder="Your email address"
                className="pl-10 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="phone"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                placeholder="Your phone number"
                className="pl-10 border-gray-200 focus:border-black focus:ring-black"
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <Button
            onClick={handleUpdateProfile}
            className="bg-black hover:bg-gray-800 text-white"
            disabled={profileUpdating}
          >
            {profileUpdating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </div>
      </CardContent>

      {/* OTP Dialog */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Verify Email</DialogTitle>
            <DialogDescription className="text-gray-600">
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
                    className="border-gray-200 focus:border-black focus:ring-black"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <DialogFooter>
            <Button
              onClick={handleVerifyEmail}
              className="w-full bg-black hover:bg-gray-800 text-white"
              disabled={profileUpdating}
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