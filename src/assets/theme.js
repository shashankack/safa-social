import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#af1923",
    },
    secondary: {
      main: "#1a3e12",
    },
    background: {
      default: "#fdf6eb",
    },
    text: {
      primary: "#1a3e12",
      secondary: "#af1923",
    },
  },
  typography: {
    fontFamily: "Agraham",
    fontSize: 14,

    h1: {
      color: "#1a3e12",
    },
    body1: {
      color: "#1a3e12",
      fontFamily: "Manrope",
    },
  },
});

export default theme;
