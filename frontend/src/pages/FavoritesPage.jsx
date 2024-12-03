import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import PostCard from "../components/PostCard";
import { fetchFavorites } from "../features/favorites/favoritesSlice";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const {
    items: favorites,
    loading,
    error,
  } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, currentUser]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (!currentUser) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center p-8 max-w-md mx-auto"
        >
          <HiOutlineHeart className="w-16 h-16 mx-auto text-teal-500 dark:text-teal-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Sign in to see your favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create an account or sign in to keep track of your favorite posts.
          </p>
          <Link
            to="/sign-in"
            className="inline-block bg-teal-500 dark:bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
          >
            Sign In
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
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear",
          }}
          className="rounded-full h-12 w-12 border-4 border-teal-500 dark:border-teal-400 border-t-transparent"
        ></motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center p-8"
        >
          <p className="text-red-500 dark:text-red-400 mb-4">
            Error loading favorites: {error.message || "Something went wrong."}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(fetchFavorites())}
            className="bg-teal-500 dark:bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (!favorites?.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center p-8 max-w-md mx-auto"
        >
          <HiHeart className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No favorites yet
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start exploring posts and save your favorites to see them here.
          </p>
          <Link
            to="/"
            className="inline-block bg-teal-500 dark:bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors"
          >
            Explore Posts
          </Link>
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
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Your Favorites
        </h1>
        <motion.span
          variants={itemVariants}
          className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-400 text-sm font-medium px-3 py-1 rounded-full"
        >
          {favorites.length} {favorites.length === 1 ? "Post" : "Posts"}
        </motion.span>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {favorites.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FavoritesPage;
