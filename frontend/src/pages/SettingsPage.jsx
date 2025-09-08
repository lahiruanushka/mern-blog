import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser,
  FiSettings,
  FiLock,
  FiBell,
  FiCamera,
  FiMail,
  FiGithub,
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiEye,
  FiEyeOff,
  FiSave,
  FiLogOut,
  FiMoon,
  FiSun,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiShield,
  FiZap,
  FiEdit3
} from 'react-icons/fi';
import { Sparkles } from 'lucide-react';

const ByteThoughtsSettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: '', type: 'success' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef(null);

  // Mock user data
  const [userData, setUserData] = useState({
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    displayName: 'John Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about creating innovative solutions and sharing knowledge with the tech community.',
    socialLinks: {
      github: 'https://github.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      instagram: ''
    }
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    commentReplies: true,
    newsletter: false
  });

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const sections = [
    { 
      id: 'profile', 
      label: 'Profile', 
      icon: FiUser, 
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Manage your public profile'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: FiSettings, 
      gradient: 'from-green-500 to-emerald-500',
      description: 'Account preferences'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: FiLock, 
      gradient: 'from-red-500 to-pink-500',
      description: 'Privacy and security'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: FiBell, 
      gradient: 'from-purple-500 to-indigo-500',
      description: 'Email and push notifications'
    }
  ];

  const showToastNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData({ ...userData, avatar: e.target.result });
        showToastNotification('Profile photo updated successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    showToastNotification('Profile settings saved successfully!');
  };

  const handleSaveAccount = () => {
    showToastNotification('Account settings updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToastNotification('Passwords do not match!', 'error');
      return;
    }
    if (passwords.newPassword.length < 6) {
      showToastNotification('Password must be at least 6 characters!', 'error');
      return;
    }
    setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    showToastNotification('Password changed successfully!');
  };

  const handleLogoutAllDevices = () => {
    setShowModal(false);
    showToastNotification('Logged out from all devices successfully!');
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    showToastNotification('Notification preferences updated!');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const ProfileSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
              <FiUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Profile Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Manage your public profile information</p>
            </div>
          </div>

          {/* Avatar Upload */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-200 dark:ring-blue-800 shadow-xl"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 shadow-lg"
                >
                  <FiCamera size={16} />
                </motion.button>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload new photo</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Your profile photo will be displayed across ByteThoughts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Recommended: Square image, at least 400x400px. JPG, PNG or WebP. Max 5MB.
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={userData.displayName}
                onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
                className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter your display name"
              />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">@</span>
                <input
                  type="text"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  className="w-full pl-8 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              rows={4}
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              placeholder="Tell the community about yourself..."
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
            />
          </div>

          {/* Social Links */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              Social Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'github', icon: FiGithub, placeholder: 'GitHub profile URL', color: 'text-gray-700' },
                { key: 'twitter', icon: FiTwitter, placeholder: 'Twitter profile URL', color: 'text-blue-500' },
                { key: 'linkedin', icon: FiLinkedin, placeholder: 'LinkedIn profile URL', color: 'text-blue-600' },
                { key: 'instagram', icon: FiInstagram, placeholder: 'Instagram profile URL', color: 'text-pink-600' }
              ].map(({ key, icon: Icon, placeholder, color }) => (
                <div key={key} className="relative">
                  <Icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${color}`} size={18} />
                  <input
                    type="url"
                    placeholder={placeholder}
                    value={userData.socialLinks[key]}
                    onChange={(e) => setUserData({
                      ...userData,
                      socialLinks: { ...userData.socialLinks, [key]: e.target.value }
                    })}
                    className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiSave size={18} />
            Save Profile Changes
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const AccountSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Account Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Manage your account preferences</p>
            </div>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-gray-900 dark:text-white"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 font-semibold rounded-2xl hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/40 dark:hover:to-emerald-800/40 transition-all duration-300 border border-green-200 dark:border-green-800"
              >
                Update
              </motion.button>
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="mb-8">
            <div className="p-6 bg-gradient-to-r from-gray-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-indigo-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
                    {isDarkMode ? <FiMoon className="text-white" size={20} /> : <FiSun className="text-white" size={20} />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Theme Preference</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose between light and dark mode
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(16, 185, 129, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveAccount}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiSave size={18} />
            Save Account Settings
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  const SecuritySection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        {/* Change Password Card */}
        <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg">
                <FiLock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Security Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {[
                { key: 'oldPassword', label: 'Current Password', placeholder: 'Enter your current password' },
                { key: 'newPassword', label: 'New Password', placeholder: 'Enter a strong new password' },
                { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Confirm your new password' }
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword[key] ? 'text' : 'password'}
                      placeholder={placeholder}
                      value={passwords[key]}
                      onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                      className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, [key]: !showPassword[key] })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword[key] ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 25px 50px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleChangePassword}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 via-red-700 to-pink-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 mb-6"
            >
              <FiShield size={18} />
              Update Password
            </motion.button>

            <div className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 text-red-700 dark:text-red-300 font-semibold rounded-2xl border border-red-200 dark:border-red-800 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FiLogOut size={18} />
                Logout from All Devices
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const NotificationsSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg">
              <FiBell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Notification Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">Control what notifications you receive</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Receive email updates about your account activity and important announcements'
              },
              {
                key: 'commentReplies',
                label: 'Comment Replies',
                description: 'Get notified when someone replies to your comments or mentions you'
              },
              {
                key: 'newsletter',
                label: 'Newsletter Subscription',
                description: 'Receive our weekly newsletter with curated content and platform updates'
              }
            ].map(({ key, label, description }) => (
              <div key={key} className="p-6 bg-gradient-to-r from-gray-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {description}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                      notifications[key] 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-600' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        notifications[key] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'account': return <AccountSection />;
      case 'security': return <SecuritySection />;
      case 'notifications': return <NotificationsSection />;
      default: return <ProfileSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200/50 dark:border-indigo-800/50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mr-2" />
              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Account Settings
              </span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Customize Your Experience
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Personalize your ByteThoughts profile and manage your account preferences with ease.
            </p>
          </motion.div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Enhanced Sidebar */}
            <motion.div
              variants={itemVariants}
              className="xl:w-80 flex-shrink-0"
            >
              <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden xl:block p-6">
                  <nav className="space-y-2">
                    {sections.map((section, index) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`group w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                            isActive
                              ? 'bg-gradient-to-r from-gray-50/80 to-indigo-50/80 dark:from-gray-800/80 dark:to-indigo-900/20 border-l-4 border-indigo-500'
                              : 'hover:bg-gradient-to-r hover:from-gray-50/60 hover:to-gray-100/60 dark:hover:from-gray-800/60 dark:hover:to-gray-700/60'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`p-3 rounded-xl transition-all duration-300 ${
                            isActive 
                              ? `bg-gradient-to-r ${section.gradient} shadow-lg` 
                              : `bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-gray-700/50 dark:to-gray-600/50 group-hover:${section.gradient}`
                          }`}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-white'}`} />
                          </div>
                          <div className="flex-1">
                            <span className={`font-bold text-base transition-all duration-300 ${
                              isActive 
                                ? 'text-indigo-700 dark:text-indigo-300' 
                                : 'text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                            }`}>
                              {section.label}
                            </span>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {section.description}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </nav>
                </div>

                {/* Mobile/Tablet Tabs */}
                <div className="xl:hidden p-4">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isActive = activeSection === section.id;
                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 mr-2 rounded-2xl transition-all duration-300 ${
                            isActive
                              ? 'bg-gradient-to-r from-indigo-100/80 to-purple-100/80 dark:from-indigo-900/30 dark:to-purple-900/30'
                              : 'hover:bg-gradient-to-r hover:from-gray-100/60 hover:to-indigo-100/60 dark:hover:from-gray-800/60 dark:hover:to-indigo-900/20'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className={`p-2 rounded-xl ${
                            isActive 
                              ? `bg-gradient-to-r ${section.gradient}` 
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}>
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                          </div>
                          <span className={`text-xs font-semibold whitespace-nowrap ${
                            isActive 
                              ? 'text-indigo-700 dark:text-indigo-300' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {section.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {renderSection()}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Logout Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/50 overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl">
                    <FiAlertTriangle className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                    Logout from All Devices?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    This will end all active sessions across all your devices. You'll need to sign in again everywhere.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogoutAllDevices}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Yes, Logout All
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white font-semibold rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.5, rotate: 10 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm"
          >
            <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              showToast.type === 'success' 
                ? 'bg-green-50/90 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
                : 'bg-red-50/90 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            }`}>
              <div className={`p-2 rounded-xl ${
                showToast.type === 'success'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-red-500 to-pink-600'
              }`}>
                {showToast.type === 'success' ? (
                  <FiCheck className="w-4 h-4 text-white" />
                ) : (
                  <FiX className="w-4 h-4 text-white" />
                )}
              </div>
              <span className="font-semibold flex-1">{showToast.message}</span>
              <button
                onClick={() => setShowToast({ show: false, message: '', type: 'success' })}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
              >
                <FiX size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ByteThoughtsSettings;