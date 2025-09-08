import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";
import AnimatedLogo from "./components/AnimatedLogo";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:id" element={<EventDetailPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
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
          <AnimatedLogo color="#da6c81" loop mode="loader" size={120} />
        </Box>
      }
    >
      <AppRoutes />
    </Suspense>
  );
};

export default App;
