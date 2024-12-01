import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import {
  signInStart,
  signInSuccess,
  signInFailure,
  clearError,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignInPage = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear any existing errors when the component mounts
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      //  console.log(data);

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        dispatch(signInFailure(data.message));
      }
    } catch (error) {
      console.error(error);
      dispatch(
        signInFailure("An unexpected error occurred. Please try again later.")
      );
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
            Welcome to ByteThoughts, where you can explore stories and connect
            with a vibrant community. Log in to access your account and start
            reading, commenting, and engaging with posts today.
          </p>
        </div>

        {/* Right section */}
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
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                required
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
                onChange={handleChange}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              className="w-full py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />{" "}
                  <span>Please wait...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <Link
              to="/forgot-password"
              className="text-indigo-500 hover:underline mt-4 block text-sm"
            >
              Forgot Password?
            </Link>

            <OAuth />
          </form>
          <div className="flex justify-between mt-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?
            </span>
            <Link to="/sign-up" className="text-indigo-500 hover:underline">
              Sign Up
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <Alert color="failure" icon={HiInformationCircle} className="mt-4">
              <span>{error}</span>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
