import { Route, Routes } from "react-router-dom";
import SignInSide from "./components/SignInSide";
import Account from "./pages/Account";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import ProtectedAdmin from "./components/ProtectedAdmin";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { UserAuth } from "./context/AuthContext";

function App() {
  const { user } = UserAuth();
  const { googleUser, setGoogleUser } = useState([]);
  const handleClick = () => {
    console.log("click debuger:");
    console.log(user);
    console.log(googleUser);
  };
  const handleGoogleUser = () => {
    setGoogleUser(user);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Button color="error" variant="contained" onClick={handleClick}>
        DEBUGGER
      </Button>
      <Button color="warning" variant="contained" onClick={handleGoogleUser}>
        setGoogleUser
      </Button>
      <Routes>
        <Route path="/wishlist" element={<SignInSide />} />

        <Route
          path="/wishlist/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist/admin"
          element={
            <ProtectedAdmin>
              <Admin />
            </ProtectedAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
