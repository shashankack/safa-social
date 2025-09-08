import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#da6c81",
    },
    secondary: {
      main: "#fecdd7",
    },
    background: {
      default: "#f4eacf",
    },
    text: {
      primary: "#da6c81",
      secondary: "#000",
    },
  },
  typography: {
    fontFamily: "Alternate Gothic",
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
