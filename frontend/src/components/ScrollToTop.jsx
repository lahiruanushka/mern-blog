import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronUp } from "react-icons/hi";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{
            opacity: 0,
            scale: 0.5,
            y: 50,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20,
            },
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
            y: 50,
            transition: {
              duration: 0.2,
            },
          }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-teal-500 text-white 
          p-3 rounded-full shadow-lg hover:bg-teal-600 
          focus:outline-none focus:ring-2 focus:ring-teal-500 
          focus:ring-offset-2 transition-all duration-300 
          dark:bg-teal-600 dark:hover:bg-teal-700"
          aria-label="Scroll to top"
        >
          <HiOutlineChevronUp className="h-6 w-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
