import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Api, Psychology } from "@mui/icons-material";

const Sidebar = ({ open, onClose, onSelectEndpoint }) => {
  const endpoints = [
    { name: "PokeAPI", icon: <Api />, value: "pokeapi" },
    { name: "Local AI", icon: <Psychology />, value: "local" },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <List sx={{ width: 250 }}>
        {endpoints.map((endpoint) => (
          <ListItem
            button
            key={endpoint.value}
            onClick={() => {
              onSelectEndpoint(endpoint.value);
              onClose();
            }}
          >
            <ListItemIcon>{endpoint.icon}</ListItemIcon>
            <ListItemText primary={endpoint.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
