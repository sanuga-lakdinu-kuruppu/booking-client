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

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BOOKING_SERVICE_BASE_URL}/bookings`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingPage;
