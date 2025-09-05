import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle, HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../features/user/userSlice";
import OAuth from "../components/OAuth";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import { Sparkles, Zap, Shield, Users, TrendingUp, Star } from "lucide-react";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [lastAttempt, setLastAttempt] = useState(null);
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle reCAPTCHA script loading
  useEffect(() => {
    dispatch(clearError());
    checkLoginBlock();

    if (import.meta.env.VITE_NODE_ENV === "production") {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_RECAPTCHA_SITE_KEY
      }`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value.trim(),
    }));
  };

  const checkLoginBlock = () => {
    const blockUntil = localStorage.getItem("loginBlockedUntil");
    if (blockUntil && parseInt(blockUntil) > Date.now()) {
      const remainingTime = Math.ceil(
        (parseInt(blockUntil) - Date.now()) / 1000 / 60
      );
      dispatch(
        signInFailure(
          `Too many login attempts. Please try again in ${remainingTime} minutes`
        )
      );
    } else {
      localStorage.removeItem("loginBlockedUntil");
    }
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: "login",
          })
          .then((token) => resolve(token))
          .catch(reject);
      } else {
        reject(new Error("reCAPTCHA not loaded"));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lastAttempt && Date.now() - lastAttempt < 2000) {
      dispatch(signInFailure("Please wait before trying again"));
      return;
    }

    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill out all fields"));
      return;
    }

    try {
      setLastAttempt(Date.now());
      dispatch(signInStart());

      let recaptchaToken = null;
      if (import.meta.env.VITE_NODE_ENV === "production") {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          dispatch(signInFailure("reCAPTCHA verification failed"));
          return;
        }
      }

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("loginBlockedUntil");
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        const attempts =
          parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        localStorage.setItem("loginAttempts", attempts);

        if (attempts >= 5) {
          const blockUntil = Date.now() + 15 * 60 * 1000;
          localStorage.setItem("loginBlockedUntil", blockUntil);
        }

        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(
        signInFailure("An unexpected error occurred. Please try again later.")
      );
    }
  };

  const stats = [
    { icon: Users, value: "50K+", label: "Active Users" },
    { icon: TrendingUp, value: "1M+", label: "Monthly Views" },
    { icon: Star, value: "4.9", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-20"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-6xl"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left Section - Branding & Stats */}
              <div className="relative p-8 lg:p-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col justify-between">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: Math.random() * 3,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to="/"
                      className="group inline-flex items-center space-x-4 mb-8"
                    >
                      <div className="relative">
                        <motion.div
                          className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          >
                            <FaBolt className="text-white text-2xl" />
                          </motion.div>
                        </motion.div>
                      </div>
                      <div>
                        <h1 className="text-4xl font-black text-white mb-1">
                          ByteThoughts
                        </h1>
                        <p className="text-purple-100 font-semibold tracking-wide">
                          One byte, one thought
                        </p>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mb-8"
                  >
                    <h2 className="text-3xl font-bold text-white mb-4">
                      Welcome Back!
                    </h2>
                    <p className="text-purple-100 text-lg leading-relaxed">
                      Continue your journey with ByteThoughts. Explore insights, 
                      connect with creators, and dive into the digital conversation 
                      that's shaping tomorrow.
                    </p>
                  </motion.div>

                  {/* Enhanced Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid grid-cols-3 gap-4"
                  >
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                        className="text-center"
                      >
                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
                          <div className="flex justify-center mb-2">
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-2xl font-bold text-white">
                            {stat.value}
                          </div>
                          <div className="text-purple-100 text-sm font-medium">
                            {stat.label}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Bottom Decoration */}
                <motion.div
                  className="relative z-10 flex items-center justify-center space-x-2 text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">Secure & Encrypted</span>
                </motion.div>
              </div>

              {/* Right Section - Sign In Form */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </motion.div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                        Sign In
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Access your account to continue your digital journey
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label
                        htmlFor="email"
                        className="block mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <FaEnvelope className="w-4 h-4 text-purple-600" />
                        Email Address
                      </Label>
                      <TextInput
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        required
                        onChange={handleChange}
                        className="w-full"
                        autoComplete="email"
                        style={{
                          borderRadius: '12px',
                          border: '2px solid transparent',
                          background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #4F46E5, #7C3AED, #DB2777) border-box',
                        }}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label
                        htmlFor="password"
                        className="block mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <FaLock className="w-4 h-4 text-purple-600" />
                        Password
                      </Label>
                      <div className="relative">
                        <TextInput
                          type={showPassword ? "text" : "password"}
                          id="password"
                          placeholder="Enter your password"
                          required
                          onChange={handleChange}
                          className="w-full pr-12"
                          autoComplete="current-password"
                          style={{
                            borderRadius: '12px',
                            border: '2px solid transparent',
                            background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #4F46E5, #7C3AED, #DB2777) border-box',
                          }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <HiEyeOff className="w-5 h-5" />
                          ) : (
                            <HiEye className="w-5 h-5" />
                          )}
                        </motion.button>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={loading}
                        className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative flex items-center justify-center gap-2 text-lg">
                          {loading ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Signing in...
                            </>
                          ) : (
                            <>
                              Sign In
                              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </motion.button>
                    </motion.div>

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <Alert
                            color="failure"
                            icon={HiInformationCircle}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                          >
                            {error}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="space-y-4 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to="/forgot-password"
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-semibold transition-colors"
                      >
                        <Zap className="w-4 h-4" />
                        Forgot your password?
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link 
                          to="/sign-up" 
                          className="text-purple-600 hover:text-purple-700 font-bold hover:underline transition-all"
                        >
                          Sign up here
                        </Link>
                      </p>
                    </motion.div>

                    <motion.div
                      className="relative my-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400 font-medium">
                          Or continue with
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                    >
                      <OAuth />
                    </motion.div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInPage;