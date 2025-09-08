import { TextInput, Button, Alert, Progress } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader,
  KeyRound,
  Shield,
  Zap,
} from "lucide-react";
import zxcvbn from "zxcvbn";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaLock, FaCheckCircle } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [lastAttempt, setLastAttempt] = useState(null);

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

  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: "reset_password",
          })
          .then((token) => resolve(token))
          .catch(reject);
      } else {
        reject(new Error("reCAPTCHA not loaded"));
      }
    });
  };

  const getPasswordStrength = (password) => {
    const result = zxcvbn(password);
    return { score: result.score, feedback: result.feedback };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthPercentage = passwordStrength.score * 25;

  const getStrengthColor = () => {
    if (strengthPercentage <= 25) return "red";
    if (strengthPercentage <= 50) return "yellow";
    if (strengthPercentage <= 75) return "blue";
    return "green";
  };

  const getStrengthText = () => {
    if (strengthPercentage <= 25) return "Very Weak";
    if (strengthPercentage <= 50) return "Weak";
    if (strengthPercentage <= 75) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lastAttempt && Date.now() - lastAttempt < 2000) {
      setError("Please wait before trying again");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (strengthPercentage < 75) {
      setError("Please create a stronger password");
      return;
    }

    setLoading(true);
    setError("");
    setLastAttempt(Date.now());

    try {
      let recaptchaToken = null;
      if (import.meta.env.VITE_NODE_ENV === "production") {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          setError("reCAPTCHA verification failed");
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: formData.password,
          recaptchaToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword &&
      strengthPercentage >= 75
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
            {/* Header Section */}
            <div className="relative p-8 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-center">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-20">
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
                {/* Brand Logo */}
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-6"
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <KeyRound className="text-white text-3xl" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-white mb-2"
                >
                  Reset Password
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-purple-100 text-lg"
                >
                  Create a strong new password for your account
                </motion.p>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaLock className="w-4 h-4 text-purple-600" />
                      New Password
                    </label>
                    <div className="relative w-full">
                      <TextInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
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

                    {/* Password Strength Indicator */}
                    <AnimatePresence>
                      {formData.password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              Password Strength: {getStrengthText()}
                            </span>
                            {strengthPercentage >= 75 && (
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
                            progress={strengthPercentage}
                            color={getStrengthColor()}
                            size="sm"
                            className="mb-2"
                          />
                          {passwordStrength.feedback.suggestions.length > 0 && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {passwordStrength.feedback.suggestions[0]}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaLock className="w-4 h-4 text-purple-600" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <TextInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        className="w-full pr-12 rounded-xl border-2 border-transparent
                 dark:bg-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-purple-500"
                      />

                      {/* Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                          {formData.password === formData.confirmPassword ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-600"
                            >
                              <Check size={20} />
                            </motion.div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center relative">
                              <div className="w-2 h-0.5 bg-red-500 rotate-45 absolute" />
                              <div className="w-2 h-0.5 bg-red-500 -rotate-45 absolute" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className={`w-full relative overflow-hidden font-bold py-3 rounded-2xl shadow-xl transition-all duration-300 group ${
                      !loading && isFormValid()
                        ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:shadow-2xl"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                    whileHover={
                      !loading && isFormValid() ? { scale: 1.02 } : {}
                    }
                    whileTap={!loading && isFormValid() ? { scale: 0.98 } : {}}
                  >
                    {!loading && isFormValid() && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                    <span className="relative flex items-center justify-center gap-2 text-lg">
                      {loading ? (
                        <>
                          <Loader className="animate-spin w-5 h-5" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Reset Password
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Success/Error Messages */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6"
                    >
                      <Alert
                        color="success"
                        className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl"
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                          <span className="font-semibold">{success}</span>
                        </div>
                      </Alert>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-6"
                    >
                      <Alert
                        color="failure"
                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                      >
                        <span className="font-semibold">{error}</span>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Security Tips
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>
                          • Use a unique password you haven't used elsewhere
                        </li>
                        <li>
                          • Include uppercase, lowercase, numbers, and symbols
                        </li>
                        <li>• Make it at least 12 characters long</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
