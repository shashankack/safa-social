import React, { lazy, Suspense } from "react";
import { Box } from "@mui/material";
import AnimatedLogo from "./components/AnimatedLogo";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const ActivityDetailsPage = lazy(() => import("./pages/ActivityDetailsPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/event/:slug" element={<ActivityDetailsPage />} />
      <Route path="/thank-you" element={<ThankYouPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;
