import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import TripCard from "../../widgets/tripCard";
import { ToastContainer, toast } from "react-toastify";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";
const TRIP_SERVICE_BASE_URL = "https://api.busriya.com/trip-service/v1.3";

const MakeReservation = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/stations`, {
          params: {
            all: true,
          },
        });
        setLocations(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleFindTrips = async () => {
    setLoading(true);
    console.log(
      `Finding trips from ${JSON.stringify(fromLocation)} to ${JSON.stringify(
        toLocation
      )} on ${selectedDate}`
    );
    try {
      const response = await axios.get(
        `${TRIP_SERVICE_BASE_URL}/trips/${Number(fromLocation)}/${Number(
          toLocation
        )}/${selectedDate}`
      );

      if (response.status === 200) {
        // const doubledTrips = new Array(6).fill(response.data).flat();
        setTrips(response.data);
        console.log("Response Data: ", response.data);
      } else {
        const errorMessage =
          response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
    setLoading(false);
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
        <Header
          title="Trips Available"
          tag="Choose your trip details and find your trip"
        />

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col w-full sm:w-1/4 text-sm">
              <label htmlFor="from" className="text-gray-400">
                Origin
              </label>
              <div className="relative mt-4">
                <select
                  id="from"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="bg-gray-700 text-white p-4 pl-8 pr-8 rounded-md appearance-none w-full"
                >
                  <option value="">Start Location</option>
                  {locations.map((location) => (
                    <option key={location.stationId} value={location.stationId}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                  &#9662;
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/4 text-sm">
              <label htmlFor="to" className="text-gray-400">
                Destination
              </label>
              <div className="relative mt-4">
                <select
                  id="to"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="bg-gray-700 text-white p-4 pl-8 pr-8 rounded-md appearance-none w-full"
                >
                  <option value="">End Location</option>
                  {locations.map((location) => (
                    <option key={location.stationId} value={location.stationId}>
                      {location.name}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400">
                  &#9662;
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/4 text-sm">
              <label htmlFor="date" className="text-gray-400">
                Trip Date
              </label>
              <div className="relative mt-4">
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-700 text-white p-4 rounded-md w-full"
                />
              </div>
            </div>

            <div className="flex flex-col w-full sm:w-1/4 text-sm">
              <div className="relative mt-9">
                <button
                  onClick={handleFindTrips}
                  disabled={loading}
                  className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                    loading
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
                  }`}
                >
                  Find Trips
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6 mt-8">
          {loading ? (
            <div className="flex justify-center items-center col-span-full">
              <ClipLoader color="#fbbf24" loading={loading} size={50} />
            </div>
          ) : (
            trips.map((trip, index) => <TripCard key={index} trip={trip} />)
          )}
        </div>
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};

export default MakeReservation;
