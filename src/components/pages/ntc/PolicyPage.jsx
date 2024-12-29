import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../widgets/header";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const CORE_SERVICE_BASE_URL = "https://api.busriya.com/core-service/v2.0";

const PolicyPage = () => {
  const { token } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newPolicy, setNewPolicy] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${CORE_SERVICE_BASE_URL}/policies`, {
        params: {
          page,
          limit: 10,
        },
      });
      setPolicies(response.data.data);
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

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${CORE_SERVICE_BASE_URL}/policies/${Number(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Policy deleted successfully :)");
      setPolicies(policies.filter((policy) => policy.policyId !== Number(id)));
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (policy) => {
    setSelectedPolicy(policy);
    setNewPolicy({
      name: policy.policyName,
      type: policy.type,
      description: policy.description,
    });
    setShowUpdateForm(true);
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        policyName: newPolicy.name,
        type: newPolicy.type,
        description: newPolicy.description,
      };
      const response = await axios.put(
        `${CORE_SERVICE_BASE_URL}/policies/${selectedPolicy.policyId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Policy updated successfully :)");
      setPolicies(
        policies.map((policy) =>
          policy.policyId === selectedPolicy.policyId ? response.data : policy
        )
      );
      setSelectedPolicy(null);
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
    setNewPolicy((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const request = {
        policyName: newPolicy.name,
        type: newPolicy.type,
        description: newPolicy.description,
      };
      const response = await axios.post(
        `${CORE_SERVICE_BASE_URL}/policies`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Policy created successfully :)");
      setPolicies((previousPolicies) => [...previousPolicies, response.data]);
      setNewPolicy({ name: "", type: "", description: "" });
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
    fetchPolicies(newPage);
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
        <Header title="Manage Policies" />

        <button
          onClick={() => {
            setNewPolicy({ name: "", type: "", description: "" });
            setShowAddForm(!showAddForm);
          }}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
        >
          Add New Policy
        </button>

        {showAddForm && (
          <form
            onSubmit={handleAddStation}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 flex flex-col"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Policy Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPolicy.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter policy name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newPolicy.type}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter the policy type"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPolicy.description}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  rows="4"
                  placeholder="Enter description"
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
                Add Policy
              </button>
            </div>
          </form>
        )}

        {showUpdateForm && (
          <form
            onSubmit={handleUpdateStation}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 flex flex-col"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Policy Name</label>
                <input
                  type="text"
                  name="name"
                  value={newPolicy.name}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter policy name"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Type</label>
                <input
                  type="text"
                  name="type"
                  value={newPolicy.type}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Enter the type"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPolicy.description}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  rows="4"
                  placeholder="Enter description"
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
                Update Policy
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Policy ID
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Policy Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Type
                </th>
                <th className="py-3 px-6 text-left flex text-sm font-semibold text-gray-200 justify-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr
                  key={policy.policyId}
                  className="border-b border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {policy.policyId}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {policy.policyName}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    {policy.type}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(policy)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(policy.policyId)}
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

export default PolicyPage;
