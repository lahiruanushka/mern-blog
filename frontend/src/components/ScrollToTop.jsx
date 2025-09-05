import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronUp, HiSparkles } from "react-icons/hi";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Show button when page is scrolled up to given distance and calculate scroll progress
  const toggleVisibility = () => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    setScrollProgress(progress);
    
    if (scrollTop > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top with smooth animation
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.3,
      y: 100,
      rotate: -180,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.3,
      y: 100,
      rotate: 180,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.1,
      y: -5,
      rotate: [0, -5, 5, 0],
      transition: {
        scale: { duration: 0.2 },
        y: { duration: 0.2 },
        rotate: { 
          duration: 0.6,
          ease: "easeInOut",
        },
      },
    },
    tap: {
      scale: 0.9,
      transition: { duration: 0.1 },
    },
  };

  const iconVariants = {
    rest: { y: 0 },
    hover: {
      y: [-2, -4, -2],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const sparkleVariants = {
    rest: { opacity: 0, scale: 0, rotate: 0 },
    hover: {
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          whileHover="hover"
          whileTap="tap"
        >
          {/* Gradient background blur effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
          
          {/* Progress ring */}
          <div className="absolute inset-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              {/* Background circle */}
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={176} // 2 * π * 28 ≈ 176
                strokeDashoffset={176 - (176 * scrollProgress) / 100}
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Main button */}
          <motion.button
            onClick={scrollToTop}
            className="group relative w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 hover:shadow-3xl transition-all duration-500 overflow-hidden"
            aria-label="Scroll to top"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-600/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-600/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-2xl" />
            
            {/* Sparkle decorations */}
            <motion.div
              variants={sparkleVariants}
              className="absolute -top-1 -right-1 text-yellow-400"
            >
              <HiSparkles className="w-4 h-4" />
            </motion.div>
            
            <motion.div
              variants={sparkleVariants}
              className="absolute -bottom-1 -left-1 text-pink-400"
              style={{ animationDelay: "0.5s" }}
            >
              <HiSparkles className="w-3 h-3" />
            </motion.div>

            {/* Main icon with enhanced animations */}
            <motion.div
              variants={iconVariants}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                
                {/* Main icon */}
                <HiOutlineChevronUp className="relative w-8 h-8 text-gray-700 dark:text-gray-200 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300 drop-shadow-lg" />
              </div>
            </motion.div>

            {/* Ripple effect on click */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 opacity-0 group-active:opacity-20 transition-opacity duration-150" />
            </div>
          </motion.button>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${20 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            whileHover={{ opacity: 1, x: 0, scale: 1 }}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-sm font-medium rounded-xl shadow-xl backdrop-blur-sm border border-gray-700/20 dark:border-gray-200/20 whitespace-nowrap pointer-events-none"
          >
            Back to top
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900/90 dark:border-l-white/90 border-y-4 border-y-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;