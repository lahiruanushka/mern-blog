import { TextInput, Button, Alert, Progress } from "flowbite-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Check, Loader, KeyRound } from "lucide-react";
import zxcvbn from "zxcvbn";

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

  // Handle reCAPTCHA script loading
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

  // Execute reCAPTCHA verification
  const executeRecaptcha = () => {
    return new Promise((resolve, reject) => {
      if (window.grecaptcha && window.grecaptcha.execute) {
        window.grecaptcha
          .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
            action: 'reset_password',
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
    return result.score * 25;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "red";
    if (passwordStrength <= 50) return "yellow";
    if (passwordStrength <= 75) return "blue";
    return "green";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent rapid repeated attempts
    if (lastAttempt && Date.now() - lastAttempt < 2000) {
      setError("Please wait before trying again");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (passwordStrength < 75) {
      setError("Please create a stronger password");
      return;
    }

    setLoading(true);
    setError("");
    setLastAttempt(Date.now());

    try {
      // Execute reCAPTCHA only in production
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
          recaptchaToken 
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/sign-in"), 3000);
      } else {
        setError(data.message || "Failed to reset password.");
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
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <KeyRound
                size={40}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Reset Password
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please create a strong password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                  />
                  <TextInput
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                    className="pl-10 pr-10"
                    sizing="lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <Progress
                      progress={passwordStrength}
                      color={getStrengthColor()}
                      size="sm"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Password strength:{" "}
                      {passwordStrength <= 25
                        ? "Weak"
                        : passwordStrength <= 50
                        ? "Fair"
                        : passwordStrength <= 75
                        ? "Good"
                        : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                />
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
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
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {success && (
            <Alert color="success" className="mt-6">
              <div className="flex items-center">
                <Check className="mr-2" size={16} />
                {success}
              </div>
            </Alert>
          )}

          {error && (
            <Alert color="failure" className="mt-6">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;