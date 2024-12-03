import { useState } from "react";
import { Button, TextInput, Alert } from "flowbite-react";
import { Eye, EyeOff, Lock, KeyRound } from "lucide-react";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";

const PasswordUpdateSection = () => {
  const [passwordUpdateMode, setPasswordUpdateMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error and success states
  const [updateUserError, setUpdateUserError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);

  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  const navigate = useNavigate();

  // Comprehensive password validation
  const validatePasswords = () => {
    const errors = [];

    // Check current password length
    if (currentPassword.length < 6) {
      errors.push("Current password is too short");
    }

    // Check new password strength
    const passwordStrength = zxcvbn(newPassword);

    // Check password match
    if (newPassword !== confirmPassword) {
      errors.push("New passwords do not match");
    }

    // Enforce strong password
    if (passwordStrength.score < 3) {
      errors.push(
        passwordStrength.feedback.warning || "Password is not strong enough"
      );

      // Add specific suggestions
      if (passwordStrength.feedback.suggestions.length > 0) {
        errors.push(
          "Suggestions: " + passwordStrength.feedback.suggestions.join(". ")
        );
      }
    }

    return errors;
  };

  const handleRequestOTP = async () => {
    // Validate current password before requesting OTP
    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setUpdateUserError(validationErrors[0]);
      return;
    }

    try {
      const res = await fetch("/api/user/request-password-update-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setOtpSent(true);
        setUpdateUserSuccess("OTP sent to your email");
        setUpdateUserError(null);
      } else {
        setUpdateUserError(data.message);
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Comprehensive validation
    const validationErrors = validatePasswords();

    if (validationErrors.length > 0) {
      setUpdateUserError(validationErrors[0]);
      return;
    }

    try {
      const res = await fetch("/api/user/update-password", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setUpdateUserSuccess("Password updated successfully");
        setUpdateUserError(null);
        setPasswordUpdateSuccess(true); // Add this line
        resetForm(); // Just reset the form
      } else {
        setUpdateUserError(data.message);
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };

  const resetForm = () => {
    setPasswordUpdateMode(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    setOtpSent(false);
  };

  // Password strength calculation
  const passwordStrength = newPassword ? zxcvbn(newPassword) : null;

  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
      {!passwordUpdateMode || passwordUpdateSuccess ? (
        <Button
          onClick={() => {
            setPasswordUpdateMode(true);
            setPasswordUpdateSuccess(false);
          }}
          gradientDuoTone="purpleToBlue"
          className="w-full flex items-center justify-center"
        >
          <Lock className="mr-2 h-5 w-5" />
          Change Password
        </Button>
      ) : (
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          {/* Current Password Input */}
          <div className="relative">
            <TextInput
              type={showCurrentPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setUpdateUserError(null);
              }}
              required
              icon={KeyRound}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password Input */}
          <div className="relative">
            <TextInput
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setUpdateUserError(null);
              }}
              required
              icon={Lock}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          <div className="flex h-1.5 space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 rounded-full ${
                  passwordStrength && passwordStrength.score >= level
                    ? "bg-green-500"
                    : "bg-gray-200 dark:bg-gray-700"
                } transition-colors duration-300`}
              />
            ))}
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <TextInput
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setUpdateUserError(null);
              }}
              required
              icon={Lock}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* OTP Section */}
          {!otpSent ? (
            <Button
              onClick={handleRequestOTP}
              gradientDuoTone="greenToBlue"
              outline
              className="w-full"
              disabled={!currentPassword}
            >
              Request OTP
            </Button>
          ) : (
            <div className="space-y-4">
              <TextInput
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setUpdateUserError(null);
                }}
                required
                maxLength={6}
              />
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                className="w-full"
                disabled={!otp || otp.length !== 6}
              >
                Update Password
              </Button>
            </div>
          )}

          {/* Cancel Button */}
          <div className="flex justify-between">
            <Button
              onClick={() => {
                resetForm();
              }}
              color="gray"
              outline
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Error and Success Alerts */}
      {updateUserError && (
        <Alert color="failure" className="mt-4">
          {updateUserError}
        </Alert>
      )}
      {updateUserSuccess && (
        <Alert color="success" className="mt-4">
          {updateUserSuccess}
        </Alert>
      )}
    </div>
  );
};

export default PasswordUpdateSection;
