import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ role }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;