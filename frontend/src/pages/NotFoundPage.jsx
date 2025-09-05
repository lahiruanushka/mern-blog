import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HiHome, HiArrowLeft, HiSparkles } from "react-icons/hi";

// NotFoundPage Component
const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full opacity-10 blur-3xl"
          animate={{
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
          }}
          style={{ left: "10%", top: "20%" }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-400 to-orange-500 rounded-full opacity-10 blur-3xl"
          animate={{
            x: mousePosition.x * -0.02,
            y: mousePosition.y * -0.02,
          }}
          style={{ right: "10%", bottom: "20%" }}
        />
      </div>

      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Floating 404 Number */}
          <motion.div
            className="relative mb-8"
            variants={floatingVariants}
            animate="animate"
          >
            <motion.h1
              className="text-9xl md:text-[12rem] lg:text-[15rem] font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none"
              variants={itemVariants}
            >
              404
            </motion.h1>

            {/* Decorative elements around 404 */}
            <motion.div
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-30"
              animate={{
                scale: [1, 0.8, 1],
                rotate: [0, -180, -360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Error Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="inline-flex items-center px-6 py-3 
                         bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 
                         border border-indigo-500/20 rounded-full mb-6 backdrop-blur-sm"
            >
              <HiSparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Oops! Page Not Found
              </span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800 dark:text-gray-100 leading-tight">
              Lost in the{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Digital
              </span>{" "}
              Void
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed max-w-3xl mx-auto">
              The page you're looking for seems to have wandered off into the
              bytes...
            </p>

            <p className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto">
              Don't worry though! Every great journey starts with a single step
              back to familiar territory.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)",
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl"
              onClick={() => (window.location.href = "/")}
            >
              <span className="relative z-10 flex items-center justify-center">
                <HiHome className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Return Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-xl backdrop-blur-sm"
              onClick={() => window.history.back()}
            >
              <span className="flex items-center justify-center">
                <HiArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                Go Back
              </span>
            </motion.button>
          </motion.div>

          {/* Decorative Code Block */}
          <motion.div
            variants={itemVariants}
            className="mt-16 max-w-md mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur-xl opacity-20" />
              <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                <div className="flex items-center mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full" />
                    <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                  </div>
                </div>
                <div className="text-left font-mono text-sm space-y-2">
                  <div className="text-purple-600 dark:text-purple-400">
                    if (page.exists()) {"{"}
                  </div>
                  <div className="pl-4 text-gray-600 dark:text-gray-400">
                    return &lt;Content /&gt;;
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">
                    {"}"} else {"{"}
                  </div>
                  <div className="pl-4 text-orange-600 dark:text-orange-400">
                    return &lt;NotFound /&gt;;
                  </div>
                  <div className="text-purple-600 dark:text-purple-400">
                    {"}"}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
