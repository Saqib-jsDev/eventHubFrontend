import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/resident"} replace />
    );
  }

  return <Outlet />;
}
