import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { delEvent } from "../features/events/eventsThunk";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, events } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const currentEvent = events.find((event) => event.id === Number(params.id));
  const [event, setEvent] = useState(currentEvent);

  // useEffect(() => {
  //
  // }, [id]);

  const deleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(delEvent(+params.id));
      navigate(user.role === "resident" ? "/resident" : "admin");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold mb-2 text-green-600">{event.title}</h2>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <p className="text-gray-500 mb-1">
        {new Date(event.date).toLocaleString()}
      </p>
      <p className="text-gray-700 font-medium">{event.location}</p>
      <p className="text-sm mt-2">Approved: {event.approved ? "Yes" : "No"}</p>

      <div className="flex mt-4 space-x-4">
        <Link
          to={`/edit-event/${event.id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Edit
        </Link>
        <button
          onClick={deleteEvent}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
