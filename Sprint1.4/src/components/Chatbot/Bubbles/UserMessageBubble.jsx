import React from "react";
import { Typography } from "@mui/material";
import BaseBubble from "./BaseBubble";

const UserMessageBubble = ({ text, currentEndpoint }) => {
  return (
  <BaseBubble isUser={true} currentEndpoint={currentEndpoint}>
  <Typography variant="body1">{text}</Typography>
  </BaseBubble>
  );
};

export default UserMessageBubble;
