import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiCode,
  HiDatabase,
  HiDesktopComputer,
  HiSearch,
  HiArrowRight,
  HiStar,
  HiTrendingUp,
  HiBookOpen,
  HiUsers,
  HiSparkles,
  HiLightningBolt,
} from "react-icons/hi";
import PostCard from "../components/PostCard";
import { Link, useNavigate } from "react-router-dom";
import postService from "../api/postService";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postService.getPosts({ startIndex: 0, limit: 10 });
        setPosts(data.posts.slice(0, 6)); // Limit to 6 recent posts
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const technologies = [
    {
      icon: HiCode,
      title: "Frontend Development",
      description: "React, Vue, Angular, and modern JavaScript frameworks",
      gradient: "from-blue-500 to-purple-600",
      stats: "200+ Articles",
      bgGradient:
        "from-blue-50 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20",
    },
    {
      icon: HiDatabase,
      title: "Backend & Databases",
      description: "Node.js, Python, PostgreSQL, MongoDB, and APIs",
      gradient: "from-green-500 to-teal-600",
      stats: "150+ Guides",
      bgGradient:
        "from-green-50 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20",
    },
    {
      icon: HiDesktopComputer,
      title: "DevOps & Infrastructure",
      description: "Docker, Kubernetes, AWS, CI/CD, and cloud technologies",
      gradient: "from-orange-500 to-red-600",
      stats: "100+ Tutorials",
      bgGradient:
        "from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20",
    },
  ];

  const stats = [
    {
      icon: HiBookOpen,
      value: "500+",
      label: "Articles",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiUsers,
      value: "50K+",
      label: "Readers",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: HiTrendingUp,
      value: "1M+",
      label: "Page Views",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: HiStar,
      value: "4.9",
      label: "Rating",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Auto-rotate hero content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden">
      {/* Hero Section - Enhanced */}
      <motion.section
        className="relative pt-16 lg:pt-24 pb-20 flex items-center px-4"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
              >
                <HiSparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  #1 Tech Learning Platform
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 leading-tight"
                variants={itemVariants}
              >
                <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  ByteThoughts
                </span>
              </motion.h1>

              <motion.div className="mb-8" variants={itemVariants}>
                <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 font-semibold mb-4">
                  One byte, one thought
                </p>
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Where innovation meets knowledge. Dive into cutting-edge
                  tutorials, expert insights, and the future of technology.
                </p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl"
                  onClick={() => navigate("/search")}
                >
                  <span className="relative z-10 flex items-center justify-center">
                    <HiSearch className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Explore Articles
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-xl backdrop-blur-sm"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              className="relative order-1 lg:order-2 max-w-lg mx-auto w-full"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="relative">
                {/* Enhanced floating card with gradient effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl blur-3xl opacity-30 transform rotate-3" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 rounded-3xl blur-2xl opacity-20 transform -rotate-3" />
                <div className="relative bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-700 backdrop-blur-xl border border-white/20 dark:border-gray-700/20">
                  <div className="flex items-center mb-6">
                    <div className="flex space-x-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg" />
                      <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg" />
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 rounded-lg animate-pulse shadow-sm" />
                    <div className="h-4 bg-gradient-to-r from-green-200 via-blue-200 to-purple-200 dark:from-green-800 dark:via-blue-800 dark:to-purple-800 rounded-lg animate-pulse delay-75 shadow-sm" />
                    <div className="h-4 bg-gradient-to-r from-purple-200 via-pink-200 to-orange-200 dark:from-purple-800 dark:via-pink-800 dark:to-orange-800 rounded-lg animate-pulse delay-150 shadow-sm" />
                    <div className="h-4 w-3/4 bg-gradient-to-r from-orange-200 via-red-200 to-pink-200 dark:from-orange-800 dark:via-red-800 dark:to-pink-800 rounded-lg animate-pulse delay-300 shadow-sm" />
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full opacity-30 animate-pulse delay-1000" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section - Enhanced with cards */}
      <motion.section
        className="py-20 bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl border-y border-white/20 dark:border-gray-700/20"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-semibold">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Technologies Section - Enhanced with better cards */}
      <motion.section className="py-20 px-4" variants={itemVariants}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6"
            >
              <HiLightningBolt className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                What We Cover
              </span>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Technology Domains
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              From frontend frameworks to cloud infrastructure, we've got you
              covered with expert insights and practical tutorials that
              transform complex concepts into digestible knowledge.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${tech.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20 h-full">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${tech.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <tech.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {tech.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span
                      className={`text-sm font-semibold bg-gradient-to-r ${tech.gradient} bg-clip-text text-transparent`}
                    >
                      {tech.stats}
                    </span>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`p-2 rounded-xl bg-gradient-to-r ${tech.gradient} text-white shadow-lg`}
                    >
                      <HiArrowRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Posts Section - Enhanced */}
      {posts && posts.length > 0 && (
        <motion.section
          className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4">
            <motion.div className="text-center mb-16" variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-indigo-500/20 rounded-full mb-6"
              >
                <HiBookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  Latest Insights
                </span>
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 dark:from-indigo-200 dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Fresh from Our Community
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Stay ahead of the curve with our latest articles on emerging
                technologies and best practices. Every byte of knowledge,
                thoughtfully crafted.
              </p>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {posts.slice(0, 6).map((post, index) => (
                <PostCard key={post._id} post={post} index={index} />
              ))}
            </motion.div>

            <motion.div className="text-center mt-12" variants={itemVariants}>
              <Link to="/posts">
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    View All Posts
                    <HiArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
