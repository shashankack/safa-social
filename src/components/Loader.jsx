import React from "react";
import { Box } from "@mui/material";
import AnimatedLogo from "./AnimatedLogo";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "background.default",
      }}
    >
      <AnimatedLogo color="#da6c81" loop mode="loader" size={120} />
    </Box>
  );
};

export default Loader;
