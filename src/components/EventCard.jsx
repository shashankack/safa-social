import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function EventCard({ item }) {
  const price =
    typeof item.registrationFee === "number"
      ? (item.registrationFee / 100).toFixed(2)
      : null;

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" fontWeight={700}>
            {item.title}
          </Typography>
          {item.startAt && (
            <Typography variant="body2" color="text.secondary">
              {new Date(item.startAt).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
              })}
            </Typography>
          )}
          {price && (
            <Typography variant="body1" fontWeight={600}>
              ₹{price}
            </Typography>
          )}
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          component={RouterLink}
          to={`/event/${item.slug || item.id}`}
          size="small"
          variant="contained"
        >
          View details
        </Button>
      </CardActions>
    </Card>
  );
}
