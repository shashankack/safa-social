import {
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useActivities } from "../hooks/useActivities";
import EventCard from "../components/EventCard";

export default function EventsPage() {
  const { items, loading, error } = useActivities(); // all

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        All Events
      </Typography>
      {loading && <CircularProgress size={28} />}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && items.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No events yet.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {items.map((it) => (
          <Grid item key={it.id} xs={12} sm={6} md={4}>
            <EventCard item={it} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
