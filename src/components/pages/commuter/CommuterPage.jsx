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
      <main className="container mx-auto p-6 flex-1 space-y-8">
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
            title="Lost & Found"
            description="Report or search for items lost during your commute."
            Icon={FaBoxOpen}
            onClick={() => console.log("Navigate to Lost & Found page")}
          />
        </div>
      </main>
    </div>
  );
};

export default CommuterFlow;
