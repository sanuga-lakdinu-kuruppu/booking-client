import PropTypes from "prop-types";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";

const NavBar = ({ mode, title }) => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {mode === 1 && <img src="/bus.png" alt="Logo" className="w-8 h-8" />}
          {mode === 2 && (
            <button className="text-white text-xl">
              <IoArrowBack className="hover:text-yellow-500 transition duration-200" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <FaBell className="text-white text-xl cursor-pointer hover:text-yellow-500 transition duration-200" />
          </div>

          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-yellow-500 transition duration-200" />
          </div>
        </div>
      </div>
    </header>
  );
};

// Define PropTypes for validation
NavBar.propTypes = {
  mode: PropTypes.number.isRequired, // mode should be a number and is required
  title: PropTypes.string.isRequired, // title should be a string and is required
};

export default NavBar;
