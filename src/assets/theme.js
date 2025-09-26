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
      secondary: "#1a3e12",
    },
  },
  typography: {
    fontFamily: "Alternate Gothic",
    fontSize: 14,

    h1: {
      color: "#1a3e12",
    },
    h2: {
      color: "#da6c81",
      fontFamily: "Agraham",
    },
    h3: {
      fontFamily: "Awesome Ways",
    },
    body1: {
      color: "#1a3e12",
      fontFamily: "Manrope",
    },
  },
});

export default theme;
