import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";
import { HiUser, HiPencil, HiBookmark, HiHeart, HiLogin, HiX, HiSparkles } from "react-icons/hi";
import { Star, Sparkles, Lock, ArrowRight } from "lucide-react";

const LoginPrompt = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { 
        duration: 0.2 
      } 
    },
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9, 
      y: 50,
      rotateX: -15 
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 50,
      rotateX: 15,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
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

  // Enhanced features list with icons and descriptions
  const features = [
    {
      icon: HiBookmark,
      text: "Save articles to your personal collection",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      icon: HiHeart,
      text: "Like and engage with amazing content",
      gradient: "from-red-500 to-pink-600",
    },
    {
      icon: HiUser,
      text: "Access your personalized dashboard",
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  // Navigation handlers
  const handleSignIn = () => {
    onClose();
    navigate("/signin");
  };

  const handleRegister = () => {
    onClose();
    navigate("/signup");
  };

  const handleBackdropClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <AnimatePresence mode='wait'>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop with blur */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />
          
          {/* Modal container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* Modal Container */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
              className="relative max-w-md w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Card */}
              <motion.div 
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative bg-white/95 dark:bg-gray-900/95 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden w-full max-w-md"
              >
                
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />

                {/* Enhanced Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-800/70 transition-all duration-200 shadow-lg border border-white/10 dark:border-gray-700/30"
                >
                  <HiX className="w-5 h-5" />
                </motion.button>

                {/* Content */}
                <div className="relative z-10 p-8">
                  
                  {/* Enhanced Logo/Icon */}
                  <motion.div
                    variants={itemVariants}
                    className="flex justify-center mb-8"
                  >
                    <motion.div
                      variants={floatingVariants}
                      animate="animate"
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50"></div>
                      <div className="relative p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl">
                        <Lock className="w-10 h-10 text-white" />
                      </div>
                      {/* Floating sparkles */}
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Title */}
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent"
                  >
                    Join ByteThoughts
                  </motion.h2>

                  {/* Enhanced Description */}
                  <motion.p 
                    variants={itemVariants} 
                    className="text-center text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                  >
                    Unlock the full potential of our platform and join a community of curious minds sharing knowledge, one byte at a time.
                  </motion.p>

                  {/* Enhanced Features List */}
                  <motion.div variants={itemVariants} className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                        whileHover={{ x: 5, scale: 1.02 }}
                        className="group flex items-center gap-4 p-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/20 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-all duration-300 cursor-pointer"
                      >
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <motion.div variants={itemVariants} className="space-y-4">
                    
                    {/* Enhanced Sign In Button */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSignIn}
                      className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent"
                    >
                      <HiLogin className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Sign In to Continue</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>

                    {/* Enhanced Register Section */}
                    <motion.div 
                      className="text-center p-4 bg-gradient-to-r from-gray-50/50 to-indigo-50/50 dark:from-gray-800/50 dark:to-indigo-900/20 rounded-2xl border border-gray-100/50 dark:border-gray-700/50"
                      whileHover={{ scale: 1.01 }}
                    >
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        New to our community?
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRegister}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold rounded-xl border border-indigo-200 dark:border-indigo-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Star className="w-4 h-4" />
                        Create Free Account
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginPrompt;