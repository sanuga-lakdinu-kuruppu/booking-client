import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
  });
  const [tripDetails, setTripDetails] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const response = await axios.get(
          `${TRIP_SERVICE_BASE_URL}/trips/${tripId}`
        );
        setTripDetails(response.data);
        toast.success(`Trip selected ${response.data.tripId} :)`);
      } catch (error) {
        console.error("Failed to fetch trip details", error);
        toast.error("Failed to fetch trip details");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
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

      const response = await axios.post(
        `${BOOKING_SERVICE_BASE_URL}/commuters`,
        commuter
      );
      const { commuterId } = response.data;
      toast.success(
        `Commuter registered successfully! Commuter ID: ${commuterId}`
      );
    } catch (error) {
      console.error("Commuter registration failed", error);
      toast.error("Failed to register commuter");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-900 justify-center items-center text-gray-100">
      <div className="max-w-lg w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        {tripDetails ? (
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold text-yellow-500 mb-4">
              {tripDetails.route.routeName}
            </h3>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Trip Date:</strong> {tripDetails.tripDate}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Departure Time:</strong>{" "}
              {tripDetails.schedule.departureTime}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Arrival Time:</strong> {tripDetails.schedule.arrivalTime}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Capacity:</strong> {tripDetails.vehicle.capacity} seats
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <strong>Price per Seat:</strong> Rs.{" "}
              {tripDetails.vehicle.pricePerSeat}.00
            </p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading trip details...</p>
        )}

        <form onSubmit={handleSubmit} className="text-sm">
          {/* First Name and Last Name as Horizontal */}
          <div className="flex mb-4 ">
            <div className="w-1/2 pr-2">
              <label className="block text-white">First Name</label>
              <input
                type="text"
                name="firstName"
                value={commuterData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black"
                required
              />
            </div>
            <div className="w-1/2 pl-2">
              <label className="block text-white">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={commuterData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black"
                required
              />
            </div>
          </div>

          {/* NIC Field */}
          <div className="mb-4 ">
            <label className="block text-white">NIC</label>
            <input
              type="text"
              name="nic"
              value={commuterData.nic}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
          </div>

          {/* Mobile Field */}
          <div className="mb-4">
            <label className="block text-white">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={commuterData.mobile}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-4 ">
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              value={commuterData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transform transition-all duration-300 ease-in-out"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommuterRegistration;
