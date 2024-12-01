import { TextInput, Button, Alert } from 'flowbite-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-all">
        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Don't worry! Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <TextInput
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  sizing="lg"
                />
              </div>
            </div>

            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin mr-2" size={20} />
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center mt-6">
              <Link
                to="/sign-in"
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Sign In
              </Link>
            </div>
          </form>

          {/* Alert Messages */}
          {success && (
            <Alert 
              color="success" 
              className="mt-6"
            >
              <div className="flex items-center">
                <Mail className="mr-2" size={16} />
                {success}
              </div>
            </Alert>
          )}
          
          {error && (
            <Alert 
              color="failure" 
              className="mt-6"
            >
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;