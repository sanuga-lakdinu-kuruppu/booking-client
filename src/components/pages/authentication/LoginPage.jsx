import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const { updateToken, role, clearToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (role === "COMMUTER") {
      if (!username || !password) {
        toast.error("Username and password are required.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://api.busriya.com/core-service/v2.0/authentications",
          {
            username,
            password,
          }
        );
        toast.success("Login successful!");
        const { accessToken } = response.data;
        updateToken(accessToken);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to login. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else if (role !== "COMMUTER") {
      clearToken();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-yellow-500 text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          {role === "COMMUTER" && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black focus:outline-none focus:ring focus:ring-yellow-500"
                placeholder="Enter your username"
              />
            </div>
          )}
          {role === "COMMUTER" && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-lg text-black focus:outline-none focus:ring focus:ring-yellow-500"
                placeholder="Enter your password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || role !== "COMMUTER"}
            className={`w-full px-6 py-2 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
              isLoading || role !== "COMMUTER"
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 focus:ring-yellow-500"
            }`}
          >
            {role !== "COMMUTER" ? `Logged In As ${role}` : "Login"}
          </button>
          {role !== "COMMUTER" && (
            <button
              type="submit"
              className={`w-full px-6 py-2 rounded-lg font-semibold text-white focus:outline-none focus:ring-2 transform transition-all duration-300 ease-in-out ${
                isLoading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-400 focus:ring-yellow-500"
              }`}
            >
              {isLoading ? `Please wait...` : "Logout"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
