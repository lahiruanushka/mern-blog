import { Footer as FlowbiteFooter, Button, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsPinterest,
  BsLinkedin,
  BsYoutube,
} from "react-icons/bs";
import { FaBolt, FaEnvelope, FaArrowRight, FaHeart } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Users,
  BookOpen,
  TrendingUp,
  Star,
  Send,
  Mail,
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (email.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Subscribing email:", email);
        setIsSubscribed(true);
        setEmail("");
        setIsLoading(false);

        // Reset the success message after 3 seconds
        setTimeout(() => {
          setIsSubscribed(false);
        }, 3000);
      }, 1000);
    }
  };

  const socialLinks = [
    {
      icon: BsFacebook,
      href: "https://www.facebook.com",
      color: "hover:text-blue-600",
      name: "Facebook",
    },
    {
      icon: BsTwitter,
      href: "https://www.twitter.com",
      color: "hover:text-blue-400",
      name: "Twitter",
    },
    {
      icon: BsInstagram,
      href: "https://www.instagram.com",
      color: "hover:text-pink-600",
      name: "Instagram",
    },
    {
      icon: BsLinkedin,
      href: "https://www.linkedin.com",
      color: "hover:text-blue-700",
      name: "LinkedIn",
    },
    {
      icon: BsYoutube,
      href: "https://www.youtube.com",
      color: "hover:text-red-600",
      name: "YouTube",
    },
    {
      icon: BsPinterest,
      href: "https://www.pinterest.com",
      color: "hover:text-red-500",
      name: "Pinterest",
    },
  ];

  const quickLinks = [
    { label: "Latest Posts", href: "#" },
    { label: "Trending Topics", href: "#" },
    { label: "Categories", href: "#" },
    { label: "Authors", href: "#" },
  ];

  const supportLinks = [
    { label: "Help Center", href: "/support" },
    { label: "Contact Us", href: "/support" },
    { label: "Community Guidelines", href: "/support" },
    { label: "Report Content", href: "/support" },
  ];

  const stats = [
    { icon: BookOpen, value: "500+", label: "Articles" },
    { icon: Users, value: "50K+", label: "Readers" },
    { icon: TrendingUp, value: "1M+", label: "Views" },
    { icon: Star, value: "4.9", label: "Rating" },
  ];

  return (
    <div className="relative bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <FlowbiteFooter className="relative bg-transparent border-t-0">
        <div className="w-full px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Enhanced Newsletter Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-12 sm:mb-16 shadow-2xl"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)",
                    "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>

            {/* Floating Sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${20 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}

            <div className="relative max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full mb-6 border border-white/30"
              >
                <Sparkles className="w-5 h-5 text-white mr-2" />
                <span className="text-white font-semibold">Stay Updated</span>
              </motion.div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
                Join Our Digital Journey
              </h3>
              <p className="text-purple-100 mb-8 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                Subscribe to our newsletter and become part of a community that
                transforms complex technology into digestible insights. Every
                byte matters.
              </p>

              <motion.form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex-1 relative">
                  <TextInput
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                    style={{
                      borderRadius: "16px",
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                    disabled={isLoading}
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubscribed || isLoading}
                  className="bg-white text-purple-600 hover:bg-gray-50 font-bold px-8 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 min-w-[140px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"
                        />
                        Joining...
                      </motion.div>
                    ) : isSubscribed ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-green-600"
                      >
                        ✨ Subscribed!
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        Subscribe
                        <Send className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.form>

              <AnimatePresence>
                {isSubscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-green-200 mt-4 font-semibold flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Welcome aboard! Check your email to confirm your
                    subscription.
                    <Sparkles className="w-4 h-4" />
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group text-center"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-black text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand Section */}
            <motion.div
              className="sm:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/"
                className="group inline-flex items-center space-x-4 mb-6"
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FaBolt className="text-white text-2xl" />
                    </motion.div>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ByteThoughts
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                    One byte, one thought
                  </p>
                </div>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed max-w-lg text-lg">
                Empowering minds through digital storytelling. Join our
                community of innovators, creators, and forward-thinkers as we
                explore the ideas that shape tomorrow's digital landscape.
              </p>

              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-gray-500 ${social.color} border border-white/20 dark:border-gray-700/20 group`}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links & Support Links */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-8">
              {/* Explore Links */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                  Explore
                </h3>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FlowbiteFooter.Link
                        href={link.href}
                        className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium flex items-center gap-2 group"
                      >
                        <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </FlowbiteFooter.Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Support Links */}
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  Support
                </h3>
                <div className="space-y-3">
                  {supportLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FlowbiteFooter.Link
                        onClick={() => navigate(link.href)}
                        className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium flex items-center gap-2 group"
                      >
                        <Zap className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {link.label}
                      </FlowbiteFooter.Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="relative">
            <FlowbiteFooter.Divider className="my-8 border-gray-200 dark:border-gray-700" />

            <motion.div
              className="flex flex-col lg:flex-row justify-between items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-2">
                  <FlowbiteFooter.Copyright
                    href="#"
                    by="ByteThoughts"
                    year={new Date().getFullYear()}
                    className="text-gray-500 dark:text-gray-400 font-medium"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaHeart className="w-4 h-4 text-red-500" />
                  </motion.div>
                </div>

                <div className="flex flex-wrap justify-center gap-6">
                  {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                    (item, index) => (
                      <motion.div
                        key={item}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <FlowbiteFooter.Link
                          href="#"
                          className="text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 font-medium"
                        >
                          {item}
                        </FlowbiteFooter.Link>
                      </motion.div>
                    )
                  )}
                </div>
              </div>

              <motion.div
                className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 px-4 py-2 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  hello@bytethoughts.com
                </span>
              </motion.div>
            </motion.div>

            {/* Bottom decorative line */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-full opacity-60" />
          </div>
        </div>
      </FlowbiteFooter>
    </div>
  );
};

export default Footer;
