import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInSuccess, signInFailure } from "../features/user/userSlice";
import authService from "../services/authService";

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only check auth if we don't have a user in the store
        if (!currentUser) {
          const response = await authService.getCurrentUser();

          if (response?.data) {
            dispatch(signInSuccess(response.data.user));
          } else {
            dispatch(signInFailure("No active session found"));
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, [dispatch, currentUser]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
