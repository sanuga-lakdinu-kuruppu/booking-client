import PropTypes from "prop-types";

const Header = ({ title, tag }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-200">{title}</h2>
      <p className="mt-2 text-gray-400 leading-relaxed text-sm">{tag}</p>
    </section>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
};

export default Header;
