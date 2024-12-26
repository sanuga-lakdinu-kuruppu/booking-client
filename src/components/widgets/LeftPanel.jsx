import PropTypes from "prop-types";

const LeftPanel = ({ trip }) => {
  return (
    <div className="col-span-12 md:col-span-5 bg-gray-800 rounded-lg shadow-lg p-8  transition duration-300">
      <h3 className="text-xl font-semibold text-yellow-500 mb-4 justify-start">
        Trip Selection
      </h3>
      <div className="text-sm text-gray-300 space-y-2">
        <div className="flex justify-between text-blue-500">
          <span className="font-semibold">Trip Number:</span>
          <span>{trip.tripNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Route Name:</span>
          <span>{trip.route.routeName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Trip Date:</span>
          <span>{trip.tripDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Departure Time:</span>
          <span>{trip.schedule.departureTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Arrival Time:</span>
          <span>{trip.schedule.arrivalTime}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Price per Seat:</span>
          <span>Rs. {trip.vehicle.pricePerSeat}.00</span>
        </div>
      </div>
    </div>
  );
};

LeftPanel.propTypes = {
  trip: PropTypes.object.isRequired,
};
export default LeftPanel;
