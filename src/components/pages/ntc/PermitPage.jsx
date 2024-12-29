import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const PermitPage = () => {
  const { token } = useAuth();
  const [permits, setPermits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPermit, setNewPermit] = useState({});
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicleDetails = async (vehicleId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${CORE_SERVICE_BASE_URL}/vehicles/${vehicleId}`
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/vehicles`, {
          params: {
            all: true,
          },
        });
        setVehicles(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/routes`, {
          params: {
            all: true,
          },
        });
        setRoutes(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  const fetchPermits = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/permits`, {
        params: {
          page,
          limit: 10,
        },
      });
      setPermits(response.data.data);
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
    fetchPermits();
  }, []);

  const handleAddPermit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const thisVehicle = await fetchVehicleDetails(newPermit.vehicle);
      const request = {
        permitNumber: newPermit.permitNumber,
        issueDate: newPermit.issueDate,
        expiryDate: newPermit.expiryDate,
        route: Number(newPermit.route),
        vehicle: Number(newPermit.vehicle),
        busOperator: Number(thisVehicle.busOperator.operatorId),
      };
      console.log(`${JSON.stringify(request)}`);
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/permits`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Permit created successfully :)");
      setPermits((previousPermits) => [...previousPermits, response.data]);
      setNewPermit({});
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
      await axios.delete(`${CORE_SERVICE_BASE_URL}/permits/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Permit deleted successfully :)");
      setPermits(permits.filter((permit) => permit.permitId !== Number(id)));
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
    setNewPermit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchPermits(newPage);
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
        <Header title="Manage Permits" />
        <button
          onClick={() => {
            setNewPermit({});
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Create New Permit
        </button>
        {showAddForm && (
          <form
            onSubmit={handleAddPermit}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Permit Number</label>
              <input
                type="text"
                name="permitNumber"
                value={newPermit.permitNumber}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="PERMIT-2024-0003"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={newPermit.issueDate}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Select Issue Date"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                value={newPermit.expiryDate}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Select Expiry Date"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Route</label>
              <select
                name="route"
                value={newPermit.route}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the route</option>
                {routes.map((route) => (
                  <option key={route.routeId} value={Number(route.routeId)}>
                    {route.routeName} [{route.routeNumber}]
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Vehicle</label>
              <select
                name="vehicle"
                value={newPermit.vehicle}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                    {vehicle.model} [{vehicle.registrationNumber}]
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
                Add Permit
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Permit ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Permit Number
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Route
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Issue Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Expiry Date
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Vehicle
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Bus Operator
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {permits.map((permit) => (
                <tr
                  key={permit.permitId}
                  className="border-bs border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.permitId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.permitNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.route.routeNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.issueDate}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.expiryDate}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.vehicle.model}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {permit.busOperator.company}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleDelete(permit.permitId)}
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

export default PermitPage;
