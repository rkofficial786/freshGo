"use client";

import React, { useState } from "react";
import { FaLock, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { loginAdmin } from "@/lib/features/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const OtpInput = ({ value, onChange }) => {
  const inputRefs: any = Array(6)
    .fill(0)
    .map(() => React.createRef());

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    if (newValue.length <= 1 && /^\d*$/.test(newValue)) {
      const newOtp = value.split("");
      newOtp[index] = newValue;
      onChange(newOtp.join(""));
      if (newValue && index < 5) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="flex justify-between max-w-xs mx-auto gap-1">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={inputRefs[index]}
          className="w-12 h-12 text-center text-lg"
        />
      ))}
    </div>
  );
};

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const dispatch = useDispatch<any>();
  const router = useRouter();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setAuthData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const submitForm = async () => {
    try {
      setLoading(true);
      const { payload } = await dispatch(loginAdmin(authData));
      setLoading(false);

      console.log(payload, "payload");

      if (payload && payload.success) {
        router.push("/admin/get-orders");
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      setLoading(false);
      toast.error("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                placeholder="Enter your Email"
                className="pl-10"
                value={authData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={authData.password}
                placeholder="Enter your password"
                className="pl-10"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={submitForm} className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
