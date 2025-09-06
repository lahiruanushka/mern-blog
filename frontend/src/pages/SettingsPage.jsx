import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  Button, 
  TextInput, 
  Textarea, 
  ToggleSwitch,
  Label,
  Modal,
  Toast
} from 'flowbite-react';
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
  FiAlertTriangle
} from 'react-icons/fi';

const SettingsPage = () => {
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
    bio: 'Software developer passionate about creating amazing user experiences.',
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
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'account', label: 'Account', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  const showToastNotification = (message, type = 'success') => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
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
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiUser className="text-blue-600" />
            Profile Settings
          </h3>

          {/* Avatar Upload */}
          <div className="mb-6">
            <Label htmlFor="avatar" value="Profile Photo" className="mb-2 block" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={userData.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <FiCamera size={16} />
                </button>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the camera icon to upload a new photo
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  JPG, PNG or GIF. Max size 5MB.
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

          {/* Display Name */}
          <div className="mb-4">
            <Label htmlFor="displayName" value="Display Name" />
            <TextInput
              id="displayName"
              value={userData.displayName}
              onChange={(e) => setUserData({ ...userData, displayName: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <Label htmlFor="bio" value="Bio" />
            <Textarea
              id="bio"
              rows={4}
              value={userData.bio}
              onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              className="mt-1"
            />
          </div>

          {/* Social Links */}
          <div className="mb-6">
            <Label value="Social Links" className="mb-3 block" />
            <div className="space-y-3">
              {[
                { key: 'github', icon: FiGithub, placeholder: 'GitHub URL' },
                { key: 'twitter', icon: FiTwitter, placeholder: 'Twitter URL' },
                { key: 'linkedin', icon: FiLinkedin, placeholder: 'LinkedIn URL' },
                { key: 'instagram', icon: FiInstagram, placeholder: 'Instagram URL' }
              ].map(({ key, icon: Icon, placeholder }) => (
                <div key={key} className="relative">
                  <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <TextInput
                    placeholder={placeholder}
                    value={userData.socialLinks[key]}
                    onChange={(e) => setUserData({
                      ...userData,
                      socialLinks: { ...userData.socialLinks, [key]: e.target.value }
                    })}
                    className="pl-10"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleSaveProfile} className="w-full" gradientDuoTone="purpleToBlue">
            <FiSave className="mr-2" size={16} />
            Save Profile
          </Button>
        </div>
      </Card>
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
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiSettings className="text-green-600" />
            Account Settings
          </h3>

          {/* Email */}
          <div className="mb-4">
            <Label htmlFor="email" value="Email Address" />
            <div className="flex gap-2 mt-1">
              <TextInput
                id="email"
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                className="flex-1"
                icon={FiMail}
              />
              <Button size="sm" color="gray">Update</Button>
            </div>
          </div>

          {/* Username */}
          <div className="mb-6">
            <Label htmlFor="username" value="Username" />
            <TextInput
              id="username"
              value={userData.username}
              onChange={(e) => setUserData({ ...userData, username: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be displayed in your profile URL
            </p>
          </div>

          {/* Theme Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                {isDarkMode ? <FiMoon className="text-indigo-600" /> : <FiSun className="text-yellow-600" />}
                <div>
                  <Label value="Theme Preference" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Choose your preferred theme
                  </p>
                </div>
              </div>
              <ToggleSwitch
                checked={isDarkMode}
                onChange={setIsDarkMode}
              />
            </div>
          </div>

          <Button onClick={handleSaveAccount} className="w-full" gradientDuoTone="greenToBlue">
            <FiSave className="mr-2" size={16} />
            Save Account Settings
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const SecuritySection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Change Password */}
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiLock className="text-red-600" />
            Security Settings
          </h3>

          <div className="space-y-4 mb-6">
            {[
              { key: 'oldPassword', label: 'Current Password', placeholder: 'Enter current password' },
              { key: 'newPassword', label: 'New Password', placeholder: 'Enter new password' },
              { key: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Confirm new password' }
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <Label htmlFor={key} value={label} />
                <div className="relative mt-1">
                  <TextInput
                    id={key}
                    type={showPassword[key] ? 'text' : 'password'}
                    placeholder={placeholder}
                    value={passwords[key]}
                    onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, [key]: !showPassword[key] })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword[key] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleChangePassword} className="w-full mb-4" gradientDuoTone="redToYellow">
            <FiLock className="mr-2" size={16} />
            Change Password
          </Button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button 
              onClick={() => setShowModal(true)}
              color="failure"
              className="w-full"
            >
              <FiLogOut className="mr-2" size={16} />
              Logout from All Devices
            </Button>
          </div>
        </div>
      </Card>
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
      <Card className="shadow-lg">
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
            <FiBell className="text-purple-600" />
            Notification Preferences
          </h3>

          <div className="space-y-4">
            {[
              {
                key: 'emailNotifications',
                label: 'Email Notifications',
                description: 'Receive email updates about your account activity'
              },
              {
                key: 'commentReplies',
                label: 'Comment Replies',
                description: 'Get notified when someone replies to your comments'
              },
              {
                key: 'newsletter',
                label: 'Newsletter Subscription',
                description: 'Receive our weekly newsletter with updates and tips'
              }
            ].map(({ key, label, description }) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <Label value={label} className="text-base font-medium" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {description}
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications[key]}
                  onChange={() => handleNotificationChange(key)}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar / Mobile Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <Card className="shadow-lg">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{section.label}</span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Tabs */}
              <div className="lg:hidden p-4">
                <div className="flex overflow-x-auto">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg mr-2 transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium whitespace-nowrap">{section.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {renderSection()}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-red-600" size={20} />
            Logout from All Devices
          </div>
        </Modal.Header>
        <Modal.Body>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to logout from all devices? This will end all active sessions 
            and you'll need to login again on all your devices.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex gap-2 w-full">
            <Button color="failure" onClick={handleLogoutAllDevices} className="flex-1">
              Yes, Logout All
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <div className={`flex items-center p-4 rounded-lg shadow-lg ${
              showToast.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
                : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            }`}>
              {showToast.type === 'success' ? (
                <FiCheck className="mr-3" size={20} />
              ) : (
                <FiX className="mr-3" size={20} />
              )}
              <span className="font-medium">{showToast.message}</span>
              <button
                onClick={() => setShowToast({ show: false, message: '', type: 'success' })}
                className="ml-3 text-current opacity-70 hover:opacity-100"
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

export default SettingsPage;