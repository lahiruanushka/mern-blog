import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button, Carousel } from "flowbite-react";
import { HiCode, HiDatabase, HiDesktopComputer, HiSearch } from "react-icons/hi";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts");
        const data = await res.json();
        setPosts(data.posts.slice(0, 3)); // Limit to 3 recent posts
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
      description: "Explore cutting-edge web technologies and frameworks."
    },
    {
      icon: HiDesktopComputer,
      title: "Software Engineering",
      description: "Deep dives into software design and best practices."
    },
    {
      icon: HiDatabase,
      title: "Infrastructure",
      description: "Learn about scalable and efficient IT infrastructure."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-teal-500 to-blue-500 text-white dark:from-teal-700 dark:to-blue-800">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 text-center">
          <Badge color="purple" className="mb-4">New Content Every Week</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white dark:text-gray-100">
            ByteThoughts: Your Tech Knowledge Hub
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white/90 dark:text-white/80">
            Dive deep into the world of technology with expert insights, 
            comprehensive tutorials, and cutting-edge programming knowledge.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              color="light" 
              size="lg" 
              className="group"
              href="/search"
              as={Link}
            >
              <HiSearch className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Explore Posts
            </Button>
            <Button 
              color="dark" 
              size="lg" 
              outline 
              href="/about"
              as={Link}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          What We Cover
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
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
          ))}
        </div>
      </div>

      {/* Recent Posts Section */}
      {posts && posts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
              Recent Posts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Button 
                color="teal" 
                size="lg" 
                href="/search"
                as={Link}
              >
                View All Posts
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}