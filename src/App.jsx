import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/home/HomePage";
import { ToastContainer } from "react-toastify";
import CommuterFlow from "./components/pages/commuter/commuterPage";
import MakeReservation from "./components/pages/commuter/MakeReservation";
import CommuterRegistration from "./components/pages/commuter/CommuterRegistration";

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
      </Routes>
    </Router>
  );
}

export default App;
