import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import ResponsiveAppBar from "../components/Appbar";
import { UserAuth } from "../context/AuthContext";

const Admin = () => {
  const { user, logout } = UserAuth();

  return (
    <Box sx={{ width: "100%" }}>
      <ResponsiveAppBar user={user} logout={logout} />
      <Paper>{user.displayName} is admin</Paper>
    </Box>
  );
};

export default Admin;
