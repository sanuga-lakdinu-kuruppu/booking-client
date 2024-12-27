import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import { ToastContainer } from "react-toastify";
import CommuterFlow from "./components/pages/commuter/CommuterPage";
import MakeReservation from "./components/pages/commuter/MakeReservation";
import CommuterRegistration from "./components/pages/commuter/CommuterRegistration";
import ViewReservation from "./components/pages/commuter/ViewReservationPage";
import BookingCancellationPage from "./components/pages/commuter/BookingCancellationPage";
import Login from "./components/pages/authentication/LoginPage";
import ProtectedRoute from "./routes/protectedRoutes";
import OperatorPage from "./components/pages/operator/OperatorPage";

function App() {
  return (
    <Router>
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/commuter" element={<CommuterFlow />} />
        <Route
          path="/commuter/make-reservations"
          element={<MakeReservation />}
        />
        <Route
          path="/commuter/make-reservations/register/:tripId"
          element={<CommuterRegistration />}
        />
        <Route
          path="/commuter/view-reservations"
          element={<ViewReservation />}
        />
        <Route
          path="/commuter/cancel-reservations"
          element={<BookingCancellationPage />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/operator"
          element={
            <ProtectedRoute
              element={OperatorPage}
              allowedRoles={["NTC_USER"]}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
