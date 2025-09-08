import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSearch, FaSun, FaBolt } from "react-icons/fa";
import {
  Home,
  Info,
  BookmarkCheck,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  UserCircle2,
  LayoutDashboard,
  LogOut,
  Cog,
  Bell,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../features/theme/themeSlice";
import { signoutSuccess } from "../features/user/userSlice";
import defaultAvatar from "/src/assets/default-avatar.png";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiMoon, HiSparkles, HiSun } from "react-icons/hi";

const Header = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchFromUrl = urlParams.get("searchTerm");

    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParms = new URLSearchParams(location.search);
    urlParms.set("searchTerm", searchTerm);

    const searchQuery = urlParms.toString();
    navigate(`/search?${searchQuery}`);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/posts", label: "Posts", icon: HiSparkles },
    { path: "/favorites", label: "Favorites", icon: Star },
    { path: "/about", label: "About", icon: Info },
  ];

  // Add a dynamic style based on theme
  const getSearchInputStyle = (isDark) => ({
    borderRadius: "16px",
    border: "1px solid transparent",
    background: isDark
      ? "linear-gradient(rgb(17 24 39), rgb(17 24 39)) padding-box, linear-gradient(45deg, #6366f1, #a855f7, #ec4899) border-box"
      : "linear-gradient(white, white) padding-box, linear-gradient(45deg, #4F46E5, #7C3AED, #DB2777) border-box",
  });

  return (
    <motion.div
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-700/50"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Gradient Border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <Navbar className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Link
            to="/"
            className="group flex items-center space-x-3 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
          >
            <div className="relative">
              {/* Animated background glow */}
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500"
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <div className="relative w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <FaBolt className="text-white text-xl drop-shadow-lg" />
                </motion.div>

                {/* Sparkle effects */}
                <motion.div
                  className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full opacity-60"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                />
              </div>
            </div>
            <div className="hidden sm:block">
              <motion.h1
                className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                ByteThoughts
              </motion.h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                One byte, one thought
              </p>
            </div>
          </Link>
        </motion.div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <div className="p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
              <TextInput
                type="text"
                placeholder="Discover thoughts and ideas..."
                rightIcon={() => (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <FaSearch className="w-4 h-4 text-gray-400 hover:text-purple-500 transition-colors" />
                  </motion.div>
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={getSearchInputStyle(theme === "dark")}
                className="
    w-full relative z-10 
    bg-transparent
    border-0
    outline-none          
    focus:ring-0          
    rounded-2xl
    text-gray-900 dark:text-gray-100
    placeholder-gray-500 dark:placeholder-gray-400
  "
              />
            </div>
          </form>
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleTheme())}
            className="relative p-2 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-200/50 dark:border-yellow-800/50 hover:from-yellow-500/20 hover:to-orange-500/20 transition-all duration-300"
            aria-label="Toggle theme"
          >
            <motion.div
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === "dark" ? (
                <HiSun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <HiMoon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              )}
            </motion.div>
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200/50 dark:border-purple-800/50 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300"
          >
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full animate-pulse"></div>
          </motion.button>

          {/* User Avatar or Sign In Button */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              className="mr-4"
              label={
                <motion.div
                  className="relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    alt="user"
                    img={currentUser.profilePicture || defaultAvatar}
                    rounded
                    size="sm"
                    className="ring-2 ring-gray-200 dark:ring-gray-700 hover:ring-purple-500 transition-all duration-300 shadow-lg"
                  />
                  <motion.div
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>
              }
            >
              <Dropdown.Header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
                <span className="block text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  @{currentUser.username}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400 truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>

              <Dropdown.Item
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                onClick={() => navigate(`/user/${currentUser?._id || ""}`)}
              >
                <span className="flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" />
                  Profile
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
                onClick={() => navigate("/settings")}
              >
                <span className="flex items-center gap-2">
                  <Cog className="w-4 h-4" />
                  Settings
                </span>
              </Dropdown.Item>

              <Dropdown.Divider />
              {currentUser.isAdmin && (
                <>
                  <Dropdown.Item
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
                    onClick={() => navigate("/dashboard")}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </span>
                  </Dropdown.Item>

                  <Dropdown.Divider />
                </>
              )}
              <Dropdown.Item
                onClick={handleSignout}
                className="text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </span>
              </Dropdown.Item>
            </Dropdown>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="group relative overflow-hidden px-3 sm:px-6 py-0.5 sm:py-1 font-bold text-white border-none shadow-none focus:ring-0 transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] hover:shadow-xl"
                onClick={() => navigate("/signin")}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="inline">Sign In</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform transition-transform group-hover:translate-x-0.5 sm:group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>
          )}

          <Navbar.Toggle className="ml-2 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200" />
        </div>

        <Navbar.Collapse>
          <div className="flex flex-col space-y-4 mt-6 md:hidden">
            {/* Mobile Search */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative">
                <TextInput
                  type="text"
                  placeholder="Search thoughts..."
                  rightIcon={FaSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  style={getSearchInputStyle(theme === "dark")}
                />
              </div>
            </form>

            {/* Enhanced Mobile Navigation */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Navbar.Link
                    key={item.path}
                    as={Link}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 font-bold shadow-lg transform scale-[1.02]"
                        : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                      />
                    )}
                  </Navbar.Link>
                );
              })}
            </div>
          </div>
        </Navbar.Collapse>
      </Navbar>

      {/* Desktop Navigation - Hidden by default, only show when needed */}
      <div className="hidden lg:block border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-8 py-3">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
                      : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeDesktopNavItem"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;
