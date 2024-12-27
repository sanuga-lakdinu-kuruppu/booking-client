import PropTypes from "prop-types";
import { createContext, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("COMMUTER");

  const updateToken = (newToken) => {
    setToken(newToken);
    try {
      const decoded = jwtDecode(newToken);
      if (
        decoded["cognito:groups"] &&
        Array.isArray(decoded["cognito:groups"])
      ) {
        const decodedRole = decoded["cognito:groups"][0];
        setRole(decodedRole);
      } else {
        setRole(null);
      }
    } catch (error) {
      console.error("Invalid token", error);
      setRole(null);
    }
  };

  const clearToken = () => {
    setToken(null);
    setRole("COMMUTER");
  };

  return (
    <AuthContext.Provider value={{ token, role, updateToken, clearToken }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
