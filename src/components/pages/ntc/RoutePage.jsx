import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../widgets/header";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const RoutePage = () => {
  const { token } = useAuth();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newRoute, setNewRoute] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [locations, setLocations] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
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

  const fetchRoutes = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/routes`, {
        params: {
          page,
          limit: 10,
        },
      });
      setRoutes(response.data.data);
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
    fetchRoutes();
  }, []);

  const handleAddStation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        routeNumber: newRoute.routeNumber,
        routeName: newRoute.routeName,
        travelDistance: newRoute.travelDistance,
        travelDuration: newRoute.travelDuration,
        startStationId: Number(newRoute.startStationId),
        endStationId: Number(newRoute.endStationId),
      };
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/routes`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Route created successfully :)");
      setRoutes((previousRoutes) => [...previousRoutes, response.data]);
      setNewRoute({
        routeNumber: "",
        routeName: "",
        travelDistance: "",
        travelDuration: "",
        startStationId: "",
        endStationId: "",
      });
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
      await axios.delete(`${CORE_SERVICE_BASE_URL}/routes/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Route deleted successfully :)");
      setRoutes(routes.filter((route) => route.routeId !== Number(id)));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        routeNumber: newRoute.routeNumber,
        routeName: newRoute.routeName,
        travelDistance: newRoute.travelDistance,
        travelDuration: newRoute.travelDuration,
        startStationId: Number(newRoute.startStationId),
        endStationId: Number(newRoute.endStationId),
      };
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/routes/${selectedRoute.routeId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Route updated successfully :)");
      setRoutes(
        routes.map((route) =>
          route.routeId === selectedRoute.routeId ? response.data : route
        )
      );
      setSelectedRoute(null);
      setShowUpdateForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (route) => {
    setSelectedRoute(route);
    setNewRoute({
      routeNumber: route.routeNumber,
      routeName: route.routeName,
      travelDistance: route.travelDistance,
      travelDuration: route.travelDuration,
      startStationId: route.startLocation.stationId,
      endStationId: route.endLocation.stationId,
    });
    setShowUpdateForm(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchRoutes(newPage);
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
        <Header title="Manage Routes" />

        <button
          onClick={() => {
            setNewRoute({
              routeNumber: "",
              routeName: "",
              travelDistance: "",
              travelDuration: "",
              startStationId: "",
              endStationIds: "",
            });
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Route
        </button>

        {showAddForm && (
          <form
            onSubmit={handleAddStation}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Route Number</label>
              <input
                type="text"
                name="routeNumber"
                value={newRoute.routeNumber}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Route - 87/4"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Route Name</label>
              <input
                type="text"
                name="routeName"
                value={newRoute.routeName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Ex: Colombo - Kandy"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Start Location</label>
              <select
                name="startStationId"
                value={newRoute.startStationId}
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
                name="endStationId"
                value={newRoute.endStationId}
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
              <label className="text-gray-200 mb-2">Distance</label>
              <input
                type="text"
                name="travelDistance"
                value={newRoute.travelDistance}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Travel distance in KM"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Duration</label>
              <input
                type="text"
                name="travelDuration"
                value={newRoute.travelDuration}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Travel duration in hours"
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
                Add Route
              </button>
            </div>
          </form>
        )}

        {showUpdateForm && (
          <form
            onSubmit={handleUpdateRoute}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Route Number</label>
              <input
                type="text"
                name="routeNumber"
                value={newRoute.routeNumber}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Route - 87/4"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Route Name</label>
              <input
                type="text"
                name="routeName"
                value={newRoute.routeName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Ex: Colombo - Kandy"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Start Location</label>
              <select
                name="startStationId"
                value={newRoute.startStationId}
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
                name="endStationId"
                value={newRoute.endStationId}
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
              <label className="text-gray-200 mb-2">Distance</label>
              <input
                type="text"
                name="travelDistance"
                value={newRoute.travelDistance}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Travel distance in KM"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Duration</label>
              <input
                type="text"
                name="travelDuration"
                value={newRoute.travelDuration}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Travel duration in hours"
              />
            </div>
            <div className="col-span-2 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                disabled={loading}
                className="px-6 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition duration-200"
              >
                Update Route
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Route ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Route Number
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Route Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Travel Distance
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Travel Duration
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Start Location
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  End Location
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr
                  key={route.routeId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.routeId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.routeNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.routeName}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.travelDistance}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.travelDuration}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.startLocation.name}
                  </td>{" "}
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {route.endLocation.name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(route)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(route.routeId)}
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

export default RoutePage;
