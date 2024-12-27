import { useState } from "react";
import Header from "../../widgets/header";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const BOOKING_SERVICE_BASE_URL = "https://api.busriya.com/booking-service/v1.7";

const TicketScanPage = () => {
  const { token } = useAuth();
  const [eTicket, setETicket] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (eTicket.trim() === "") {
      toast.error(`Please enter customer E Tikcet`);
      return false;
    }
    setIsLoading(true);
    try {
      const url = `${BOOKING_SERVICE_BASE_URL}/bookings/eTicket/${eTicket}`;
      const response = await axios.patch(
        `${url}`,
        {
          ticketStatus: "USED",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      toast.success("Commuter Onboard successfull :)");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header title="Scan the Ticket" tag="" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7 bg-gray-800 shadow-lg rounded-lg p-8">
            <form onSubmit={handleSubmit} className="text-sm">
              {" "}
              <h3 className="text-xl font-semibold text-yellow-500 mb-4">
                Use this Ticket
              </h3>
              <p className="mt-2 text-gray-400 leading-relaxed text-sm">
                E ticket Entering
              </p>
              <div className="flex mb-4 mt-8">
                <div className="w-1/2 pr-2">
                  <input
                    type="text"
                    name="eTicket"
                    value={eTicket}
                    onChange={(e) => setETicket(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg text-black"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-white"></label>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                      isLoading
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
                    }`}
                  >
                    {isLoading ? <span>Please wait ... </span> : "Onboard"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketScanPage;
