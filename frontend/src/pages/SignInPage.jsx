import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiInformationCircle } from "react-icons/hi";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

const SignInPage = () => {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      console.log(data); // Check the response structure

      if (!data.success) {
        dispatch(signInFailure(data.message));
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error)
      dispatch(signInFailure("An unexepted error occured"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-4xl w-full mx-auto md:flex md:space-x-8">
        {/* Left section */}
        <div className="flex-1 mb-8 md:mb-0">
          <Link
            to="/"
            className="text-4xl font-extrabold text-gray-900 dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog
            </span>
            Nest
          </Link>
          <p className="mt-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Welcome to BlogNest, where you can share your stories and connect
            with others. Log in to access your account and start engaging with
            our community.
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
