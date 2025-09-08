import React from "react";
import {
  Stack,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { useActivities } from "../../hooks/useActivities";
import EventCard from "../EventCard";
import { Link as RouterLink } from "react-router-dom";

export default function EventsSection() {
  const { items, loading, error } = useActivities({ status: "upcoming" }); // server filter :contentReference[oaicite:7]{index=7}

  return (
    <Stack
      justifyContent="center"
      alignItems="stretch"
      bgcolor={"background.default"}
      pt={{ xs: 10, sm: 20 }}
      pb={10}
      px={{ xs: 2, sm: 10 }}
      gap={3}
    >
      <Typography
        fontFamily="Agraham"
        fontSize={{ xs: "4vw", sm: "1.6vw" }}
        color="primary.main"
        fontWeight={700}
      >
        Upcoming Events
      </Typography>

      {loading && <CircularProgress size={28} sx={{ mt: 1 }} />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Grid container spacing={2}>
          {items.slice(0, 6).map((it, index) => (
            <Grid
              key={index}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <EventCard item={it} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box>
        <Button component={RouterLink} to="/events" variant="text">
          See all events →
        </Button>
      </Box>
    </Stack>
  );
}
