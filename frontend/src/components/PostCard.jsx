import { HiArrowRight, HiClock, HiEye } from "react-icons/hi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const PostCard = ({ post, index }) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.1 }}
      className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-lg hover:shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:-translate-y-2"
    >
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {post?.isFeatured && (
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}

          {post?.isTrending && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
              <FaFire ire className="w-3 h-3" />
              Trending
            </span>
          )}
        </div>

        {/* Category */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 bg-${post?.category?.color}-500 text-white text-sm font-medium rounded-full`}
          >
            {post?.category?.name}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={post.user.profilePicture}
            alt={post.user.firstName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              <Link to={`/users/${post.user.username}`}>
                {post.user.firstName} {post.user.lastName}
              </Link>
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              @{post.user?.username}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer">
          <Link to={`/posts/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.publishAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post?.readTime || 0} min read
            </span>
          </div>
        </div>

        {/* Tags */}
        {post?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 my-4">
            {post.tags.map((tag, index) => {
              // Generate a consistent color based on the tag text
              const colors = [
                "from-blue-500 to-cyan-400",
                "from-purple-500 to-pink-500",
                "from-green-500 to-emerald-400",
                "from-amber-500 to-yellow-400",
                "from-rose-500 to-pink-400",
                "from-indigo-500 to-blue-400",
                "from-teal-500 to-cyan-400",
              ];
              const colorIndex =
                Math.abs(
                  tag
                    .split("")
                    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
                ) % colors.length;
              const gradient = colors[colorIndex];

              return (
                <span
                  key={index}
                  className={`px-1 py-1 text-xs font-medium rounded-full bg-clip-text text-transparent bg-gradient-to-r ${gradient} shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  #{tag}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post?.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post?.numberOfLikes || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post?.numberOfComments || 0}
            </span>
          </div>

          <div className="flex justify-end">
            <Link
              to={`/posts/${post.slug}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:gap-3 transition-all duration-300 font-medium"
            >
              Read More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
