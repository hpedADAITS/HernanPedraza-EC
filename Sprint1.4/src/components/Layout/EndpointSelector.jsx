import React from "react";
import { Box, Select, MenuItem, Typography } from "@mui/material";

const EndpointSelector = ({ currentEndpoint, onEndpointChange }) => {
  const endpoints = [
    { value: "pokeapi", label: "PokeAPI", isLocal: false, deprecated: true },
    { value: "lmstudio", label: "Local", isLocal: true },
  ];

  const currentEp = endpoints.find((ep) => ep.value === currentEndpoint);

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
      {currentEp?.isLocal && (
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
      {currentEp?.deprecated && (
        <Typography
          variant="caption"
          sx={{
            backgroundColor: "rgba(255, 0, 0, 0.1)",
            color: "#d32f2f",
            padding: "2px 8px",
            borderRadius: "4px",
            fontWeight: "medium",
          }}
        >
          ⚠️ Will be removed in Sprint 1.5
        </Typography>
      )}
    </Box>
  );
};

export default EndpointSelector;
