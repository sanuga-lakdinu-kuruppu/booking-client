import {
  FaRegCheckCircle,
  FaBus,
  FaUsers,
  FaUserCog,
  FaMapMarkedAlt,
  FaCar,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../widgets/homeCard";
import Header from "../../widgets/header";

const NtcHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header
          title="NTC Administrator Operations"
          tag="Manage master data in busriya.com"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HomeCard
            title="Bus Stations"
            description="Manage bus stations and related data"
            Icon={FaMapMarkedAlt}
            onClick={() => navigate("/ntc/stations")}
            tag="Stations Management"
          />

          <HomeCard
            title="Policies"
            description="Manage and configure booking policies"
            Icon={FaRegCheckCircle}
            onClick={() => navigate("/ntc/policies")}
            tag="Policies Setup"
          />

          <HomeCard
            title="Routes"
            description="Manage bus routes and schedules"
            Icon={FaBus}
            onClick={() => navigate("/ntc/routes")}
            tag="Routes Management"
          />

          <HomeCard
            title="Bus Operators"
            description="Manage bus operators and assign vehicles"
            Icon={FaUserCog}
            onClick={() => navigate("/ntc/operators")}
            tag="Operator Management"
          />

          <HomeCard
            title="Vehicles"
            description="Manage vehicles and their assignment to routes"
            Icon={FaCar}
            onClick={() => navigate("/ntc/vehicles")}
            tag="Vehicle Management"
          />

          <HomeCard
            title="Bus Workers"
            description="Manage bus workers and their assignments"
            Icon={FaUsers}
            onClick={() => navigate("/ntc/workers")}
            tag="Worker Management"
          />

          <HomeCard
            title="Permits"
            description="Issue and manage permits for operators and vehicles"
            Icon={FaIdCard}
            onClick={() => navigate("/ntc/permits")}
            tag="Permits"
          />

          <HomeCard
            title="Schedules"
            description="Manage bus schedules and trips"
            Icon={FaCalendarAlt}
            onClick={() => navigate("/ntc/schedules")}
            tag="Schedule Management"
          />
        </div>
      </main>
    </div>
  );
};

export default NtcHomePage;
