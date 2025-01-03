import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const SchedulePage = () => {
  const { token } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({});
  const [permits, setPermits] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    const fetchPermits = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/permits`, {
          params: {
            all: true,
          },
        });
        setPermits(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPermits();
  }, []);

  const fetchSchedules = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/schedules`, {
        params: {
          page,
          limit: 10,
        },
      });
      setSchedules(response.data.data);
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
    fetchSchedules();
  }, []);

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        route: { routeId },
      } = await getPermitDetails(newSchedule.permit);
      const request = {
        permit: Number(newSchedule.permit),
        route: Number(routeId),
        startLocation: Number(newSchedule.startLocation),
        endLocation: Number(newSchedule.endLocation),
        departureTime: newSchedule.departureTime,
        arrivalTime: newSchedule.arrivalTime,
      };
      console.log(`${JSON.stringify(request)}`);
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/schedules`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Permit created successfully :)");
      setSchedules((previousSchedules) => [
        ...previousSchedules,
        response.data,
      ]);
      setNewSchedule({});
      setShowAddForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${CORE_SERVICE_BASE_URL}/schedules/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Schedule deleted successfully :)");
      setSchedules(
        schedules.filter((schedule) => schedule.scheduleId !== Number(id))
      );
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
    setNewSchedule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchSchedules(newPage);
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
        <Header title="Manage Schedules" />
        <button
          onClick={() => {
            setNewSchedule({});
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Create New Schedule
        </button>
        {showAddForm && (
          <form
            onSubmit={handleAddSchedule}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Permit</label>
              <select
                name="permit"
                value={newSchedule.permit}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the permit</option>
                {permits.map((permit) => (
                  <option key={permit.permitId} value={Number(permit.permitId)}>
                    {permit.permitNumber} [{permit.route.routeNumber}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Start Location</label>
              <select
                name="startLocation"
                value={newSchedule.startLocation}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select Start Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.stationId}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">End Location</label>
              <select
                name="endLocation"
                value={newSchedule.endLocation}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select End Location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.stationId}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Departure Time</label>
              <input
                type="time"
                name="departureTime"
                value={newSchedule.departureTime}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Select Departure Time"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Arrival Time</label>
              <input
                type="time"
                name="arrivalTime"
                value={newSchedule.arrivalTime}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Select Arrival Time"
              />
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
                Add Schedule
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Schedule ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Route
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Start
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  End
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Permit
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Departure At
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Arrival At
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((schedule) => (
                <tr
                  key={schedule.scheduleId}
                  className="border-bs border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.scheduleId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.route.routeNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.startLocation.name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.endLocation.name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.permit.permitNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.departureTime}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {schedule.arrivalTime}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleDelete(schedule.scheduleId)}
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
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};
export default SchedulePage;
