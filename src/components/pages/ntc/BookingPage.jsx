import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const BookingPage = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BOOKING_SERVICE_BASE_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          limit: 10,
        },
      });
      setBookings(response.data.data);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchBookings(newPage);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <main className="container mx-auto p-6 flex-1 space-y-8">
        <Header title="Manage Bookings" />
        {loading ? (
          <div className="flex justify-center items-center col-span-full">
            <ClipLoader color="#fbbf24" loading={loading} size={50} />
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
              <thead className="bg-gray-700">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Booking Id
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Trip Number
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Route
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Commuter
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Seat Number
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Booking Status
                  </th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                    Ticket Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="border-bs border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                  >
                    <td className="py-3 px-6 text-xs text-gray-300">
                      {booking.bookingId}
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-300">
                      {booking.trip.tripNumber}
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-300">
                      {booking.trip.startLocation.name} -{" "}
                      {booking.trip.endLocation.name}
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-300">
                      {booking.commuter.name.firstName}{" "}
                      {booking.commuter.name.lastName}
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-300">
                      {booking.seatNumber}
                    </td>
                    <td className="py-3 px-6 text-xs text-gray-300">
                      <span
                        className={`rounded px-2 py-1 ${
                          booking.bookingStatus === "CREATING"
                            ? "text-yellow-400 bg-yellow-900"
                            : booking.bookingStatus === "PENDING"
                            ? "text-blue-400 bg-blue-900"
                            : booking.bookingStatus === "PAID"
                            ? "text-green-400 bg-green-900"
                            : booking.bookingStatus === "CANCELLED"
                            ? "text-red-400 bg-red-900"
                            : booking.bookingStatus === "EXPIRED"
                            ? "text-gray-400 bg-gray-900"
                            : "text-gray-300"
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>

                    <td className="py-3 px-6 text-xs text-gray-300">
                      <span
                        className={`rounded px-2 py-1 ${
                          booking.ticketStatus === "NOT_USED"
                            ? "text-blue-400 bg-blue-900"
                            : booking.ticketStatus === "USED"
                            ? "text-green-400 bg-green-900"
                            : "text-gray-300 bg-gray-700"
                        }`}
                      >
                        {booking.ticketStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-controls mt-4 flex justify-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};

export default BookingPage;
