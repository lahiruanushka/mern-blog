import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  HiUserCircle,
  HiMail,
  HiCalendar,
  HiStar,
  HiTrendingUp,
  HiBookOpen,
  HiUsers,
  HiSparkles,
  HiEye,
  HiHeart,
  HiChat,
  HiX,
  HiRefresh,
} from "react-icons/hi";
import { ShieldIcon } from "lucide-react";
import PostCard from "../components/PostCard";
import { getUserProfileByUsername } from "../api/userService";
import { getPostsByUserId } from "../api/postService";

const UserProfilePage = () => {
  const { username } = useParams();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State for user data
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);

        // Get user by username
        const userData = await getUserProfileByUsername(username);
        setUser(userData);

        // Get posts by user ID
        const postsData = await getPostsByUserId(userData._id);
        setPosts(postsData);
      } catch (err) {
        setProfileError(err.message || "Something went wrong");
      } finally {
        setProfileLoading(false);
      }
    };

    if (username) fetchData();
  }, [username]);

  // Check if this is the current user's profile
  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-red-200 dark:border-red-800 shadow-xl"
        >
          <div className="text-center">
            <HiX className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Profile Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{profileError}</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!user) return null;

  const stats = [
    {
      icon: HiBookOpen,
      value: posts.length,
      label: "Posts",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: HiUsers,
      value: "1.2K",
      label: "Followers",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: HiHeart,
      value: "3.4K",
      label: "Likes",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: HiTrendingUp,
      value: "12K",
      label: "Views",
      color: "from-purple-500 to-indigo-500",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Enhanced Profile Header */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl mb-10"
            variants={itemVariants}
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-purple-400/5" />

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-500/20 to-orange-500/20 rounded-full translate-y-20 -translate-x-20 blur-3xl" />

            <div className="relative p-8 sm:p-12">
              {/* Profile Picture */}
              <div className="relative w-32 h-32 mx-auto sm:mx-0">
                <img
                  src={user.profilePicture || "https://via.placeholder.com/150"}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
                />
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      @{user.username}
                    </span>
                    {user.isAdmin && (
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-rose-600 text-white">
                        <ShieldIcon className="w-3 h-3 mr-1" /> Admin
                      </span>
                    )}
                  </motion.h1>

                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <HiCalendar className="w-5 h-5" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Badges */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold shadow-lg backdrop-blur-xl"
                    >
                      Member since {new Date(user.createdAt).getFullYear()}
                    </motion.span>

                    {user.isAdmin && (
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 font-semibold shadow-lg backdrop-blur-xl flex items-center gap-2"
                      >
                        <ShieldIcon className="w-4 h-4" />
                        Admin
                      </motion.span>
                    )}

                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-semibold shadow-lg backdrop-blur-xl flex items-center gap-2"
                    >
                      <HiSparkles className="w-4 h-4" />
                      Active Contributor
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8"
                variants={containerVariants}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="group text-center"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {stat.value}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Posts Section */}
          <motion.div className="mt-10" variants={itemVariants}>
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                  {isOwnProfile ? "Your" : `${user.username}'s`} Posts
                </h2>
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 rounded-2xl">
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {posts.length} articles
                  </span>
                </div>
              </motion.div>
            </div>

            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <HiBookOpen className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Posts Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                    {isOwnProfile
                      ? "Start sharing your thoughts and ideas with the world!"
                      : `${user.username} hasn't published any posts yet.`}
                  </p>
                  {isOwnProfile && (
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      onClick={() => navigate("/create-post")}
                    >
                      Create Your First Post
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {posts.map((post, index) => (
                  <PostCard key={post._id} post={post} index={index} />
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Load More Button */}
          {posts.length > 0 && posts.length >= 6 && (
            <motion.div className="text-center mt-12" variants={itemVariants}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Load More Posts
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="ml-2"
                  >
                    <HiRefresh className="w-5 h-5" />
                  </motion.div>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
