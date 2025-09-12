import Post from "../models/postModel.js";
import { errorHandler } from "../utils/error.js";

// Create a new post
export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

// Get all posts with filters, pagination, search
export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    let posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate("userId", "username firstName lastName profilePicture isAdmin")
      .lean(); // returns plain JS objects

    // 🪄 Transform userId → user
    posts = posts.map((post) => ({
      ...post,
      user: post.userId, // rename
      userId: undefined, // remove old key
    }));

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
      totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a post
export const deletepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    if (req.user.id !== post.userId) {
      return next(errorHandler(403, "You are not allowed to delete this post"));
    }

    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "The post has been deleted" });
  } catch (error) {
    next(error);
  }
};

// Update a post
export const updatepost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    if (req.user.id !== post.userId) {
      return next(errorHandler(403, "You are not allowed to update this post"));
    }

    let slug = post.slug;
    if (req.body.title) {
      slug = req.body.title
        .split(" ")
        .join("-")
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, "");
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title || post.title,
          content: req.body.content || post.content,
          category: req.body.category || post.category,
          image: req.body.image || post.image,
          slug: slug,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

// Get a single post
export const getpost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id)
      .populate("userId", "username firstName lastName profilePicture isAdmin")
      .lean();

    if (!post) {
      return next(errorHandler(404, "Post not found"));
    }

    // Transform userId → user
    post = {
      ...post,
      user: post.userId,
      userId: undefined,
    };

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Like a post
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, "Post not found"));

    if (post.likes.includes(req.user.id)) {
      return next(errorHandler(400, "You already liked this post"));
    }

    post.likes.push(req.user.id);
    post.numberOfLikes = post.likes.length;

    await post.save();

    res.status(201).json({
      message: "Post liked successfully",
      postId: post._id,
      numberOfLikes: post.numberOfLikes,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};

// Unlike a post
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(errorHandler(404, "Post not found"));

    if (!post.likes.includes(req.user.id)) {
      return next(errorHandler(400, "You haven't liked this post"));
    }

    post.likes = post.likes.filter((id) => id !== req.user.id);
    post.numberOfLikes = post.likes.length;

    await post.save();

    res.status(200).json({
      message: "Post unliked successfully",
      postId: post._id,
      numberOfLikes: post.numberOfLikes,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};

// Get all likes of a post
export const getPostLikes = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select(
      "likes numberOfLikes"
    );
    if (!post) return next(errorHandler(404, "Post not found"));

    res.status(200).json({
      postId: post._id,
      numberOfLikes: post.numberOfLikes,
      likes: post.likes,
    });
  } catch (error) {
    next(error);
  }
};
