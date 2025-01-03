import { FaRegCheckCircle, FaLock, FaUserCog, FaUsers } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../widgets/homeCard";
import Header from "../../widgets/header";
import NavBar from "../../widgets/navbar";
import { useAuth } from "../../../context/AuthContext";

const HomePage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
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
      <NavBar mode={1} title="Busriya.com .. ." />

      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header
          title="Welcome to the Bus Booking System"
          tag=" Plan your trip and book your tickets easily. Select your starting
          and destination points, pick a date, and find available trips."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HomeCard
            title="Authentication Flow"
            description="User login for different roles in the busriya.com"
            Icon={FaLock}
            onClick={() => navigate("/login")}
          />

          <HomeCard
            title="Daily Commuter Flow"
            description="Trip selection with booking creation"
            Icon={FaRegCheckCircle}
            onClick={() => navigate("/commuter")}
          />

          <HomeCard
            title={`Bus Operator Flow ${role === "COMMUTER" ? "LOCKED" : ""}`}
            description=" Manage currently working vehicles and workers"
            Icon={FaUserCog}
            onClick={() => navigate("/operator")}
            disabled={role === "COMMUTER"}
          />

          <HomeCard
            title={`NTC Admin Flow ${role === "COMMUTER" ? "LOCKED" : ""}`}
            description="Master data handling for the busriya.com"
            Icon={FaUsers}
            onClick={() => navigate("/ntc")}
            disabled={role === "COMMUTER"}
          />
        </div>
      </main>

      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
