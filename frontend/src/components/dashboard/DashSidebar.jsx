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
  HiMenu,
  HiArrowSmLeft,
} from "react-icons/hi";
import {
  ShieldIcon,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashSidebar.css";

const DashSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      width: isCollapsed ? "5rem" : "18rem",
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
      width: isCollapsed ? "5rem" : "18rem",
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
        <motion.div
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative flex items-center gap-3 px-3 py-3 mx-3 my-1 rounded-xl
            transition-all duration-300
            ${
              isActive
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/80"
            }
            ${isCollapsed ? "justify-center px-0" : ""}
          `}
        >
          {/* Icon */}
          <Icon
            className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
              isActive ? "drop-shadow-sm" : ""
            }`}
          />

          {/* Label */}
          {!isCollapsed && (
            <span
              className={`font-medium flex-1 text-sm transition-all duration-300 ${
                isActive ? "drop-shadow-sm" : ""
              }`}
            >
              {label}
            </span>
          )}

          {/* Badge */}
          {!isCollapsed && badge && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`
                px-2 py-0.5 rounded-lg text-xs font-bold flex-shrink-0
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                }
              `}
            >
              {badge}
            </motion.span>
          )}

          {/* Active Indicator */}
          {isActive && (
            <motion.div
              layoutId={isCollapsed ? "collapsedActive" : "expandedActive"}
              className={`absolute ${
                isCollapsed
                  ? "right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full"
                  : "left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
              } bg-white`}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    );
  };

  return (
    <>
      {/* Custom CSS moved to DashSidebar.css */}

      <AnimatePresence>
        <motion.aside
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={sidebarVariants}
          className="fixed top-0 left-0 bottom-0 z-40 md:top-16 bg-white dark:bg-gray-900 shadow-xl border-r border-gray-200 dark:border-gray-800 transition-colors duration-300"
        >
          <div className="flex flex-col h-full">
            {/* Toggle Button */}
            <div className="relative flex items-center justify-end p-3 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleCollapse}
                className="p-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 hover:from-indigo-50 hover:to-purple-50 dark:from-gray-800 dark:to-gray-700 dark:hover:from-indigo-950/50 dark:hover:to-purple-950/50 text-gray-700 dark:text-gray-300 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <motion.div
                  animate={{ rotate: isCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>

            {/* Navigation Items with Custom Scrollbar */}
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
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
                      className="px-6 mb-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                        Overview
                      </h3>
                    </motion.div>
                  )}
                  <NavItem
                    to="/dashboard"
                    icon={HiChartPie}
                    label="Dashboard"
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
                        className="px-6 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                          Content
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
                        className="px-6 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
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
                        className="px-6 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
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
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
              {/* Back to Blog Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className={`flex items-center gap-3 w-full px-3 py-2.5 mb-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-xl transition-all duration-300 group ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Back to Blog" : ""}
              >
                <HiHome className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Back to Blog</span>
                )}
              </motion.button>

              {/* Sign Out Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignout}
                className={`flex items-center gap-3 w-full px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-300 group ${
                  isCollapsed ? "justify-center" : ""
                }`}
                title={isCollapsed ? "Sign Out" : ""}
              >
                <HiArrowSmLeft className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium text-sm">Sign Out</span>
                )}
              </motion.button>
            </div>
          </div>
        </motion.aside>
      </AnimatePresence>
    </>
  );
};

export default DashSidebar;
