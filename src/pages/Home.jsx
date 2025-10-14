import React from "react";
import HeroSection from "../components/sections/HeroSection";
import UpcomingEventsSection from "../components/sections/UpcomingEventsSection";
import EventsSection from "../components/sections/EventsSection";
const Home = () => {
  return (
    <>
      <HeroSection />
      <UpcomingEventsSection />
      <EventsSection />
    </>
  );
};

export default Home;
