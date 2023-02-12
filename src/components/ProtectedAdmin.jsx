import React from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const ProtectedAdmin = ({ children }) => {
  const { user } = UserAuth();
  const navigate = useNavigate();

  if (!user.admin) {
    return navigate(-1);
  }
  return children;
};

export default ProtectedAdmin;
