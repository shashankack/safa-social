import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import AnimatedLogo from "./components/AnimatedLogo";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
          }}
        >
          <AnimatedLogo color="#1a3e12" loop mode="loader" size={120} />
        </Box>
      }
    >
      <AppRoutes />
    </Suspense>
  );
};

export default App;
