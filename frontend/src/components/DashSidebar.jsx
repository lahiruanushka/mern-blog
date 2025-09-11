import React, { useEffect, useState } from "react";
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
  HiX,
  HiSparkles,
  HiLightningBolt,
  HiPlus,
  HiCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiHome,
} from "react-icons/hi";
import { ShieldIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DashSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      width: isCollapsed ? "5rem" : "20rem",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        when: "beforeChildren",
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      width: isCollapsed ? "5rem" : "20rem",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        when: "afterChildren",
      },
    },
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  const [activeTab, setActiveTab] = useState("/dashboard");

  const handleSignout = async () => {
    console.log("Signing out...");
  };

  const location = useLocation();

  const NavItem = ({ to, icon: Icon, label, badge }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        onClick={() => {
          setActiveTab(to);
          if (window.innerWidth < 768) onClose?.();
        }}
        className="w-full group block"
        title={isCollapsed ? label : ""}
      >
        <div
          className={`
            flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl
            transition-all duration-300 transform
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white shadow-lg scale-105"
                : "text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/50 hover:scale-102"
            }
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <div
            className={`
            p-2 rounded-xl transition-all duration-300 flex-shrink-0
            ${
              isActive
                ? "bg-white/20 shadow-md"
                : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
            }
          `}
          >
            <Icon className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <>
              <span className="font-semibold flex-1 text-left truncate">
                {label}
              </span>
              {badge && (
                <div
                  className={`
                  px-2 py-1 rounded-full text-xs font-bold flex-shrink-0
                  ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  }
                `}
                >
                  {badge}
                </div>
              )}
            </>
          )}
          {isActive && !isCollapsed && (
            <div className="w-1 h-8 bg-white rounded-full opacity-80" />
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {/* Custom CSS for gradient scrollbar - only when expanded */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: ${isCollapsed ? "0px" : "8px"};
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #4f46e5, #7c3aed, #db2777);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: ${isCollapsed ? "none" : "thin"};
          scrollbar-color: #6366f1 transparent;
        }
      `}</style>

      <AnimatePresence>
        <motion.aside
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed top-0 left-0 bottom-0 z-40 md:top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-white/20 dark:border-gray-800/50"
        >
          <div className="flex flex-col h-full relative">
            {/* Centered Collapse Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleCollapse}
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-600 hover:via-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiOutlineChevronLeft className="w-5 h-5" />
              </motion.div>
            </motion.button>

            {/* Header */}
            <div className="flex items-center justify-between p-4">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <ShieldIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Dashboard
                    </h2>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Navigation Items with Custom Scrollbar */}
            <nav
              className={`flex-1 overflow-y-auto py-6 px-2 space-y-2 ${
                !isCollapsed ? "custom-scrollbar" : ""
              }`}
            >
              {/* Main Dashboard */}
              {currentUser?.isAdmin && (
                <motion.div
                  className="mb-6"
                  initial="closed"
                  animate={isOpen ? "open" : "closed"}
                  variants={contentVariants}
                >
                  {!isCollapsed && (
                    <motion.div
                      className="px-4 mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"></div>
                        Overview
                      </h3>
                    </motion.div>
                  )}
                  <NavItem
                    to="/dashboard"
                    icon={HiChartPie}
                    label="Dashboard"
                    badge="New"
                  />
                </motion.div>
              )}

              {/* Admin Section */}
              {currentUser?.isAdmin && (
                <>
                  <motion.div
                    className="mb-6"
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={contentVariants}
                  >
                    {!isCollapsed && (
                      <motion.div
                        className="px-4 mb-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                          Content Management
                        </h3>
                      </motion.div>
                    )}
                    <div className="space-y-1">
                      <NavItem
                        to="/dashboard/posts"
                        icon={HiDocumentText}
                        label="Posts"
                      />
                      <NavItem
                        to="/dashboard/categories"
                        icon={HiOutlineTag}
                        label="Categories"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={contentVariants}
                  >
                    {!isCollapsed && (
                      <motion.div
                        className="px-4 mb-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full"></div>
                          Community
                        </h3>
                      </motion.div>
                    )}
                    <div className="space-y-1">
                      <NavItem
                        to="/dashboard/users"
                        icon={HiOutlineUserGroup}
                        label="Users"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className="mb-6"
                    initial="closed"
                    animate={isOpen ? "open" : "closed"}
                    variants={contentVariants}
                  >
                    {!isCollapsed && (
                      <motion.div
                        className="px-4 mb-3"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
                          System
                        </h3>
                      </motion.div>
                    )}
                    <NavItem
                      to="/dashboard/settings"
                      icon={HiCog}
                      label="Settings"
                    />
                  </motion.div>
                </>
              )}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
                      <div className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        42
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Posts
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                      <div className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        1.2K
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Users
                      </div>
                    </div>
                    <div className="text-center p-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-xl border border-orange-200/50 dark:border-orange-800/50">
                      <div className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                        89%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Uptime
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Back to Blog Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className={`flex items-center gap-3 w-full px-4 py-3 mb-2 text-indigo-600 dark:text-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 rounded-2xl transition-all duration-300 group transform hover:shadow-lg border border-transparent hover:border-indigo-200/50 dark:hover:border-indigo-800/50 ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Back to Blog" : ""}
              >
                <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl group-hover:from-indigo-200 group-hover:to-purple-200 dark:group-hover:from-indigo-900/50 dark:group-hover:to-purple-900/50 transition-all duration-300 shadow-sm">
                  <HiHome className="w-5 h-5 " />
                </div>
                {!isCollapsed && (
                  <span className="font-semibold">Back to Blog</span>
                )}
              </motion.button>

              {/* Sign Out Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignout}
                className={`flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/50 dark:hover:to-pink-950/50 rounded-2xl transition-all duration-300 group transform hover:shadow-lg border border-transparent hover:border-red-200/50 dark:hover:border-red-800/50 ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Sign Out" : ""}
              >
                <div className="p-2 bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-950/50 dark:to-pink-950/50 rounded-xl group-hover:from-red-200 group-hover:to-pink-200 dark:group-hover:from-red-900/50 dark:group-hover:to-pink-900/50 transition-all duration-300 shadow-sm">
                  <HiArrowSmRight className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="font-semibold">Sign Out</span>
                )}
              </motion.button>

              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 text-center"
                >
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    ByteThoughts Dashboard
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      v2.0 • Online
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default DashSidebar;
