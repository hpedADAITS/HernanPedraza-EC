import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

/**
 * Loading Component
 * 
 * Consistent loading state indicator used across the app
 * 
 * @param {string} message - Optional loading message to display
 */
const Loading = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: 200,
        py: 8,
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
