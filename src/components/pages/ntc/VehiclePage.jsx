import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const VehiclePage = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [newVehicle, setNewVehicle] = useState({});
  const [operators, setOperators] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchOperators = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${CORE_SERVICE_BASE_URL}/bus-operators`,
          {
            params: {
              all: true,
            },
          }
        );
        setOperators(response.data.data);
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
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${CORE_SERVICE_BASE_URL}/policies`, {
          params: {
            all: true,
          },
        });
        setPolicies(response.data.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  const fetchVehicles = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/vehicles`, {
        params: {
          page,
          limit: 10,
        },
      });
      setVehicles(response.data.data);
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
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/vehicles`,
        newVehicle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Vehicle created successfully :)");
      setVehicles((previousVehicles) => [...previousVehicles, response.data]);
      setNewVehicle({});
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
      await axios.delete(`${CORE_SERVICE_BASE_URL}/vehicles/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Vehicle deleted successfully :)");
      setVehicles(
        vehicles.filter((vehicle) => vehicle.vehicleId !== Number(id))
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/vehicles/${selectedVehicle.vehicleId}`,
        newVehicle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Vehicle updated successfully :)");
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.vehicleId === selectedVehicle.vehicleId
            ? response.data
            : vehicle
        )
      );
      setSelectedVehicle(null);
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
    setNewVehicle((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = (vehicle) => {
    setSelectedVehicle(vehicle);
    setNewVehicle({
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      capacity: vehicle.capacity,
      type: vehicle.type,
      status: vehicle.status,
      airCondition: vehicle.airCondition,
      adjustableSeats: vehicle.adjustableSeats,
      chargingCapability: vehicle.chargingCapability,
      restStops: vehicle.restStops,
      movie: vehicle.movie,
      music: vehicle.music,
      cupHolder: vehicle.cupHolder,
      emergencyExit: vehicle.emergencyExit,
      bookingClose: vehicle.bookingClose,
      pricePerSeat: vehicle.pricePerSeat,
      cancellationPolicyId: vehicle.cancellationPolicy.policyId,
      busOperatorId: vehicle.busOperator.operatorId,
    });
    setShowUpdateForm(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchVehicles(newPage);
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
        <Header title="Manage Vehicles" />
        <button
          onClick={() => {
            setNewVehicle({});
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Vehicle
        </button>
        {showAddForm && (
          <form
            onSubmit={handleAddVehicle}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={newVehicle.registrationNumber}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="ABC12345"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={newVehicle.model}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Volvo 960"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Bus Operator</label>
              <select
                name="busOperatorId"
                value={newVehicle.busOperatorId}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select Bus Operator</option>
                {operators.map((operator) => (
                  <option key={operator.operatorId} value={operator.operatorId}>
                    {operator.company}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={newVehicle.capacity}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="50"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Type</label>
              <select
                name="type"
                value={newVehicle.type}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select type</option>
                <option key={1} value={`LUXURY`}>
                  Luxury
                </option>
                <option key={2} value={`SEMI_LUXURY`}>
                  Semi Luxury
                </option>
                <option key={3} value={`NORMAL`}>
                  Normal
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Status</label>
              <select
                name="status"
                value={newVehicle.status}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select status</option>
                <option key={1} value={`ACTIVE`}>
                  Active
                </option>
                <option key={2} value={`INACTIVE`}>
                  Inactive
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Price Per Seat</label>
              <input
                type="number"
                name="pricePerSeat"
                value={newVehicle.pricePerSeat}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="6500.00"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">
                Booking Close Before At (Minutes)
              </label>
              <input
                type="number"
                name="bookingClose"
                value={newVehicle.bookingClose}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="45"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Cancellation Policy</label>
              <select
                name="cancellationPolicyId"
                value={newVehicle.cancellationPolicyId}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select cancellation Policy</option>
                {policies.map((policy) => (
                  <option key={policy.policyId} value={policy.policyId}>
                    {policy.policyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Air Condition</label>
              <select
                name="airCondition"
                value={newVehicle.airCondition}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Adjustable Seats</label>
              <select
                name="adjustableSeats"
                value={newVehicle.adjustableSeats}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Charging Capability</label>
              <select
                name="chargingCapability"
                value={newVehicle.chargingCapability}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Rest Stops</label>
              <select
                name="restStops"
                value={newVehicle.restStops}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Music</label>
              <select
                name="music"
                value={newVehicle.music}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Movie</label>
              <select
                name="movie"
                value={newVehicle.movie}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Cup Holder</label>
              <select
                name="cupHolder"
                value={newVehicle.cupHolder}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Emergency Exit</label>
              <select
                name="emergencyExit"
                value={newVehicle.emergencyExit}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
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
                className="px-6 py-1 bg-yellow-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Add Vehicle
              </button>
            </div>
          </form>
        )}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdateVehicle}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Registration Number</label>
              <input
                type="text"
                name="registrationNumber"
                value={newVehicle.registrationNumber}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="ABC12345"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Model</label>
              <input
                type="text"
                name="model"
                value={newVehicle.model}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Volvo 960"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Bus Operator</label>
              <select
                name="busOperatorId"
                value={newVehicle.busOperatorId}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select Bus Operator</option>
                {operators.map((operator) => (
                  <option key={operator.operatorId} value={operator.operatorId}>
                    {operator.company}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Capacity</label>
              <input
                type="number"
                name="capacity"
                value={newVehicle.capacity}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="50"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Type</label>
              <select
                name="type"
                value={newVehicle.type}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select type</option>
                <option key={1} value={`LUXURY`}>
                  Luxury
                </option>
                <option key={2} value={`SEMI_LUXURY`}>
                  Semi Luxury
                </option>
                <option key={3} value={`NORMAL`}>
                  Normal
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Status</label>
              <select
                name="status"
                value={newVehicle.status}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select status</option>
                <option key={1} value={`ACTIVE`}>
                  Active
                </option>
                <option key={2} value={`INACTIVE`}>
                  Inactive
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Price Per Seat</label>
              <input
                type="number"
                name="pricePerSeat"
                value={newVehicle.pricePerSeat}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="6500.00"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">
                Booking Close Before At (Minutes)
              </label>
              <input
                type="number"
                name="bookingClose"
                value={newVehicle.bookingClose}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="45"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Cancellation Policy</label>
              <select
                name="cancellationPolicyId"
                value={newVehicle.cancellationPolicyId}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select cancellation Policy</option>
                {policies.map((policy) => (
                  <option key={policy.policyId} value={policy.policyId}>
                    {policy.policyName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Air Condition</label>
              <select
                name="airCondition"
                value={newVehicle.airCondition}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Adjustable Seats</label>
              <select
                name="adjustableSeats"
                value={newVehicle.adjustableSeats}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Charging Capability</label>
              <select
                name="chargingCapability"
                value={newVehicle.chargingCapability}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Rest Stops</label>
              <select
                name="restStops"
                value={newVehicle.restStops}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Music</label>
              <select
                name="music"
                value={newVehicle.music}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Movie</label>
              <select
                name="movie"
                value={newVehicle.movie}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Cup Holder</label>
              <select
                name="cupHolder"
                value={newVehicle.cupHolder}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Emergency Exit</label>
              <select
                name="emergencyExit"
                value={newVehicle.emergencyExit}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select availability</option>
                <option key={1} value={true}>
                  Available
                </option>
                <option key={2} value={false}>
                  Not Available
                </option>
              </select>
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
                className="px-6 py-1 bg-yellow-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Update Vehicle
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Vehicle ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Registration Number
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Model
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Capacity
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Type
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Status
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr
                  key={vehicle.vehicleId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {vehicle.vehicleId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {vehicle.registrationNumber}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {vehicle.model}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {vehicle.capacity}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-white text-xs ${
                        vehicle.type === "LUXURY"
                          ? "bg-blue-500"
                          : vehicle.type === "SEMI_LUXURY"
                          ? "bg-orange-500"
                          : vehicle.type === "NORMAL"
                          ? "bg-purple-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-white text-xs ${
                        vehicle.status === "ACTIVE"
                          ? "bg-green-500"
                          : vehicle.status === "INACTIVE"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(vehicle)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.vehicleId)}
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

export default VehiclePage;
