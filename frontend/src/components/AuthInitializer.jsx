import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { signInSuccess, signInFailure } from '../features/user/userSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only check auth if we don't have a user in the store
        if (!currentUser) {
          const response = await authService.getCurrentUser();
          if (response?.data?.user) {
            dispatch(signInSuccess(response.data.user));
          } else {
            dispatch(signInFailure('No active session found'));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        dispatch(signInFailure('Failed to check authentication status'));
      }
    };

    checkAuth();
  }, [dispatch, currentUser]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;
