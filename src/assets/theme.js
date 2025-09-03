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
      default: "#fdf6eb",
    },
    text: {
      primary: "#1a3e12",
      secondary: "#af1923",
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
