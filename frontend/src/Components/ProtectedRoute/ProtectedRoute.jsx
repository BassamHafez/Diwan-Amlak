import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const currentRole = JSON.parse(localStorage.getItem("role"));

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (currentRole === requiredRole || !requiredRole) {
    return children;
  }

  const redirectMap = {
    user: "/dashboard",
    admin: "/admin-dashboard",
  };

  const redirectPath = redirectMap[currentRole] || "/login";
  return <Navigate to={redirectPath} />;
};

export default ProtectedRoute;
