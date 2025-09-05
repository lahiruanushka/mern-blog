import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Badge, Timeline, Button } from "flowbite-react";
import {
  FaBolt,
  FaCode,
  FaGlobe,
  FaLightbulb,
  FaUsers,
  FaRocket,
  FaHeart,
  FaStar,
  FaArrowRight,
  FaQuoteLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Sparkles, Zap, Target, Eye, TrendingUp, Award, Crown, Shield } from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FaCode,
      title: "Byte-Sized Learning",
      description: "Digestible programming tutorials that break complex concepts into manageable thoughts",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20"
    },
    {
      icon: FaGlobe,
      title: "Global Perspectives",
      description: "Connect with developers worldwide and share diverse coding philosophies",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    {
      icon: FaLightbulb,
      title: "Innovative Ideas",
      description: "Spark creativity with cutting-edge techniques and forward-thinking approaches",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20"
    },
    {
      icon: FaRocket,
      title: "Career Growth",
      description: "Accelerate your development journey with industry-relevant insights",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
    },
    {
      icon: FaUsers,
      title: "Vibrant Community",
      description: "Join a supportive ecosystem where every thought and byte matters",
      color: "from-indigo-500 to-purple-500",
      bgColor: "from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20"
    },
    {
      icon: FaHeart,
      title: "Passionate Content",
      description: "Created with love by developers, for developers who care about quality",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-50 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20"
    },
  ];

  const stats = [
    { number: "50K+", label: "Active Readers", icon: FaUsers, color: "from-blue-500 to-cyan-500" },
    { number: "500+", label: "Articles Published", icon: FaCode, color: "from-green-500 to-emerald-500" },
    { number: "80+", label: "Countries Reached", icon: FaGlobe, color: "from-purple-500 to-pink-500" },
    { number: "4.9", label: "Community Rating", icon: FaStar, color: "from-yellow-500 to-orange-500" },
  ];

  const testimonials = [
    {
      quote: "ByteThoughts transformed how I approach learning. One byte, one thought - it really works! The community here is incredibly supportive.",
      author: "Sarah Chen",
      role: "Frontend Developer",
      avatar: "SC",
      company: "@Google"
    },
    {
      quote: "The quality of content here is unmatched. Every article sparks meaningful discussions and genuine learning moments.",
      author: "Marcus Rodriguez", 
      role: "Full Stack Engineer",
      avatar: "MR",
      company: "@Microsoft"
    },
    {
      quote: "Finally, a platform that makes complex topics feel approachable and exciting. The byte-sized approach is genius!",
      author: "Aisha Patel",
      role: "Software Architect",
      avatar: "AP", 
      company: "@Netflix"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const floatAnimation = {
    y: [-15, 15, -15],
    rotate: [0, 5, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Enhanced Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10"
      >
        {/* Enhanced Hero Section */}
        <motion.div variants={itemVariants} className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 py-24 text-center">
            <motion.div animate={floatAnimation} className="mb-12">
              <div className="relative inline-block">
                <motion.div
                  className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBolt className="text-white text-4xl" />
                  </motion.div>
                </motion.div>
                
                {/* Animated glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl blur-3xl opacity-30 animate-pulse" />
                
                {/* Sparkle effects */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${10 + (i % 3) * 30}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  />
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                About ByteThoughts
              </span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                ByteThoughts
              </span>
            </h1>
            
            <motion.p 
              className="text-3xl md:text-4xl text-gray-600 dark:text-gray-300 font-bold mb-8"
              variants={itemVariants}
            >
              One byte, one thought
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
              variants={itemVariants}
            >
              Where technology meets philosophy. We transform complex coding concepts into 
              digestible insights, fostering a community where every byte of knowledge 
              sparks meaningful thoughts and lasting connections.
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-wrap justify-center gap-4 mb-12"
            >
              {[
                { icon: FaCode, text: "Tech Learning Platform", color: "purple" },
                { icon: FaUsers, text: "Global Community", color: "pink" },
                { icon: FaLightbulb, text: "Innovation Hub", color: "indigo" },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="group"
                >
                  <Badge 
                    color={badge.color} 
                    size="lg" 
                    className="px-6 py-3 text-base font-semibold shadow-lg group-hover:shadow-xl transition-all duration-300"
                  >
                    <badge.icon className="mr-2" />
                    {badge.text}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Section */}
        <motion.div 
          variants={itemVariants} 
          className="py-20 bg-white/50 dark:bg-gray-800/30 backdrop-blur-xl border-y border-white/20 dark:border-gray-700/20"
        >
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={containerVariants}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group text-center"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <stat.icon className="text-white text-2xl" />
                      </div>
                      <div className="text-4xl font-black text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 font-semibold text-lg">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Mission & Vision */}
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div variants={containerVariants} className="grid md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-2xl relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-600 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                      }}
                    />
                  ))}
                </div>
                
                <div className="p-10 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Target className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                        Our Mission
                      </h2>
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-2" />
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    To democratize technology education by transforming complex programming 
                    concepts into accessible, bite-sized insights. We believe that every 
                    developer deserves quality learning resources that respect their time, 
                    intelligence, and unique learning journey.
                  </p>
                </div>
              </Card>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              <Card className="h-full bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-2xl relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-600 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 0.3, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: Math.random() * 4,
                      }}
                    />
                  ))}
                </div>
                
                <div className="p-10 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                      <Eye className="text-white text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-gray-900 dark:text-white">
                        Our Vision
                      </h2>
                      <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2" />
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    To create a world where learning technology is intuitive, engaging, 
                    and community-driven. We envision a future where every byte of 
                    knowledge shared creates ripples of innovation across the global 
                    developer ecosystem, fostering meaningful connections and breakthroughs.
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Enhanced Features Grid */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
              >
                <Crown className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Premium Features
                </span>
              </motion.div>
              
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                Why Choose ByteThoughts?
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Every feature is designed with our core philosophy in mind: meaningful learning through thoughtful content.
              </p>
            </div>
            
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="group relative"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <Card className="relative h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20 rounded-3xl overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-gray-600 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            opacity: [0, 0.3, 0],
                            scale: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: Math.random() * 3,
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="p-8 relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                      
                      {/* Hover indicator */}
                      <motion.div
                        className="mt-6 flex items-center text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 5 }}
                      >
                        <span className="text-sm font-semibold mr-2">Learn More</span>
                        <FaArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Testimonials */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
              >
                <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Community Love
                </span>
              </motion.div>
              
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-6 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                What Our Community Says
              </h2>
              <p className="text-2xl text-gray-600 dark:text-gray-300">
                Real feedback from real developers who've grown with us.
              </p>
            </div>
            
            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-3 gap-8"
            >
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/20 dark:border-gray-700/20 relative overflow-hidden">
                    {/* Quote decoration */}
                    <div className="absolute top-6 left-6 opacity-10">
                      <FaQuoteLeft className="text-purple-500 text-6xl" />
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed text-lg font-medium">
                        "{testimonial.quote}"
                      </p>
                      
                      <div className="flex items-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white font-bold text-lg">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-lg">
                            {testimonial.author}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {testimonial.role}
                          </div>
                          <div className="text-purple-600 text-sm font-semibold">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Timeline */}
          <motion.div variants={itemVariants} className="mb-20">
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500/10 via-purple-600/10 to-pink-500/10 border border-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full mb-8 backdrop-blur-sm"
              >
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Our Story
                </span>
              </motion.div>
              
              <h2 className="text-4xl font-black text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
                The ByteThoughts Journey
              </h2>
            </div>
            
            <Card className="bg-gradient-to-br from-gray-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/80 backdrop-blur-xl border-0 shadow-2xl border border-white/20 dark:border-gray-700/20">
              <div className="p-12 relative overflow-hidden">
                {/* Background animation */}
                <div className="absolute inset-0 opacity-5">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-purple-600 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 0.5, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                      }}
                    />
                  ))}
                </div>
                
                <Timeline className="relative z-10">
                  <Timeline.Item>
                    <Timeline.Point className="bg-gradient-to-br from-blue-500 to-indigo-500">
                      <FaRocket className="text-white" />
                    </Timeline.Point>
                    <Timeline.Content>
                      <Timeline.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Platform Genesis
                      </Timeline.Title>
                      <Timeline.Body className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        Born from the belief that learning should be accessible, engaging, 
                        and meaningful. ByteThoughts launched with our core philosophy: 
                        "One byte, one thought" - transforming complex concepts into 
                        digestible insights that respect developers' time and intelligence.
                      </Timeline.Body>
                    </Timeline.Content>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Timeline.Point className="bg-gradient-to-br from-green-500 to-emerald-500">
                      <FaUsers className="text-white" />
                    </Timeline.Point>
                    <Timeline.Content>
                      <Timeline.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Community Flourishing
                      </Timeline.Title>
                      <Timeline.Body className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        Our community grew organically as developers worldwide embraced 
                        our approach to thoughtful, byte-sized learning. Quality over quantity 
                        became our guiding principle, fostering meaningful discussions and 
                        lasting connections across continents.
                      </Timeline.Body>
                    </Timeline.Content>
                  </Timeline.Item>
                  <Timeline.Item>
                    <Timeline.Point className="bg-gradient-to-br from-purple-500 to-pink-500">
                      <FaLightbulb className="text-white" />
                    </Timeline.Point>
                    <Timeline.Content>
                      <Timeline.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Innovation & Evolution
                      </Timeline.Title>
                      <Timeline.Body className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                        Continuously evolving to meet the changing needs of developers. 
                        We remain committed to our mission: transforming complex concepts 
                        into meaningful insights while fostering a supportive ecosystem 
                        where every thought matters.
                      </Timeline.Body>
                    </Timeline.Content>
                  </Timeline.Item>
                </Timeline>
              </div>
            </Card>
          </motion.div>

          {/* Enhanced CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 border-0 shadow-2xl">
              {/* Animated background effects */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      y: [0, -30, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      delay: Math.random() * 6,
                    }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 p-16 text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-8"
                >
                  <Zap className="text-white text-3xl" />
                </motion.div>
                
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Join thousands of developers who've discovered the power of thoughtful, 
                  byte-sized learning. Start your journey with ByteThoughts today and 
                  become part of something extraordinary.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="xl"
                      className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-10 py-4 text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                      onClick={() => navigate("/search")}
                    >
                      <FaRocket className="mr-3" />
                      Start Exploring
                      <FaArrowRight className="ml-3" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="xl"
                      outline
                      className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold px-10 py-4 text-xl rounded-2xl transition-all duration-300"
                      onClick={() => navigate("/favorites")}
                    >
                      <FaHeart className="mr-3" />
                      View Favorites
                    </Button>
                  </motion.div>
                </div>
                
                {/* Social proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-12 flex items-center justify-center space-x-8 text-white/80"
                >
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Trusted by 50K+ developers</span>
                  </div>
                  <div className="hidden md:block w-px h-6 bg-white/30" />
                  <div className="flex items-center">
                    <FaStar className="w-5 h-5 mr-2" />
                    <span className="font-semibold">4.9/5 community rating</span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;