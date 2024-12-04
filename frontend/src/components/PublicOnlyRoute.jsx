import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const PublicOnlyRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  // If user is logged in, redirect to home page
  // Otherwise, render the auth-related components
  return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default PublicOnlyRoute;