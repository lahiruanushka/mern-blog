import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Eye,
  Save,
  Edit3,
  RotateCcw,
  Clock,
  AlertTriangle,
  FileText,
  Camera,
  Sparkles,
  History,
  AlertCircle
} from "lucide-react";

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
  const [wordCount, setWordCount] = useState(0);

  // Mock current user
  const currentUser = { _id: 'user123', username: 'johndoe' };

  // React Quill configuration
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'align': [] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'blockquote', 'code-block',
    'link', 'image', 'align', 'color', 'background'
  ];

  // Count words in content
  useEffect(() => {
    if (formData.content) {
      const textContent = formData.content.replace(/<[^>]*>/g, '').trim();
      const words = textContent ? textContent.split(/\s+/).length : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [formData.content]);

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
          content: '<h1>Understanding React Hooks</h1><p>React Hooks have revolutionized how we write React components. In this comprehensive guide, we\'ll explore the most commonly used hooks and learn how to create custom hooks for reusable logic.</p><h2>Key Benefits</h2><ul><li>Cleaner component logic</li><li>Better state management</li><li>Enhanced reusability</li></ul><p>Let\'s dive deeper into each hook and understand their practical applications...</p>',
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
    if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50"
        >
          <div className="w-16 h-16 mx-auto mb-8 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RotateCcw className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Loading Your Post
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Preparing your content for editing...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
      <div className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-2xl shadow-lg mb-8">
                <Edit3 className="w-5 h-5" />
                <span className="font-semibold">Update Post</span>
                <Sparkles className="w-4 h-4" />
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                Refine Your Story
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Make your content even better. Update and refine your post to keep it fresh and engaging.
              </p>

              {/* Changes Indicator */}
              <AnimatePresence>
                {hasChanges && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="inline-flex items-center gap-3 mt-6 px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800/30 rounded-2xl backdrop-blur-lg"
                  >
                    <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
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
                  className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/30 rounded-3xl backdrop-blur-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-700 dark:text-green-300">
                        Post Updated Successfully!
                      </p>
                      <p className="text-green-600 dark:text-green-400">
                        Your changes have been saved and are now live.
                      </p>
                    </div>
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
                  className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800/30 rounded-3xl backdrop-blur-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-xl font-bold text-red-700 dark:text-red-300">
                        {publishError || imageUploadError}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setPublishError(null);
                        setImageUploadError(null);
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors p-2"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Post Meta Info */}
            <motion.div
              variants={itemVariants}
              className="mb-8 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">
                      Last updated: {originalData.updatedAt ? new Date(originalData.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Never'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-purple-500" />
                    <span className="font-medium">
                      Created: {originalData.createdAt ? new Date(originalData.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Unknown'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-300 rounded-2xl font-semibold border border-green-200 dark:border-green-800/30">
                    Published
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Main Form */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-amber-500/5 to-yellow-500/5 rounded-3xl blur-lg"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
                <div className="p-8 lg:p-12 space-y-8">
                  {/* Title and Category Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Title Input */}
                    <div className="lg:col-span-2">
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                        <FileText className="w-5 h-5 text-orange-600" />
                        Post Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter an engaging title..."
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-lg"
                      />
                    </div>

                    {/* Category Select */}
                    <div>
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                        <Tag className="w-5 h-5 text-amber-600" />
                        Category
                      </label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:focus:border-orange-400 transition-all duration-300 text-slate-900 dark:text-white text-lg"
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
                    <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                      <Camera className="w-5 h-5 text-yellow-600" />
                      Featured Image
                    </label>
                    
                    <div
                      className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                        isDragging
                          ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20 scale-105'
                          : 'border-slate-300 dark:border-slate-600 hover:border-orange-400 hover:bg-orange-50/30 dark:hover:bg-orange-900/10'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {formData.image ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img
                            src={formData.image}
                            alt="Upload preview"
                            className="w-full h-80 object-cover rounded-3xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-300"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: '' })}
                            className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </motion.div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-6">
                            <div className="p-6 bg-gradient-to-r from-orange-500/10 to-amber-600/10 rounded-3xl">
                              <Upload className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            Update Featured Image
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Drag and drop your new image here, or click to browse and replace the current image.
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
                              className="px-8 py-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 cursor-pointer font-semibold shadow-lg hover:shadow-xl"
                            >
                              <ImageIcon className="w-5 h-5 inline mr-2" />
                              Choose New Image
                            </label>
                            
                            {file && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                type="button"
                                onClick={handleUploadImage}
                                disabled={imageUploadProgress}
                                className="px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
                              >
                                {imageUploadProgress ? (
                                  <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Uploading {imageUploadProgress}%
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-5 h-5" />
                                    Upload Image
                                  </>
                                )}
                              </motion.button>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-6">
                            Recommended: 1200x600px or larger, max 10MB (JPG, PNG, WebP)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300">
                        <Edit3 className="w-5 h-5 text-indigo-600" />
                        Content
                      </label>
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <span>{wordCount} words</span>
                        <span>•</span>
                        <span>~{Math.ceil(wordCount / 200)} min read</span>
                      </div>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg">
                      <ReactQuill
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content })}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Update your amazing content..."
                        className="h-96"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleReset}
                      disabled={!hasChanges}
                      className="flex-1 px-8 py-6 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      <RotateCcw className="w-6 h-6" />
                      Reset Changes
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="flex-1 px-8 py-6 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-700 dark:to-indigo-600 text-blue-700 dark:text-blue-300 rounded-2xl hover:from-blue-200 hover:to-indigo-300 dark:hover:from-blue-600 dark:hover:to-indigo-500 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                    >
                      <Eye className="w-6 h-6" />
                      Preview Changes
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(251, 146, 60, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isLoading || !hasChanges}
                      onClick={handleSubmit}
                      className="flex-2 px-8 py-6 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Updating Post...
                        </>
                      ) : (
                        <>
                          <Save className="w-6 h-6" />
                          Update Post
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-yellow-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-orange-400/10 to-red-500/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default UpdatePost;