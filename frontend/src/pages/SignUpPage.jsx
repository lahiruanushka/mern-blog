import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Button,
  Label,
  Spinner,
  TextInput,
  Progress,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff, HiInformationCircle } from "react-icons/hi";
import OAuth from "../components/OAuth";
import zxcvbn from "zxcvbn";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBolt,
  FaEnvelope,
  FaLock,
  FaUser,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  Sparkles,
  Zap,
  Shield,
  Users,
  TrendingUp,
  Star,
  Crown,
  EyeOff,
  Eye,
} from "lucide-react";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const feedbackMessages = {
    0: "Password is very weak. Use a stronger combination of characters.",
    1: "Password is weak. Add more complexity.",
    2: "Password is moderate. Consider making it stronger.",
    3: "Password is strong, but could be even better.",
    4: "Excellent password strength!",
  };

  const passwordStrength = useMemo(() => {
    return formData.password ? zxcvbn(formData.password) : null;
  }, [formData.password]);

  const getProgressColor = () => {
    if (!passwordStrength) return "gray";
    switch (passwordStrength.score) {
      case 0:
      case 1:
        return "red";
      case 2:
        return "yellow";
      case 3:
      case 4:
        return "green";
      default:
        return "gray";
    }
  };

  const isSignupEnabled = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      passwordStrength &&
      passwordStrength.score >= 2
    );
  };

  useEffect(() => {
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
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: "signup",
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

    if (!formData.username || !formData.email || !formData.password) {
      return setErrors("Please fill out all fields");
    }

    if (passwordStrength.score < 2) {
      return setErrors("Please choose a stronger password");
    }

    try {
      setLoading(true);
      setErrors(null);

      let recaptchaToken = null;
      if (import.meta.env.VITE_NODE_ENV === "production") {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          setErrors("reCAPTCHA verification failed");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        return setErrors(data.message);
      } else {
        navigate("/verify-email", {
          state: { email: formData.email },
        });
      }
    } catch (error) {
      console.log(error);
      setErrors("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Users, text: "Join 50K+ creators" },
    { icon: Star, text: "Premium content access" },
    { icon: Crown, text: "Exclusive community features" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />

        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30"
            style={{
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 4) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 1,
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
            <div className="grid lg:grid-cols-2 min-h-[700px]">
              {/* Left Section - Branding */}
              <div className="relative p-8 lg:p-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col justify-between">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(25)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: Math.random() * 4,
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
                          whileHover={{ scale: 1.05, rotate: -5 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{
                              duration: 10,
                              repeat: Infinity,
                              ease: "linear",
                            }}
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
                      Join the Revolution
                    </h2>
                    <p className="text-purple-100 text-lg leading-relaxed mb-6">
                      Become part of ByteThoughts community where ideas
                      flourish, creativity meets technology, and every thought
                      has the power to inspire change.
                    </p>

                    {/* Benefits List */}
                    <div className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-center gap-3 text-white"
                        >
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <benefit.icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold">{benefit.text}</span>
                        </motion.div>
                      ))}
                    </div>
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
                  <span className="text-sm font-medium">
                    Secure Registration Process
                  </span>
                </motion.div>
              </div>

              {/* Right Section - Sign Up Form */}
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
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <Sparkles className="w-6 h-6 text-purple-600" />
                      </motion.div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                        Create Account
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Start your journey with ByteThoughts today
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label
                        htmlFor="username"
                        className="block mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <FaUser className="w-4 h-4 text-purple-600" />
                        Username
                      </Label>
                      <TextInput
                        type="text"
                        id="username"
                        placeholder="Choose a unique username"
                        required
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-transparent
            [background:linear-gradient(white,white)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
            dark:[background:linear-gradient(#1e293b,#1e293b)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
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
                        placeholder="Enter your email address"
                        required
                        autoComplete="email"
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-transparent
            [background:linear-gradient(white,white)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
            dark:[background:linear-gradient(#1e293b,#1e293b)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label
                        htmlFor="password"
                        className="block mb-3 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                      >
                        <FaLock className="w-4 h-4 text-purple-600" />
                        Password
                      </Label>
                      <div className="relative w-full">
                        <TextInput
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                          className="w-full rounded-xl border-2 border-transparent
      [background:linear-gradient(white,white)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
      dark:[background:linear-gradient(#1e293b,#1e293b)_padding-box,linear-gradient(45deg,#4F46E5,#7C3AED,#DB2777)_border-box]
      text-gray-900 dark:text-gray-100
      placeholder-gray-500 dark:placeholder-gray-400
      pr-12
      focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />

                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-purple-600 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </motion.button>
                      </div>

                      {/* Enhanced Password Strength Indicator */}
                      <AnimatePresence>
                        {formData.password && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Password Strength
                              </span>
                              {passwordStrength?.score >= 2 && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="text-green-600"
                                >
                                  <FaCheckCircle className="w-4 h-4" />
                                </motion.div>
                              )}
                            </div>
                            <Progress
                              progress={(passwordStrength?.score + 1) * 20}
                              color={getProgressColor()}
                              size="sm"
                              className="mb-2"
                            />
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {passwordStrength &&
                                feedbackMessages[passwordStrength.score]}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={loading || !isSignupEnabled()}
                        className={`w-full relative overflow-hidden font-bold py-3 rounded-xl shadow-xl transition-all duration-300 group ${
                          isSignupEnabled()
                            ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:shadow-2xl"
                            : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                        }`}
                        whileHover={isSignupEnabled() ? { scale: 1.02 } : {}}
                        whileTap={isSignupEnabled() ? { scale: 0.98 } : {}}
                      >
                        {isSignupEnabled() && (
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        )}
                        <span className="relative flex items-center justify-center gap-2 text-lg">
                          {loading ? (
                            <>
                              <Spinner size="sm" className="mr-2" />
                              Creating Account...
                            </>
                          ) : (
                            <>
                              Create Account
                              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </span>
                      </motion.button>
                    </motion.div>

                    <AnimatePresence>
                      {errors && (
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
                            {errors}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      <p className="text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                          to="/signin"
                          className="text-purple-600 hover:text-purple-700 font-bold hover:underline transition-all"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </motion.div>

                    <motion.div
                      className="relative my-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
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
                      transition={{ delay: 1 }}
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

export default SignUpPage;
