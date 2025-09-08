import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  // Check if user is logged in and is an admin
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : currentUser ? (
    // If user is logged in but not admin, redirect to dashboard
    <Navigate to="/dashboard/profile" />
  ) : (
    // If user is not logged in, redirect to sign in
    <Navigate to="/signin" />
  );
};

export default AdminPrivateRoute;