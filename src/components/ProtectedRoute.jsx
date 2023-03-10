import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
const ProtectedRoute = ({ children }) => {
  const { user, googleUser } = UserAuth();

  if (!user) {
    return <Navigate to="/wishlist" />;
  }
  return children;
};

export default ProtectedRoute;
