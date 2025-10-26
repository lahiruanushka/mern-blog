import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiClock, 
  HiSparkles, 
  HiLightningBolt,
  HiBell
} from 'react-icons/hi';
import { Rocket, Construction, Zap } from 'lucide-react';

const ComingSoonModal = ({ 
  isOpen, 
  onClose, 
  featureName = "This feature",
  message = "We're working hard to bring you this feature. Stay tuned!"
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="relative w-full max-w-md pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl" />
              
              {/* Modal Content */}
              <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full -translate-y-20 translate-x-20 blur-3xl animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500 to-orange-500 rounded-full translate-y-20 -translate-x-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                >
                  <HiX className="w-5 h-5 text-gray-600 dark:text-gray-300 transition-colors duration-300" />
                </motion.button>

                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Animated Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.1 
                    }}
                    className="relative mx-auto w-24 h-24 mb-6"
                  >
                    {/* Rotating Ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 blur-sm"
                    />
                    
                    {/* Icon Container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                      <motion.div
                        animate={{ 
                          y: [0, -8, 0],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Rocket className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Sparkles */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <HiSparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        delay: 0.5
                      }}
                      className="absolute -bottom-2 -left-2"
                    >
                      <Zap className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-black text-gray-900 dark:text-white mb-3 transition-colors duration-300"
                  >
                    Coming Soon!
                  </motion.h2>

                  {/* Feature Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-4"
                  >
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-2xl border border-indigo-200 dark:border-indigo-800 transition-all duration-300">
                      <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        {featureName}
                      </span>
                    </span>
                  </motion.div>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-6 transition-colors duration-300"
                  >
                    {message}
                  </motion.p>

                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="mb-8 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                      <Construction className="w-4 h-4 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" />
                      <span className="font-semibold">Currently in development</span>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Got it!
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl border border-gray-300 dark:border-gray-700 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <HiBell className="w-5 h-5" />
                      Notify Me
                    </motion.button>
                  </motion.div>

                  {/* Footer Note */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 text-xs text-gray-500 dark:text-gray-500 flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <HiClock className="w-4 h-4" />
                    We'll let you know when it's ready
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ComingSoonModal;