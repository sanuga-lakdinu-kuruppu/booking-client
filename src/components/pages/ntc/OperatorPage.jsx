import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const OperatorPage = () => {
  const { token } = useAuth();
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOperator, setNewOperator] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
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

    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOperator((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOperator = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: {
          firstName: newOperator.firstName,
          lastName: newOperator.lastName,
        },
        company: newOperator.company,
        contact: {
          mobile: newOperator.mobile,
          email: newOperator.email,
          address: {
            no: newOperator.no,
            street1: newOperator.street1,
            street2: newOperator.street2,
            street3: newOperator.street3,
            city: newOperator.city,
            district: newOperator.district,
            province: newOperator.province,
          },
        },
      };
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/bus-operators`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Operator created successfully :)");
      setOperators((previousRoutes) => [...previousRoutes, response.data]);
      setNewOperator({
        firstName: "",
        lastName: "",
        company: "",
        mobile: "",
        email: "",
        no: "",
        street1: "",
        street2: "",
        street3: "",
        city: "",
        district: "",
        province: "",
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

  const handleUpdateOperator = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        name: {
          firstName: newOperator.firstName,
          lastName: newOperator.lastName,
        },
        company: newOperator.company,
        contact: {
          mobile: newOperator.mobile,
          email: newOperator.email,
          address: {
            no: newOperator.no,
            street1: newOperator.street1,
            street2: newOperator.street2,
            street3: newOperator.street3,
            city: newOperator.city,
            district: newOperator.district,
            province: newOperator.province,
          },
        },
      };
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/bus-operators/${selectedOperator.operatorId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Operator updated successfully :)");
      setOperators(
        operators.map((operator) =>
          operator.operatorId === selectedOperator.operatorId
            ? response.data
            : operator
        )
      );
      setSelectedOperator(null);
      setShowUpdateForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (operator) => {
    setSelectedOperator(operator);
    setNewOperator({
      firstName: operator.name.firstName,
      lastName: operator.name.lastName,
      company: operator.company,
      mobile: operator.contact.mobile,
      email: operator.contact.email,
      no: operator.contact.address.no,
      street1: operator.contact.address.street1,
      street2: operator.contact.address.street2,
      street3: operator.contact.address.street3,
      city: operator.contact.address.city,
      district: operator.contact.address.district,
      province: operator.contact.address.province,
    });
    setShowUpdateForm(true);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(
        `${CORE_SERVICE_BASE_URL}/bus-operators/${Number(id)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Operator deleted successfully :)");
      setOperators(
        operators.filter((operator) => operator.operatorId !== Number(id))
      );
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
        <Header title="Manage Bus Operators" />
        <button
          onClick={() => {
            setNewOperator({
              firstName: "",
              lastName: "",
              company: "",
              mobile: "",
              email: "",
              no: "",
              street1: "",
              street2: "",
              street3: "",
              city: "",
              district: "",
              province: "",
            });
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Operator
        </button>

        {showAddForm && (
          <form
            onSubmit={handleAddOperator}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newOperator.firstName}
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
                value={newOperator.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Deshan"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={newOperator.company}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="New Line"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={newOperator.mobile}
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
                value={newOperator.email}
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
                value={newOperator.no}
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
                value={newOperator.street1}
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
                value={newOperator.street2}
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
                value={newOperator.street3}
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
                value={newOperator.city}
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
                value={newOperator.district}
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
                value={newOperator.province}
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
                Add Operator
              </button>
            </div>
          </form>
        )}

        {showUpdateForm && (
          <form
            onSubmit={handleUpdateOperator}
            className="bg-gray-800 p-6 rounded-lg shadow-lg grid grid-cols-2 gap-6"
          >
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newOperator.firstName}
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
                value={newOperator.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="Deshan"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={newOperator.company}
                onChange={handleInputChange}
                className="px-4 py-2 text-black rounded-md focus:outline-none"
                placeholder="New Line"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-200 mb-2">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={newOperator.mobile}
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
                value={newOperator.email}
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
                value={newOperator.no}
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
                value={newOperator.street1}
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
                value={newOperator.street2}
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
                value={newOperator.street3}
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
                value={newOperator.city}
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
                value={newOperator.district}
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
                value={newOperator.province}
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
                className="px-6 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
              >
                Update Operator
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Operator ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Company
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
              {operators.map((operator) => (
                <tr
                  key={operator.operatorId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.operatorId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.name.firstName} {operator.name.lastName}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.company}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.contact.mobile}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.contact.email}
                  </td>{" "}
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {operator.contact.address.no},
                    {operator.contact.address.street1},
                    {operator.contact.address.street2},
                    {operator.contact.address.street3},
                    {operator.contact.address.city},
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(operator)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(operator.operatorId)}
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

export default OperatorPage;
