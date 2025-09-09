import React from 'react';
import { motion } from 'framer-motion';
import { 
  Loader as LoaderIcon, 
  BookOpen, 
  Search, 
  User, 
  Settings, 
  Download, 
  Upload,
  RefreshCw,
  Zap,
  Heart,
  MessageCircle,
  Sparkles,
  Coffee,
  Clock
} from 'lucide-react';

const Loader = ({ 
  type = 'default', 
  size = 'medium', 
  message = 'Loading...', 
  submessage = '',
  fullScreen = false,
  variant = 'primary',
  showProgress = false,
  progress = 0
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-28 h-28',
    xlarge: 'w-36 h-36'
  };

  const containerSizes = {
    small: 'min-h-[200px]',
    medium: 'min-h-[calc(100vh-4rem)]',
    large: 'min-h-screen',
    xlarge: 'min-h-screen'
  };

  const variants = {
    primary: 'from-indigo-500 via-purple-600 to-pink-500',
    secondary: 'from-slate-500 via-slate-600 to-slate-700',
    success: 'from-emerald-500 via-green-600 to-teal-500',
    warning: 'from-yellow-500 via-orange-500 to-red-500',
    danger: 'from-red-500 via-rose-600 to-pink-500',
    info: 'from-cyan-500 via-blue-600 to-indigo-500'
  };

  const getIcon = (type) => {
    const icons = {
      default: LoaderIcon,
      posts: BookOpen,
      search: Search,
      user: User,
      settings: Settings,
      download: Download,
      upload: Upload,
      refresh: RefreshCw,
      processing: Zap,
      social: Heart,
      comments: MessageCircle
    };
    return icons[type] || icons.default;
  };

  const Icon = getIcon(type);

  // Enhanced spinning animation with multiple layers
  const primarySpinVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const secondarySpinVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Enhanced pulsing glow with multiple layers
  const glowVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.2, 0.8, 0.2],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const outerGlowVariants = {
    animate: {
      scale: [1, 1.5, 1],
      opacity: [0.1, 0.4, 0.1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  // Floating particles animation
  const particleVariants = {
    animate: (i) => ({
      y: [0, -30, 0],
      x: [0, Math.sin(i) * 10, 0],
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.3
      }
    })
  };

  // Enhanced bouncing dots with wave effect
  const dotVariants = {
    animate: (i) => ({
      y: [0, -25, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.15
      }
    })
  };

  // Container animation with spring
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Progress circle animation
  const progressVariants = {
    initial: { pathLength: 0 },
    animate: { 
      pathLength: progress / 100,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const LoaderContent = () => (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="text-center w-full flex flex-col items-center justify-center relative"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            custom={i}
            variants={particleVariants}
            animate="animate"
            className={`absolute w-2 h-2 bg-gradient-to-r ${variants[variant]} rounded-full blur-sm`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
          />
        ))}
      </div>

      {/* Main loader with enhanced effects */}
      <motion.div variants={itemVariants} className="relative mb-10">
        {/* Outer glow */}
        <motion.div
          variants={outerGlowVariants}
          animate="animate"
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${variants[variant]} opacity-10 blur-2xl ${sizeClasses[size]} transform scale-150`}
        />
        
        {/* Inner glow */}
        <motion.div
          variants={glowVariants}
          animate="animate"
          className={`absolute inset-0 rounded-full bg-gradient-to-r ${variants[variant]} opacity-30 blur-lg ${sizeClasses[size]}`}
        />
        
        {/* Outer spinning ring */}
        <motion.div
          variants={secondarySpinVariants}
          animate="animate"
          className={`absolute inset-0 border-4 border-transparent rounded-full ${sizeClasses[size]}`}
          style={{
            borderImage: `conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.3) 180deg, transparent 360deg) 1`
          }}
        />

        {/* Progress ring (if enabled) */}
        {showProgress && (
          <div className={`absolute inset-0 ${sizeClasses[size]}`}>
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                variants={progressVariants}
                initial="initial"
                animate="animate"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        
        {/* Main spinner */}
        <motion.div
          variants={primarySpinVariants}
          animate="animate"
          className={`relative bg-gradient-to-br ${variants[variant]} rounded-full flex items-center justify-center ${sizeClasses[size]} shadow-2xl border-2 border-white/20 backdrop-blur-sm`}
        >
          <Icon className={`text-white drop-shadow-lg ${
            size === 'small' ? 'w-6 h-6' : 
            size === 'medium' ? 'w-10 h-10' : 
            size === 'large' ? 'w-14 h-14' : 'w-18 h-18'
          }`} />
          
          {/* Inner sparkle */}
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-70"
          />
        </motion.div>

        {/* Progress percentage (if enabled) */}
        {showProgress && (
          <motion.div 
            variants={itemVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm drop-shadow-lg">
              {Math.round(progress)}%
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced text content */}
      <motion.div variants={itemVariants} className="space-y-4 max-w-md">
        <h2 className={`font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent ${
          size === 'small' ? 'text-xl' : 
          size === 'medium' ? 'text-2xl' : 
          size === 'large' ? 'text-3xl' : 'text-4xl'
        }`}>
          {message}
        </h2>
        
        {submessage && (
          <p className={`text-slate-600 dark:text-slate-400 leading-relaxed ${
            size === 'small' ? 'text-sm' : 
            size === 'medium' ? 'text-base' : 
            size === 'large' ? 'text-lg' : 'text-xl'
          }`}>
            {submessage}
          </p>
        )}

        {/* Enhanced animated dots with wave effect */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              custom={i}
              variants={dotVariants}
              animate="animate"
              className={`bg-gradient-to-r ${variants[variant]} rounded-full shadow-lg ${
                size === 'small' ? 'w-2 h-2' : 
                size === 'medium' ? 'w-3 h-3' : 'w-4 h-4'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800/95 dark:to-indigo-950/90 backdrop-blur-sm z-50">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[size:20px_20px] opacity-30" />
        
        <div className="min-h-screen flex items-center justify-center p-4 relative">
          {/* Floating background elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
          
          <div className="relative max-w-lg w-full">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-slate-700/20 overflow-hidden">
              {/* Card decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tr from-pink-500/5 to-orange-500/5 rounded-full blur-2xl" />
              
              <div className="relative">
                <LoaderContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 ${containerSizes[size]} w-full flex items-center justify-center relative overflow-hidden`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900/[0.04] bg-[size:20px_20px] opacity-20" />
      
      <div className="w-full max-w-4xl px-4 py-12 relative">
        <LoaderContent />
      </div>
    </div>
  );
};

// Enhanced preset configurations
export const PostsLoader = (props) => (
  <Loader 
    type="posts" 
    message="Loading Posts" 
    submessage="Discovering amazing content just for you..."
    variant="primary"
    {...props} 
  />
);

export const SearchLoader = (props) => (
  <Loader 
    type="search" 
    message="Searching..." 
    submessage="Scanning through thousands of articles to find perfect matches"
    variant="info"
    {...props} 
  />
);

export const UserLoader = (props) => (
  <Loader 
    type="user" 
    message="Loading Profile" 
    submessage="Preparing your personalized dashboard..."
    variant="success"
    {...props} 
  />
);

export const UploadLoader = (props) => (
  <Loader 
    type="upload" 
    message="Uploading..." 
    submessage="Your content is being processed and optimized"
    variant="warning"
    showProgress={true}
    {...props} 
  />
);

export const ProcessingLoader = (props) => (
  <Loader 
    type="processing" 
    message="Processing..." 
    submessage="AI is working its magic behind the scenes"
    variant="primary"
    {...props} 
  />
);

// Enhanced inline loader with more sophistication
export const InlineLoader = ({ variant = 'primary', size = 'small', message = '' }) => (
  <div className="flex items-center justify-center gap-3 p-4">
    <div className="relative">
      {/* Glow effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute inset-0 rounded-full bg-gradient-to-r ${
          variant === 'primary' ? 'from-indigo-500 to-purple-600' :
          variant === 'success' ? 'from-green-500 to-emerald-600' :
          variant === 'warning' ? 'from-yellow-500 to-orange-600' :
          variant === 'danger' ? 'from-red-500 to-pink-600' :
          'from-slate-500 to-slate-700'
        } blur-md opacity-30`}
      />
      
      {/* Main spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`relative w-8 h-8 rounded-full bg-gradient-to-r ${
          variant === 'primary' ? 'from-indigo-500 to-purple-600' :
          variant === 'success' ? 'from-green-500 to-emerald-600' :
          variant === 'warning' ? 'from-yellow-500 to-orange-600' :
          variant === 'danger' ? 'from-red-500 to-pink-600' :
          'from-slate-500 to-slate-700'
        } flex items-center justify-center shadow-lg`}
      >
        <div className="w-2 h-2 bg-white rounded-full" />
      </motion.div>
    </div>
    
    {message && (
      <span className="text-slate-600 dark:text-slate-400 font-medium">
        {message}
      </span>
    )}
  </div>
);

// Enhanced skeleton loader with better animations
export const SkeletonLoader = ({ rows = 3, className = '', showAvatar = true }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <motion.div 
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
      >
        <div className="flex space-x-4">
          {showAvatar && (
            <div className="relative">
              <div className="rounded-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 h-12 w-12 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          )}
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg w-3/4 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

// Brand new: Card loader for post previews
export const CardLoader = ({ count = 3 }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
      >
        <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-4/5 animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded w-20 animate-pulse"></div>
            <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export default Loader;