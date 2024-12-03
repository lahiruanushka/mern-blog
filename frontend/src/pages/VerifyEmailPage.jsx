import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, Button, Alert, Spinner } from "flowbite-react";
import { HiMail, HiRefresh } from "react-icons/hi";

const VerifyEmailPage = () => {
  const location = useLocation();
  const email = location.state?.email || "your email address";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification-email", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("A new verification email has been sent.");
      } else {
        setError(
          data.message || "Failed to resend the email. Please try again later."
        );
      }
    } catch (error) {
      setError("An error occurred while resending the email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-xl">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <HiMail className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>

          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Verify Your Email
          </h1>

          <div className="mb-4 text-base text-gray-500 dark:text-gray-400">
            A verification email has been sent to{" "}
            <span className="font-medium text-blue-600 dark:text-blue-400">
              {email}
            </span>
          </div>

          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Please check your inbox and follow the instructions to activate your
            account.
          </div>

          {successMessage && (
            <Alert color="success" icon={HiCheckCircle} className="mb-4">
              {successMessage}
            </Alert>
          )}

          {error && (
            <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
              {error}
            </Alert>
          )}

          <div className="mt-6 flex flex-col items-center space-y-4">
            <Button
              color="blue"
              onClick={handleResend}
              disabled={loading}
              className="w-full max-w-xs"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-3" />
                  Resending...
                </>
              ) : (
                <>
                  <HiRefresh className="mr-2 h-5 w-5" />
                  Resend Verification Email
                </>
              )}
            </Button>

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

export default VerifyEmailPage;
