export const STYLES = {
  CHAT_CONTAINER: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    position: "relative",
  },
  MESSAGE_LIST: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    p: 2,
    overflowY: "auto",
    backgroundColor: "background.default",
  },
  MESSAGE_INPUT: {
    display: "flex",
    alignItems: "center",
    p: 2,
    borderTop: "1px solid",
    backgroundColor: "background.paper",
  },
  INPUT_FIELD: {
    input: { color: "text.primary" },
    backgroundColor: "background.default",
    borderRadius: "12px",
  },
  SEND_BUTTON: {
    ml: 2,
    borderRadius: 3,
    minWidth: 48,
    height: 48,
  },
  CENTER_FIRST_MESSAGE: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
};
