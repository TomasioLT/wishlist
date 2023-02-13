import { Route, Routes } from "react-router-dom";
import SignInSide from "./components/SignInSide";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import ProtectedAdmin from "./components/ProtectedAdmin";

function App() {
  return (
    <Routes>
      <Route path="/wishlist" element={<SignInSide />} />

      <Route
        path="/wishlist/account/"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist/admin/"
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
