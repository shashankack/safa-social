import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Loader from "./components/Loader";

import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";

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
      <Navbar />
      <Analytics />
      <AppRoutes />
    </Suspense>
  );
};

export default App;
