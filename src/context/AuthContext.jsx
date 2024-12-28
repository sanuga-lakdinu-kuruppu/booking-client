import PropTypes from "prop-types";
import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(Cookies.get("authToken") || null);
  const [role, setRole] = useState("COMMUTER");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (
          decoded["cognito:groups"] &&
          Array.isArray(decoded["cognito:groups"])
        ) {
          setRole(decoded["cognito:groups"][0]);
        } else {
          setRole(null);
        }
      } catch (error) {
        console.error("Invalid token", error);
        setRole(null);
        clearToken();
      }
    }
  }, [token]);

  const updateToken = (newToken) => {
    setToken(newToken);
    Cookies.set("authToken", newToken, { secure: true, sameSite: "Strict" });
    try {
      const decoded = jwtDecode(newToken);
      if (
        decoded["cognito:groups"] &&
        Array.isArray(decoded["cognito:groups"])
      ) {
        setRole(decoded["cognito:groups"][0]);
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
    Cookies.remove("authToken");
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
