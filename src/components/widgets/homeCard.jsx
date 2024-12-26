import PropTypes from "prop-types";

const HomeCard = ({ title, description, Icon, onClick }) => {
  return (
    <div
      className="bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:bg-gray-700 transition duration-300"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        {Icon && <Icon className="text-yellow-500 text-xl" />}
        <h2 className="text-sm font-semibold text-white">{title}</h2>
      </div>
      <p className="mt-8 text-gray-400 text-sm">{description}</p>
    </div>
  );
};

HomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  Icon: PropTypes.elementType.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HomeCard;
