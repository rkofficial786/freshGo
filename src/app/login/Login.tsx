"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, verifyOtp } from "@/lib/features/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FiUser, FiLock } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import ButtonMain from "@/components/ButtonMain";
import FloatingLabelInput from "@/components/FloatingInput";

const Login = () => {
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [temp, setTemp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { payload } = await dispatch(login({ name, email }));
      if (payload.success) {
        toast.success(payload.msg);
        setTemp(payload.otp);
        setIsOtpSent(true);
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsVerify(true);
    try {
      const { payload } = await dispatch(
        verifyOtp({ email, otp: otp.join("") })
      );
      if (payload.success) {
        toast.success(payload.msg);
        router.back();
      } else {
        toast.error(payload.msg);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsVerify(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleChangeCredentials = () => {
    setIsOtpSent(false);
    setOtp(["", "", "", "", "", ""]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-primary-50 to-primary-100">
      <Card className="w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="bg-white px-8 py-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isOtpSent ? "Verify OTP" : "Welcome"}
          </h2>
          {/* <p>{temp}</p> */}

          <p className="text-center text-gray-600 mb-8">
            {isOtpSent
              ? "Enter the OTP sent to your email"
              : "Sign in or Create a new account"}
          </p>

          <CardContent className="space-y-6">
            {!isOtpSent ? (
              <>
               
                <FloatingLabelInput
                  id="email"
                  label="Enter Email"
                  icon={MdEmail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 border-0 rounded-lg"
                />
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                    />
                  ))}
                </div>
                <Button
                  variant="link"
                  onClick={handleChangeCredentials}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors w-full"
                >
                  Change credentials
                </Button>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center mt-6">
            <ButtonMain
              className="w-full bg-gradient-to-r from-primary-700 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              onClick={isOtpSent ? handleVerifyOtp : handleLogin}
              loading={isLoading || isVerify}
            >
              {isOtpSent ? "Verify OTP" : "Submit"}
            </ButtonMain>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default Login;
