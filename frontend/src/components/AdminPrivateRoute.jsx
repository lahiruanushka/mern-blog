import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  // Check if user is logged in and is an admin
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : currentUser ? (
    // If user is logged in but not admin, redirect them to the main site
    // (avoid redirecting into /dashboard sub-paths which are admin-only)
    <Navigate to="/" replace />
  ) : (
    // If user is not logged in, redirect to sign in
    <Navigate to="/signin" replace />
  );
};

export default AdminPrivateRoute;
