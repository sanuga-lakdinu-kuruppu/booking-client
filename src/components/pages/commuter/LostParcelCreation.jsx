import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const LostParcelCreationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [reqeustData, setRequestData] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BOOKING_SERVICE_BASE_URL}/lost-parcels`,
        reqeustData
      );
      const { referenceId } = response.data;
      toast.success(
        `Complain created successfully, reference Id ${referenceId} :)`
      );
      navigate("/commuter");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
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
      <main className="flex items-center justify-center w-full h-full p-4">
        <div className="bg-gray-800 p-10 rounded-lg shadow-lg w-full max-w-lg">
          {/* <Header title="Lost Parcel Reporting" tag="" /> */}
          <h2 className="text-xl font-semibold text-white text-center mb-6">
            Lost Parcel Reporting
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm mb-2">E Ticket</label>
              <input
                type="text"
                name="eTicket"
                value={reqeustData.eTicket}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black text-sm"
                placeholder="79a631ed-8698-4dfa-bdbf-ae928c0c9f43"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Type</label>
              <input
                type="text"
                name="type"
                value={reqeustData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black text-sm"
                placeholder="Bag"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={reqeustData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black text-sm"
                placeholder="School bag"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={reqeustData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg text-black text-sm"
                rows="4"
                placeholder="Enter description"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
              }`}
            >
              {isLoading ? <span>Please wait ... </span> : "Report"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LostParcelCreationPage;
