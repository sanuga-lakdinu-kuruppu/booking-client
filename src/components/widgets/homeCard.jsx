import PropTypes from "prop-types";

const HomeCard = ({ title, description, Icon, onClick, disabled }) => {
  return (
    <div
      className={`rounded-lg shadow-lg p-8 transition duration-300 cursor-pointer ${
        disabled
          ? "bg-gray-700 cursor-not-allowed"
          : "bg-gray-800 hover:bg-gray-700"
      }`}
      onClick={!disabled ? onClick : undefined} 
    >
      <div className="flex justify-between items-center">
        {Icon && (
          <Icon
            className={`text-xl ${
              disabled ? "text-gray-400" : "text-yellow-500"
            }`}
          />
        )}
        <h2
          className={`text-sm font-semibold ${
            disabled ? "text-gray-300" : "text-white"
          }`}
        >
          {title}
        </h2>
      </div>
      <p
        className={`mt-8 text-sm ${
          disabled ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
};

HomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool, 
};

HomeCard.defaultProps = {
  disabled: false,
};

export default HomeCard;
