import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  Eye,
  Sparkles,
  BookOpen,
  Tag,
  Edit3,
  AlertCircle,
  FileText,
  Camera,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";
import postService from "../services/postService";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import categoryService from "../services/categoryService";
import Loader from "../components/Loader";
import ComingSoonModal from "../components/ComingSoonModal";

const UpdatePostPage = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    image: "",
    categoryId: "",
    tags: [],
    publishAt: "",
    status: "draft",
  });

  // UI state
  const [file, setFile] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Tags state
  const [tagInput, setTagInput] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Refs
  const quillRef = useRef(null);

  const [categories, setCategories] = useState([]);

  const { showToast } = useToast();
  const navigate = useNavigate();

  // React Quill configuration
  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

  const handlePreview = () => {
    setShowComingSoonModal(true);
  };

  // Fetch post data when component mounts
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsInitialLoading(true);
        const res = await postService.getPosts({ slug: postSlug });

        if (res.success && res.posts.length > 0) {
          const postData = res.posts[0];
          setPost(postData);

          // Update form data with the fetched post data
          setFormData({
            title: postData.title,
            excerpt: postData.excerpt,
            content: postData.content,
            image: postData.imageUrl,
            categoryId: postData.category?._id,
            tags: postData.tags || [],
            publishAt: postData.publishAt
              ? new Date(postData.publishAt).toISOString().split("T")[0]
              : "",
            status: postData.status || "draft",
          });

          // Set the file state if there's an image
          if (postData.imageUrl) {
            setFile({ name: "existing-image", preview: postData.imageUrl });
          }
        } else {
          showToast("Post not found", "error");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        showToast("Failed to load post", "error");
        navigate("/");
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchPost();
  }, [postSlug, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await categoryService.getCategories();

      console.log(res);
      if (res.success) {
        setCategories(res.categories);
      }
    };

    fetchCategories();
  }, []);

  // Count words in content
  useEffect(() => {
    if (formData.content) {
      const textContent = formData.content.replace(/<[^>]*>/g, "").trim();
      const words = textContent ? textContent.split(/\s+/).length : 0;
      setWordCount(words);
    } else {
      setWordCount(0);
    }
  }, [formData.content]);

  // Handle remove image
  const handleRemoveImage = () => {
    setFile(null);
    setFormData((prev) => ({ ...prev, image: "" }));
    // Reset file input to allow selecting the same file again
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.value = "";
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
    if (files[0] && files[0].type.startsWith("image/")) {
      handleImageSelect(files[0]);
    }
  };

  // Handle tag input
  const handleTagInput = async (value) => {
    setTagInput(value);
    if (value.trim()) {
      try {
        const response = await postService.getTags(value);
        if (response.success) {
          setSuggestedTags(
            response.data.filter((tag) => !formData.tags.includes(tag))
          );
          setShowTagSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    } else {
      setShowTagSuggestions(false);
    }
  };

  // Add tag
  const addTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setTagInput("");
    setShowTagSuggestions(false);
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    } else if (e.key === "Backspace" && !tagInput && formData.tags.length > 0) {
      removeTag(formData.tags[formData.tags.length - 1]);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";
    if (!formData.categoryId) errors.category = "Category is required";
    if (!formData.excerpt.trim()) errors.excerpt = "Excerpt is required";
    if (formData.excerpt.length > 160)
      errors.excerpt = "Excerpt must be 160 characters or less";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    console.log(formData);

    if (!validateForm()) {
      setUpdateError("Please fix the validation errors before publishing");
      return;
    }

    setIsLoading(true);
    setUpdateError(null);

    try {
      let uploadedImageUrl = formData.image || "";

      // Upload image if a file is selected
      if (file) {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadedImageUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });

        setImageUploadProgress(null);
      }

      // Submit post with uploaded image
      const response = await postService.updatePost(post._id, {
        ...formData,
        imageUrl: uploadedImageUrl,
        status: "published",
      });

      if (response.success) {
        setShowSuccess(true);
        // show toast
        showToast("Post updated successfully", "success");
        navigate(`/posts/${response.post.slug}`);

        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            title: "",
            excerpt: "",
            content: "",
            imageUrl: "",
            categoryId: "",
            tags: [],
            publishAt: "",
            status: "draft",
          });
          setFile(null);
        }, 3000);
      } else {
        setUpdateError(response.message || "Failed to update post");
      }
    } catch (error) {
      console.error(error);
      setUpdateError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsInitialLoading(true);
        const res = await postService.getPosts({
          slug: postSlug,
        });
        if (!res.success) {
          setError(res.message);
          return;
        } else {
          setPost(res.posts[0]);
        }
      } catch (error) {
        setError(error.message || "Failed to fetch post");
      } finally {
        setIsInitialLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // Auto-hide errors
  useEffect(() => {
    if (updateError || imageUploadError) {
      const timer = setTimeout(() => {
        setUpdateError(null);
        setImageUploadError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateError, imageUploadError]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (isInitialLoading) {
    return <Loader message="Loading post data..." />;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
        <div className="pt-32 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {/* Header */}
              <motion.div variants={itemVariants} className="text-center mb-16">
                <div className="flex items-center justify-center mb-8">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-lg">
                    <Edit3 className="w-5 h-5" />
                    <span className="font-semibold">Edit Post</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 bg-gradient-to-r from-slate-900 via-green-800 to-emerald-800 dark:from-white dark:via-green-200 dark:to-emerald-200 bg-clip-text text-transparent">
                  Update Your Story
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  Refine and improve your content. All changes are automatically
                  tracked.
                </p>

                {hasUnsavedChanges && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-xl text-sm font-medium"
                  >
                    <AlertCircle className="w-4 h-4" />
                    You have unsaved changes
                  </motion.div>
                )}
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
                {(updateError || imageUploadError) && (
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
                          {updateError || imageUploadError}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setUpdateError(null);
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

              {/* Main Form */}
              <motion.form
                onSubmit={handleUpdate}
                variants={itemVariants}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-blue-500/5 rounded-3xl blur-lg"></div>
                <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden">
                  <div className="p-8 lg:p-12 space-y-8">
                    {/* Title and Category Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                      {/* Title Input */}
                      <div className="sm:col-span-8">
                        <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                          <FileText className="w-5 h-5 text-blue-600" />
                          Post Title *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter an engaging title..."
                          required
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className={`w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-lg ${
                            validationErrors.title
                              ? "border-red-500"
                              : "border-slate-200 dark:border-slate-600"
                          }`}
                        />
                        {validationErrors.title && (
                          <p className="text-red-500 text-sm mt-2">
                            {validationErrors.title}
                          </p>
                        )}
                      </div>

                      {/* Category Select */}
                      <div className="sm:col-span-4">
                        <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                          <Tag className="w-5 h-5 text-purple-600" />
                          Category *
                        </label>
                        <select
                          required
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoryId: e.target.value,
                            })
                          }
                          className={`w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white text-lg ${
                            validationErrors.category
                              ? "border-red-500"
                              : "border-slate-200 dark:border-slate-600"
                          }`}
                        >
                          <option value="">Choose a category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                        {validationErrors.category && (
                          <p className="text-red-500 text-sm mt-2">
                            {validationErrors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Excerpt Row */}
                    <div>
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                        <BookOpen className="w-5 h-5 text-green-600" />
                        Excerpt * ({formData.excerpt.length}/160)
                      </label>
                      <textarea
                        placeholder="Brief summary of your post..."
                        required
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        maxLength={160}
                        rows={4}
                        className={`w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 resize-none ${
                          validationErrors.excerpt
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-600"
                        }`}
                      />
                      {validationErrors.excerpt && (
                        <p className="text-red-500 text-sm mt-2">
                          {validationErrors.excerpt}
                        </p>
                      )}
                    </div>

                    {/* Tags Section */}
                    <div>
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                        <Tag className="w-5 h-5 text-indigo-600" />
                        Tags
                      </label>

                      {/* Selected Tags */}
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.tags.map((tag, index) => (
                            <motion.span
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {/* Tag Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Type to search and add tags..."
                          value={tagInput}
                          onChange={(e) => handleTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          className="w-full px-6 py-4 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                        />

                        {/* Tag Suggestions */}
                        {showTagSuggestions && suggestedTags.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-10 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto"
                          >
                            {suggestedTags.map((tag, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => addTag(tag)}
                                className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 last:border-b-0"
                              >
                                {tag}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Press Enter to add tags, Backspace to remove last tag
                      </p>
                    </div>

                    {/* Featured Image Upload */}
                    <div>
                      <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">
                        <Camera className="w-5 h-5 text-green-600" />
                        Featured Image
                      </label>

                      <div
                        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all duration-300 ${
                          isDragging
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-105"
                            : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-900/10"
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
                              onClick={handleRemoveImage}
                              className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl"
                              title="Remove image"
                            >
                              <X className="w-5 h-5" />
                            </button>
                            {file && (
                              <div className="absolute top-4 left-4 px-3 py-2 bg-green-500 text-white rounded-xl text-sm font-medium">
                                New image selected
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-6">
                              <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-3xl">
                                <Upload className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                              Upload Featured Image
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                              Drag and drop your image here, or click to browse.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleImageSelect(e.target.files[0])
                                }
                                className="hidden"
                                id="fileInput"
                              />
                              <label
                                htmlFor="fileInput"
                                className="px-8 py-4 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 cursor-pointer font-semibold shadow-lg hover:shadow-xl"
                              >
                                <ImageIcon className="w-5 h-5 inline mr-2" />
                                Choose Image
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-300">
                          <BookOpen className="w-5 h-5 text-indigo-600" />
                          Content *
                        </label>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <span>{wordCount} words</span>
                          <span>•</span>
                          <span>~{Math.ceil(wordCount / 200)} min read</span>
                        </div>
                      </div>

                      <div
                        className={`bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border shadow-lg ${
                          validationErrors.content
                            ? "border-red-500"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <ReactQuill
                          ref={quillRef}
                          theme="snow"
                          value={formData.content}
                          onChange={(content) =>
                            setFormData({ ...formData, content })
                          }
                          modules={quillModules}
                          formats={quillFormats}
                          placeholder="Continue crafting your amazing story..."
                          className="h-96"
                        />
                      </div>
                      {validationErrors.content && (
                        <p className="text-red-500 text-sm mt-2">
                          {validationErrors.content}
                        </p>
                      )}
                    </div>

                    {/* Schedule Publishing */}
                    <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-8">
                      <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 dark:text-slate-300 mb-6">
                        <Calendar className="w-6 h-6 text-purple-600" />
                        Publishing Options
                      </h3>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Schedule Date */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <Clock className="w-4 h-4" />
                            Schedule for Later (Optional)
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.publishAt}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                publishAt: e.target.value,
                              })
                            }
                            min={new Date().toISOString().slice(0, 16)}
                            className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white"
                          />
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Leave blank to publish immediately
                          </p>
                        </div>

                        {/* Status Display */}
                        <div>
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                            <FileText className="w-4 h-4" />
                            Current Status
                          </label>
                          <div className="flex items-center gap-3 p-4 bg-slate-50/80 dark:bg-slate-700/80 rounded-xl border border-slate-200 dark:border-slate-600">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                formData.status === "published"
                                  ? "bg-green-500"
                                  : formData.status === "scheduled"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }`}
                            ></div>
                            <span className="text-slate-900 dark:text-white font-medium capitalize">
                              {formData.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 font-bold text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        onClick={handlePreview}
                      >
                        <Eye className="w-5 h-5" />
                        Preview Changes
                      </motion.button>

                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : formData.publishAt ? (
                          <>
                            <Calendar className="w-5 h-5" />
                            Update & Schedule
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-5 h-5" />
                            Update Post
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-blue-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
        featureName="Preview Post"
        message="We're working hard to bring you the ability to preview your posts before publishing. This feature will be available soon!"
      />
    </>
  );
};

export default UpdatePostPage;
