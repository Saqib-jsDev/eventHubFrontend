import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import PublicLanding from "./pages/PublicLanding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import AddEvent from "./pages/AddEvents";
import EventDetails from "./pages/EventDetails";
import AdminDashboard from "./pages/AdminDashboard";
import EditEvent from "./pages/EditEvent";
import { getEvents } from "./features/events/eventsThunk";
import { useEffect } from "react";

// Protected Route
function ProtectedRoute({ allowedRoles = [] }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/resident"} replace />
    );
  }

  return <Outlet />;
}

// Public Route
function PublicOnlyRoute() {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/resident"} replace />
    );
  }
  return <Outlet />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* PUBLIC */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* RESIDENT */}
            <Route element={<ProtectedRoute allowedRoles={["resident"]} />}>
              <Route path="/resident" element={<Landing />} />
              <Route path="/add-event" element={<AddEvent />} />
            </Route>
            <Route
              element={<ProtectedRoute allowedRoles={["resident", "admin"]} />}
            >
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/event-details/:id" element={<EventDetails />} />
            </Route>
            {/* ADMIN */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white text-center py-4">
          © {new Date().getFullYear()} Neighborhood Event Hub
        </footer>
      </div>
    </Router>
  );
}

export default App;
