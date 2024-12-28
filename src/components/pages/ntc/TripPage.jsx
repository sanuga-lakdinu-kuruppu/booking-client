import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const TRIP_SERVICE_BASE_URL = "https://api.busriya.com/trip-service/v1.3";
const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const TripPage = () => {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTrip, setNewTrip] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [workers, setWorkers] = useState([]);

  const getVehicleDetails = async (vehicleId) => {
    try {
      const response = await axios.get(
        `${CORE_SERVICE_BASE_URL}/vehicles/${Number(vehicleId)}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const getScheduleDetails = async (scheduleId) => {
    try {
      const response = await axios.get(
        `${CORE_SERVICE_BASE_URL}/schedules/${Number(scheduleId)}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  const getPermitDetails = async (permitId) => {
    try {
      const response = await axios.get(
        `${CORE_SERVICE_BASE_URL}/permits/${Number(permitId)}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${CORE_SERVICE_BASE_URL}/bus-workers`
        );
        setWorkers(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/schedules`);
        setSchedules(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const fetchTripsForRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${TRIP_SERVICE_BASE_URL}/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrips(response.data);
      toast.success("Trip fetched successfully :)");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${TRIP_SERVICE_BASE_URL}/trips`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrips(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleUpdateStatus = async (tripId, type, newStatus) => {
    const endpoint =
      type === "bookingStatus"
        ? `${TRIP_SERVICE_BASE_URL}/trips/${tripId}/booking-status`
        : `${TRIP_SERVICE_BASE_URL}/trips/${tripId}/trip-status`;

    setLoading(true);
    try {
      const request =
        type === "tripStatus"
          ? { tripStatus: newStatus }
          : { bookingStatus: newStatus };
      const response = await axios.patch(endpoint, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTrips((prevTrips) =>
        prevTrips.map((trip) => (trip.tripId === tripId ? response.data : trip))
      );

      toast.success(
        `${
          type === "bookingStatus" ? "Booking" : "Trip"
        } status updated to ${newStatus}`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while updating status.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${TRIP_SERVICE_BASE_URL}/trips/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Trip deleted successfully :)");
      setTrips(trips.filter((trip) => trip.tripId !== Number(id)));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTrip = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const schedule = await getScheduleDetails(newTrip.schedule);
      const {
        vehicle: { vehicleId },
        busOperator: { operatorId },
      } = await getPermitDetails(schedule.permit.permitId);
      const {
        cancellationPolicy: { policyId },
      } = await getVehicleDetails(vehicleId);
      const request = {
        tripDate: newTrip.tripDate,
        startLocation: schedule.startLocation.stationId,
        endLocation: schedule.endLocation.stationId,
        schedule: schedule.scheduleId,
        route: schedule.route.routeId,
        driver: newTrip.driver,
        vehicle: vehicleId,
        conductor: newTrip.conductor,
        operator: operatorId,
        cancellationPolicy: policyId,
      };
      console.log(`${JSON.stringify(request)}`);
      await axios.post(`${TRIP_SERVICE_BASE_URL}/trips`, request, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Trip created successfully :)");
      setNewTrip({});
      setShowAddForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
        <Header title="Manage Trips" />
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setNewTrip({});
              setShowAddForm(!showAddForm);
            }}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
          >
            New Trip
          </button>
          <button
            onClick={fetchTripsForRefresh}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Refresh
          </button>
        </div>
        {showAddForm && (
          <form
            onSubmit={handleAddTrip}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Trip Date</label>
              <input
                type="date"
                name="tripDate"
                value={newTrip.tripDate}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Select Trip Date"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Schedule</label>
              <select
                name="schedule"
                value={newTrip.schedule}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the Schedule</option>
                {schedules.map((schedule) => (
                  <option key={schedule.scheduleId} value={schedule.scheduleId}>
                    Route: {schedule.route.routeNumber} (
                    {schedule.startLocation.name} - {schedule.endLocation.name})
                    - {schedule.departureTime} {schedule.arrivalTime}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Driver</label>
              <select
                name="driver"
                value={newTrip.driver}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the driver</option>
                {workers.map((worker) => (
                  <option key={worker.workerId} value={worker.workerId}>
                    {worker.name.firstName} {worker.name.lastName} |{" "}
                    {worker.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Conductor</label>
              <select
                name="conductor"
                value={newTrip.conductor}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the conductor</option>
                {workers.map((worker) => (
                  <option key={worker.workerId} value={worker.workerId}>
                    {worker.name.firstName} {worker.name.lastName} |{" "}
                    {worker.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={loading}
                className="px-6 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Add Trip
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Trip Number
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Trip Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Start
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  End
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Trip Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Booking Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Confirmed Seats
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Booking Close At
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Price Per Seat
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr
                  key={trip.tripId}
                  className="border-bs border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.tripNumber}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.tripDate}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.startLocation.name} [{trip.schedule.departureTime}]
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.endLocation.name} [{trip.schedule.arrivalTime}]
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    <select
                      value={trip.tripStatus}
                      onChange={(e) =>
                        handleUpdateStatus(
                          trip.tripId,
                          "tripStatus",
                          e.target.value
                        )
                      }
                      className={`bg-gray-800 text-gray-300 rounded px-2 py-1 ${
                        trip.tripStatus === "SCHEDULED"
                          ? "text-green-400"
                          : trip.tripStatus === "STARTED"
                          ? "text-blue-400"
                          : trip.tripStatus === "ENDED"
                          ? "text-gray-400"
                          : trip.tripStatus === "CANCELLED"
                          ? "text-red-400"
                          : ""
                      }`}
                    >
                      <option value="SCHEDULED" className="text-green-400">
                        SCHEDULED
                      </option>
                      <option value="STARTED" className="text-blue-400">
                        STARTED
                      </option>
                      <option value="ENDED" className="text-gray-400">
                        ENDED
                      </option>
                      <option value="CANCELLED" className="text-red-400">
                        CANCELLED
                      </option>
                    </select>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    <select
                      value={trip.bookingStatus}
                      onChange={(e) =>
                        handleUpdateStatus(
                          trip.tripId,
                          "bookingStatus",
                          e.target.value
                        )
                      }
                      className={`bg-gray-800 text-gray-300 rounded px-2 py-1 ${
                        trip.bookingStatus === "ENABLED"
                          ? "text-green-400"
                          : trip.bookingStatus === "SOLD_OUT"
                          ? "text-yellow-400"
                          : trip.bookingStatus === "DISABLED"
                          ? "text-red-400"
                          : ""
                      }`}
                    >
                      <option value="ENABLED" className="text-green-400">
                        ENABLED
                      </option>
                      <option value="SOLD_OUT" className="text-yellow-400">
                        SOLD_OUT
                      </option>
                      <option value="DISABLED" className="text-red-400">
                        DISABLED
                      </option>
                    </select>
                  </td>

                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.confirmedSeats.count}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.bookingCloseAt}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {trip.vehicle.pricePerSeat}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleDelete(trip.tripId)}
                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};
export default TripPage;
