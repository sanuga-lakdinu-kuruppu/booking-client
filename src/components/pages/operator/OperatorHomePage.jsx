import { FaRegCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import HomeCard from "../../widgets/homeCard";
import Header from "../../widgets/header";

const OperatorHomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <main className="container mx-auto p-4 flex-1 space-y-8">
        <Header
          title="Bus Operator Operations"
          tag="Manage bus operator workflow"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <HomeCard
            title="Ticket Scan"
            description="Onboard commuters"
            Icon={FaRegCheckCircle}
            onClick={() => navigate("/operator/ticket")}
          />
        </div>
      </main>
    </div>
  );
};
export default OperatorHomePage;
