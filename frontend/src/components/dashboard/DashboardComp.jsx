import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiSparkles,
  HiTrendingUp,
  HiEye,
  HiHeart,
  HiChat,
  HiLightningBolt,
  HiGlobe,
  HiCalendar,
  HiClock,
} from "react-icons/hi";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getusers?limit=5");
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/getPosts?limit=5");
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getcomments?limit=5");
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      growth: lastMonthUsers,
      icon: HiOutlineUserGroup,
      gradient: "from-indigo-500 via-purple-600 to-pink-500",
      bgGradient:
        "from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-pink-950/50",
      glowColor: "0 25px 50px rgba(99, 102, 241, 0.4)",
    },
    {
      title: "Total Posts",
      value: totalPosts,
      growth: lastMonthPosts,
      icon: HiDocumentText,
      gradient: "from-emerald-500 via-teal-600 to-cyan-500",
      bgGradient:
        "from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50",
      glowColor: "0 25px 50px rgba(16, 185, 129, 0.4)",
    },
    {
      title: "Total Comments",
      value: totalComments,
      growth: lastMonthComments,
      icon: HiAnnotation,
      gradient: "from-orange-500 via-amber-500 to-yellow-500",
      bgGradient:
        "from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950/50 dark:via-amber-950/50 dark:to-yellow-950/50",
      glowColor: "0 25px 50px rgba(245, 158, 11, 0.4)",
    },
    {
      title: "Engagement Rate",
      value: "94.2%",
      growth: "+5.2%",
      icon: HiTrendingUp,
      gradient: "from-rose-500 via-pink-600 to-purple-500",
      bgGradient:
        "from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950/50 dark:via-pink-950/50 dark:to-purple-950/50",
      glowColor: "0 25px 50px rgba(236, 72, 153, 0.4)",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-20 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Dashboard Overview
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Welcome back, {currentUser?.username}! Here's what's happening
                with ByteThoughts.
              </p>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <HiLightningBolt className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  System Status
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative transform transition-all duration-300 hover:scale-105"
              style={{
                filter: "hover:drop-shadow(" + stat.glowColor + ")",
              }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 h-full">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`px-3 py-1 bg-gradient-to-r ${stat.gradient} bg-opacity-10 rounded-full`}
                  >
                    <span
                      className={`text-xs font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      +{stat.growth}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {stat.title}
                  </h3>
                  <div className="text-3xl font-black text-gray-900 dark:text-white">
                    {typeof stat.value === "number"
                      ? stat.value.toLocaleString()
                      : stat.value}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <HiArrowNarrowUp className="w-4 h-4 mr-1" />
                      <span className="font-semibold">This month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Posts */}
        <div className="lg:col-span-5 gap-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                    <HiDocumentText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Recent Posts
                  </h2>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  View All
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div
                    key={post._id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:transform hover:-translate-x-2"
                  >
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-16 h-12 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                        <span className="px-2 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <HiEye className="w-3 h-3" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No recent posts
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">
                Quick Actions
              </h2>
              <p className="text-indigo-100">
                Manage your content and community with ease
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Manage Users",
                  icon: HiOutlineUserGroup,
                  description: "View and manage users",
                },
                {
                  title: "Categories",
                  icon: HiSparkles,
                  description: "Organize your content",
                },
                {
                  title: "Analytics",
                  icon: HiTrendingUp,
                  description: "View detailed stats",
                },
              ].map((action, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
                >
                  <div className="inline-flex p-3 bg-white/20 rounded-xl mb-4">
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    {action.title}
                  </h3>
                  <p className="text-indigo-100 text-sm">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
