import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { signoutSuccess } from "../features/user/userSlice";
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
} from "react-icons/hi";

const DashSidebar = ({ isOpen, isCollapsed, onToggleCollapse, onClose }) => {
  const sidebarVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      width: isCollapsed ? '5rem' : '20rem',
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        when: 'beforeChildren'
      }
    },
    closed: { 
      x: '-100%', 
      opacity: 0,
      width: isCollapsed ? '5rem' : '20rem',
      transition: { 
        type: 'spring', 
        stiffness: 400, 
        damping: 40,
        when: 'afterChildren'
      }
    }
  };
  
  const contentVariants = {
    open: { 
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    },
    closed: { 
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const NavItem = ({ to, icon: Icon, label, badge }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className="w-full group"
        onClick={() => {
          if (window.innerWidth < 768) onClose?.();
        }}
        title={isCollapsed ? label : ''}
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
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <div className={`
            p-2 rounded-xl transition-all duration-300 flex-shrink-0
            ${
              isActive 
                ? "bg-white/20 shadow-md" 
                : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
            }
          `}>
            <Icon className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <>
              <span className="font-semibold flex-1 text-left truncate">{label}</span>
              {badge && (
                <div className={`
                  px-2 py-1 rounded-full text-xs font-bold flex-shrink-0
                  ${
                    isActive 
                      ? "bg-white/20 text-white" 
                      : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  }
                `}>
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
    <AnimatePresence>
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed top-0 left-0 bottom-0 z-40 md:top-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-r border-white/20 dark:border-gray-800/50"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && (
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Dashboard
              </h2>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiOutlineChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiOutlineChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </motion.div>
              )}
            </motion.button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-6 px-2 space-y-2">
            {/* Main Dashboard */}
            {currentUser?.isAdmin && (
              <motion.div 
                className="mb-6"
                initial="closed"
                animate={isOpen ? "open" : "closed"}
                variants={contentVariants}
              >
                {!isCollapsed && (
                  <div className="px-4 mb-3">
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Overview
                    </h3>
                  </div>
                )}
                <NavItem
                  to="/dashboard/dash"
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
                    <div className="px-4 mb-3">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Content Management
                      </h3>
                    </div>
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
                    <div className="px-4 mb-3">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Community
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1">
                    <NavItem
                      to="/dashboard/users"
                      icon={HiOutlineUserGroup}
                      label="Users"
                    />
                    <NavItem
                      to="/dashboard/comments"
                      icon={HiAnnotation}
                      label="Comments"
                      badge="3"
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
                    <div className="px-4 mb-3">
                      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        System
                      </h3>
                    </div>
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
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl">
                  <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">42</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Posts</div>
                </div>
                <div className="text-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-xl">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">1.2K</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Users</div>
                </div>
                <div className="text-center p-2 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50 rounded-xl">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">89%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            )}

            {/* Sign Out Button */}
            <button
              onClick={handleSignout}
              className={`flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-2xl transition-all duration-300 group transform hover:scale-105 ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title={isCollapsed ? 'Sign Out' : ''}
            >
              <div className="p-2 bg-red-100 dark:bg-red-950/50 rounded-xl group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                <HiArrowSmRight className="w-5 h-5" />
              </div>
              {!isCollapsed && <span className="font-semibold">Sign Out</span>}
            </button>

            {!isCollapsed && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  ByteThoughts Dashboard v2.0
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  © 2024 All rights reserved
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};

export default DashSidebar;
