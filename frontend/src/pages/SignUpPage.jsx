import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import OAuth from "../components/OAuth";

const SignUpPage = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      return setErrors("Please fill out all fields");
    }

    try {
      setLoading(true);
      setErrors(null);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        return setErrors(data.message);
      } else {
        navigate("/sign-in");
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
              <TextInput
                type="password"
                placeholder="Password"
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
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex justify-between mt-6 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Already have an account?
            </span>
            <Link to="/sign-in" className="text-indigo-500 hover:underline">
              Sign In
            </Link>
          </div>

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
