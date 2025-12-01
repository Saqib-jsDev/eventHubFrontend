import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../utils/axios";

const PublicLanding = () => {
  //
  const [stats, setStats] = useState({ users: 235, events: 45 });
  const [nearEvents, setNearEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const { data } = await api.get("/nearest-events");

      setNearEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gray-50">
        <h2 className="text-4xl md:text-5xl font-bold text-emerald-600 mb-4">
          Connect. Share. Grow Together.
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Discover events happening around you — from garage sales to community
          meetups. Strengthen your neighborhood by joining hands today!
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/login"
            className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-lg shadow hover:bg-emerald-600 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg shadow hover:bg-orange-600 transition"
          >
            Register
          </a>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
          <div className="p-6 bg-emerald-50 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-emerald-600">
              {stats.users}
            </h3>
            <p className="text-gray-700 font-medium">Registered Users</p>
          </div>
          <div className="p-6 bg-orange-50 rounded-xl shadow-sm">
            <h3 className="text-3xl font-bold text-orange-500">
              {stats.events}
            </h3>
            <p className="text-gray-700 font-medium">Upcoming Events</p>
          </div>
        </div>
      </section>

      {/* NEAREST EVENTS */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl font-bold text-emerald-700 mb-8 text-center">
          Nearest Upcoming Events
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {nearEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-100 rounded-xl shadow-md hover:shadow-lg transition p-6 text-left"
            >
              <h4 className="text-lg font-semibold text-emerald-600 mb-2">
                {event.title}
              </h4>
              <p className="text-gray-500 text-sm mb-2">
                📅 {event.date} | 📍 {event.location}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 text-center py-4 text-gray-500 text-sm border-t">
        © 2025 Neighborhood Event Hub — Building Better Communities
      </footer>
    </div>
  );
};

export default PublicLanding;
