// src/pages/ThankYouPage.jsx
import { Container, Typography, Stack, Button, Alert } from "@mui/material";
import { useSearchParams, Link as RouterLink } from "react-router-dom";

export default function ThankYouPage() {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const eventId = params.get("event");

  return (
    <Container sx={{ py: 8 }}>
      <Stack spacing={3} alignItems="flex-start" maxWidth={640}>
        <Typography variant="h4" fontWeight={800}>
          Thank you! 🎉
        </Typography>

        <Alert severity="success" sx={{ width: "100%" }}>
          Payment completed (or in progress). You’ll receive an email with your
          booking details and payment confirmation shortly.
        </Alert>

        <Typography variant="body1">
          {eventId ? <>Event: <strong>{eventId}</strong><br /></> : null}
          {bookingId ? <>Booking ID: <strong>{bookingId}</strong></> : null}
        </Typography>

        <Stack direction="row" spacing={2}>
          {bookingId && (
            <Button
              component={RouterLink}
              to={`/booking/${bookingId}`}
              variant="outlined"
            >
              View booking status
            </Button>
          )}
          <Button component={RouterLink} to="/events" variant="contained">
            Browse more events
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Didn’t get an email after a few minutes? Check your spam folder, then
          reach out to us with your booking ID.
        </Typography>
      </Stack>
    </Container>
  );
}
