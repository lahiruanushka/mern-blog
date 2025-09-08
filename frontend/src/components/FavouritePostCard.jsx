import { HiArrowRight, HiClock, HiEye } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Tag, Calendar, User, Heart, MessageCircle, Sparkles, Star, StarOff } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../features/favorites/favoritesSlice";
import { useToast } from "../context/ToastContext";
import { useState } from "react";

export default function FavouritePostCard({ post, index = 0, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { currentUser } = useSelector((state) => state.user);
  const { items: favorites, loading: favLoading } = useSelector((state) => state.favorites);

  // Check if post is in favorites
  const isFavorite = favorites?.some(
    (fav) => fav === post?._id || fav.postId === post?._id || fav._id === post?._id
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.8,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  // Strip HTML tags and get plain text
  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Get the first 120 characters of content without HTML tags
  const contentPreview = stripHtml(post.content).slice(0, 120) + "...";

  // Calculate reading time
  const readingTime = Math.ceil(stripHtml(post.content).length / 1000);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      showToast("Please login to manage favorites", "error");
      return;
    }

    setIsRemoving(true);
    
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(post._id)).unwrap();
        showToast("Removed from favorites", "success");
        // Call the onRemove callback to update the parent component
        if (onRemove) {
          setTimeout(() => onRemove(post._id), 300);
        }
      } else {
        await dispatch(addToFavorites(post._id)).unwrap();
        showToast("Added to favorites", "success");
      }
    } catch (error) {
      showToast(error.message || "Failed to update favorites", "error");
      setIsRemoving(false);
    }
  };

  return (
    <motion.article
      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-700/20"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/5 to-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Enhanced Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite indicator badge */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm rounded-xl text-white text-xs font-semibold shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Favorited
          </div>
        </div>
        
        {/* Enhanced Category Badge */}
        {post.category && (
          <motion.div
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to={`/search?category=${post.category}`}
              className="group/badge inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md">
                <Tag className="w-3 h-3 text-white transition-transform group-hover/badge:rotate-12" />
              </div>
              <span className="relative">
                {post.category}
                <span className="absolute inset-x-0 -bottom-1 h-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full transform scale-x-0 group-hover/badge:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>
        )}

        {/* Reading time badge */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            <HiClock className="w-3 h-3" />
            {readingTime} min read
          </div>
        </div>
      </div>

      {/* Enhanced Content Container */}
      <div className="relative p-6 space-y-4">
        {/* Title */}
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 leading-tight cursor-pointer">
            {post.title}
          </h3>
        </Link>

        {/* Content Preview */}
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed text-sm">
          {contentPreview}
        </p>

        {/* Enhanced Author and Meta Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/50 dark:ring-gray-700/50">
                <span className="text-white text-sm font-bold">
                  {post.author
                    ? post.author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
              </div>
            </div>

            {/* Author Info */}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {post.author || "Unknown Author"}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Read More Button */}
          <Link to={`/post/${post.slug}`}>
            <motion.div
              whileHover={{ x: 5, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group/arrow flex items-center justify-center w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <HiArrowRight className="w-5 h-5 text-white group-hover/arrow:translate-x-0.5 transition-transform duration-200" />
            </motion.div>
          </Link>
        </div>

        {/* Enhanced Stats and Actions Bar */}
        <div className="flex items-center justify-between pt-3">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <motion.span 
              className="flex items-center gap-1 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-3 h-3 text-red-500" />
              <span className="font-medium">{post.numberOfLikes || 0}</span>
            </motion.span>
            
            <motion.span 
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <MessageCircle className="w-3 h-3 text-blue-500" />
              <span className="font-medium">{post.comments || 0}</span>
            </motion.span>
            
            <motion.span 
              className="flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <HiEye className="w-3 h-3 text-green-500" />
              <span className="font-medium">{post.views || 0}</span>
            </motion.span>
          </div>
          
          {/* Favorite Action Button */}
          <motion.button
            onClick={handleFavoriteToggle}
            disabled={favLoading || isRemoving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs transition-all duration-300 shadow-lg hover:shadow-xl ${
              isFavorite 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-pink-500 hover:to-red-500' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-orange-500 hover:to-yellow-500'
            } ${(favLoading || isRemoving) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isRemoving ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : isFavorite ? (
              <StarOff className="w-3 h-3" />
            ) : (
              <Star className="w-3 h-3" />
            )}
            <span>
              {isRemoving ? 'Removing...' : isFavorite ? 'Remove' : 'Add'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
    </motion.article>
  );
}