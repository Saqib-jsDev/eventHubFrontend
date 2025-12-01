import { useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authThunk";
import api from "../utils/axios";

export default function Register() {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  ///
  const pros = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  ///
  let [color, setColor] = useState("#ffffff");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(register(form));
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border p-2 rounded"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="bg-green-600 text-white w-full py-2 rounded">
            Register
          </button>
        </form>
      </div>
      {loading && (
        <ClipLoader
          color={color}
          loading={loading}
          cssOverride={pros}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
      {error && <h1>{error}</h1>}{" "}
    </>
  );
}
