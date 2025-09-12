import { HiArrowRight, HiClock, HiEye } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Tag,
  Calendar,
  User,
  Heart,
  MessageCircle,
  Sparkles,
  Crown,
} from "lucide-react";

export default function PostCard({ post, index = 0 }) {
  const navigate = useNavigate();

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
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <motion.article
      className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-white/20 dark:border-gray-700/20"
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      initial="hidden"
      animate="visible"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/5 to-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/*  Image Container */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/*  gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating sparkles effect on hover */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100"
          initial={{ scale: 0, rotate: 0 }}
          whileHover={{ scale: 1, rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/*  Category Badge */}
        {post.category && (
          <motion.div
            className="absolute top-4 left-4"
            whileHover={{ scale: 1.05 }}
          >
            <Link
              to={`/search?category=${post.category?.slug}`}
              className="group/badge inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md">
                <Tag className="w-3 h-3 text-white transition-transform group-hover/badge:rotate-12" />
              </div>
              <span className="relative">
                {post.category?.name}
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

      {/*  Content Container */}
      <div className="relative p-6 space-y-4">
        {/* Title */}
        <Link to={`/posts/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2 leading-tight cursor-pointer">
            {post.title}
          </h3>
        </Link>

        {/* Content Preview */}
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed text-sm">
          {contentPreview}
        </p>

        {/* Author and Meta Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            {/* Avatar with Profile Link */}
            <Link
              to={`users/${post?.user?.username}`}
              className="relative group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 blur-md scale-105 group-hover:scale-110 transition-all duration-300"></div>
                <div className="relative overflow-hidden rounded-xl w-10 h-10 transition-all duration-300 group-hover:scale-105">
                  {post?.user?.profilePicture ? (
                    <img
                      src={post.user.profilePicture}
                      alt={`${
                        post?.user?.firstName || post?.user?.username
                      }'s profile`}
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {post?.user?.firstName
                          ? post.user.firstName.charAt(0).toUpperCase()
                          : post?.user?.username
                          ? post.user.username.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Admin Crown */}
                {post?.user?.isAdmin && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center z-10">
                    <Crown className="w-2.5 h-2.5 text-white" />
                  </div>
                )}

                {/* Online Status (only show if not admin) */}
                {!post?.user?.isAdmin && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </div>
            </Link>

            {/* Author Info */}
            <div>
              {/* Author Name with Profile Link */}
              <Link
                to={`/users/${post?.user?.username}`}
                className="group/name"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover/name:text-indigo-600 dark:group-hover/name:text-indigo-400 transition-colors duration-200 flex items-center gap-1">
                  {post?.user?.firstName && post?.user?.lastName
                    ? `${post.user.firstName} ${post.user.lastName}`
                    : post?.user?.username || "Unknown Author"}

                  {/* Admin Badge */}
                  {post?.user?.isAdmin && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-medium text-yellow-800 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-200 rounded-md border border-yellow-200 dark:border-yellow-700/50">
                      <Crown className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </p>
              </Link>

              {/* Date */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/*  Stats Bar */}
        <div className="flex items-center justify-between pt-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
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

          {/* Quality indicator */}
          {post.isFeatured && (
            <motion.div
              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-3 h-3 text-yellow-500" />
              <span className="font-medium text-yellow-600 dark:text-yellow-400">
                Featured
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none" />
    </motion.article>
  );
}
