import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedAdmin = ({ children }) => {
  const { googleUser } = UserAuth();

  if (!googleUser?.admin) {
    return <Navigate to="/wishlist" />;
  }
  return children;
};

export default ProtectedAdmin;
