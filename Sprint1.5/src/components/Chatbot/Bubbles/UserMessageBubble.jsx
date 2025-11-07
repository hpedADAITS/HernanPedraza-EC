import React from "react";
import { Typography } from "@mui/material";
import BaseBubble from "./BaseBubble";

const UserMessageBubble = ({ text }) => {
  return (
  <BaseBubble isUser={true}>
  <Typography variant="body1">{text}</Typography>
  </BaseBubble>
  );
};

export default UserMessageBubble;
