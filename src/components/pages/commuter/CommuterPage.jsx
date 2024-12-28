import Header from "../../widgets/header";
import HomeCard from "../../widgets/homeCard";
import {
  FaBus,
  FaClipboardList,
  FaTimesCircle,
  FaBoxOpen,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CommuterFlow = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header
          title="Daily Commuter Flows"
          tag="No authentication needed for commuter activities"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HomeCard
            title="Make a Reservation"
            description="Book your trips easily and plan your daily commute."
            Icon={FaBus}
            onClick={() => navigate("/commuter/make-reservations")}
          />
          <HomeCard
            title="View Reservations"
            description="Check the details of your existing bookings."
            Icon={FaClipboardList}
            onClick={() => navigate("/commuter/view-reservations")}
          />
          <HomeCard
            title="Cancel Reservations"
            description="Manage your bookings by canceling if needed."
            Icon={FaTimesCircle}
            onClick={() => navigate("/commuter/cancel-reservations")}
          />
          <HomeCard
            title="Lost & Found [Complain]"
            description="Report for items lost during your commute."
            Icon={FaBoxOpen}
            onClick={() => navigate("/commuter/lost-parcels/create")}
          />
        </div>
      </main>
      <footer className="bg-gray-800 p-2 text-center text-gray-400 text-sm mt-auto">
        © 2024 Busriya.com. All rights reserved.
      </footer>
    </div>
  );
};

export default CommuterFlow;
