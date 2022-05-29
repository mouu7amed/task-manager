import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";

export const NoMatch = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      p={6}
    >
      <Typography variant="h1" color="error.light">
        404
      </Typography>
      <Typography variant="h6" color="error">
        Page Not Found
      </Typography>
    </Box>
  );
};
