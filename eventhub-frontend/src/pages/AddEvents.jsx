import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../features/events/eventsThunk";
import { LifeLine } from "react-loading-indicators";
import EventUI from "../components/EventUI";
import EventForm from "../components/EventForm";

export default function AddEvent() {
  const { loading, events, error } = useSelector((state) => state.events);

  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          Add New Event
        </h2>
        <EventForm fnDispatch={createEvent} />

        {error && <h3>{error}</h3>}
      </div>
    </>
  );
}
