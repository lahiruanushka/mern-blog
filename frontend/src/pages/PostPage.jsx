import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button, Spinner, Badge, Card } from "flowbite-react";
import { Link, useParams } from "react-router-dom";
import { HiClock, HiCalendar, HiTag } from "react-icons/hi";
import CommentSection from "../components/CommentSection";
import PostCard from "../components/PostCard";
import FavoriteButton from "../components/FavoriteButton";

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchRecentPosts();
  }, []);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl mt-10 font-bold text-gray-900 dark:text-gray-100 mb-4">
          {post && post.title}
        </h1>

        <div className="flex justify-center items-center space-x-4 mb-6">
          <Link to={`/search?category=${post && post.category}`}>
            <Badge color="info" icon={HiTag} className="cursor-pointer">
              {post && post.category}
            </Badge>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 flex justify-center"
      >
        <img
          src={post && post.image}
          alt={post && post.title}
          className="w-auto max-h-[350px] object-contain rounded-xl shadow-lg"
        />
      </motion.div>

      <Card className="max-w-2xl mx-auto w-full mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <HiCalendar className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {post && new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <HiClock className="text-gray-500" />
            <span className="text-sm text-gray-600 italic">
              {post && (post.content.length / 1000).toFixed(0)} mins read
            </span>
          </div>
          <FavoriteButton post={post} />
        </div>
      </Card>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-2xl mx-auto w-full prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      />

      <CommentSection postId={post._id} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          Recent Articles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts &&
            recentPosts.map((recentPost) => (
              <motion.div
                key={recentPost._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PostCard post={recentPost} />
              </motion.div>
            ))}
        </div>
      </motion.div>
    </motion.main>
  );
};

export default PostPage;
