import Header from "../../widgets/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const LostParcelAdminPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [parcels, setParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [request, setRequest] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BOOKING_SERVICE_BASE_URL}/lost-parcels`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParcels(response.data);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchParcels();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("klsajflkj");
      const response = await axios.patch(
        `${BOOKING_SERVICE_BASE_URL}/lost-parcels/${selectedParcel.parcelId}`,
        request,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParcels((previousParcels) =>
        previousParcels.map((parcel) =>
          parcel.parcelId === selectedParcel.parcelId ? response.data : parcel
        )
      );
      toast.success(`lost parcel updated successfully`);
      setSelectedParcel(null);
      setShowUpdateForm(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while updating status.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (parcel) => {
    setSelectedParcel(parcel);
    setShowUpdateForm(true);
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
        <Header title="Manage Lost Parcels" />
        {showUpdateForm && (
          <form
            onSubmit={handleUpdateStatus}
            className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 flex flex-col"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Status</label>
                <select
                  name="status"
                  value={request.status}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                >
                  <option value="">Select new status</option>
                  <option key={1} value={`FOUND`}>
                    Found
                  </option>
                  <option key={1} value={`NOT_FOUND`}>
                    Not Found
                  </option>
                  <option key={1} value={`HANDED_OVER`}>
                    Hand Over
                  </option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">Take away station</label>
                <input
                  type="text"
                  name="takeAwayStation"
                  value={request.takeAwayStation}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Pettah Bus Stand Main Office"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">
                  Handed Over Person First Name
                </label>
                <input
                  type="text"
                  name="handedOverPersonFirstName"
                  value={request.handedOverPersonFirstName}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Lahiru "
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">
                  Handed Over Person Last Name
                </label>
                <input
                  type="text"
                  name="handedOverPersonLastName"
                  value={request.handedOverPersonLastName}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="Perera"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-200 mb-2">
                  Handed Over Person NIC
                </label>
                <input
                  type="text"
                  name="handedOverPersonNIC"
                  value={request.handedOverPersonNIC}
                  onChange={handleInputChange}
                  className="px-4 py-2 text-black rounded-md focus:outline-none"
                  placeholder="200127201643"
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
                Update Parcel
              </button>
            </div>
          </form>
        )}
        <div className="overflow-x-auto rounded-lg shadow-lg mt-8">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Parcel Id
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Reference Id
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Type
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Status
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Commuter Name
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Contact
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  NIC
                </th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => (
                <tr
                  key={parcel.parcelId}
                  className="border-bs border-gray-700 hover:bg-gray-700 transition-all duration-300 ease-in-out"
                >
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.parcelId}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.referenceId}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.type}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.name}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    <span
                      className={`rounded px-2 py-1 ${
                        parcel.status === "REQUESTED"
                          ? "text-yellow-400 bg-yellow-900 border-yellow-700"
                          : parcel.status === "FOUND"
                          ? "text-green-400 bg-green-900 border-green-700"
                          : parcel.status === "NOT_FOUND"
                          ? "text-orange-400 bg-orange-900 border-orange-700"
                          : parcel.status === "HANDED_OVER"
                          ? "text-blue-400 bg-blue-900 border-blue-700"
                          : "text-gray-300 bg-gray-800 border-gray-600"
                      }`}
                    >
                      {parcel.status}
                    </span>
                  </td>

                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.commuter.name.firstName}{" "}
                    {parcel.commuter.name.lastName}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.commuter.contact.mobile} |{" "}
                    {parcel.commuter.contact.email}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    {parcel.commuter.nic}
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-300">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleUpdate(parcel)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
export default LostParcelAdminPage;
