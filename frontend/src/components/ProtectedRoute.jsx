import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ redirectPath = "/signin" }) => {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    // Redirect to sign-in page if not authenticated
    return <Navigate to={redirectPath} replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
