import { TextInput, Button, Alert } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader, Send, Shield, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaEnvelope } from "react-icons/fa";
import { Sparkles } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
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
            action: "forgot_password",
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
      setError("Please wait before trying again");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
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

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          recaptchaToken,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || "Check your email for a reset link.");
        setEmail("");
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: Math.random() * 5,
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
                {[...Array(15)].map((_, i) => (
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
                {/* Brand Logo */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 mb-6"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <FaBolt className="text-white text-3xl" />
                  </motion.div>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-white mb-2"
                >
                  Forgot Password?
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-purple-100 text-lg"
                >
                  No worries! We'll help you reset it.
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
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <FaEnvelope className="w-4 h-4 text-purple-600" />
                      Email Address
                    </label>
                    <div className="relative">
                      <TextInput
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12"
                        style={{
                          borderRadius: '16px',
                          border: '2px solid transparent',
                          background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, #4F46E5, #7C3AED, #DB2777) border-box',
                        }}
                        disabled={loading}
                      />
                      <Mail
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                        size={20}
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className={`w-full relative overflow-hidden font-bold py-4 rounded-2xl shadow-xl transition-all duration-300 group ${
                      !loading && email.trim()
                        ? "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white hover:shadow-2xl"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                    whileHover={!loading && email.trim() ? { scale: 1.02 } : {}}
                    whileTap={!loading && email.trim() ? { scale: 0.98 } : {}}
                  >
                    {!loading && email.trim() && (
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                    <span className="relative flex items-center justify-center gap-2 text-lg">
                      {loading ? (
                        <>
                          <Loader className="animate-spin w-5 h-5" />
                          Sending Reset Link...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          Send Reset Link
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
                            <Mail className="w-4 h-4" />
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

                {/* Back to Sign In */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center mt-8"
                >
                  <Link
                    to="/signin"
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200 group"
                  >
                    <ArrowLeft 
                      size={16} 
                      className="group-hover:-translate-x-1 transition-transform" 
                    />
                    Back to Sign In
                  </Link>
                </motion.div>

                {/* Security Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="mt-6 p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Secure Process
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        For your security, reset links expire after 1 hour and can only be used once.
                      </p>
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

export default ForgotPasswordPage;