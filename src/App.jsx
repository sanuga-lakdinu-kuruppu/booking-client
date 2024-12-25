import {
  FaRegCheckCircle,
  FaLock,
  FaUserCog,
  FaUsers,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <ToastContainer />
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/public/bus.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-semibold text-white">
              Busriya.com .. .
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <FaBell className="text-white text-xl cursor-pointer hover:text-yellow-500 transition duration-200" />
            </div>

            <div className="flex items-center space-x-2">
              <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-yellow-500 transition duration-200" />
              <span className="text-white text-sm">Malith Perera</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 flex-1 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-200">
            Welcome to the Bus Booking System
          </h2>
          <p className="mt-2 text-gray-400 leading-relaxed text-sm">
            Plan your trip and book your tickets easily. Select your starting
            and destination points, pick a date, and find available trips.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-700 transition duration-300"
            onClick={() => {
              toast.success("Authentiction Card", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
              });
            }}
          >
            <div className="flex justify-between items-center">
              <FaLock className="text-yellow-500 text-xl" />
              <h2 className="text-sm font-semibold text-white">
                Authentication Flow
              </h2>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              User login for different roles in the busriya.com
            </p>
          </div>

          <div
            className="bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-700 transition duration-300"
            onClick={() => {
              toast.success("Commuter Card", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
              });
            }}
          >
            <div className="flex justify-between items-center">
              <FaRegCheckCircle className="text-yellow-500 text-xl" />
              <h2 className="text-sm font-semibold text-white">
                Daily Commuter Flow
              </h2>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              Trip selection with booking creation
            </p>
          </div>

          <div
            className="bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-700 transition duration-300"
            onClick={() => {
              toast.success("Operator Card", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
              });
            }}
          >
            <div className="flex justify-between items-center">
              <FaUserCog className="text-yellow-500 text-xl" />
              <h2 className="text-sm font-semibold text-white">
                Bus Operator Flow
              </h2>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              Manage currently working vehicles and workers
            </p>
          </div>

          <div
            className="bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-700 transition duration-300"
            onClick={() => {
              toast.success("Administrator Card", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
              });
            }}
          >
            <div className="flex justify-between items-center">
              <FaUsers className="text-yellow-500 text-xl" />
              <h2 className="text-sm font-semibold text-white">
                NTC Administrator Flow
              </h2>
            </div>
            <p className="mt-8 text-gray-400 text-sm">
              Master data handling for the busriya.com
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
