import { useState } from "react";
import Header from "../../widgets/header";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const ViewReservation = () => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eTicket, setETicket] = useState("");
  const [verification, setVerification] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (eTicket.trim() === "") {
      toast.error(`Please enter your E Tikcet`);
      return false;
    }
    if (!verification && !verificationId) {
      setIsLoading(true);
      try {
        const url = `${BOOKING_SERVICE_BASE_URL}/bookings/eTicket/${eTicket}`;
        const response = await axios.get(`${url}`);
        const { verificationId } = response.data;
        if (verificationId) {
          setVerificationId(verificationId);
        } else {
          setVerificationId(0);
          setVerification(true);
          setBooking(response.data);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else if (verificationId) {
      if (otp.length < 4) {
        toast.error("Please enter a valid OTP.");
        return;
      }
      setIsLoading(true);
      try {
        await axios.patch(
          `${BOOKING_SERVICE_BASE_URL}/otp-verifications/${verificationId}`,
          {
            otp: Number(otp),
          }
        );
        toast.success("Commuter verification successful");
        try {
          const url = `${BOOKING_SERVICE_BASE_URL}/bookings/eTicket/${eTicket}`;
          const response = await axios.get(`${url}`);
          const { verificationId } = response.data;
          if (!verificationId) {
            setBooking(response.data);
            setVerification(true);
          }
        } catch (error) {
          const errorMessage =
            error.response?.data?.error || "An unexpected error occurred.";
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
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
      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header title="View Reservations" tag="" />{" "}
        <div className="grid grid-cols-12 gap-6">
          {verification ? (
            <div className="col-span-12 md:col-span-5 bg-gray-800 rounded-lg shadow-lg p-8  transition duration-300">
              <h3 className="text-xl font-semibold text-yellow-500 mb-4 justify-start">
                Booking Details
              </h3>
              <div className="text-sm text-gray-300 space-y-2">
                <div className="flex justify-between text-blue-500">
                  <span className="font-semibold">Booking Id:</span>
                  <span>{booking.bookingId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Commuter:</span>
                  <span>
                    {booking.commuter.name.firstName}{" "}
                    {booking.commuter.name.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Trip Date:</span>
                  <span>{booking.trip.tripDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Route:</span>
                  <span>{booking.trip.route.routeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Departure Time:</span>
                  <span>{booking.trip.schedule.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Arrival Time:</span>
                  <span>{booking.trip.schedule.arrivalTime}</span>
                </div>

                <div className="flex justify-between">
                  <span className="font-semibold">Booking Status:</span>
                  <span>{booking.bookingStatus}</span>
                </div>
              </div>
            </div>
          ) : !verificationId ? (
            <div className="col-span-12 md:col-span-7 bg-gray-800 shadow-lg rounded-lg p-8">
              <form onSubmit={handleSubmit} className="text-sm">
                {" "}
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                  E Ticket Verification
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed text-sm">
                  Please enter your E ticket for getting the ticket details
                </p>
                <div className="flex mb-4 mt-8">
                  <div className="w-1/2 pr-2">
                    <input
                      type="3"
                      name="eTicket"
                      value={eTicket}
                      onChange={(e) => setETicket(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-white"></label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                        isLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
                      }`}
                    >
                      {isLoading ? <span>Please wait ... </span> : "Check"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="col-span-12 md:col-span-7 bg-gray-800 shadow-lg rounded-lg p-8">
              <form onSubmit={handleSubmit} className="text-sm">
                {" "}
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                  Commuter Verification
                </h3>
                <p className="mt-2 text-gray-400 leading-relaxed text-sm">
                  You will be received an otp via entered email address. Please
                  verify your email address by entering received otp, This otp
                  will only be valid for 10 minutes
                </p>
                <div className="flex mb-4 mt-8">
                  <div className="w-1/2 pr-2">
                    <input
                      type="3"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg text-black"
                    />
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="block text-white"></label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                        isLoading
                          ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                          : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
                      }`}
                    >
                      {isLoading ? <span>Please wait ... </span> : "Verify"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ViewReservation;
