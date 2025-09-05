import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  HiPencil,
  HiTrash,
  HiLogout,
  HiUpload,
  HiRefresh,
  HiUserCircle,
  HiMail,
  HiCalendar,
  HiStar,
  HiTrendingUp,
  HiBookOpen,
  HiUsers,
  HiSparkles,
  HiCog,
  HiEye,
  HiHeart,
  HiChat,
  HiOutlineExclamationCircle,
  HiCheck,
  HiX,
} from "react-icons/hi";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  clearError,
} from "../features/user/userSlice.js";
import { ShieldIcon } from "lucide-react";

// Mock PostCard component for demonstration
const PostCard = ({ post, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
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

  return (
    <motion.div
      className="group relative"
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20">
        {post.image && (
          <div className="h-48 rounded-2xl overflow-hidden mb-4">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold rounded-full">
            {post.category || "Technology"}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {post.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {post.content}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <HiEye className="w-4 h-4" />
              <span>{post.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <HiHeart className="w-4 h-4" />
              <span>{post.likes?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const UserProfilePage = () => {
  const { userId } = useParams();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // State for user data
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const filePickerRef = useRef(null);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProfileLoading(true);
        setProfileError(null);

        const [userRes, postsRes] = await Promise.all([
          fetch(`/api/user/getuser/${userId}`),
          fetch(`/api/post/getposts?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        const postsData = await postsRes.json();

        if (!userRes.ok) throw new Error(userData.message || "Failed to load user");
        if (!postsRes.ok) throw new Error(postsData.message || "Failed to load posts");

        setUser(userData);
        setPosts(postsData.posts || []);
      } catch (err) {
        setProfileError(err.message || "Something went wrong");
      } finally {
        setProfileLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  // Check if this is the current user's profile
  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  // Auto-hide alerts
  useEffect(() => {
    let timeoutId;
    if (updateUserSuccess || updateUserError || imageFileUploadError) {
      timeoutId = setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
        setImageFileUploadError(null);
      }, 3000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [updateUserSuccess, updateUserError, imageFileUploadError]);

  // Image upload functionality
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage();
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const currentValue = user.username;

    if (newValue !== currentValue) {
      setFormData({ ...formData, [e.target.id]: newValue });
      setHasChanges(true);
    } else {
      const { [e.target.id]: removedField, ...rest } = formData;
      setFormData(rest);
      setHasChanges(Object.keys(rest).length > 0 || imageFile !== null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (formData.username && formData.username.length < 6) {
      setUpdateUserError("Username must be at least 6 characters");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUser(data);
        setUpdateUserSuccess("Profile updated successfully");
        setHasChanges(false);
        setIsEditing(false);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowDeleteModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${user._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
    { icon: HiBookOpen, value: posts.length, label: "Posts", color: "from-blue-500 to-cyan-500" },
    { icon: HiUsers, value: "1.2K", label: "Followers", color: "from-green-500 to-emerald-500" },
    { icon: HiHeart, value: "3.4K", label: "Likes", color: "from-pink-500 to-rose-500" },
    { icon: HiTrendingUp, value: "12K", label: "Views", color: "from-purple-500 to-indigo-500" },
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
              {/* Action Buttons (for own profile) */}
              {isOwnProfile && (
                <div className="absolute top-6 right-6 flex gap-2">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-300"
                    >
                      <HiCog className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </motion.button>
                  ) : (
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={loading || !hasChanges}
                        className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                      >
                        <HiCheck className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({});
                          setHasChanges(false);
                          setImageFile(null);
                          setImageFileUrl(null);
                        }}
                        className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/20 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                      >
                        <HiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8">
                {/* Profile Image */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative"
                  >
                    {isEditing && isOwnProfile ? (
                      <div
                        onClick={() => filePickerRef.current?.click()}
                        className="cursor-pointer group relative"
                      >
                        <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden ring-4 ring-white/70 dark:ring-gray-800/70 shadow-2xl relative">
                          {imageFileUploadProgress && imageFileUploading && (
                            <div className="absolute inset-0 z-10 bg-gray-900/70 flex items-center justify-center rounded-3xl">
                              <div className="text-white text-lg font-semibold">
                                {imageFileUploadProgress}%
                              </div>
                            </div>
                          )}
                          <img
                            src={imageFileUrl || user.profilePicture}
                            alt={user.username}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-indigo-600/80 to-purple-600/80 rounded-3xl">
                            <HiUpload className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          ref={filePickerRef}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl overflow-hidden ring-4 ring-white/70 dark:ring-gray-800/70 shadow-2xl">
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Stats Badge */}
                    <div className="absolute -bottom-3 -right-3 px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl">
                      {posts.length} posts
                    </div>

                    {/* Admin Badge */}
                    {user.isAdmin && (
                      <div className="absolute -top-2 -left-2 p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl shadow-xl">
                        <ShieldIcon className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  {isEditing && isOwnProfile ? (
                    <div className="space-y-4">
                      <input
                        id="username"
                        type="text"
                        defaultValue={user.username}
                        onChange={handleChange}
                        className="text-2xl sm:text-3xl lg:text-4xl font-black bg-transparent border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl px-4 py-2 text-center lg:text-left w-full max-w-md bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl focus:outline-none focus:border-indigo-500 transition-all duration-300"
                        placeholder="Username"
                      />
                    </div>
                  ) : (
                    <motion.h1
                      className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                        @{user.username}
                      </span>
                    </motion.h1>
                  )}

                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <HiMail className="w-5 h-5" />
                      <span className="text-lg">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                      <HiCalendar className="w-5 h-5" />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
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
                      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
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

              {/* Action Buttons for Own Profile */}
              {isOwnProfile && !isEditing && (
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8"
                  variants={itemVariants}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(239, 68, 68, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <HiTrash className="w-5 h-5" />
                    Delete Account
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSignout}
                    className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-xl backdrop-blur-sm flex items-center justify-center gap-2"
                  >
                    <HiLogout className="w-5 h-5" />
                    Sign Out
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Status Messages */}
          <AnimatePresence>
            {(updateUserSuccess || updateUserError || imageFileUploadError) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 max-w-md mx-auto"
              >
                {updateUserSuccess && (
                  <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl text-green-700 dark:text-green-300 flex items-center gap-3">
                    <HiCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                    {updateUserSuccess}
                  </div>
                )}
                
                {(updateUserError || imageFileUploadError) && (
                  <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-300 flex items-center gap-3">
                    <HiX className="w-5 h-5 text-red-600 dark:text-red-400" />
                    {updateUserError || imageFileUploadError}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Section */}
          <motion.div
            className="mt-10"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Latest Posts
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
                      whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
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
            <motion.div
              className="text-center mt-12"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)" 
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-10 py-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-semibold rounded-2xl overflow-hidden shadow-2xl"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Load More Posts
                  <motion.div
                    animate={{ rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
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

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <HiOutlineExclamationCircle className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Delete Account
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Are you sure you want to delete your account? This action cannot be undone and all your posts will be permanently removed.
                </p>
                
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDeleteUser}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Yes, Delete
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xl"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfilePage;