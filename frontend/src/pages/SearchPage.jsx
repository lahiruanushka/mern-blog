import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  HiArrowRight,
  HiFilter,
  HiSearch,
  HiX,
  HiSparkles,
  HiLightningBolt,
  HiBookOpen,
  HiTrendingUp,
  HiAdjustments,
  HiRefresh,
  HiExclamationCircle,
  HiCollection,
} from "react-icons/hi";

// Enhanced SearchPage Component
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultFilters = {
    searchTerm: searchParams.get("searchTerm") || "",
    sort: searchParams.get("sort") || "desc",
    category: searchParams.get("category") || "uncategorized",
  };

  const [sidebarData, setSidebarData] = useState(defaultFilters);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [categories, setCategories] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const postsPerPage = 6;

  const location = useLocation();
  const navigate = useNavigate();

  // Mouse tracking for background effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/getCategories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch posts with filters
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page,
          limit: postsPerPage,
          searchTerm: sidebarData.searchTerm,
          category: sidebarData.category,
          sort: sidebarData.sort,
        });

        const res = await fetch(`/api/post/search?${queryParams}`);
        const data = await res.json();

        if (data.success) {
          setPosts((prev) =>
            page === 1 ? data.posts : [...prev, ...data.posts]
          );
          setTotalPosts(data.total);
          setShowMore(data.total > page * postsPerPage);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [sidebarData, page]);

  const handleChange = (e) => {
    setSidebarData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    setPage(1); // Reset page when filters change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    Object.entries(sidebarData).forEach(([key, value]) => {
      if (value && value !== defaultFilters[key]) {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSidebarData(defaultFilters);
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handleShowMore = () => {
    setPage((prev) => prev + 1);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
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

  const PostCard = ({ post, index }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-500">
        {/* Post Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-full">
              {post.category.name}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
            {post.content}
          </p>

          {/* Post Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.author.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {post.author.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ x: 5 }}
              className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-shadow"
            >
              <HiArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 overflow-hidden">
      {/* Animated Background Elements */}
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

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
          >
            <HiSearch className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-3" />
            <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Knowledge
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Search & Explore
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Find exactly what you're looking for with our powerful search and
            filtering system. Every byte of knowledge at your fingertips.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                  <HiAdjustments className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Search Filters
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Refine your search
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Search Term */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HiSearch className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="font-semibold text-gray-700 dark:text-gray-200">
                      Search Term
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="searchTerm"
                      type="text"
                      value={sidebarData.searchTerm}
                      onChange={handleChange}
                      placeholder="What are you looking for?"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 pl-12"
                    />
                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>

                {/* Sort Order */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HiTrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="font-semibold text-gray-700 dark:text-gray-200">
                      Sort Order
                    </label>
                  </div>
                  <select
                    id="sort"
                    value={sidebarData.sort}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="desc">Latest Posts</option>
                    <option value="asc">Oldest Posts</option>
                  </select>
                </motion.div>

                {/* Category */}
                <motion.div variants={itemVariants} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HiCollection className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <label className="font-semibold text-gray-700 dark:text-gray-200">
                      Category
                    </label>
                  </div>
                  <select
                    id="category"
                    value={sidebarData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="uncategorized">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-3 pt-4"
                >
                  <motion.button
                    type="submit"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <HiArrowRight className="w-5 h-5 mr-2" />
                    Apply Filters
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={handleClearFilters}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300"
                  >
                    <HiRefresh className="w-5 h-5 mr-2" />
                    Clear Filters
                  </motion.button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Results Summary */}
            <motion.div
              variants={itemVariants}
              className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                    <HiBookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {loading ? "Searching..." : `Found ${totalPosts} results`}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sidebarData.searchTerm &&
                        `for "${sidebarData.searchTerm}"`}
                      {sidebarData.category !== "uncategorized" &&
                        ` in ${
                          categories.find(
                            (c) => c.slug === sidebarData.category
                          )?.name
                        }`}
                    </p>
                  </div>
                </div>
                {!loading && posts.length > 0 && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
                  >
                    <HiSparkles className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
                >
                  <HiLightningBolt className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Searching the Knowledge Base
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Finding the perfect content for you...
                </p>
              </motion.div>
            )}

            {/* No Results */}
            {!loading && posts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <HiExclamationCircle className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  No Results Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
                  We couldn't find any content matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <motion.button
                  onClick={handleClearFilters}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}

            {/* Results Grid */}
            {!loading && posts.length > 0 && (
              <>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12"
                >
                  <AnimatePresence>
                    {posts.map((post, index) => (
                      <PostCard key={post._id} post={post} index={index} />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Button */}
                {showMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <motion.button
                      onClick={handleShowMore}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      <span className="flex items-center">
                        Load More Results
                        <HiArrowRight className="w-5 h-5 ml-2" />
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
