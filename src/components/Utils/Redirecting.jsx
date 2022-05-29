import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";

export const Redirecting = ({ title }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    document.title = title;
    setTimeout(() => {
      if (currentUser) {
        navigate("/dashboard", { replace: true });
      }
    }, 2000);
  }, [title, currentUser, navigate]);

  return (
    <Box
      bgcolor={"primary.light"}
      width="100%"
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress sx={{ color: "white" }} />
    </Box>
  );
};
