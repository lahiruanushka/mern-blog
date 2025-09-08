import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signoutSuccess } from "../features/user/userSlice";
import { toggleTheme } from "../features/theme/themeSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
  HiOutlineTag,
  HiOutlineDocumentText,
  HiArrowNarrowUp,
  HiSparkles,
  HiTrendingUp,
  HiEye,
  HiHeart,
  HiChat,
  HiMenu,
  HiX,
  HiLightningBolt,
  HiSun,
  HiMoon,
  HiGlobe,
  HiArrowSmLeft,
} from "react-icons/hi";
import { Bell, LogOut, ShieldIcon, UserCircle2 } from "lucide-react";
import { Menu } from "lucide-react";
import { Avatar, Dropdown } from "flowbite-react";
import { FaBolt } from "react-icons/fa";

const AdminHeader = ({ onMenuClick, sidebarOpen }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-800/50 hover:from-indigo-500/20 hover:to-purple-500/20 transition-all duration-300"
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {sidebarOpen ? (
                  <HiX className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <HiMenu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                )}
              </motion.div>
            </motion.button>

            <motion.div
              className="flex items-center space-x-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                to="/dashboard"
                className="group flex items-center space-x-3 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
              >
                <div className="relative">
                  {/* Animated background glow */}
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaBolt className="text-white text-xl drop-shadow-lg" />
                    </motion.div>

                    {/* Sparkle effects */}
                    <motion.div
                      className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: 0.5,
                      }}
                    />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <motion.h1
                    className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                    whileHover={{ scale: 1.05 }}
                  >
                    ByteThoughts
                  </motion.h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                    Admin Dashboard
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleTheme())}
              className="relative p-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/50 dark:border-yellow-800/50 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <motion.div
                animate={{ rotate: theme === "dark" ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === "dark" ? (
                  <HiSun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <HiMoon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                )}
              </motion.div>
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-800/50 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
            </motion.button>

            {/* User Profile */}
            {currentUser ? (
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <motion.div
                    className="relative cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Avatar
                      alt="user"
                      img={currentUser.profilePicture || defaultAvatar}
                      rounded
                      size="sm"
                      className="ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-purple-500 transition-all duration-300 shadow-lg"
                    />
                    <motion.div
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                }
              >
                <Dropdown.Header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
                  <span className="block text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    @{currentUser.username}
                  </span>
                  <span className="block text-sm text-gray-500 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </span>
                </Dropdown.Header>

                <Dropdown.Item
                  onClick={() => navigate(`/user/${currentUser?._id || ""}`)}
                  className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4" />
                    Profile
                  </span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleSignout}
                  className="text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </span>
                </Dropdown.Item>
              </Dropdown>
            ) : null}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default AdminHeader;
