import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Badge, Button, Carousel } from "flowbite-react";
import {
  HiCode,
  HiDatabase,
  HiDesktopComputer,
  HiSearch,
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        setPosts(data.posts.slice(0, 6)); // Limit to 3 recent posts
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const technologies = [
    {
      icon: HiCode,
      title: "Web Development",
      description: "Explore cutting-edge web technologies and frameworks.",
    },
    {
      icon: HiDesktopComputer,
      title: "Software Engineering",
      description: "Deep dives into software design and best practices.",
    },
    {
      icon: HiDatabase,
      title: "Infrastructure",
      description: "Learn about scalable and efficient IT infrastructure.",
    },
  ];

  // Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
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
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-br from-teal-500 to-blue-500 text-white dark:from-teal-700 dark:to-blue-800"
        variants={itemVariants}
      >
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 text-center">
          <Badge color="purple" className="mb-4">
            New Content Every Week
          </Badge>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-6 text-white dark:text-gray-100"
            variants={itemVariants}
          >
            ByteThoughts: Your Tech Knowledge Hub
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90 dark:text-white/80"
            variants={itemVariants}
          >
            Dive deep into the world of technology with expert insights,
            comprehensive tutorials, and cutting-edge programming knowledge.
          </motion.p>
          <div className="flex justify-center space-x-4">
            <motion.div variants={itemVariants}>
              <Button
                color="light"
                size="lg"
                className="group"
                to="/search"
                as={Link}
              >
                <HiSearch className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Explore Posts
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button color="dark" size="lg" outline to="/about" as={Link}>
                Learn More
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Technologies Section */}
      <motion.div
        className="max-w-6xl mx-auto py-16 px-4"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          What We Cover
        </h2>
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              className="dark:bg-gray-800 dark:border-gray-700"
              variants={itemVariants}
            >
              <Card>
                <div className="flex flex-col items-center">
                  <tech.icon className="h-12 w-12 text-teal-500 dark:text-teal-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">
                    {tech.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Recent Posts Section */}
      {posts && posts.length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 py-16"
          variants={itemVariants}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
              Recent Posts
            </h2>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {posts.map((post) => (
                <motion.div key={post._id} variants={itemVariants}>
                  <PostCard post={post} />
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-10">
              <Button color="teal" size="lg" to="/search" as={Link}>
                View All Posts
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
