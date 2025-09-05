import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiHome,
  HiArrowLeft,
  HiSparkles,
  HiLightningBolt,
  HiMenu,
  HiX,
  HiUser,
  HiDocument,
  HiUsers,
  HiChat,
  HiCollection,
  HiChartBar,
  HiPlusCircle,
  HiPencil,
  HiCog,
  HiLogout,
} from "react-icons/hi";

const DashboardPage = ({
  currentUser = { isAdmin: true, name: "John Doe" },
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: HiChartBar,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "profile",
      label: "Profile",
      icon: HiUser,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "posts",
      label: "Posts",
      icon: HiDocument,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "create-post",
      label: "Create Post",
      icon: HiPlusCircle,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "users",
      label: "Users",
      icon: HiUsers,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: "comments",
      label: "Comments",
      icon: HiChat,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: "categories",
      label: "Categories",
      icon: HiCollection,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    {
      label: "Total Posts",
      value: "127",
      icon: HiDocument,
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
    },
    {
      label: "Active Users",
      value: "2.4K",
      icon: HiUsers,
      color: "from-green-500 to-emerald-500",
      change: "+18%",
    },
    {
      label: "Comments",
      value: "856",
      icon: HiChat,
      color: "from-purple-500 to-pink-500",
      change: "+7%",
    },
    {
      label: "Categories",
      value: "24",
      icon: HiCollection,
      color: "from-orange-500 to-red-500",
      change: "+3%",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full opacity-5 blur-3xl"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          style={{ left: "10%", top: "20%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full opacity-5 blur-3xl"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          style={{ right: "10%", bottom: "20%" }}
        />
      </div>

      {/* Mobile Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden relative z-50 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/20"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <HiLightningBolt className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <HiMenu className="w-6 h-6" />
        </motion.button>
      </motion.div>

      <div className="flex relative">
        {/* Enhanced Sidebar */}
        <AnimatePresence>
          {(isSidebarOpen || window.innerWidth >= 768) && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${
                isSidebarOpen ? "fixed" : "hidden md:block"
              } top-0 left-0 h-screen w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-white/20 dark:border-gray-700/20 z-50 overflow-y-auto`}
            >
              {/* Sidebar Header */}
              <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <HiLightningBolt className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ByteThoughts
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Admin Panel
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* User Profile Section */}
              <div className="p-6 border-b border-white/20 dark:border-gray-700/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <HiUser className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {currentUser.name}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">
                      {currentUser.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="p-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 group ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${
                        activeTab === item.id
                          ? "bg-white/20"
                          : `bg-gradient-to-r ${item.color} text-white group-hover:scale-110 transition-transform`
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}

                {/* Logout Button */}
                <motion.button
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: menuItems.length * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 group hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 mt-4"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white group-hover:scale-110 transition-transform">
                    <HiLogout className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Logout</span>
                </motion.button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay */}
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <motion.main
          className="flex-1 p-6 md:p-8 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Dashboard Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full"
              >
                <HiLightningBolt className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Admin Dashboard
                </span>
              </motion.div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Welcome Back, {currentUser.name}!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Here's what's happening with your content today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-purple-50/50 dark:from-gray-800/50 dark:to-purple-900/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`text-sm font-semibold px-3 py-1 rounded-full bg-gradient-to-r ${stat.color} text-white`}
                    >
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Content Area */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20"
          >
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <HiCog
                  className="w-12 h-12 text-white animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1).replace("-", " ")}{" "}
                Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                This is where your {activeTab} management interface would be
                rendered. The component system is ready to integrate with your
                existing dashboard components.
              </p>
            </div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default DashboardPage;
