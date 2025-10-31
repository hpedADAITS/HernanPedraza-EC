import React from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";

const EndpointSelector = ({ currentEndpoint, onEndpointChange }) => {
  const endpoints = [
    { value: "pokeapi", label: "PokeAPI", isLocal: false },
    { value: "lmstudio", label: "LM Studio", isLocal: true },
  ];

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Select
        value={currentEndpoint}
        onChange={(e) => onEndpointChange(e.target.value)}
        size="small"
        sx={{ minWidth: 120 }}
      >
        {endpoints.map((endpoint) => (
          <MenuItem key={endpoint.value} value={endpoint.value}>
            {endpoint.label}
          </MenuItem>
        ))}
      </Select>
      {endpoints.find((ep) => ep.value === currentEndpoint)?.isLocal && (
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "rgba(255, 255, 0, 0.2)",
            color: "#A67D03",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "medium",
          }}
        >
          Local endpoint
        </Typography>
      )}
    </Box>
  );
};

export default EndpointSelector;
