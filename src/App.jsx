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
import TicketScanPage from "./components/pages/operator/TicketScanPage";
import OperatorHomePage from "./components/pages/operator/OperatorHomePage";
import NtcHomePage from "./components/pages/ntc/NtcHomePage";
import StationPage from "./components/pages/ntc/StationPage";
import PolicyPage from "./components/pages/ntc/PolicyPage";
import RoutePage from "./components/pages/ntc/RoutePage";
import OperatorPage from "./components/pages/ntc/OperatorPage";

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
              element={OperatorHomePage}
              allowedRoles={["NTC_USER"]}
            />
          }
        />
        <Route
          path="/operator/ticket"
          element={
            <ProtectedRoute
              element={TicketScanPage}
              allowedRoles={["NTC_USER"]}
            />
          }
        />
        <Route
          path="/ntc"
          element={
            <ProtectedRoute element={NtcHomePage} allowedRoles={["NTC_USER"]} />
          }
        />
        <Route
          path="/ntc/stations"
          element={
            <ProtectedRoute element={StationPage} allowedRoles={["NTC_USER"]} />
          }
        />{" "}
        <Route
          path="/ntc/policies"
          element={
            <ProtectedRoute element={PolicyPage} allowedRoles={["NTC_USER"]} />
          }
        />
        <Route
          path="/ntc/routes"
          element={
            <ProtectedRoute element={RoutePage} allowedRoles={["NTC_USER"]} />
          }
        />
        <Route
          path="/ntc/operators"
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
