import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Key,
  Eye,
  EyeOff,
  X,
  UserCheck,
  Crown,
  Globe,
  Lock,
  Loader,
  Settings
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import zxcvbn from "zxcvbn";

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  // Error and success states
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isOpen || !userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/user/getuser/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        showToast("Failed to load user details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isOpen, userId, showToast]);

  // Auto-clear alerts after 5 seconds
  useEffect(() => {
    let errorTimer, successTimer;

    if (updateUserError) {
      errorTimer = setTimeout(() => {
        setUpdateUserError(null);
      }, 5000);
    }

    if (updateUserSuccess) {
      successTimer = setTimeout(() => {
        setUpdateUserSuccess(null);
      }, 5000);
    }

    return () => {
      if (errorTimer) clearTimeout(errorTimer);
      if (successTimer) clearTimeout(successTimer);
    };
  }, [updateUserError, updateUserSuccess]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  // Comprehensive password validation
  const validatePasswords = () => {
    const errors = [];

    if (currentPassword.length < 6) {
      errors.push("Current password is too short");
    }

    const passwordStrength = zxcvbn(newPassword);

    if (newPassword !== confirmPassword) {
      errors.push("New passwords do not match");
    }

    if (passwordStrength.score < 3) {
      errors.push(
        passwordStrength.feedback.warning || "Password is not strong enough"
      );

      if (passwordStrength.feedback.suggestions.length > 0) {
        errors.push(
          "Suggestions: " + passwordStrength.feedback.suggestions.join(". ")
        );
      }
    }

    return errors;
  };

  const handleRequestOTP = async () => {
    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setUpdateUserError(validationErrors[0]);
      return;
    }

    setIsRequestingOTP(true);
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    try {
      const res = await fetch("/api/user/request-password-update-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setUpdateUserSuccess("OTP sent to your email");
      } else {
        setUpdateUserError(data.message);
      }
    } catch (error) {
      setUpdateUserError(error.message);
    } finally {
      setIsRequestingOTP(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setUpdateUserError(validationErrors[0]);
      return;
    }

    setIsUpdatingPassword(true);
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    try {
      const res = await fetch("/api/user/update-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setUpdateUserSuccess("Password updated successfully");
        setPasswordUpdateSuccess(true);
        resetPasswordForm();
      } else {
        setUpdateUserError(data.message);
      }
    } catch (error) {
      setUpdateUserError(error.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordUpdateMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpSent(false);
    setPasswordUpdateSuccess(false);
  };


  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: "None", color: "text-slate-400" };
    
    const result = zxcvbn(password);
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColors = [
      "text-red-500",
      "text-orange-500", 
      "text-yellow-500",
      "text-blue-500",
      "text-green-500"
    ];

    return {
      score: result.score,
      label: strengthLabels[result.score],
      color: strengthColors[result.score]
    };
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    User Profile Details
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    Comprehensive user information and settings
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gradient-to-r from-blue-500 to-purple-500 border-t-transparent"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-md"></div>
                  </div>
                  <p className="mt-6 text-slate-600 dark:text-slate-400 text-lg">
                    Loading user details...
                  </p>
                </div>
              ) : userData ? (
                <motion.div
                  variants={itemVariants}
                  className="space-y-8"
                >
                  {/* Profile Header */}
                  <motion.div variants={itemVariants}>
                    <div className="relative p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl border border-blue-200 dark:border-blue-800/30">
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative">
                          <img
                            src={userData.profilePicture || `https://ui-avatars.com/api/?name=${userData.username}&background=random`}
                            alt={userData.username}
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-white dark:ring-slate-700 shadow-xl"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 ${userData.accountStatus === "active" ? "bg-green-500" : "bg-red-500"}`}></div>
                          {userData.isAdmin && (
                            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="text-center sm:text-left flex-1">
                          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                            {userData.username}
                          </h3>
                          <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{userData.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Joined {new Date(userData.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className={`px-4 py-2 rounded-xl font-semibold ${userData.accountStatus === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"}`}>
                            {userData.accountStatus === "active" ? "Active Account" : "Inactive"}
                          </span>
                          {userData.isAdmin && (
                            <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-700 dark:text-yellow-300 rounded-xl font-semibold">
                              Administrator
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Information Cards Grid */}
                  <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Account Information */}
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-6 border border-white/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                            Account Information
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Account Status</span>
                            <div className="flex items-center gap-2">
                              {userData.accountStatus === "active" ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`font-semibold ${userData.accountStatus === "active" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                {userData.accountStatus}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">User Type</span>
                            <div className="flex items-center gap-2">
                              {userData.isAdmin ? (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <User className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {userData.isAdmin ? "Administrator" : "Standard User"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Created</span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                              {formatDate(userData.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Security Information */}
                      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-6 border border-white/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                            Security Settings
                          </h4>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Authentication</span>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-blue-500" />
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {userData.authProvider || "Local"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-600 dark:text-slate-400">Two-Factor Auth</span>
                            <div className="flex items-center gap-2">
                              {userData.securitySettings?.twoFactorEnabled ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`font-semibold ${userData.securitySettings?.twoFactorEnabled ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                {userData.securitySettings?.twoFactorEnabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Activity & Statistics */}
                  <motion.div variants={itemVariants}>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-800/30">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                          <Settings className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                          Additional Information
                        </h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {userData.postsCount || 0}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Posts Created</p>
                        </div>
                        
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {userData.commentsCount || 0}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Comments Made</p>
                        </div>
                        
                        <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">
                            {userData.lastLoginDays || "N/A"}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Days Since Login</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    No User Data Available
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
                    We couldn't load the user information. Please try again or contact support if the issue persists.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDetailsModal;
                                 