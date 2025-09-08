import React, { useEffect, useState } from "react";
import { Button, Alert } from "flowbite-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [alertMessage, setAlertMessage] = useState(null); // State for alert messages
  const [alertType, setAlertType] = useState("failure"); // Type of alert (success, failure)

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
            action: "google_login",
          })
          .then((token) => resolve(token))
          .catch(reject);
      } else {
        reject(new Error("reCAPTCHA not loaded"));
      }
    });
  };

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Get reCAPTCHA token in production
      let recaptchaToken = null;
      if (import.meta.env.VITE_NODE_ENV === "production") {
        try {
          recaptchaToken = await executeRecaptcha();
        } catch (recaptchaError) {
          console.error("reCAPTCHA verification failed:", recaptchaError);
          setAlertMessage("Could not verify reCAPTCHA. Please try again.");
          setAlertType("failure");
          return;
        }
      }

      const resultsFromGoogle = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
          googleId: resultsFromGoogle.user.uid,
          recaptchaToken,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(signInSuccess(data));
        setAlertMessage("signin successful! Redirecting...");
        setAlertType("success");
        navigate("/");
      } else {
        console.error("Google signin failed", data.message);
        setAlertMessage(data.message || "Google signin failed.");
        setAlertType("failure");
      }
    } catch (error) {
      console.error("Could not sign in with Google", error);
      setAlertMessage("An error occurred during Google signin.");
      setAlertType("failure");
    }
  };

  return (
    <div className="space-y-4">
      {/* Display Alert if there's a message */}
      {alertMessage && (
        <Alert
          color={alertType}
          onDismiss={() => setAlertMessage(null)} // Dismiss alert on close
        >
          {alertMessage}
        </Alert>
      )}
      <Button
        type="button"
        gradientDuoTone="pinkToOrange"
        outline
        onClick={handleGoogleClick}
        className="w-full"
      >
        <FaGoogle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </div>
  );
};

export default OAuth;
