import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const WorkerPage = () => {
  const { token } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newWorker, setNewWorker] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: {
          firstName: newWorker.firstName,
          lastName: newWorker.lastName,
        },
        company: newWorker.company,
        nic: newWorker.nic,
        type: newWorker.type,
        contact: {
          mobile: newWorker.mobile,
          email: newWorker.email,
          address: {
            no: newWorker.no,
            street1: newWorker.street1,
            street2: newWorker.street2,
            street3: newWorker.street3,
            city: newWorker.city,
            district: newWorker.district,
            province: newWorker.province,
          },
        },
      };
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/bus-workers`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Worker created successfully :)");
      setWorkers((previousWorkers) => [...previousWorkers, response.data]);
      setNewWorker({});
      setShowAddForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorker = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: {
          firstName: newWorker.firstName,
          lastName: newWorker.lastName,
        },
        company: newWorker.company,
        nic: newWorker.nic,
        type: newWorker.type,
        contact: {
          mobile: newWorker.mobile,
          email: newWorker.email,
          address: {
            no: newWorker.no,
            street1: newWorker.street1,
            street2: newWorker.street2,
            street3: newWorker.street3,
            city: newWorker.city,
            district: newWorker.district,
            province: newWorker.province,
          },
        },
      };
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/bus-workers/${selectedWorker.workerId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Worker updated successfully :)");
      setWorkers(
        workers.map((worker) =>
          worker.workerId === selectedWorker.workerId ? response.data : worker
        )
      );
      setSelectedWorker(null);
      setShowUpdateForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (worker) => {
    setSelectedWorker(worker);
    setNewWorker({
      firstName: worker.name.firstName,
      lastName: worker.name.lastName,
      nic: worker.nic,
      mobile: worker.contact.mobile,
      email: worker.contact.email,
      no: worker.contact.address.no,
      street1: worker.contact.address.street1,
      street2: worker.contact.address.street2,
      street3: worker.contact.address.street3,
      city: worker.contact.address.city,
      district: worker.contact.address.district,
      province: worker.contact.address.province,
      type: worker.type,
    });
    setShowUpdateForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${CORE_SERVICE_BASE_URL}/bus-workers/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Worker deleted successfully :)");
      setWorkers(workers.filter((worker) => worker.workerId !== Number(id)));
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
    setNewWorker((prev) => ({
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
        <Header title="Manage Bus Workers" />
        <button
          onClick={() => {
            setNewWorker({});
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Worker
        </button>
        {showAddForm && (
          <form
            onSubmit={handleAddWorker}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newWorker.firstName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Malith"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newWorker.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Deshan"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Type</label>
              <select
                name="type"
                value={newWorker.type}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select type</option>
                <option key={1} value={`DRIVER`}>
                  Driver
                </option>
                <option key={2} value={`CONDUCTOR`}>
                  Conductor
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">NIC</label>
              <input
                type="text"
                name="nic"
                value={newWorker.nic}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="736153683v"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={newWorker.mobile}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="+94778060563"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Email Address</label>
              <input
                type="text"
                name="email"
                value={newWorker.email}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="sampleemail@gmail.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (No)</label>
              <input
                type="text"
                name="no"
                value={newWorker.no}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="NO 1/1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 01)</label>
              <input
                type="text"
                name="street1"
                value={newWorker.street1}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 02)</label>
              <input
                type="text"
                name="street2"
                value={newWorker.street2}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 03)</label>
              <input
                type="text"
                name="street3"
                value={newWorker.street3}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 3"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (City)</label>
              <input
                type="text"
                name="city"
                value={newWorker.city}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="City"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (District)</label>
              <input
                type="text"
                name="district"
                value={newWorker.district}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="District"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Province)</label>
              <input
                type="text"
                name="province"
                value={newWorker.province}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Province"
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
                Add Worker
              </button>
            </div>
          </form>
        )}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdateWorker}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newWorker.firstName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Malith"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newWorker.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Deshan"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Type</label>
              <select
                name="type"
                value={newWorker.type}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
              >
                <option value="">Select type</option>
                <option key={1} value={`DRIVER`}>
                  Driver
                </option>
                <option key={2} value={`CONDUCTOR`}>
                  Conductor
                </option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">NIC</label>
              <input
                type="text"
                name="nic"
                value={newWorker.nic}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="736153683v"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={newWorker.mobile}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="+94778060563"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Email Address</label>
              <input
                type="text"
                name="email"
                value={newWorker.email}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="sampleemail@gmail.com"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (No)</label>
              <input
                type="text"
                name="no"
                value={newWorker.no}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="NO 1/1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 01)</label>
              <input
                type="text"
                name="street1"
                value={newWorker.street1}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 1"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 02)</label>
              <input
                type="text"
                name="street2"
                value={newWorker.street2}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 2"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Street 03)</label>
              <input
                type="text"
                name="street3"
                value={newWorker.street3}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="street 3"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (City)</label>
              <input
                type="text"
                name="city"
                value={newWorker.city}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="City"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (District)</label>
              <input
                type="text"
                name="district"
                value={newWorker.district}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="District"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Address (Province)</label>
              <input
                type="text"
                name="province"
                value={newWorker.province}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Province"
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
                className="px-6 py-1 bg-yellow-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Update Worker
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Worker ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  NIC
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Type
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Mobile
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Email
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Address
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr
                  key={worker.workerId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.workerId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.name.firstName} {worker.name.lastName}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.nic}
                  </td>
                  <td className="py-3 px-6 text-sm">
                    <span
                      className={`px-3 py-1 rounded-md text-white text-xs ${
                        worker.type === "DRIVER"
                          ? "bg-green-500"
                          : worker.type === "CONDUCTOR"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {worker.type}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.contact.mobile}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.contact.email}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {worker.contact.address.no},{worker.contact.address.street1}
                    ,{worker.contact.address.street2},
                    {worker.contact.address.street3},
                    {worker.contact.address.city},
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(worker)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(worker.workerId)}
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
export default WorkerPage;
