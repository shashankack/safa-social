import React from "react";
import { Stack, Typography } from "@mui/material";

import SubmitForm from "../SubmitForm";

const EventsSection = () => {
  return (
    <Stack
      justifyContent="center"
      alignItems="start"
      pt={{ xs: 10, sm: 20 }}
      pb={10}
      px={{ xs: 2, sm: 10 }}
    >
      <Typography
        fontFamily="Agraham"
        fontSize={{ xs: "4vw", sm: "1.6vw" }}
        color="primary.main"
        fontWeight={700}
      >
        Upcoming Events
      </Typography>
      <Typography
        variant="body1"
        mt={{ xs: 2, sm: 4 }}
        maxWidth={1000}
        fontSize={{ xs: "3vw", sm: "1.4vw" }}
        fontWeight={500}
        sx={{ textAlign: "justify" }}
      >
        Stay Tuned! be the first to know about our upcoming events, Sign up and
        stay connected as we unveil meaningful experiences designed for you.
      </Typography>

      <Stack mt={4} width="100%" maxWidth={800}>
        <SubmitForm />
      </Stack>
    </Stack>
  );
};

export default EventsSection;
