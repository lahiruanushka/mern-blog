import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  TrendingUp,
  BookOpen,
  Users,
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Filter,
  Grid,
  List,
  ChevronRight,
  Star,
  Award,
  Sparkles,
  Hash,
  User,
  Bookmark,
  ArrowRight,
  Globe,
  Target,
} from "lucide-react";
import { FaFire } from "react-icons/fa";

const ExplorePage = () => {
  // State management
  const [activeTab, setActiveTab] = useState("posts");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const [latestPosts] = useState([
    {
      id: 1,
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt:
        "Explore the cutting-edge technologies and methodologies shaping the future of web development.",
      author: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150",
        role: "Senior Developer",
      },
      category: { name: "Technology", color: "blue" },
      publishedAt: "2024-03-15",
      readTime: 8,
      views: 2850,
      likes: 142,
      comments: 28,
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      trending: true,
      featured: true,
    },
    {
      id: 2,
      title: "Mastering React Hooks: A Complete Guide",
      excerpt:
        "Learn how to effectively use React Hooks to build modern, efficient applications.",
      author: {
        name: "Michael Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
        role: "React Specialist",
      },
      category: { name: "React", color: "cyan" },
      publishedAt: "2024-03-12",
      readTime: 12,
      views: 1920,
      likes: 89,
      comments: 15,
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      trending: false,
      featured: false,
    },
    {
      id: 3,
      title: "Design Systems: Building Consistent User Experiences",
      excerpt:
        "Create cohesive and scalable design systems that enhance user experience across platforms.",
      author: {
        name: "Emma Thompson",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
        role: "UX Designer",
      },
      category: { name: "Design", color: "purple" },
      publishedAt: "2024-03-10",
      readTime: 6,
      views: 3200,
      likes: 198,
      comments: 42,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
      trending: true,
      featured: true,
    },
    {
      id: 4,
      title: "AI and Machine Learning in Modern Applications",
      excerpt:
        "Discover how AI and ML are revolutionizing software development and user experiences.",
      author: {
        name: "Dr. James Wilson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        role: "AI Research Lead",
      },
      category: { name: "AI/ML", color: "emerald" },
      publishedAt: "2024-03-08",
      readTime: 15,
      views: 4100,
      likes: 256,
      comments: 67,
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
      trending: true,
      featured: false,
    },
  ]);

  const [trendingTopics] = useState([
    { name: "React 18", count: 45, growth: "+12%", color: "blue" },
    { name: "TypeScript", count: 38, growth: "+8%", color: "indigo" },
    { name: "Next.js", count: 32, growth: "+15%", color: "purple" },
    { name: "UI/UX Design", count: 29, growth: "+6%", color: "pink" },
    { name: "Web Performance", count: 26, growth: "+11%", color: "green" },
    { name: "JavaScript", count: 24, growth: "+4%", color: "yellow" },
    { name: "CSS Grid", count: 21, growth: "+9%", color: "cyan" },
    { name: "API Development", count: 19, growth: "+7%", color: "orange" },
  ]);

  const [categories] = useState([
    {
      id: 1,
      name: "Technology",
      description: "Latest tech trends and innovations",
      postCount: 124,
      color: "blue",
      icon: "💻",
      growth: "+18%",
    },
    {
      id: 2,
      name: "Design",
      description: "UI/UX design principles and trends",
      postCount: 89,
      color: "purple",
      icon: "🎨",
      growth: "+23%",
    },
    {
      id: 3,
      name: "Development",
      description: "Programming tutorials and best practices",
      postCount: 156,
      color: "green",
      icon: "⚡",
      growth: "+15%",
    },
    {
      id: 4,
      name: "AI/ML",
      description: "Artificial intelligence and machine learning",
      postCount: 67,
      color: "emerald",
      icon: "🤖",
      growth: "+34%",
    },
    {
      id: 5,
      name: "Mobile",
      description: "Mobile app development and trends",
      postCount: 78,
      color: "orange",
      icon: "📱",
      growth: "+12%",
    },
    {
      id: 6,
      name: "Career",
      description: "Professional development and career advice",
      postCount: 45,
      color: "pink",
      icon: "🚀",
      growth: "+28%",
    },
  ]);

  const [authors] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      role: "Senior Full-Stack Developer",
      bio: "10+ years building scalable web applications",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150",
      posts: 24,
      followers: 1520,
      expertise: ["React", "Node.js", "TypeScript"],
      verified: true,
      featured: true,
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      role: "React Specialist & Consultant",
      bio: "Helping teams build better React applications",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      posts: 18,
      followers: 980,
      expertise: ["React", "JavaScript", "Testing"],
      verified: true,
      featured: false,
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "UX Designer & Researcher",
      bio: "Creating delightful user experiences through research",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      posts: 31,
      followers: 2100,
      expertise: ["UI/UX", "Design Systems", "Research"],
      verified: true,
      featured: true,
    },
    {
      id: 4,
      name: "Dr. James Wilson",
      role: "AI Research Lead",
      bio: "PhD in Computer Science, AI/ML specialist",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      posts: 15,
      followers: 3200,
      expertise: ["AI/ML", "Python", "Data Science"],
      verified: true,
      featured: true,
    },
  ]);

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  // Tab configuration
  const tabs = [
    {
      id: "posts",
      label: "Latest Posts",
      icon: BookOpen,
      count: latestPosts.length,
    },
    {
      id: "trending",
      label: "Trending Topics",
      icon: TrendingUp,
      count: trendingTopics.length,
    },
    {
      id: "categories",
      label: "Categories",
      icon: Grid,
      count: categories.length,
    },
    { id: "authors", label: "Authors", icon: Users, count: authors.length },
  ];

  // Filter posts based on search and category
  const filteredPosts = latestPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || post.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Render post card
  const PostCard = ({ post, index }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {post.featured && (
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {post.trending && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <FaFire ire className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 bg-${post.category.color}-500 text-white text-sm font-medium rounded-full`}
          >
            {post.category.name}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {post.author.name}
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {post.author.role}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </span>
          </div>

          <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all duration-300 font-medium">
            Read More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  // Render trending topic
  const TrendingCard = ({ topic, index }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.05 }}
      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl border border-white/50 dark:border-slate-700/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 bg-gradient-to-r from-${topic.color}-500 to-${topic.color}-600 rounded-xl flex items-center justify-center`}
        >
          <Hash className="w-6 h-6 text-white" />
        </div>
        <span className="text-green-500 font-bold text-sm flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {topic.growth}
        </span>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        #{topic.name}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm">
        {topic.count} posts this month
      </p>
    </motion.div>
  );

  // Render category card
  const CategoryCard = ({ category, index }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-${category.color}-500 to-${category.color}-600 rounded-3xl text-4xl mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          {category.icon}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {category.name}
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {category.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">
            {category.postCount} posts
          </span>
          <span className="text-green-500 font-bold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {category.growth}
          </span>
        </div>
      </div>
    </motion.div>
  );

  // Render author card
  const AuthorCard = ({ author, index }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
    >
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-20 h-20 rounded-3xl object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {author.verified && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          )}
          {author.featured && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
              Featured
            </div>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {author.name}
        </h3>

        <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
          {author.role}
        </p>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
          {author.bio}
        </p>

        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {author.expertise.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{author.posts} posts</span>
          <span>{author.followers.toLocaleString()} followers</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg mb-8">
                <Globe className="w-5 h-5" />
                <span className="font-semibold">Explore Content</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-8 bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Discover Amazing Content
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Explore our latest posts, trending topics, categories, and
                featured authors. Find exactly what you're looking for in our
                content universe.
              </p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/50 dark:border-slate-700/50">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Search Bar */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search posts, topics, authors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-700/80 rounded-2xl p-2">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-md"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-md"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="flex flex-wrap justify-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl p-2 shadow-lg border border-white/50 dark:border-slate-700/50">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 font-medium ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          activeTab === tab.id
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Content Sections */}
            <AnimatePresence mode="wait">
              {activeTab === "posts" && (
                <motion.div
                  key="posts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "trending" && (
                <motion.div
                  key="trending"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {trendingTopics.map((topic, index) => (
                      <TrendingCard
                        key={topic.name}
                        topic={topic}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "categories" && (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "authors" && (
                <motion.div
                  key="authors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {authors.map((author, index) => (
                      <AuthorCard
                        key={author.id}
                        author={author}
                        index={index}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More Button */}
            <motion.div variants={itemVariants} className="text-center mt-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3 mx-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Loading More...
                  </>
                ) : (
                  <>
                    Load More Content
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Statistics Section */}
            <motion.div variants={itemVariants} className="mt-20">
              <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-12 backdrop-blur-lg border border-white/20 dark:border-slate-700/20">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    Content Statistics
                  </h2>
                  <p className="text-xl text-slate-600 dark:text-slate-400">
                    Our growing community of knowledge and expertise
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {(latestPosts.length + 450).toLocaleString()}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Published Posts
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {authors.length + 24}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Expert Authors
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Grid className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {categories.length}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Categories
                    </p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-6 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {trendingTopics.length}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Trending Topics
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div variants={itemVariants} className="mt-20">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90"></div>
                <div className="relative z-10">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 opacity-80" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Share Your Knowledge?
                  </h2>
                  <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                    Join our community of expert writers and share your insights
                    with thousands of readers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-white text-blue-600 rounded-2xl hover:shadow-xl transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3"
                    >
                      Start Writing
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 border-2 border-white/20 text-white rounded-2xl hover:bg-white/10 transition-all duration-300 font-bold text-lg flex items-center justify-center gap-3"
                    >
                      Learn More
                      <Target className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Background decorations */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-gradient-to-br from-pink-400/10 to-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-40 w-28 h-28 bg-gradient-to-br from-green-400/10 to-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/3 left-1/2 w-36 h-36 bg-gradient-to-br from-indigo-400/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ExplorePage;
