import { Alert, Snackbar } from "@mui/material";
import React from "react";

const Alertbar = ({ isOpen, severity, message }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
  };
  return (
    <Snackbar open={isOpen} autoHideDuration={6000}>
      <Alert severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Alertbar;
