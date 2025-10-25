import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { useState, useEffect } from "react";
import {
  HiLightningBolt,
  HiArrowRight,
  HiCollection,
  HiCode,
  HiDesktopComputer,
  HiChip,
} from "react-icons/hi";
import categoryService from "../services/categoryService";

// Color mapping for gradients and backgrounds
const colorMappings = {
  blue: {
    gradient: "from-blue-500 to-blue-700",
    bgGradient: "from-blue-500/20 to-blue-700/20",
    icon: HiDesktopComputer,
    accent: "text-blue-600 dark:text-blue-400",
  },
  green: {
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-500/20 to-emerald-600/20",
    icon: HiCollection,
    accent: "text-green-600 dark:text-green-400",
  },
  purple: {
    gradient: "from-purple-500 to-violet-600",
    bgGradient: "from-purple-500/20 to-violet-600/20",
    icon: HiChip,
    accent: "text-purple-600 dark:text-purple-400",
  },
  indigo: {
    gradient: "from-indigo-500 to-purple-600",
    bgGradient: "from-indigo-500/20 to-purple-600/20",
    icon: HiCode,
    accent: "text-indigo-600 dark:text-indigo-400",
  },
  orange: {
    gradient: "from-orange-500 to-red-500",
    bgGradient: "from-orange-500/20 to-red-500/20",
    icon: HiLightningBolt,
    accent: "text-orange-600 dark:text-orange-400",
  },
  cyan: {
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    icon: HiDesktopComputer,
    accent: "text-cyan-600 dark:text-cyan-400",
  },
  red: {
    gradient: "from-red-500 to-pink-600",
    bgGradient: "from-red-500/20 to-pink-600/20",
    icon: Shield,
    accent: "text-red-600 dark:text-red-400",
  },
  teal: {
    gradient: "from-teal-500 to-cyan-600",
    bgGradient: "from-teal-500/20 to-cyan-600/20",
    icon: HiCollection,
    accent: "text-teal-600 dark:text-teal-400",
  },
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoryService.getCategories();

      console.log(res);
      if (res.success) {
        setCategories(res.categories);
      }
    };

    fetchCategories();
  }, []);

  // Auto-rotate every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + direction) % categories.length;
        return next < 0 ? categories.length - 1 : next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [categories.length, direction]);

  const cardVariants = {
    enter: (direction) => ({
      opacity: 0,
      x: direction > 0 ? 300 : -300,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction < 0 ? 300 : -300,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const currentCategory = categories[currentIndex];
  const colorConfig =
    colorMappings[currentCategory?.color] || colorMappings.blue;
  const IconComponent = colorConfig.icon;

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + categories.length) % categories.length
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  if (!categories || categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6 backdrop-blur-sm"
          >
            <HiCollection className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Explore Categories
            </span>
          </motion.div>

          <h2 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            Learning Categories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Discover a wide range of topics designed to enhance your knowledge
            and skills across various domains of technology and development.
          </p>
        </motion.div>

        {/* Category Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={handlePrevious}
              className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiArrowRight className="w-6 h-6 text-gray-700 dark:text-gray-300 rotate-180" />
            </motion.button>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 z-20">
            <motion.button
              onClick={handleNext}
              className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-full shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <HiArrowRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>

          {/* Main Card */}
          <div className="mx-16 overflow-hidden perspective-1000">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentCategory._id}
                className="relative"
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                transition={{
                  duration: 0.8,
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                }}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colorConfig.bgGradient} rounded-3xl opacity-20 animate-pulse`}
                />

                <motion.div
                  className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-16 -translate-x-16" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-6 rounded-3xl bg-gradient-to-r ${colorConfig.gradient} mb-8 shadow-xl`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Content */}
                    <motion.h3
                      className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900 dark:text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      {currentCategory.name}
                    </motion.h3>

                    <motion.p
                      className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      {currentCategory.description}
                    </motion.p>

                    {/* Footer */}
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    >
                      <span
                        className={`text-sm font-semibold ${colorConfig.accent} bg-gradient-to-r ${colorConfig.gradient} bg-clip-text text-transparent`}
                      >
                        Category #{currentIndex + 1} of {categories.length}
                      </span>
                      <motion.div
                        className={`p-3 rounded-2xl bg-gradient-to-r ${colorConfig.gradient} text-white shadow-lg cursor-pointer`}
                        whileHover={{ scale: 1.1, x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <HiArrowRight className="w-6 h-6" />
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-3">
            {categories.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? `bg-gradient-to-r ${colorConfig.gradient} shadow-lg`
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>

          {/* Category Grid Preview */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 opacity-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {categories.slice(0, 4).map((category, index) => {
              const config =
                colorMappings[category.color] || colorMappings.blue;
              return (
                <motion.div
                  key={category._id}
                  className={`p-4 bg-gradient-to-r ${config.bgGradient} rounded-2xl border border-white/20 backdrop-blur-sm cursor-pointer`}
                  whileHover={{ scale: 1.05, opacity: 1 }}
                  onClick={() => setCurrentIndex(index)}
                >
                  <config.icon className={`w-6 h-6 ${config.accent} mb-2`} />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {category.name}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CategorySection;
