import React, { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  Chip,
  Stack,
  Skeleton,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Box,
  Pagination,
  Divider,
} from "@mui/material";
import { useActivities } from "../../hooks/useActivities";
import RegisterDialog from "../../components/RegisterDialog";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // add back

/* ----------------------------------------------------------
   Helpers
---------------------------------------------------------- */
function formatRange(startAt, endAt) {
  if (!startAt) return "";
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  const date = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const startTime = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime =
    end &&
    end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  return end ? `${date} • ${startTime} – ${endTime}` : `${date} • ${startTime}`;
}

function formatINR(paise) {
  if (typeof paise !== "number") return null;
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(rupees);
}

/* ----------------------------------------------------------
   UI Bits
---------------------------------------------------------- */
const StatusChip = ({ status }) => {
  if (!status) return null;
  const norm = String(status).toLowerCase();
  const color =
    norm === "live"
      ? "secondary"
      : norm === "upcoming"
      ? "secondary"
      : norm === "past"
      ? "default"
      : "info";
  return (
    <Chip
      size="small"
      color={color}
      label={norm}
      sx={{
        textTransform: "uppercase",
        fontWeight: 500,
        letterSpacing: 0.3,
        color: "primary.main",
      }}
    />
  );
};

const LoadingGrid = () => (
  <Box minHeight="100vh" bgcolor={"background.default"}>
    <Grid container spacing={3} px={{ xs: 1, md: 10 }} py={{ xs: 3, md: 6 }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={224} />
            <CardContent>
              <Skeleton variant="text" width="70%" height={28} />
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="rounded" height={72} sx={{ mt: 1.5 }} />
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Skeleton variant="rounded" width={140} height={40} />
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

/* ----------------------------------------------------------
   Event Card (no redirect, body1 everywhere, What's Included accordion)
---------------------------------------------------------- */
function EventCard({
  event,
  onRegisterClick,
  showMapButton = true,
  showPrice = true,
}) {
  const isClosed =
    !event?.canBook ||
    event?.status === "past" ||
    Number(event?.totalSlots ?? 0) - Number(event?.bookedSlots ?? 0) <= 0;

  const isFree = Number(event?.registrationFee) === 0;
  const priceLabel =
    typeof event?.registrationFee === "number"
      ? isFree
        ? "Free"
        : formatINR(event.registrationFee)
      : null;

  const whatsIncludedHtml =
    event?.whatsIncluded || event?.additionalNotes || "";

  const thumb =
    (Array.isArray(event?.thumbnailUrls) && event.thumbnailUrls[0]) ||
    event?.coverImageUrl ||
    event?.thumbnailUrl ||
    event?.imageUrl ||
    event?.bannerUrl ||
    `https://placehold.co/800x450?text=${encodeURIComponent(
      event?.title || event?.name || "Event"
    )}`;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        border: 2,
        overflow: "hidden",
        bgcolor: "background.default",
        transition: (t) =>
          t.transitions.create(["transform", "box-shadow"], {
            duration: t.transitions.duration.shorter,
          }),
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      {/* Media only */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            // aspectRatio: "14 / 10",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            src={thumb}
            alt={event?.title || event?.name}
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Typography
            variant="body1"
            sx={{ fontSize: 20, fontWeight: 700, color: "primary.main" }}
          >
            {event?.title || event?.name}
          </Typography>
          <StatusChip status={event?.status} />
        </Stack>

        {event?.startAt && (
          <Typography
            variant="body1"
            sx={{
              fontSize: 15,
              mb: 0.5,
              "& span": { fontWeight: 800, color: "primary.main" },
            }}
          >
            <span>Time:</span> {formatRange(event.startAt, event.endAt)}
          </Typography>
        )}

        {event?.venueName && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              fontSize: 15,
              mb: 1.25,
              "& span": { fontWeight: 800, color: "primary.main" },
            }}
          >
            <span>Venue:</span> {event.venueName}
          </Typography>
        )}

        {/* Optional price (no availability shown) */}
        {showPrice && priceLabel && (
          <Typography
            variant="body1"
            sx={{
              fontSize: 14,
              fontWeight: 600,
              "& span": { fontWeight: 800, color: "primary.main" },
            }}
          >
            <span>Price:</span> {priceLabel}
          </Typography>
        )}

        {/* Description */}
        {event?.description && (
          <Typography
            variant="body1"
            color="text.primary"
            fontFamily={"Alternate Gothic"}
            component="div"
            sx={{ fontSize: 20, mt: 0.5 }}
          >
            {event.description}
          </Typography>
        )}

        {/* "What's Included" Accordion (HTML allowed) */}
        {whatsIncludedHtml && (
          <Accordion
            sx={{
              mt: 1.5,
              borderRadius: 2,
              boxShadow: "none",
              bgcolor: "background.default",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />} // arrow added back
              sx={{
                bgcolor: "rgba(0,0,0,0.04)",
                borderRadius: 2,
                "& .MuiAccordionSummary-content": { my: 1 },
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontSize: 16, fontWeight: 700 }}
              >
                What’s Included
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                className="whats-included"
                sx={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "text.secondary",
                  fontFamily: "Manrope",
                  "& ul": {
                    listStyle: "disc",
                    paddingLeft: "1.25rem",
                    margin: 0,
                  },
                  "& li": {
                    marginBottom: "0.5rem",
                  },
                  "& strong": {
                    fontWeight: 600,
                    color: "seconday.main",
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: (whatsIncludedHtml || "").replace(
                    /<h3[^>]*>.*?<\/h3>/i,
                    ""
                  ),
                }}
              />
            </AccordionDetails>
          </Accordion>
        )}
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        {showMapButton && event?.mapUrl && (
          <Button
            fullWidth
            variant="outlined"
            component="a"
            href={event.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Map
          </Button>
        )}
        <Tooltip
          title={
            isClosed
              ? "Registrations are closed for this event"
              : "Proceed to registration"
          }
        >
          <span style={{ width: "100%" }}>
            <Button
              fullWidth
              variant="contained"
              disabled={isClosed}
              onClick={() => onRegisterClick?.(event)}
            >
              {isClosed ? "Closed" : isFree ? "Register (Free)" : "Register"}
            </Button>
          </span>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

/* ----------------------------------------------------------
   Main Section
---------------------------------------------------------- */
const PAGE_SIZE = 9;

const EventsSectionTemp = () => {
  const { items, loading, error } = useActivities();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate(); // kept if you need elsewhere; not used for card click

  const handleOpenRegister = (activity) => {
    setSelectedActivity(activity);
    setDialogOpen(true);
  };
  const handleCloseRegister = () => {
    setDialogOpen(false);
    setSelectedActivity(null);
  };
  const handleSuccess = (bookingId) => {
    console.log("Booking successful:", bookingId);
  };

  const enriched = useMemo(
    () =>
      (items || []).map((ev) => ({
        ...ev,
        _date: ev.startAt ? new Date(ev.startAt).getTime() : 0,
      })),
    [items]
  );

  const sorted = useMemo(() => {
    const arr = [...enriched];
    arr.sort((a, b) => a._date - b._date);
    return arr;
  }, [enriched]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = useMemo(
    () => sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sorted, page]
  );

  useEffect(() => {
    setPage(1);
  }, [items]);

  if (loading) return <LoadingGrid />;

  if (error)
    return (
      <Alert severity="error" variant="outlined">
        {error || "Error loading events"}
      </Alert>
    );

  if (!enriched.length)
    return (
      <Alert severity="info" variant="outlined">
        No events found.
      </Alert>
    );

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Typography
        width="100%"
        textAlign={{ xs: "center", md: "left" }}
        variant="body1"
        sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 800 }}
        fontFamily={"Agraham"}
        color="primary"
        ml={{ xs: "auto", md: 10 }}
        mt={{ xs: 3, md: 6 }}
      >
        Upcoming Events
      </Typography>

      <Grid container spacing={3} px={{ xs: 2, md: 10 }} py={{ xs: 3, md: 6 }}>
        {pageItems.map((event) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
            <EventCard
              event={event}
              onRegisterClick={handleOpenRegister}
              showMapButton
              showPrice
            />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Stack alignItems="center" sx={{ mt: 3, mb: 6 }}>
          <Pagination
            color="primary"
            page={page}
            count={totalPages}
            onChange={(_, v) => setPage(v)}
          />
        </Stack>
      )}

      <RegisterDialog
        open={dialogOpen}
        onClose={handleCloseRegister}
        activity={selectedActivity}
        onSuccess={handleSuccess}
      />
    </Box>
  );
};

export default EventsSectionTemp;
