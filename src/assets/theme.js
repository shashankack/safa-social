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
    fontFamily: "Montserrat, sans-serif",
    fontSize: 14,

    h1: {
      fontFamily: "Tan Nimbus",
      color: "#da6c81",
    },

    body1: {
      color: "#000",
    },
  },
});

export default theme;
