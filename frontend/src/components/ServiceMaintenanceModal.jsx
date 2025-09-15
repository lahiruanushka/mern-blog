import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  Wrench,
  Clock,
  Coffee,
  Zap,
  Shield,
  Heart,
  MessageCircle,
  X,
} from "lucide-react";

const ServiceMaintenanceModal = ({
  isOpen,
  onClose,
  estimatedTime = "2 hours",
  message = "We're making some improvements to serve you better!",
  showSocialLinks = true,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 30,
    seconds: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Handle modal visibility
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleOverlayClick}
      style={{
        animation: isOpen ? "fadeIn 0.2s ease-out" : "fadeOut 0.2s ease-in",
      }}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Modal Card */}
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-lg transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/10 to-blue-500/10 rounded-full blur-2xl" />

          <div className="relative p-6 lg:p-10 text-center">
            {/* Animated Icon */}
            <div className="mb-6">
              <div className="relative inline-block animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Wrench className="w-10 h-10 text-white animate-pulse" />
                </div>
                {/* Progress indicator */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div
              className="mb-8 animate-slideUp"
              style={{ animationDelay: "0.1s" }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Service Maintenance
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 leading-relaxed max-w-lg mx-auto">
                {message}
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                <Clock className="w-4 h-4" />
                Estimated time: {estimatedTime}
              </div>
            </div>

            {/* Countdown Timer */}
            <div
              className="mb-8 animate-slideUp"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {[
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((time, index) => (
                  <div
                    key={time.label}
                    className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50 shadow-lg hover:shadow-xl transition-shadow duration-200"
                  >
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                      {String(time.value).padStart(2, "0")}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                      {time.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Updates */}
            <div
              className="mb-6 animate-slideUp"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="grid md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-green-800 dark:text-green-300 text-sm">
                      Security
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      Enhanced
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-blue-800 dark:text-blue-300 text-sm">
                      Performance
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      Optimizing
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-purple-800 dark:text-purple-300 text-sm">
                      Experience
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      Improving
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className="space-y-3 animate-slideUp"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Page
                </button>

                {showSocialLinks && (
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Get Updates
                  </button>
                )}
              </div>

              {/* Fun message */}
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                <Coffee className="w-4 h-4" />
                <span>Perfect time for a coffee break!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default ServiceMaintenanceModal;
