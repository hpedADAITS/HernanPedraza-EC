import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

/**
 * ErrorBlock Component
 * 
 * Consistent error state indicator used across the app
 * 
 * @param {string} message - Error message to display
 * @param {function} onRetry - Optional callback for retry button
 */
const ErrorBlock = ({ message = "An error occurred", onRetry }) => {
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
      <ErrorOutlineIcon
        sx={{
          fontSize: 64,
          color: "error.main",
          mb: 2,
        }}
      />
      <Typography variant="h6" color="error" sx={{ mb: 1 }}>
        Error
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: "center", maxWidth: 400 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Box>
  );
};

export default ErrorBlock;
