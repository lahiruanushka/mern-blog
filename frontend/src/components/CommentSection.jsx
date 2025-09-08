import { Alert, Button, Modal, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  User,
  AlertTriangle,
  Trash2,
  Edit,
  Heart,
  Clock,
  Users,
  Sparkles,
  CheckCircle,
  X,
} from "lucide-react";
import Comment from "./Comment";
import LoginPrompt from "./LoginPrompt";

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200 || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment("");
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        setIsLoginPromptOpen(true);
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate("/signin");
        return;
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCloseLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "popular":
        return (b.numberOfLikes || 0) - (a.numberOfLikes || 0);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full"
    >
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg mb-6">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">Join the Discussion</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Comments
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Share your thoughts and engage with other readers. Your voice
            matters!
          </p>
        </div>

        {/* User Status */}
        <div className="mb-8">
          {currentUser ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800/30"
            >
              <div className="relative">
                <img
                  className="w-12 h-12 object-cover rounded-full ring-2 ring-green-200 dark:ring-green-800"
                  src={currentUser.profilePicture}
                  alt="Profile"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Commenting as
                </p>
                <Link
                  to="/dashboard?tab=profile"
                  className="text-lg font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                >
                  @{currentUser.username}
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-800/30"
            >
              <User className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Join the conversation! Sign in to share your thoughts.
              </p>
              <Link
                to="/signin"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                Sign In to Comment
              </Link>
            </motion.div>
          )}
        </div>

        {/* Comment Form */}
        <AnimatePresence>
          {currentUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-lg"></div>
                  <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-xl">
                    <div className="relative">
                      <textarea
                        placeholder="Share your thoughts... What did you think about this article?"
                        rows="4"
                        maxLength="200"
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                        className="w-full p-6 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                      />
                      <div className="absolute bottom-4 right-4 text-sm text-slate-400">
                        {200 - comment.length} characters left
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-4">
                          <span
                            className={`flex items-center gap-1 ${
                              comment.length > 200
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                            {comment.length <= 200
                              ? "Valid length"
                              : "Too long"}
                          </span>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={
                          !comment.trim() ||
                          comment.length > 200 ||
                          isSubmitting
                        }
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Post Comment
                          </>
                        )}
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {commentError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl"
                        >
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-4 h-4" />
                            {commentError}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comments Section */}
        <div className="space-y-8">
          {/* Comments Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-2xl border border-white/50 dark:border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {comments.length} Comment{comments.length !== 1 ? "s" : ""}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Join the conversation below
                  </p>
                </div>
              </div>
            </div>

            {comments.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Liked</option>
                </select>
              </div>
            )}
          </div>

          {/* Comments List */}
          <AnimatePresence mode="wait">
            {comments.length === 0 ? (
              <motion.div
                key="no-comments"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-16 bg-white/40 dark:bg-slate-800/40 backdrop-blur-lg rounded-3xl border border-white/50 dark:border-slate-700/50"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  No comments yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-6">
                  Be the first to share your thoughts about this article. Your
                  comment could start an interesting discussion!
                </p>
                {!currentUser && (
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <User className="w-4 h-4" />
                    Sign In to Comment
                  </Link>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="comments-list"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {sortedComments.map((comment) => (
                  <motion.div key={comment._id} variants={itemVariants}>
                    <Comment
                      comment={comment}
                      onLike={handleLike}
                      onEdit={handleEdit}
                      onDelete={(commentId) => {
                        setShowModal(true);
                        setCommentToDelete(commentId);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/50 dark:border-slate-700/50"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Delete Comment?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  This action cannot be undone. The comment will be permanently
                  removed from the discussion.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(commentToDelete)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Prompt */}
      <LoginPrompt
        isOpen={isLoginPromptOpen}
        onClose={handleCloseLoginPrompt}
      />
    </motion.div>
  );
}
