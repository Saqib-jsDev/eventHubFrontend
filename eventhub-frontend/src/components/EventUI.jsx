import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { delEvent, getEvents } from "../features/events/eventsThunk";
import { LifeLine } from "react-loading-indicators";
import { motion, AnimatePresence } from "framer-motion";

export default function EventUI() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);
  const { events, loading } = useSelector((state) => state.events);

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);

  // Search
  const searched = useMemo(() => {
    if (!Array.isArray(events)) return [];
    if (!search) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  // Sorting
  const sorted = useMemo(() => {
    if (!Array.isArray(searched)) return [];
    return [...searched]?.sort((a, b) => {
      let A = a[sortField];
      let B = b[sortField];

      // Date sorting fix
      if (sortField === "date") {
        A = new Date(A);
        B = new Date(B);
      } else if (typeof A === "string") {
        A = A.toLowerCase();
        B = B.toLowerCase();
      }

      if (sortOrder === "asc") return A > B ? 1 : -1;
      return A < B ? 1 : -1;
    });
  }, [searched, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / postPerPage);
  const paginated = sorted.slice((page - 1) * postPerPage, page * postPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(delEvent(id));
    }
  };

  return (
    <section className="w-full py-12 px-4 md:px-16">
      <h2 className="text-3xl font-bold text-center text-emerald-600 mb-8">
        All Events
      </h2>

      {/* Search */}
      <div className="flex justify-center gap-2 mb-8">
        <input
          type="text"
          placeholder="Search by title or location..."
          className="w-full max-w-[400px] px-4 py-3 border border-emerald-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="px-4 py-3 border border-emerald-500 focus:ring-2 focus:ring-emerald-500 rounded-lg"
          value={postPerPage}
          onChange={(e) => {
            setPostPerPage(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>

        {/* Sort Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => handleSort("title")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              sortField === "title"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Title{" "}
            {sortField === "title" && (sortOrder === "asc" ? "Up" : "Down")}
          </button>

          <button
            onClick={() => handleSort("date")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              sortField === "date"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Date {sortField === "date" && (sortOrder === "asc" ? "Up" : "Down")}
          </button>

          <button
            onClick={() => handleSort("location")}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              sortField === "location"
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Location{" "}
            {sortField === "location" && (sortOrder === "asc" ? "Up" : "Down")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-20">
          <LifeLine color="#10b981" size="large" text="Loading..." />
        </div>
      ) : (
        <>
          {/* Beautiful Cards with Animation */}
          <div className="max-w-5xl mx-auto">
            <AnimatePresence>
              {paginated.length === 0 ? (
                <p className="text-center text-gray-500 text-xl py-16">
                  No events found
                </p>
              ) : (
                <div className="space-y-6">
                  {paginated.map((e) => (
                    <motion.div
                      key={e.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -40 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-8 border-emerald-500 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-emerald-700 mb-3">
                            {e.title}
                          </h3>

                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {e.description}
                          </p>

                          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Date:</span>
                              <span>
                                {new Date(e.date).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-gap-2">
                              <span className="font-semibold">Location:</span>
                              <span className="text-emerald-600 font-medium">
                                {e.location}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                Creator Name:
                              </span>
                              <span className="text-emerald-600 font-medium">
                                {e.creatorName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">Approved:</span>
                              <span>{e.approved ? "Yes" : "No"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link
                            to={`/event-details/${e.id}`}
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition text-center font-medium"
                          >
                            View Details
                          </Link>

                          <Link
                            to={`/edit-event/${e.id}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center font-medium"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(e.id)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Previous
              </button>

              <span className="flex items-center px-6 text-lg">
                Page <strong className="mx-2">{page}</strong> of{" "}
                <strong className="mx-2">{totalPages}</strong>
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
