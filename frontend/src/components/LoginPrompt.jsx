import React from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "flowbite-react";
import { motion } from "framer-motion";
import { HiUser, HiPencil, HiBookmark, HiHeart, HiLogin } from "react-icons/hi";

const LoginPrompt = ({ isOpen = true, onClose = () => {} }) => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Features list with icons and descriptions
  const features = [
    {
      icon: HiUser,
      text: "Access your personalized profile",
    },
    {
      icon: HiBookmark,
      text: "Save posts to read later",
    },
    {
      icon: HiHeart,
      text: "Like and interact with content",
    },
  ];

  // Navigation handlers
  const handleSignIn = () => {
    onClose();
    navigate("/signin");
  };

  const handleRegister = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <Modal show={isOpen} size="md" popup onClose={onClose} className="z-50">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
        className="relative bg-gray-900 dark:bg-gray-900 rounded-xl"
      >
        <Modal.Header className="border-b-0 pb-0 relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
          ></button>
        </Modal.Header>

        <Modal.Body className="relative z-10">
          <div className="text-center">
            {/* Logo/Icon */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center mb-6"
            >
              <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full shadow-lg">
                <HiLogin className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              className="text-2xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600"
            >
              Welcome to Our Community
            </motion.h2>

            {/* Description */}
            <motion.p variants={itemVariants} className="text-gray-400 mb-8">
              Sign in to unlock all features and join our growing community
            </motion.p>

            {/* Features list */}
            <motion.div variants={itemVariants} className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 text-gray-400"
                  whileHover={{ x: 5 }}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 shadow-sm">
                    <feature.icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="text-sm">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Action buttons */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Sign in button */}
              <Button
                onClick={handleSignIn}
                className="w-full"
                color="blue"
                gradientDuoTone="cyanToBlue"
              >
                Sign In
              </Button>

              {/* Register link */}
              <p className="text-sm text-gray-400">
                New here?{" "}
                <button
                  onClick={handleRegister}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  Create an account
                </button>
              </p>
            </motion.div>
          </div>
        </Modal.Body>
      </motion.div>
    </Modal>
  );
};

export default LoginPrompt;
