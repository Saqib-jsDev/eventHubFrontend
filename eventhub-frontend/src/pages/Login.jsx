// src/pages/Login.js
import { useEffect, useState } from "react";
import { LifeLine } from "react-loading-indicators";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginThunk } from "../features/auth/authThunk";
import { getEvents } from "../features/events/eventsThunk";

export default function Login() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginThunk({ email, password }));
  };
  useEffect(() => {
    if (user?.role == "resident") {
      navigate("/resident");
    } else if (user?.role === "admin") {
      navigate("/admin");
    } else null;
  }, [user]);
  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-emerald-600">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-emerald-500 text-white w-full py-3 rounded-lg hover:bg-emerald-600 transition">
            Login
          </button>
        </form>
      </div>
      {loading && (
        <div className=" flex items-center justify-center ">
          <div className="w-full max-w-md px-4 md:px-8 text-center">
            <LifeLine
              color="#f97316"
              size="medium"
              text="loging in"
              textColor="#f97316"
              className="mx-auto"
            />
          </div>
        </div>
      )}
      {error && (
        <div className="flex justify-center text-[#f97316]">
          <h2> {error}</h2>
        </div>
      )}
    </>
  );
}
