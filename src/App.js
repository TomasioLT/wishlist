import { Box } from "@mui/system";
import { Route, Routes } from "react-router-dom";
import SignInSide from "./components/SignInSide";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import ProtectedAdmin from "./components/ProtectedAdmin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignInSide />} />

      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedAdmin>
            <Admin />
          </ProtectedAdmin>
        }
      />
    </Routes>
  );
}

export default App;
