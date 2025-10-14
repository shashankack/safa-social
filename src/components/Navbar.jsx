import React from "react";
import { AppBar, Box } from "@mui/material";

const Navbar = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "background.default",
          width: "100%",
          overflow: "hidden",
          height: { xs: 80, md: 120 },
        }}
      >
        <Box
          component="img"
          src="/images/pink_logo.png"
          sx={{
            mx: "auto",
            mt: 2,
            width: { xs: 150, md: 200 },
            height: "auto",
            objectFit: "cover",
          }}
        />
      </Box>
    </AppBar>
  );
};

export default Navbar;
