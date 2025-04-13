"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, verifyOtp } from "@/lib/features/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import FloatingLabelInput from "@/components/FloatingInput";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerify, setIsVerify] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { payload } = await dispatch(login({ email }));
      if (payload.success) {
        toast.success(payload.msg);
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
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;
    
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
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 overflow-hidden border border-gray-200 shadow-lg rounded-lg">
        <div className="bg-white px-8 py-12">
          <h2 className="text-2xl font-bold text-center text-black mb-2">
            {isOtpSent ? "Verify Your Email" : "Login"}
          </h2>

          <p className="text-center text-gray-600 mb-8">
            {isOtpSent
              ? "Enter the 6-digit code sent to your email"
              : "Enter your email to continue"}
          </p>

          <CardContent className="space-y-6 p-0">
            {!isOtpSent ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <FloatingLabelInput
                  id="email"
                  label="Email Address"
                  icon={FiMail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-200 rounded-md focus-within:border-black"
                />
                
                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-medium border-2 border-gray-300 rounded-md focus:border-black focus:ring-0 transition-all"
                      required
                    />
                  ))}
                </div>
                
                <Button
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition-colors"
                  onClick={handleVerifyOtp}
                  disabled={isVerify || otp.some(digit => digit === "")}
                >
                  {isVerify ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify & Login"
                  )}
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleChangeCredentials}
                    className="text-gray-600 hover:text-black underline text-sm transition-colors"
                  >
                    Change email address
                  </button>
                </div>
              </div>
            )}
          </CardContent>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            {isOtpSent && (
              <p>
                Didn't receive the code?{" "}
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="text-black font-medium hover:underline transition-all"
                >
                  Resend
                </button>
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;