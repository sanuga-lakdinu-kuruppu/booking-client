import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../widgets/header";
import LeftPanel from "../../widgets/LeftPanel";
import RightPanel from "../../widgets/RightPanel";
import { ToastContainer, toast } from "react-toastify";

const TRIP_SERVICE_BASE_URL = "https://api.busriya.com/trip-service/v1.3";
const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const CommuterRegistration = () => {
  const { tripId } = useParams();
  const [commuterData, setCommuterData] = useState({
    firstName: "",
    lastName: "",
    nic: "",
    mobile: "",
    email: "",
    seatNumber: "",
  });
  const [tripDetails, setTripDetails] = useState(null);
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [commuterId, setCommuterId] = useState(0);
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(0);
  const [bookingId, setBookingId] = useState(0);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(
          `${TRIP_SERVICE_BASE_URL}/trips/${tripId}`
        );
        setTripDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch trip details", error);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCommuterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateCommuterCreation = (commuterData) => {
    if (commuterData.firstName.trim() === "") {
      toast.error(`First Name is required`);
      return false;
    }
    if (commuterData.lastName.trim() === "") {
      toast.error(`Last Name is required`);
      return false;
    }
    if (commuterData.nic.trim() === "") {
      toast.error(`NIC is required`);
      return false;
    }
    const nicPattern = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;
    if (!nicPattern.test(commuterData.nic.trim())) {
      toast.error(`Invalid NIC format`);
      return false;
    }
    if (commuterData.mobile.trim() === "") {
      toast.error(`Mobile Number is required`);
      return false;
    }
    const mobilePattern = /^\+94[0-9]{9}$/;
    if (!mobilePattern.test(commuterData.mobile.trim())) {
      toast.error(`Mobile Number must start with +94 and contain 12 digits`);
      return false;
    }
    if (commuterData.email.trim() === "") {
      toast.error(`Email is required`);
      return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(commuterData.email.trim())) {
      toast.error(`Invalid Email Address`);
      return false;
    }
    return true;
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (step === 0) {
      const isValidated = validateCommuterCreation(commuterData);
      if (!isValidated) return;
      setIsLoading(true);
      try {
        const commuter = {
          name: {
            firstName: commuterData.firstName,
            lastName: commuterData.lastName,
          },
          nic: commuterData.nic,
          contact: {
            mobile: commuterData.mobile,
            email: commuterData.email,
          },
        };

        const url = `${BOOKING_SERVICE_BASE_URL}/commuters`;
        const response = await axios.post(`${url}`, commuter);
        const { commuterId } = response.data;
        setCommuterId(commuterId);
        setStep(1);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 1) {
      const selectedSeat = Number(commuterData.seatNumber);
      const capacity = Number(tripDetails.vehicle.capacity);
      if (selectedSeat <= 0 || selectedSeat > capacity) {
        toast.error(`Select a valid seat`);
        return;
      }
      setIsLoading(true);
      try {
        const booking = {
          commuter: Number(commuterId),
          trip: Number(tripId),
          seatNumber: Number(commuterData.seatNumber),
        };
        const url = `${BOOKING_SERVICE_BASE_URL}/bookings`;
        const response = await axios.post(`${url}`, booking);
        const { verificationId } = response.data;
        setVerificationId(verificationId);
        setStep(2);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 2) {
      if (otp.length < 4) {
        toast.error("Please enter a valid OTP.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.patch(
          `${BOOKING_SERVICE_BASE_URL}/otp-verifications/${verificationId}`,
          {
            otp: Number(otp),
          }
        );
        setBookingId(response.data.bookingId);
        toast.success("Reservation Creation Successful.");
        setStep(3);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    } else if (step === 3) {
      setIsLoading(true);
      try {
        const response = await axios.post(
          `${BOOKING_SERVICE_BASE_URL}/booking-payments`,
          {
            booking: Number(bookingId),
          }
        );
        const { redirectUrl } = response.data;
        if (redirectUrl) {
          window.open(redirectUrl, "_blank");
        } else {
          toast.error("Redirect URL is not available.");
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
      <main className="container mx-auto p-6 flex-1 space-y-8">
        <Header title="Reservation Creation" tag="" />
        <div className="grid grid-cols-12 gap-6">
          {tripDetails ? <LeftPanel trip={tripDetails} /> : ""}

          <div className="col-span-12 md:col-span-7 bg-gray-800 shadow-lg rounded-lg p-8">
            {step === 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                  Commuter Creation
                </h3>
                <RightPanel
                  handleSubmitRegistration={handleSubmitRegistration}
                  isLoading={isLoading}
                  commuterData={commuterData}
                  handleInputChange={handleInputChange}
                />
              </div>
            ) : step === 1 ? (
              <form onSubmit={handleSubmitRegistration} className="text-sm">
                {" "}
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                  Select Your Seat
                </h3>
                <div className="flex mb-4 ">
                  <div className="w-1/2 pr-2">
                    <input
                      type="number"
                      name="seatNumber"
                      value={commuterData.seatNumber}
                      onChange={handleInputChange}
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
                      {isLoading ? <span>Please wait ... </span> : "Book"}
                    </button>
                  </div>
                </div>
              </form>
            ) : step === 2 ? (
              <form onSubmit={handleSubmitRegistration} className="text-sm">
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
            ) : (
              <form onSubmit={handleSubmitRegistration} className="text-sm">
                {" "}
                <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                  Payments
                </h3>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                    isLoading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
                  }`}
                >
                  {isLoading ? (
                    <span>Please wait ... </span>
                  ) : (
                    "Proceed to paymens"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommuterRegistration;
