import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import PropTypes from "prop-types";

const ProtectedRoute = ({ element: Component, allowedRoles, ...rest }) => {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Component {...rest} />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.elementType.isRequired, 
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
  };

export default ProtectedRoute;
