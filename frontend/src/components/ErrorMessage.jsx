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

export const ErrorMessage = ({
  error = "Something went wrong",
  onRetry,
  showHomeButton = true,
  showBackButton = false,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setTimeout(() => setIsRetrying(false), 1000);
      }
    } else {
      setIsRetrying(true);
      setTimeout(() => {
        setIsRetrying(false);
        window.location.reload();
      }, 1000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 dark:from-slate-900 dark:via-slate-800 dark:to-red-950/50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[size:20px_20px] opacity-50" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-lg w-full"
      >
        {/* Main Error Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-500/10 to-red-500/10 rounded-full blur-2xl" />

          <div className="relative p-8 text-center">
            {/* Animated Icon */}
            <motion.div variants={itemVariants} className="mb-8">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="relative inline-block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                {/* Warning indicator */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Error Content */}
            <motion.div variants={itemVariants} className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Oops! Something went wrong
              </h2>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800/30 mb-6">
                <p className="text-red-700 dark:text-red-300 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Don't worry, these things happen. We've been notified and are
                working on it.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                disabled={isRetrying}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5" />
                )}
                <span>{isRetrying ? "Retrying..." : "Try Again"}</span>
              </motion.button>

              <div className="flex gap-3">
                {showBackButton && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.history.back()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </motion.button>
                )}

                {showHomeButton && (
                  <Link
                    to="/"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ErrorMessage;
