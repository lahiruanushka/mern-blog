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

  // Password strength feedback messages
  const feedbackMessages = {
    0: "Password is very weak. Use a stronger combination of characters.",
    1: "Password is weak. Add more complexity.",
    2: "Password is moderate. Consider making it stronger.",
    3: "Password is strong, but could be even better.",
    4: "Excellent password strength!",
  };

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    return formData.password ? zxcvbn(formData.password) : null;
  }, [formData.password]);

  // Determine progress color based on strength
  const getProgressColor = () => {
    if (!passwordStrength) return "gray";
    switch (passwordStrength.score) {
      case 0:
        return "red";
      case 1:
        return "red";
      case 2:
        return "yellow";
      case 3:
        return "green";
      case 4:
        return "green";
      default:
        return "gray";
    }
  };

  // Check if signup should be enabled
  const isSignupEnabled = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      passwordStrength &&
      passwordStrength.score >= 2
    );
  };

  // Existing reCAPTCHA and other methods remain the same...
  useEffect(() => {
    // Load reCAPTCHA script only in production
    if (import.meta.env.VITE_NODE_ENV === "production") {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_RECAPTCHA_SITE_KEY
      }`;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Clean up script on component unmount
        document.body.removeChild(script);
      };
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  // Existing executeRecaptcha method...
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

    // Additional password strength check before submission
    if (passwordStrength.score < 2) {
      return setErrors("Please choose a stronger password");
    }

    try {
      setLoading(true);
      setErrors(null);

      // Existing submission logic...
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
        // Redirect to email verification instructions page
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl w-full mx-auto md:flex md:space-x-8">
        {/* Left section */}
        <div className="flex-1 mb-8 md:mb-0">
          <Link
            to="/"
            className="text-4xl font-extrabold text-gray-900 dark:text-white inline-block transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 active:scale-95"
          >
            <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-md font-semibold transition-all duration-300 ease-in-out transform hover:shadow-md">
              ByteThoughts
            </div>
          </Link>

          <p className="mt-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Welcome to ByteThoughts, your space to discover ideas, stories, and
            insights shared by a passionate community of writers. Sign up to
            view, read, and share your thoughts by commenting on posts today!
          </p>
        </div>

        {/* Right section */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Sign Up
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your username
              </Label>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                required
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your email
              </Label>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                required
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Your password
              </Label>
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  id="password"
                  required
                  className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <Progress
                    progress={(passwordStrength.score + 1) * 25}
                    color={getProgressColor()}
                    size="sm"
                  />
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {passwordStrength &&
                      feedbackMessages[passwordStrength.score]}
                  </div>
                </div>
              )}
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              className="w-full py-3"
              disabled={loading || !isSignupEnabled()}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />{" "}
                  <span>Please wait...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="flex flex-col space-y-2 text-sm text-center">
              <span className="text-gray-500 dark:text-gray-400">
                Already have an account?
                <Link
                  to="/sign-in"
                  className="ml-1 text-indigo-500 hover:underline"
                >
                  Sign In
                </Link>
              </span>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <OAuth />
          </form>

          {/* Error Message */}
          {errors && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-4">
              <span>{errors}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
