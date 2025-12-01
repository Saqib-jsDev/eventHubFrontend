import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EventUI from "../components/EventUI";
import { useDispatch, useSelector } from "react-redux";
import { LifeLine } from "react-loading-indicators";
import { getEvents } from "../features/events/eventsThunk";

const Landing = () => {
  const { events, loading, error } = useSelector((state) => state.events);
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getEvents());
  // }, []);

  return (
    <main className="w-full bg-white">
      {" "}
      {/* Updated to white background */}
      {/* Full-Width Hero Section */}
      <section className="w-full text-center py-20 bg--to-r from-emerald-500 to-blue-500 text-white">
        {" "}
        {/* Primary emerald to secondary blue */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Neighborhood Event Hub
        </h1>
        <p className="max-w-2xl text-black mx-auto text-lg md:text-xl px-4">
          Discover, create, and share local events in your area. Stay connected
          with your community.
        </p>
        <div className="mt-6">
          <button>
            <Link
              to="/add-event"
              className=" px-6 py-2 rounded-full font-semibold transition"
            >
              Post an Event
            </Link>
          </button>
        </div>
      </section>
      <EventUI />
      {/* {loading ? (
        <div className=" flex items-center justify-center ">
          <div className="w-full max-w-md px-4 md:px-8 text-center">
            <LifeLine
              color="#f97316"
              size="medium"
              text="Creating Event"
              textColor="#f97316"
              className="mx-auto"
            />
          </div>
        </div>
      ) : (
        <EventUI />
      )} */}
      {error && <h2>{error}</h2>}
    </main>
  );
};

export default Landing;
