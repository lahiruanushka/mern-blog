import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "../context/ToastContext";
import {
  addToFavorites,
  removeFromFavorites,
  fetchFavorites,
} from "../features/favorites/favoritesSlice";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";

import {
  Heart,
  Clock,
  Calendar,
  Tag,
  Share2,
  ArrowLeft,
  User,
  MessageCircle,
  Bookmark,
  Eye,
  Star,
  Sparkles,
  BookOpen,
  Crown,
  Edit,
  Trash2,
} from "lucide-react";
import LoginPrompt from "../components/LoginPrompt";
import ErrorMessage from "../components/ErrorMessage";
import postService from "../services/postService";
import Loader from "../components/Loader";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Redux state
  const {
    items: favorites,
    error: favError,
    loading: favLoading,
    message,
  } = useSelector((state) => state.favorites);
  const { currentUser } = useSelector((state) => state.user);

  // Check if post is in favorites
  const isFavorite = favorites?.some(
    (fav) =>
      fav === post?._id || fav.postId === post?._id || fav._id === post?._id
  );

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await postService.getPosts({
          slug: postSlug,
        });
        if (!res.success) {
          setError(res.message);
          return;
        } else {
          setPost(res.posts[0]);
          console.log("Fetched post:", res.posts[0]);
          const fetchedPost = res.posts[0];
          setLikeCount(
            fetchedPost?.numberOfLikes || fetchedPost?.likes?.length || 0
          );
          if (currentUser) {
            setLiked(!!fetchedPost?.likes?.includes(currentUser?._id));
          } else {
            setLiked(false);
          }
        }
      } catch (error) {
        setError(error.message || "Failed to fetch post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser]);

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await postService.getPosts({ limit: 3 });
        if (res.success) {
          setRecentPosts(res.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchRecentPosts();
  }, []);

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const article = document.querySelector(".article-content");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.pageYOffset;

      const progress = Math.min(
        Math.max(
          (scrollTop - articleTop + windowHeight * 0.3) / articleHeight,
          0
        ),
        1
      );
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(post._id)).unwrap();
        showToast("Removed from favorites", "success");
      } else {
        await dispatch(addToFavorites(post._id)).unwrap();
        showToast("Added to favorites", "success");
      }
    } catch (error) {
      showToast(error.message || "Failed to update favorites", "error");
    } finally {
      dispatch(fetchFavorites());
    }
  };

  // Handle like toggle (optimistic)
  const handleLikeToggle = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }

    const optimisticLiked = !liked;
    const optimisticCount = likeCount + (optimisticLiked ? 1 : -1);
    setLiked(optimisticLiked);
    setLikeCount(Math.max(0, optimisticCount));

    try {
      const res = await fetch(`/api/post/like/${post._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to toggle like");
      }
      setLiked(!!data?.liked);
      setLikeCount(data?.numberOfLikes ?? likeCount);
    } catch (error) {
      // revert on error
      setLiked(!optimisticLiked);
      setLikeCount(Math.max(0, likeCount));
      showToast(error.message || "Failed to like the post", "error");
    }
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: `Check out this article: ${post.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
      } catch (err) {
        showToast("Failed to copy link", "error");
      }
    }
  };

  const handleCloseLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      try {
        const res = await postService.deletePost(postId);
        if (res.success) {
          showToast("Post deleted successfully", "success");
          navigate("/");
        } else {
          showToast(res.message || "Failed to delete post", "error");
        }
      } catch (error) {
        showToast("An error occurred while deleting the post", "error");
        console.error("Error deleting post:", error);
      }
    }
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return <Loader message="Loading post" />;
  }

  if (error || !post) {
    console.log("Error loading post", error);
    return <ErrorMessage />;
  }

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"
    >
      {/*  Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200/50 dark:bg-gray-700/50 backdrop-blur-sm z-50 border-b border-white/20 dark:border-gray-700/20">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 shadow-lg"
          style={{ scaleX: readingProgress }}
          initial={{ scaleX: 0 }}
          transition={{ duration: 0.1 }}
          transformOrigin="left"
        />
      </div>

      <article className="max-w-4xl mx-auto px-4 py-8">
        {/*  Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/*  Category Badge */}
          <motion.div
            className="flex items-center gap-2 mb-8"
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to={`/search?category=${post.category?.name}`}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 rounded-2xl text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                <Tag className="w-4 h-4 text-white transition-transform group-hover:rotate-12" />
              </div>
              <span className="relative">
                <span className="relative z-10">{post.category?.name}</span>
                <span className="absolute inset-x-0 -bottom-1 h-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
            </Link>
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-8 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            {post.title}
          </h1>

          {/*  Author and Meta Info Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-2xl" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6 flex-wrap">
                {/* Profile Picture with Link */}
                <Link
                  to={`/users/${post.user?.username}`}
                  className="relative group"
                >
                  <div className="relative">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-md scale-105 group-hover:scale-110 transition-all duration-300"></div>

                    {/* Profile image container */}
                    <div className="relative overflow-hidden rounded-2xl w-20 h-20 transition-all duration-300 group-hover:scale-105">
                      <img
                        src={
                          post.user?.profilePicture ||
                          `https://ui-avatars.com/api/?name=${
                            post.user?.username || "Author"
                          }&background=random`
                        }
                        alt={post.user?.username || "Author"}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Admin Crown Icon */}
                    {post.user?.isAdmin && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center z-10">
                        <Crown className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}

                    {/* Online Status (only show if not admin) */}
                    {!post.user?.isAdmin && (
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center z-10">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </Link>

                <div>
                  {/* User Name with Link */}
                  <div className="mb-2">
                    <Link
                      to={`/users/${post.user?.username}`}
                      className="inline-block"
                    >
                      <div className="flex items-center gap-2 group/name">
                        <p className="font-bold text-xl text-gray-900 dark:text-white group-hover/name:text-indigo-600 dark:group-hover/name:text-indigo-400 transition-colors duration-200">
                          {post.user?.firstName && post.user?.lastName
                            ? `${post.user.firstName} ${post.user.lastName}`
                            : post.user.username || "Anonymous Author"}
                        </p>

                        {post.user.isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-yellow-800 bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 dark:text-yellow-200 rounded-full border border-yellow-200 dark:border-yellow-700/50">
                            <Crown className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Show username if we're displaying full name */}
                      {post.user?.firstName &&
                        post.user?.lastName &&
                        post.user?.username && (
                          <Link
                            to={`/users/${post.user?.username}`}
                            className="text-sm text-gray-500 dark:text-gray-400 font-medium hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors duration-200 inline-block mt-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            @{post.user?.username}
                          </Link>
                        )}
                    </Link>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {Math.ceil(post.content.length / 1000)} min read
                    </span>
                  </div>
                </div>

                {/* Edit and Delete Buttons - Only show if current user is the post owner */}
                {currentUser && currentUser._id === post.user?._id && (
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                    <Link
                      to={`/update-post/${post.slug}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-full border border-red-100 dark:border-red-800/30"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      liked ? "text-red-500 fill-current" : "text-red-400"
                    }`}
                  />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {likeCount}
                  </span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full border border-blue-100 dark:border-blue-800/30"
                >
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {post?.comments?.length || 0}
                  </span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/*  Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16 overflow-hidden rounded-3xl shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                Click to expand
              </span>
            </div>
          </div>
        </motion.div>

        {/*  Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="article-content mb-16"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:bg-indigo-50 dark:prose-code:bg-indigo-900/30 prose-code:text-indigo-700 dark:prose-code:text-indigo-300 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-gradient-to-r prose-blockquote:from-indigo-50 prose-blockquote:to-purple-50 dark:prose-blockquote:from-indigo-900/20 dark:prose-blockquote:to-purple-900/20 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:shadow-lg prose-blockquote:border-l-indigo-500">
            <div
              className="article-content prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-a:text-indigo-600 dark:prose-a:text-indigo-400 hover:prose-a:text-indigo-700 dark:hover:prose-a:text-indigo-300 prose-a:transition-colors prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:pl-4 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:not-italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-pre:bg-gray-800 prose-pre:rounded-xl prose-pre:p-4 prose-img:rounded-2xl prose-img:shadow-xl dark:prose-pre:bg-gray-900/50 dark:prose-img:border dark:prose-img:border-gray-700/50"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post?.tags?.length > 0 && (
              <div className="mt-12 mb-8">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => {
                    // Generate a consistent gradient based on the tag text
                    const colors = [
                      "from-blue-500 to-cyan-400",
                      "from-purple-500 to-pink-500",
                      "from-green-500 to-emerald-400",
                      "from-amber-500 to-yellow-400",
                      "from-rose-500 to-pink-400",
                      "from-indigo-500 to-blue-400",
                      "from-teal-500 to-cyan-400",
                    ];
                    const colorIndex =
                      Math.abs(
                        tag
                          .split("")
                          .reduce((sum, char) => sum + char.charCodeAt(0), 0)
                      ) % colors.length;
                    const gradient = colors[colorIndex];

                    return (
                      <Link
                        key={index}
                        to={`/search?tag=${encodeURIComponent(tag)}`}
                        className={`px-4 py-2 text-sm font-medium rounded-full bg-clip-text text-transparent bg-gradient-to-r ${gradient} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
                      >
                        #{tag}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/*  Engagement Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 mb-16 overflow-hidden"
        >
          {/* Decorative background */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl" />

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            {/* Like Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLikeToggle}
              aria-pressed={liked}
              title={liked ? "Unlike" : "Like this article"}
              className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border-2 ${
                liked
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-transparent shadow-red-500/25"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-700"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  liked ? "fill-current" : ""
                } transition-transform hover:scale-110`}
              />
              <span className="min-w-[4rem] font-bold">
                {liked ? "Liked" : "Like"}
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {likeCount}
              </span>
            </motion.button>

            {/* Favorite Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavoriteToggle}
              disabled={favLoading}
              title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border-2 ${
                isFavorite
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/25 border-transparent"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              <Star
                className={`w-5 h-5 ${
                  isFavorite ? "fill-current" : ""
                } transition-transform hover:scale-110`}
              />
              <span className="min-w-[7rem] text-sm sm:text-base font-bold">
                {isFavorite ? "Favorited" : "Add to Favorites"}
              </span>
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg border-2 
      bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 
      hover:bg-blue-50 dark:hover:bg-blue-900/20 
      hover:text-blue-600 dark:hover:text-blue-400 
      border-gray-200 dark:border-gray-600 
      hover:border-blue-300 dark:hover:border-blue-700"
            >
              <Share2 className="w-5 h-5 transition-transform hover:scale-110" />
              <span className="min-w-[4rem] font-bold">Share</span>
            </motion.button>
          </div>
        </motion.div>
      </article>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 mb-16"
      >
        <div className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20">
          <CommentSection postId={post._id} />
        </div>
      </motion.div>

      {/* Recent Posts Section */}
      {recentPosts && recentPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="max-w-6xl mx-auto px-4 py-16 border-t border-white/20 dark:border-gray-700/20"
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6"
            >
              <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                More Articles
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
              Continue Your Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover more insightful articles that will expand your knowledge
              and inspire your next breakthrough
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {recentPosts.map((recentPost, index) => (
              <motion.div
                key={recentPost._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <PostCard post={recentPost} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}

      {/* Login Prompt Modal */}
      {isLoginPromptOpen && (
        <LoginPrompt
          isOpen={isLoginPromptOpen}
          onClose={handleCloseLoginPrompt}
        />
      )}
    </motion.div>
  );
};

export default PostPage;
