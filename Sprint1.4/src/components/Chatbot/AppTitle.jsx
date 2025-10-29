import React from "react";
import { Typography, Box } from "@mui/material";

export default function AppTitle({ visible }) {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "20%",
        left: "50%",
        transform: "translateX(-50%)",
        textAlign: "center",
        zIndex: 1,
      }}
    >
      <Typography
        variant="h2"
        component="h1"
        sx={{
          fontWeight: "bold",
          color: "primary.main",
          mb: 2,
        }}
      >
        Botak
      </Typography>
    </Box>
  );
}
