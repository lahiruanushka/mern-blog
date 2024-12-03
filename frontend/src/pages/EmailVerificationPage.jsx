import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Alert, Spinner, Progress } from "flowbite-react";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiMail,
  HiXCircle,
  HiRefresh,
} from "react-icons/hi";

const EmailVerificationPage = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useParams();
  const navigate = useNavigate();

  const verifyEmail = async () => {
    setIsLoading(true);
    setError(null);
    setMessage("");

    try {
      const res = await fetch(`/api/auth/verify-email/${token}`);
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setMessage(
          data.message ||
            "Email verified successfully. You will be redirected to the login page."
        );
        setError(null);

        const timer = setInterval(() => {
          setCountdown((prev) => prev - 1);
        }, 1000);

        setTimeout(() => {
          navigate("/sign-in", {
            state: {
              verificationSuccess: true,
              message: "Email verified successfully. Please log in.",
            },
          });
        }, 5000);

        return () => clearInterval(timer);
      } else {
        setError(data.message || "Verification failed. Please try again.");
        setMessage("");
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        "An error occurred while verifying your email. Please try again."
      );
      setMessage("");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  const handleRetry = () => {
    setCountdown(5);
    verifyEmail();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              {isLoading ? (
                <HiMail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              ) : error ? (
                <HiXCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              ) : (
                <HiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isLoading
              ? "Verifying Your Email"
              : error
              ? "Verification Failed"
              : "Email Verified"}
          </h1>

          {isLoading ? (
            <div className="mb-4 text-base text-gray-500 dark:text-gray-400">
              Please wait while we verify your email address...
            </div>
          ) : error ? (
            <Alert color="failure" icon={HiXCircle} className="mb-4">
              {error}
            </Alert>
          ) : (
            <>
              <Alert color="success" icon={HiCheckCircle} className="mb-4">
                {message}
              </Alert>
              <div className="mb-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Redirecting to login in{" "}
                  <span className="font-medium">{countdown}</span> seconds
                </p>
                <Progress
                  progress={(countdown / 5) * 100}
                  size="sm"
                  color="blue"
                />
              </div>
            </>
          )}

          <div className="mt-6 flex flex-col items-center space-y-4">
            {error && (
              <div className="flex w-full max-w-xs flex-col space-y-2">
                <Button
                  color="blue"
                  onClick={handleRetry}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-3" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <HiRefresh className="mr-2 h-5 w-5" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button
                  color="gray"
                  onClick={() => navigate("/sign-in")}
                  className="w-full"
                >
                  <HiArrowLeft className="mr-2 h-5 w-5" />
                  Return to Login
                </Button>
              </div>
            )}

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help? Contact our{" "}
              <a
                href="/support"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                support team
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
