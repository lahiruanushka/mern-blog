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
} from "react-icons/hi";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [categories, setCategories] = useState([
    { _id: '1', slug: 'technology', name: 'Technology' },
    { _id: '2', slug: 'programming', name: 'Programming' },
    { _id: '3', slug: 'web-development', name: 'Web Development' },
    { _id: '4', slug: 'mobile-apps', name: 'Mobile Apps' },
    { _id: '5', slug: 'data-science', name: 'Data Science' },
    { _id: '6', slug: 'artificial-intelligence', name: 'Artificial Intelligence' },
    { _id: '7', slug: 'cloud-computing', name: 'Cloud Computing' },
    { _id: '8', slug: 'cybersecurity', name: 'Cybersecurity' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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
      setTimeout(() => {
        // In real app: navigate(`/post/${data.slug}`);
        console.log('Post published successfully!', formData);
        setShowSuccess(false);
        // Reset form
        setFormData({ title: '', category: '', content: '', image: '' });
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
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-800/50 rounded-full mb-6">
              <HiSparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Create New Post
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Share Your Story
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Create engaging content that inspires and educates our community of developers and tech enthusiasts.
            </p>
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
                    Post published successfully!
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Redirecting to your new post...
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
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 dark:text-white"
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
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10'
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
                        <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl">
                          <HiUpload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
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
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    placeholder="Start writing your amazing content..."
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
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <HiEye className="w-5 h-5" />
                  Preview
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-700 dark:to-indigo-600 text-blue-700 dark:text-blue-300 rounded-2xl hover:from-blue-200 hover:to-indigo-300 dark:hover:from-blue-600 dark:hover:to-indigo-500 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <HiSave className="w-5 h-5" />
                  Save Draft
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <HiLightningBolt className="w-5 h-5" />
                      Publish Post
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

export default CreatePost;