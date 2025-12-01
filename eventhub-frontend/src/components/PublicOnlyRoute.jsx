import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PublicOnlyRoute() {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/resident"} replace />
    );
  }

  return <Outlet />;
}
