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
    // Clear any previous errors
    dispatch(clearError());

    // Check for login blocks
    checkLoginBlock();

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
  }, [dispatch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value.trim(),
    }));
  };

  // Check if user is temporarily blocked from logging in
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

  // Execute reCAPTCHA verification
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent rapid repeated attempts
    if (lastAttempt && Date.now() - lastAttempt < 2000) {
      dispatch(signInFailure("Please wait before trying again"));
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.password) {
      dispatch(signInFailure("Please fill out all fields"));
      return;
    }

    try {
      setLastAttempt(Date.now());
      dispatch(signInStart());

      // Execute reCAPTCHA only in production
      let recaptchaToken = null;
      if (import.meta.env.VITE_NODE_ENV === "production") {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          dispatch(signInFailure("reCAPTCHA verification failed"));
          return;
        }
      }

      // Send login request
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
        // Clear login block on successful login
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("loginBlockedUntil");

        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        // Handle failed login attempts
        const attempts =
          parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        localStorage.setItem("loginAttempts", attempts);

        if (attempts >= 5) {
          const blockUntil = Date.now() + 15 * 60 * 1000; // 15 minutes block
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl w-full mx-auto md:flex md:space-x-8">
        {/* Left section - Branding */}
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
            Welcome to ByteThoughts, where you can explore stories and connect
            with a vibrant community. Log in to access your account and start
            reading, commenting, and engaging with posts today.
          </p>
        </div>

        {/* Right section - Login Form */}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
            Sign In
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <TextInput
                type="email"
                id="email"
                placeholder="Email"
                required
                onChange={handleChange}
                className="w-full"
                autoComplete="email"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <TextInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  required
                  onChange={handleChange}
                  className="w-full"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    <HiEyeOff className="w-5 h-5" />
                  ) : (
                    <HiEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <div className="flex flex-col space-y-2 text-sm text-center">
              <Link
                to="/forgot-password"
                className="text-indigo-500 hover:underline"
              >
                Forgot your password?
              </Link>
              <span className="text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-indigo-500 hover:underline">
                  Sign up
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
          {error && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-4">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
