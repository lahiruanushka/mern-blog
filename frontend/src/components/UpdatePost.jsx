import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiUpload,
  HiPhotograph,
  HiX,
  HiCheck,
  HiEye,
  HiSave,
  HiSparkles,
  HiLightningBolt,
  HiBookOpen,
  HiTag,
  HiPencil,
  HiRefresh,
  HiClock,
  HiExclamation,
} from "react-icons/hi";

const UpdatePost = ({ postId }) => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([
    { _id: '1', slug: 'technology', name: 'Technology' },
    { _id: '2', slug: 'programming', name: 'Programming' },
    { _id: '3', slug: 'web-development', name: 'Web Development' },
    { _id: '4', slug: 'mobile-apps', name: 'Mobile Apps' },
    { _id: '5', slug: 'data-science', name: 'Data Science' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock current user
  const currentUser = { _id: 'user123', username: 'johndoe' };

  // Animation variants
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

  // Fetch existing post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetchingPost(true);
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPost = {
          _id: postId,
          title: 'Understanding React Hooks in Depth',
          category: 'web-development',
          content: 'React Hooks have revolutionized how we write React components. In this comprehensive guide, we\'ll explore the most commonly used hooks and learn how to create custom hooks for reusable logic.',
          image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
          slug: 'understanding-react-hooks-in-depth',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setFormData(mockPost);
        setOriginalData(mockPost);
        setPublishError(null);
      } catch (error) {
        setPublishError("Failed to fetch post data");
      } finally {
        setFetchingPost(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  // Check for changes
  useEffect(() => {
    const changed = 
      formData.title !== originalData.title ||
      formData.category !== originalData.category ||
      formData.content !== originalData.content ||
      formData.image !== originalData.image;
    setHasChanges(changed);
  }, [formData, originalData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      setPublishError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setPublishError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      setOriginalData({ ...formData });
      setTimeout(() => {
        console.log('Post updated successfully!', formData);
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      setPublishError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload simulation
  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image");
      return;
    }
    
    setImageUploadError(null);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setImageUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData({ ...formData, image: e.target.result });
      setImageUploadProgress(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      setFile(files[0]);
    }
  };

  // Reset to original data
  const handleReset = () => {
    setFormData({ ...originalData });
    setFile(null);
  };

  // Auto-hide errors after 5 seconds
  useEffect(() => {
    if (publishError || imageUploadError) {
      const timer = setTimeout(() => {
        setPublishError(null);
        setImageUploadError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [publishError, imageUploadError]);

  if (fetchingPost) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-6 inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <HiRefresh className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Loading Post
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching your content...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200/50 dark:border-orange-800/50 rounded-full mb-6">
              <HiPencil className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Update Post
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
              Edit Your Story
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Make your content even better. Update and refine your post to keep it fresh and engaging.
            </p>

            {/* Changes Indicator */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                >
                  <HiExclamation className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    You have unsaved changes
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-2xl flex items-center gap-3"
              >
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                  <HiCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300">
                    Post updated successfully!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Your changes have been saved.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Messages */}
          <AnimatePresence>
            {(publishError || imageUploadError) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl">
                    <HiX className="w-5 h-5 text-white" />
                  </div>
                  <p className="font-semibold text-red-700 dark:text-red-300">
                    {publishError || imageUploadError}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPublishError(null);
                    setImageUploadError(null);
                  }}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Post Meta Info */}
          <motion.div
            variants={itemVariants}
            className="mb-8 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20"
          >
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <HiClock className="w-4 h-4" />
                  <span>Last updated: {originalData.updatedAt ? new Date(originalData.updatedAt).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                  Draft
                </span>
              </div>
            </div>
          </motion.div>

          {/* Main Form */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {/* Title and Category Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Title Input */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <HiPencil className="inline w-4 h-4 mr-2" />
                    Post Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter an engaging title..."
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <HiTag className="inline w-4 h-4 mr-2" />
                    Category
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-gray-900 dark:text-white"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <HiPhotograph className="inline w-4 h-4 mr-2" />
                  Featured Image
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-3xl p-8 transition-all duration-300 ${
                    isDragging
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50/30 dark:hover:bg-orange-900/10'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {formData.image ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <img
                        src={formData.image}
                        alt="Upload preview"
                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <HiX className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl">
                          <HiUpload className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Drag and drop your image here, or click to select
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setFile(e.target.files[0])}
                          className="hidden"
                          id="fileInput"
                        />
                        <label
                          htmlFor="fileInput"
                          className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 cursor-pointer font-semibold"
                        >
                          Choose File
                        </label>
                        
                        {file && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            type="button"
                            onClick={handleUploadImage}
                            disabled={imageUploadProgress}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {imageUploadProgress ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                {imageUploadProgress}%
                              </>
                            ) : (
                              <>
                                <HiUpload className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </motion.button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Recommended: 1200x600px, max 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <HiBookOpen className="inline w-4 h-4 mr-2" />
                  Content
                </label>
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <textarea
                    placeholder="Update your amazing content..."
                    className="w-full min-h-[300px] p-4 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanges}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiRefresh className="w-5 h-5" />
                  Reset Changes
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-700 dark:to-indigo-600 text-blue-700 dark:text-blue-300 rounded-2xl hover:from-blue-200 hover:to-indigo-300 dark:hover:from-blue-600 dark:hover:to-indigo-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <HiEye className="w-5 h-5" />
                  Preview
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(251, 146, 60, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !hasChanges}
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <HiSave className="w-5 h-5" />
                      Update Post
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdatePost;