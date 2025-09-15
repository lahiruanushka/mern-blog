import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Edit3,
  Trash2,
  Save,
  X,
  Clock,
  User,
  CheckCircle,
  MessageCircle,
  Crown,
} from "lucide-react";
import userService from "../services/userService";
import commentService from "../services/commentService";

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.numberOfLikes || 0);
  const { currentUser } = useSelector((state) => state.user);

  // Ensure comment.user exists with safe defaults
  const user = comment.user || {};

  useEffect(() => {
    if (currentUser && comment.likes) {
      setIsLiked(comment.likes.includes(currentUser._id));
    }
    setLikeCount(comment.numberOfLikes || comment.likes?.length || 0);
  }, [comment, currentUser]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await commentService.editComment(comment._id, editedContent);
      if (res.success) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleLikeClick = () => {
    // Optimistic update
    const newIsLiked = !isLiked;
    const newCount = newIsLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

    setIsLiked(newIsLiked);
    setLikeCount(newCount);

    // Call the parent function
    onLike(comment._id);
  };

  const canEdit =
    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);
  const canDelete =
    currentUser && (currentUser._id === comment.userId || currentUser.isAdmin);

  const timeAgo = moment(comment.createdAt).fromNow();
  const isRecent = moment().diff(moment(comment.createdAt), "hours") < 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex gap-6">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative group/avatar">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover/avatar:opacity-75 transition-opacity duration-300"></div>
              <img
                className="relative w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-lg"
                src={
                  (comment.user && comment.user.profilePicture) ||
                  `https://ui-avatars.com/api/?name=${
                    (comment.user && comment.user.username) || "User"
                  }&background=random`
                }
                alt={(comment.user && comment.user.username) || "User"}
              />
              {comment.user && comment.user.isAdmin && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
              {isRecent && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-lg animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h4 className="font-bold text-lg text-slate-900 dark:text-white">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "Anonymous User"}
                </h4>
                {user.isAdmin && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
                    Admin
                  </span>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{timeAgo}</span>
                  {isRecent && (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {(canEdit || canDelete) && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {canEdit && !isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleEdit}
                      className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                      title="Edit comment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </motion.button>
                  )}
                  {canDelete && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(comment._id)}
                      className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              )}
            </div>

            {/* Comment Content */}
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full p-4 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-700 dark:text-slate-200 resize-none"
                      rows="3"
                      maxLength="200"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                      {200 - editedContent.length} chars left
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={
                        !editedContent.trim() || editedContent.length > 200
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setIsEditing(false);
                        setEditedContent(comment.content);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="viewing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Comment Text */}
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                      {comment.content}
                    </p>
                  </div>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLikeClick}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          isLiked
                            ? "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400"
                        }`}
                      >
                        <motion.div
                          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isLiked ? "fill-current" : ""
                            }`}
                          />
                        </motion.div>
                        <span className="text-sm">
                          {likeCount > 0 ? likeCount : "Like"}
                        </span>
                      </motion.button>

                      {/* Reply Button (placeholder for future feature) */}
                      <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Reply</span>
                      </button>
                    </div>

                    {/* Like Count Display */}
                    {likeCount > 0 && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>
                          {likeCount} {likeCount === 1 ? "like" : "likes"}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Decorative gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
      </div>
    </motion.div>
  );
}
