import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getEvents } from "../features/events/eventsThunk";

export default function EventForm({ fnDispatch }) {
  let params = useParams();

  const { loading, events } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const currentEvent = events.find((event) => event.id === Number(params.id));
  const dateRef = useRef(null);

  const today = new Date();
  let todayString = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  todayString = todayString.replace("T", " ");

  const [form, setForm] = useState({
    id: +params.id,
    title: currentEvent?.title || "",
    description: currentEvent?.description || "",
    date: todayString,
    location: currentEvent?.location || "",
  });

  const cities = [
    "Karachi",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Hyderabad",
    "Peshawar",
    "Quetta",
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Set default current date-time

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);

    dispatch(fnDispatch(form));
    navigate(user.role === "resident" ? "/resident" : "admin");
  };
  useEffect(() => {
    const selectedEvent = events.find(
      (event) => event.id === Number(params.id)
    );
    setForm(selectedEvent);
    dispatch(getEvents());
  }, [params, dispatch]);
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={form?.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
            date: currentEvent?.date ? currentEvent?.date : todayString,
          })
        }
        className="w-full border p-2 rounded"
        required
      />

      {/* Description */}
      <textarea
        placeholder="Description"
        value={form?.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />

      {/* Date - Auto open calendar */}
      <input
        ref={dateRef}
        type="datetime-local"
        value={form?.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        className="w-full border p-2 rounded"
        required
        onClick={() => dateRef?.current?.showPicker?.()}
      />

      {/* Select City */}
      <select
        className="w-full border p-2 rounded"
        value={form?.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        required
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option
            key={city}
            value={city === currentEvent?.location ? city : null}
          >
            {city}
          </option>
        ))}
      </select>

      <button className="bg-green-600 text-white w-full py-2 rounded">
        Save Event
      </button>
    </form>
  );
}
