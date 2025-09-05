import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Spinner, Progress } from "flowbite-react";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiMail,
  HiXCircle,
  HiRefresh,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Sparkles, Mail, CheckCircle2, XCircle, RefreshCw, ArrowLeft, Shield } from "lucide-react";

const EmailVerificationPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmail = async () => {
    setIsLoading(true);
    setError(null);
    setMessage("");

    try {
      const res = await fetch(`/api/auth/verify-email/${token}`);
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setMessage(
          data.message ||
            "Email verified successfully. You will be redirected to the login page."
        );
        setError(null);

        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        setTimeout(() => {
          navigate("/signin", {
            state: {
              verificationSuccess: true,
              message: "Email verified successfully. Please log in.",
            },
          });
        }, 5000);

        return () => clearInterval(timer);
      } else {
        setError(data.message || "Verification failed. Please try again.");
        setMessage("");
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        "An error occurred while verifying your email. Please try again."
      );
      setMessage("");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  const handleRetry = () => {
    setCountdown(5);
    verifyEmail();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl overflow-hidden">
            {/* Header Section */}
            <div className="relative p-8 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-center">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                {/* Brand Logo */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBolt className="text-white text-3xl" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-white mb-2"
                >
                  ByteThoughts
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-purple-100 text-lg font-semibold"
                >
                  Email Verification
                </motion.p>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="text-center">
                {/* Status Icon */}
                <motion.div
                  className="mb-6 flex justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                >
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl ${
                    isLoading 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500" 
                      : error 
                      ? "bg-gradient-to-br from-red-500 to-pink-500"
                      : "bg-gradient-to-br from-green-500 to-emerald-500"
                  }`}>
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, rotate: -90 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 90 }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Mail className="text-white text-2xl" />
                          </motion.div>
                        </motion.div>
                      ) : error ? (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <XCircle className="text-white text-2xl" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                        >
                          <CheckCircle2 className="text-white text-2xl" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Status Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                >
                  {isLoading
                    ? "Verifying Your Email"
                    : error
                    ? "Verification Failed"
                    : "Email Verified Successfully!"}
                </motion.h2>

                {/* Status Content */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  {isLoading ? (
                    <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                        Please wait while we verify your email address...
                      </p>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-block"
                      >
                        <Spinner size="lg" className="text-purple-600" />
                      </motion.div>
                    </div>
                  ) : error ? (
                    <Alert
                      color="failure"
                      className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <div className="flex items-center">
                        <XCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    </Alert>
                  ) : (
                    <>
                      <Alert
                        color="success"
                        className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                      >
                        <div className="flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          <span className="font-semibold">{message}</span>
                        </div>
                      </Alert>
                      
                      <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50">
                        <p className="text-gray-700 dark:text-gray-300 mb-3 font-semibold">
                          Redirecting to login in{" "}
                          <span className="text-2xl font-black text-purple-600">
                            {countdown}
                          </span>{" "}
                          seconds
                        </p>
                        <Progress
                          progress={((5 - countdown) / 5) * 100}
                          size="lg"
                          className="mb-2"
                          color="purple"
                        />
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="space-y-4"
                >
                  {error && (
                    <div className="flex flex-col space-y-3">
                      <motion.button
                        onClick={handleRetry}
                        disabled={isLoading}
                        className={`w-full relative overflow-hidden font-bold py-4 rounded-2xl shadow-xl transition-all duration-300 group ${
                          !isLoading
                            ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:shadow-2xl"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        {!isLoading && (
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                        <span className="relative flex items-center justify-center gap-2 text-lg">
                          {isLoading ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-5 h-5" />
                              Try Again
                            </>
                          )}
                        </span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => navigate("/signin")}
                        className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-4 rounded-2xl transition-all duration-300 border border-gray-200 dark:border-gray-600"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ArrowLeft className="w-5 h-5" />
                          Return to Login
                        </span>
                      </motion.button>
                    </div>
                  )}
                </motion.div>

                {/* Support Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-8 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      Need help? Contact our{" "}
                      <a
                        href="/support"
                        className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                      >
                        support team
                      </a>
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;