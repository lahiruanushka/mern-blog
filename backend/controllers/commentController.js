import Comment from "../models/commentModel.js";
import { errorHandler } from "../utils/error.js";

// Create a new comment
export const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    const newComment = new Comment({
      content,
      postId,
      userId: req.user.id,
    });
    await newComment.save();

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments for a specific post
export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId })
      .sort({ createdAt: -1 })
      .populate("userId", "username firstName lastName profilePicture isAdmin");

    // Transform userId → user
    const formattedComments = comments.map((c) => ({
      _id: c._id,
      content: c.content,
      createdAt: c.createdAt,
      user: c.userId,
      likes: c.likes,
      numberOfLikes: c.numberOfLikes,
    }));

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments: formattedComments,
      count: formattedComments.length,
    });
  } catch (error) {
    next(error);
  }
};

// Like or unlike a comment
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json({
      success: true,
      message: userIndex === -1 ? "Comment liked" : "Comment unliked",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// Edit a comment
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Only owner or admin can edit
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Only owner or admin can delete
    if (comment.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get all comments (admin only)
export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get all comments"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalComments = await Comment.countDocuments();

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      comments,
      totalComments,
    });
  } catch (error) {
    next(error);
  }
};
