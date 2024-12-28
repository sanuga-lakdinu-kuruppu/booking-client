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
  const [operators, setOperators] = useState([]);

  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${CORE_SERVICE_BASE_URL}/bus-operators`
        );
        setOperators(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOperators();
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/vehicles`);
        setVehicles(response.data);
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
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/routes`);
        setRoutes(response.data);
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

  useEffect(() => {
    const fetchPermits = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/permits`);
        setPermits(response.data);
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

  const handleAddPermit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        permitNumber: newPermit.permitNumber,
        issueDate: newPermit.issueDate,
        expiryDate: newPermit.expiryDate,
        route: Number(newPermit.route),
        vehicle: Number(newPermit.vehicle),
        busOperator: Number(newPermit.busOperator),
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
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Bus Operator</label>
              <select
                name="busOperator"
                value={newPermit.busOperator}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select the operator</option>
                {operators.map((operator) => (
                  <option key={operator.operatorId} value={operator.operatorId}>
                    {operator.company}
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
        </div>
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};

export default PermitPage;
