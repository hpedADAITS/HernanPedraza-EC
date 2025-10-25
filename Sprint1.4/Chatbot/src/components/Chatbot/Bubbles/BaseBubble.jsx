import { styled } from "@mui/system";

const BaseBubble = styled("div")(({ theme, isUser }) => ({
  position: "relative",
  alignSelf: isUser ? "flex-end" : "flex-start",
  backgroundColor: isUser
    ? theme.palette.primary.dark
    : theme.palette.background.paper,
  color: isUser ? "#fff" : theme.palette.text.primary,
  padding: "12px 18px",
  borderRadius: 10,
  maxWidth: "75%",
  marginBottom: 16,
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
  fontSize: "1.1rem",
  lineHeight: 1.5,
  opacity: 0,
  transform: "translateY(10px)",
  animation: "fadeInUp 0.3s ease forwards",
  "&::before": {
    content: '""',
    position: "absolute",
    width: 0,
    height: 0,
    borderStyle: "solid",
    ...(isUser
      ? {
          borderWidth: "10px 0 10px 10px",
          borderColor: `transparent transparent transparent ${theme.palette.primary.dark}`,
          right: -9,
          top: 13,
        }
      : {
          borderWidth: "10px 10px 10px 0",
          borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
          left: -9,
          top: 13,
        }),
  },
  "@keyframes fadeInUp": {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
}));

export default BaseBubble;
