import { Calendar, User2, UserCircleIcon } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../features/actions/authActions";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state?.auth);
  const logout = () => {
    dispatch(logOut());
    navigate("/");
  };

  return (
    <nav className="bg-emerald-500 w-full text-white p-3 flex justify-between items-center shadow-md">
      <Link to="/" className="flex gap-2 text-lg font-bold">
        <Calendar />
        Neighborhood Event Hub{" "}
      </Link>
      <div className="flex items-center space-x-4">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user?.name && user?.role === "resident" && (
          <>
            <Link className="mr-6" to="/add-event">
              Add Event
            </Link>
            <User2 className="hover:text-[#3b82f6]" />
            <h3 className="hover:text-[#3b82f6]">{user?.name}</h3>
          </>
        )}
        {user?.name && user?.role === "admin" && (
          <div className="flex gap-3">
            <h3 className="hover:text-[#3b82f6]"> {user?.name}</h3>
            <UserCircleIcon className="hover:text-[#3b82f6]" />
          </div>
        )}
        {user?.name && (
          <button
            onClick={logout}
            className="bg-white text-green-700 px-3 py-1 rounded-md"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
