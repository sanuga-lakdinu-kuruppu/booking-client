import PropTypes from "prop-types";

const RightPanel = ({
  handleSubmitRegistration,
  commuterData,
  isLoading,
  handleInputChange,
}) => {
  return (
    <form onSubmit={handleSubmitRegistration} className="text-sm">
      {/* First Name and Last Name as Horizontal */}
      <div className="flex mb-4 ">
        <div className="w-1/2 pr-2">
          <label className="block text-white">First Name</label>
          <input
            type="text"
            name="firstName"
            value={commuterData.firstName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-white">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={commuterData.lastName}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />
        </div>
      </div>

      <div className="flex mb-4 ">
        <div className="w-1/2 pr-2">
          <label className="block text-white">NIC</label>
          <input
            type="text"
            name="nic"
            value={commuterData.nic}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg text-black"
          />
        </div>
        <div className="w-1/2 pl-2">
          <label className="block text-white">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={commuterData.mobile}
            className="w-full px-4 py-2 border rounded-lg text-black"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="mb-4 ">
        <label className="block text-white">Email</label>
        <input
          type="email"
          name="email"
          value={commuterData.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded-lg text-black"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full px-6 py-2 rounded-lg focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
          isLoading
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-yellow-500 text-white hover:bg-yellow-400 focus:ring-yellow-500"
        }`}
      >
        {isLoading ? <span>Please wait ... </span> : "Register"}
      </button>
    </form>
  );
};

RightPanel.propTypes = {
  handleSubmitRegistration: PropTypes.func.isRequired,
  commuterData: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default RightPanel;
