import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  const handleBookNow = () => {
    toast.success(`Trip Selected ${trip.tripId} :)`);
    navigate(`/commuter/make-reservations/register/${trip.tripId}`);
  };
  return (
    <div
      key={trip.tripId}
      className="bg-gray-800 p-6 rounded-lg shadow-lg w-full hover:shadow-2xl transform transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-semibold text-yellow-500">
          {trip.route.routeName} ({trip.route.routeName})
        </h3>
        <span className="text-lg font-medium text-blue-500">
          {trip.tripNumber}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 text-sm">
        <div className="space-y-2 text-gray-300">
          <p>
            <strong>Trip Date:</strong> {trip.tripDate}
          </p>
          <p>
            <strong>Travel Distance:</strong> {trip.route.travelDistance}
          </p>
          <p>
            <strong>Travel Duration:</strong> {trip.route.travelDuration}
          </p>
        </div>

        <div className="space-y-2 text-gray-300">
          <p>
            <strong>Registration Number:</strong> {trip.registrationNumber}
          </p>
          <p>
            <strong>Model:</strong> {trip.vehicle.model}
          </p>
          <p>
            <strong>Capacity:</strong> {trip.vehicle.capacity} seats
          </p>
          <p>
            <strong>Operator Company:</strong> {trip.operator.company}
          </p>
        </div>

        <div className="space-y-2 text-gray-300">
          <p>
            <strong>Trip Status:</strong>{" "}
            <span
              className={`${
                trip.tripStatus === "SCHEDULED"
                  ? "text-green-500"
                  : trip.tripStatus === "ENDED"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              {trip.tripStatus}
            </span>
          </p>
          <p>
            <strong>Booking Status:</strong>{" "}
            <span
              className={`${
                trip.bookingStatus === "EANABLED"
                  ? "text-green-500"
                  : trip.bookingStatus === "SOLD_OUT"
                  ? "text-yellow-500"
                  : "text-gray-500"
              }`}
            >
              {trip.bookingStatus}
            </span>
          </p>
          <p>
            <strong>Booking Close At:</strong> {trip.bookingCloseAt}
          </p>
          <p>
            <strong>Confirmed Seats:</strong> {trip.confirmedSeats.count}
          </p>
          <p>
            <strong>Seats Booking In Progress:</strong>{" "}
            {trip.bookingInProgressSeats.count}
          </p>
        </div>
      </div>

      <div className="mt-4 text-gray-300 text-sm">
        <p>
          <strong>Departure:</strong> {trip.schedule.departureTime}
        </p>
        <p>
          <strong>Arrival:</strong> {trip.schedule.arrivalTime}
        </p>
      </div>

      {/* Price Section with Highlighting */}
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xl font-bold text-green-400">
          Rs. {trip.vehicle.pricePerSeat}.00
        </p>
        <button
          className="bg-yellow-500 text-white px-6 py-2 rounded-full hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transform transition-all duration-300 ease-in-out"
          onClick={handleBookNow}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

TripCard.propTypes = {
  trip: PropTypes.object.isRequired,
};

export default TripCard;
