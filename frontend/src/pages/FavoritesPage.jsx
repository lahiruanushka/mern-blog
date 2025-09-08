import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaSearch,
  FaFilter,
  FaStar,
  FaBookmark,
  FaEye,
  FaClock,
  FaUser,
  FaTags,
} from "react-icons/fa";
import { fetchFavorites } from "../features/favorites/favoritesSlice";
import { Button, TextInput, Dropdown, Badge } from "flowbite-react";
import PostCard from "../components/PostCard";
import FavouritePostCard from "../components/FavouritePostCard";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const {
    items: favorites,
    loading,
    error,
  } = useSelector((state) => state.favorites);

  const [hasHadItems, setHasHadItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (favorites?.length > 0) {
      setHasHadItems(true);
    }
  }, [favorites]);

  // Filter and sort favorites
  const filteredAndSortedFavorites =
    favorites
      ?.filter((post) => {
        const matchesSearch =
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filterBy === "all") return matchesSearch;
        if (filterBy === "recent") {
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return matchesSearch && new Date(post.createdAt) > weekAgo;
        }
        return matchesSearch;
      })
      ?.sort((a, b) => {
        if (sortBy === "newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest")
          return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "title") return a.title?.localeCompare(b.title);
        return 0;
      }) || [];

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-12 max-w-md mx-auto"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <FaStar className="text-white text-3xl" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur-xl opacity-40"></div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Favorite Bytes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
            Sign in to save and organize your favorite thoughts. Build your
            personal collection of inspiring content.
          </p>

          <Link to="/signin">
            <Button
              gradientDuoTone="purpleToBlue"
              size="lg"
              className="font-semibold px-8 py-2 max-w-md mx-auto"
            >
              Sign In to Continue
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      >
        <motion.div className="text-center">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 2, ease: "linear" },
              scale: { repeat: Infinity, duration: 1, ease: "easeInOut" },
            }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
          >
            <FaBolt className="text-white text-2xl" />
          </motion.div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your favorite bytes...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaHeart className="text-white text-xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || "We couldn't load your favorites right now."}
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              gradientDuoTone="purpleToBlue"
              onClick={() => dispatch(fetchFavorites())}
            >
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  if (!favorites?.length && !hasHadItems) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center p-12 max-w-lg mx-4"
        >
          <motion.div
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            }}
            className="relative mb-8"
          >
            <div className="w-28 h-28 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <FaStar className="text-gray-400 dark:text-gray-500 text-4xl" />
            </div>
            <div className="absolute -inset-3 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl blur-xl opacity-30"></div>
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your Byte Collection Awaits
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            One byte, one thought
          </p>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Start exploring our articles and save the thoughts that inspire you.
            Build your personal library of meaningful content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaSearch className="w-4 h-4" />
                <span>Discover Articles</span>
              </motion.button>
            </Link>
            <Link to="/search" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-3.5 bg-white dark:bg-gray-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all duration-300"
              >
                Search Topics
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <FaStar className="text-white text-2xl" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur opacity-40"></div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Favorite Bytes
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            One byte, one thought
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Your curated collection of inspiring thoughts and ideas.
            {filteredAndSortedFavorites.length > 0 && (
              <span className="font-medium text-purple-600 dark:text-purple-400 ml-2">
                {filteredAndSortedFavorites.length}{" "}
                {filteredAndSortedFavorites.length === 1
                  ? "favorite"
                  : "favorites"}{" "}
                saved
              </span>
            )}
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        {favorites?.length > 0 && (
          <motion.div variants={itemVariants} className="mb-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1">
                  <TextInput
                    type="text"
                    placeholder="Search your favorite bytes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={FaSearch}
                    className="w-full"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="flex gap-3">
                  <Dropdown
                    label={
                      <div className="flex items-center gap-2">
                        <FaFilter />
                        Filter: {filterBy === "all" ? "All" : "Recent"}
                      </div>
                    }
                    dismissOnClick={true}
                  >
                    <Dropdown.Item onClick={() => setFilterBy("all")}>
                      All Favorites
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setFilterBy("recent")}>
                      Recent (7 days)
                    </Dropdown.Item>
                  </Dropdown>

                  <Dropdown
                    label={
                      <div className="flex items-center gap-2">
                        <FaStar />
                        Sort:{" "}
                        {sortBy === "newest"
                          ? "Newest"
                          : sortBy === "oldest"
                          ? "Oldest"
                          : "A-Z"}
                      </div>
                    }
                    dismissOnClick={true}
                  >
                    <Dropdown.Item onClick={() => setSortBy("newest")}>
                      Newest First
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("oldest")}>
                      Oldest First
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy("title")}>
                      A-Z by Title
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>

              {/* Results count */}
              {searchTerm && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {filteredAndSortedFavorites.length > 0 ? (
                    <span>
                      Found {filteredAndSortedFavorites.length}{" "}
                      {filteredAndSortedFavorites.length === 1
                        ? "result"
                        : "results"}{" "}
                      for "{searchTerm}"
                    </span>
                  ) : (
                    <span>No results found for "{searchTerm}"</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Favorites Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredAndSortedFavorites.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <FavouritePostCard
                  post={post}
                  index={post.id}
                  onRemove={(postId) => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty search results */}
        {searchTerm && filteredAndSortedFavorites.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FaSearch className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No matches found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button
              outline
              gradientDuoTone="purpleToBlue"
              onClick={() => {
                setSearchTerm("");
                setFilterBy("all");
              }}
            >
              Clear Search
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FavoritesPage;
