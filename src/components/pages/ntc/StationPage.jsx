import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../widgets/header";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const StationPage = () => {
  const { token } = useAuth();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStation, setNewStation] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLocations = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/stations`, {
        params: {
          page,
          limit: 10,
        },
      });
      setStations(response.data.data);
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
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${CORE_SERVICE_BASE_URL}/stations/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Station deleted successfully :)");
      setStations(
        stations.filter((station) => station.stationId !== Number(id))
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (station) => {
    setSelectedStation(station);
    setNewStation({
      name: station.name,
      lat: station.coordinates.lat,
      log: station.coordinates.log,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: newStation.name,
        coordinates: {
          lat: newStation.lat,
          log: newStation.log,
        },
      };
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/stations/${selectedStation.stationId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Station updated successfully :)");
      setStations(
        stations.map((station) =>
          station.stationId === selectedStation.stationId
            ? response.data
            : station
        )
      );
      setSelectedStation(null);
      setShowUpdateForm(false);
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
    setNewStation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: newStation.name,
        coordinates: {
          lat: newStation.lat,
          log: newStation.log,
        },
      };
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/stations`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Station created successfully :)");
      setStations((prevStations) => [...prevStations, response.data]);
      setNewStation({ name: "", lat: 0, log: 0 });
      setShowAddForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchLocations(newPage);
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
        <Header title="Manage Bus Stations" />

        {/* Button to toggle form visibility */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Station
        </button>

        {/* Add Station Form (single line layout) */}
        {showAddForm && (
          <form
            onSubmit={handleAddStation}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 flex items-center gap-4"
          >
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Station Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStation.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter station name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Latitude</label>
                <input
                  type="decimal"
                  name="lat"
                  value={newStation.lat}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter latitude"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Longitude</label>
                <input
                  type="decimal"
                  name="log"
                  value={newStation.log}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter longitude"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
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
                Add Station
              </button>
            </div>
          </form>
        )}

        {/* Update Station Form */}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdateStation}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 flex items-center gap-4"
          >
            <div className="flex gap-4">
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Station Name</label>
                <input
                  type="text"
                  name="name"
                  value={newStation.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter station name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Latitude</label>
                <input
                  type="decimal"
                  name="lat"
                  value={newStation.lat}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter latitude"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Longitude</label>
                <input
                  type="decimal"
                  name="log"
                  value={newStation.log}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter longitude"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
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
                Update Station
              </button>
            </div>
          </form>
        )}

        {/* Table for listing stations */}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Station ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Latitude
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Longitude
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Created At
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Last Updated At
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr
                  key={station.stationId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.stationId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.name}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.coordinates.lat}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.coordinates.log}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.createdAt}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {station.updatedAt}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(station)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(station.stationId)}
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

export default StationPage;
