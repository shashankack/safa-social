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
  Divider,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useActivities } from "../../hooks/useActivities";
import RegisterDialog from "../../components/RegisterDialog";
import { useNavigate } from "react-router-dom";

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

function parseHeadingFromHTML(html) {
  if (!html) return null;
  const match = String(html).match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i);
  if (!match) return null;
  return match[1].replace(/<[^>]+>/g, "").trim();
}

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
      size="medium"
      color={color}
      label={norm}
      sx={{
        textTransform: "uppercase",
        fontWeight: 400,
        letterSpacing: 0.2,
        color: "primary.main",
      }}
    />
  );
};

const AvailabilityChip = ({ total, available }) => {
  if (typeof available !== "number" || typeof total !== "number") return null;
  const fewLeft =
    available > 0 && available <= Math.max(1, Math.floor(total * 0.15));
  const soldOut = available <= 0;
  if (soldOut) return <Chip size="medium" color="error" label="Sold out" />;
  if (fewLeft)
    return <Chip size="medium" color="warning" label={`${available} left`} />;
  return (
    <Chip
      size="medium"
      color="secondary"
      sx={{ color: "primary.main" }}
      label={`${available} available`}
    />
  );
};

/* ----------------------------------------------------------
   Loading Grid
---------------------------------------------------------- */
const LoadingGrid = () => (
  <Grid container spacing={3} px={{ xs: 1, md: 10 }} py={{ xs: 3, md: 6 }}>
    {Array.from({ length: 3 }).map((_, i) => (
      <Grid
        size={{
          xs: 12,
          sm: 6,
          md: 4,
        }}
        key={i}
      >
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
);

/* ----------------------------------------------------------
   Event Card (lean)
---------------------------------------------------------- */
function EventCard({
  event,
  onRegisterClick,
  onRedirectClick,
  showMapButton = true,
  showPrice = true,
}) {
  const total = Number(event?.totalSlots ?? 0);
  const booked = Number(event?.bookedSlots ?? 0);
  const available = Math.max(0, total - booked);
  const isClosed =
    !event?.canBook || event?.status === "past" || available <= 0;
  const isFree = Number(event?.registrationFee) === 0;
  const priceLabel =
    typeof event?.registrationFee === "number"
      ? isFree
        ? "Free"
        : formatINR(event.registrationFee)
      : null;
  const accordionTitle =
    parseHeadingFromHTML(event?.additionalNotes) || "Additional Notes";

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
        transition: (t) =>
          t.transitions.create(["transform", "box-shadow"], {
            duration: t.transitions.duration.shorter,
          }),
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
          // cursor: "pointer",
        },
      }}
      onClick={() => onRedirectClick?.(event)}
    >
      {/* Media with overlays */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            aspectRatio: "14 / 10",
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

          {/* gradients */}
          <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 72,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 96,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.55), rgba(0,0,0,0))",
              }}
            />
          </Box>

          {/* top row: status, price, availability */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              right: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <StatusChip status={event?.status} />
              <AvailabilityChip total={total} available={available} />
            </Stack>
            {showPrice && priceLabel && (
              <Chip
                size="medium"
                label={priceLabel}
                sx={{
                  bgcolor: "secondary.main",
                  color: "primary",
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* bottom: title, time, venue */}
          <Box
            sx={{
              position: "absolute",
              left: 12,
              right: 12,
              bottom: 10,
              color: "secondary.main",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
              gutterBottom
            >
              {event?.title || event?.name}
            </Typography>
            <Stack
              direction="row"
              spacing={1.2}
              alignItems="center"
              sx={{ opacity: 0.95, flexWrap: "wrap" }}
            >
              {event?.startAt && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <AccessTimeOutlinedIcon fontSize="medium" />
                  <Typography variant="body1" color="inherit">
                    {formatRange(event.startAt, event.endAt)}
                  </Typography>
                </Stack>
              )}
              {event?.venueName && (
                <>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      mx: 1,
                      borderColor: "rgba(255,255,255,0.35)",
                      border: 1,
                    }}
                  />
                  <Stack direction="row" spacing={0.75} alignItems="center">
                    <PlaceOutlinedIcon fontSize="medium" />
                    <Typography variant="body1" color="inherit">
                      {event.venueName}
                    </Typography>
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Description & Notes */}
      <CardContent sx={{ flexGrow: 1 }}>
        {event?.description && (
          <Typography
            variant="body2"
            color="text.primary"
            component="div"
            sx={{ mb: 2 }}
          >
            {event.description}
          </Typography>
        )}

        {event?.additionalNotes && (
          <Accordion
            sx={{
              mt: 1,
              borderRadius: 2,
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "rgba(0,0,0,0.04)",
                borderRadius: 2,
                "& .MuiAccordionSummary-content": { my: 1 },
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {accordionTitle}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{ fontSize: "0.9rem", lineHeight: 1.6 }}
                dangerouslySetInnerHTML={{ __html: event.additionalNotes }}
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
            startIcon={<MapOutlinedIcon />}
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
              startIcon={<PaymentsOutlinedIcon />}
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
   Main Section (lean: no search/filters)
---------------------------------------------------------- */
const PAGE_SIZE = 9;

const EventsSectionTemp = () => {
  const { items, loading, error } = useActivities();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {}, []);

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

  const handleRedirectClick = (ev) => {
    navigate(`/event/${ev.slug}`);
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
    arr.sort((a, b) => a._date - b._date); // simple: upcoming first
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
        variant={{ xs: "h5", md: "h4" }}
        fontFamily="Agraham"
        fontWeight={700}
        color="primary"
        ml={{ xs: "auto", md: 10 }}
        mt={{ xs: 3, md: 6 }}
      >
        Upcoming Events
      </Typography>
      <Grid container spacing={3} px={{ xs: 1, md: 10 }} py={{ xs: 3, md: 6 }}>
        {pageItems.map((event) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 4,
            }}
            key={event.id}
          >
            <EventCard
              event={event}
              onRegisterClick={handleOpenRegister}
              defaultExpandNotes={
                String(event?.status).toLowerCase() === "upcoming"
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
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

      {/* Register Dialog */}
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
