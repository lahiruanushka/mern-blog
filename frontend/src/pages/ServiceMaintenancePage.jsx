import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wrench,
  Clock,
  Coffee,
  Zap,
  Shield,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const ServiceMaintenancePage = ({
  estimatedTime = "2 hours",
  message = "We're making some improvements to serve you better!",
  showSocialLinks = true,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[size:20px_20px] opacity-30" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-2xl w-full"
      >
        {/* Main Maintenance Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />

          <div className="relative p-8 lg:p-12 text-center">
            {/* Animated Icon */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="relative inline-block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Wrench className="w-12 h-12 text-white" />
                </div>
                {/* Progress indicator */}
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
                </div>
              </motion.div>
            </motion.div>

            {/* Content */}
            <motion.div variants={itemVariants} className="mb-10">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                We'll be back soon!
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed max-w-xl mx-auto">
                {message}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4" />
                Estimated time: {estimatedTime}
              </div>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div variants={itemVariants} className="mb-10">
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {[
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((time, index) => (
                  <div
                    key={time.label}
                    className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50 shadow-lg"
                  >
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                      {String(time.value).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {time.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Status Updates */}
            <motion.div variants={itemVariants} className="mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800/30">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-800 dark:text-green-300">
                      Security
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Enhanced
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-800 dark:text-blue-300">
                      Performance
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Optimizing
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-800 dark:text-purple-300">
                      Experience
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400">
                      Improving
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  Refresh Page
                </motion.button>

                {showSocialLinks && (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get Updates
                  </motion.a>
                )}
              </div>

              {/* Fun message */}
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                <Coffee className="w-5 h-5" />
                <span>Perfect time for a coffee break!</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceMaintenancePage;
