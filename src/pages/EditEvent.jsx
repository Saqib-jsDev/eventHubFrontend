import { LifeLine } from "react-loading-indicators";
import EventUI from "../components/EventUI";
import EventForm from "../components/EventForm";
import { editEvent } from "../features/events/eventsThunk";
import { useSelector } from "react-redux";

export default function EditEvent() {
  const { loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4 text-green-600">Edit Event</h2>
        <EventForm fnDispatch={editEvent} />
        {loading && (
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
        )}
      </div>
      {user?.role === "resident" && <EventUI />}
    </>
  );
}
