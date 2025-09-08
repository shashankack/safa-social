import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Button,
  Divider,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Tooltip,
  Paper,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { useTheme } from "@mui/material/styles";
import { useActivity } from "../hooks/useActivity";
import { useMemo, useState } from "react";
import RegisterDialog from "../components/RegisterDialog";

/* ------------------------------- helpers ------------------------------- */
function formatRange(startAt, endAt) {
  if (!startAt) return "";
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  const date = start.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Kolkata",
  });

  const startTime = start.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  const endTime =
    end &&
    end.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

  return end
    ? `${date} • ${startTime} – ${endTime} IST`
    : `${date} • ${startTime} IST`;
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

function AvailabilityChip({ total, booked }) {
  const available = Math.max(0, Number(total ?? 0) - Number(booked ?? 0));
  const fewLeft =
    available > 0 &&
    available <= Math.max(1, Math.floor(Number(total ?? 0) * 0.15));
  if (available <= 0)
    return <Chip color="error" size="small" label="Sold out" />;
  if (fewLeft)
    return <Chip color="warning" size="small" label={`${available} left`} />;
  return <Chip color="success" size="small" label={`${available} available`} />;
}

/* ---------------------------- component ---------------------------- */
export default function EventDetailPage() {
  const { id } = useParams(); // 1) hooks at the top, always
  const navigate = useNavigate(); // 2)
  const { data, loading, error } = useActivity(id); // 3)
  const [open, setOpen] = useState(false); // 4)
  const [err, setErr] = useState(""); // 5)
  const theme = useTheme(); // 6)
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // 7)

  // Safe destructuring for all renders
  const {
    title,
    description,
    additionalNotes,
    startAt,
    endAt,
    venueName,
    mapUrl,
    registrationFee,
    totalSlots,
    bookedSlots,
    canBook,
    status,
    thumbnailUrls,
    coverImageUrl,
    imageUrl,
    bannerUrl,
  } = data || {};

  // Memoized hero URL – runs on every render (data may be undefined)
  const hero = useMemo(
    () =>
      (Array.isArray(thumbnailUrls) && thumbnailUrls[0]) ||
      coverImageUrl ||
      imageUrl ||
      bannerUrl ||
      "https://placehold.co/1600x900?text=Event",
    [thumbnailUrls, coverImageUrl, imageUrl, bannerUrl]
  );

  const priceLabel =
    typeof registrationFee === "number" ? formatINR(registrationFee) : null;
  const total = Number(totalSlots ?? 0);
  const booked = Number(bookedSlots ?? 0);
  const available = Math.max(0, total - booked);
  const isClosed =
    !canBook || String(status).toLowerCase() === "past" || available <= 0;
  const notesTitle =
    parseHeadingFromHTML(additionalNotes) || "Additional Notes";

  function handleSuccess(bookingId) {
    navigate(`/thank-you?bookingId=${encodeURIComponent(bookingId)}`);
  }

  // Early returns AFTER all hooks have been called
  if (loading)
    return (
      <Container
        disableGutters
        maxWidth={false}
        sx={{ py: 8, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress size={28} />
      </Container>
    );

  if (error || !data)
    return (
      <Container disableGutters maxWidth={false} sx={{ py: 8 }}>
        <Alert severity="error">{error || "Not found"}</Alert>
      </Container>
    );

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Full-bleed hero */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          bgcolor: "background.default",
        }}
      >
        <Box
          sx={{ position: "relative", aspectRatio: "16 / 9", width: "100%" }}
        >
          <CardMedia
            component="img"
            src={hero}
            alt={title}
            loading="lazy"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <Container disableGutters maxWidth="lg">
            <Stack
              spacing={1}
              sx={{ position: "absolute", left: 16, right: 16, bottom: 16 }}
            >
              <Typography
                variant={isMobile ? "h5" : "h4"}
                sx={{
                  color: "#fff",
                  fontWeight: 800,
                  textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                }}
              >
                {title}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <AvailabilityChip total={total} booked={booked} />
                {priceLabel && (
                  <Chip
                    size="small"
                    label={priceLabel}
                    sx={{
                      bgcolor: "rgba(0,0,0,0.6)",
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Content */}
      <Container
        disableGutters
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 6 }, px: { xs: 2, md: 0 } }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
        >
          {/* Left */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              sx={{ mb: 1 }}
            >
              {startAt && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <AccessTimeOutlinedIcon fontSize="small" />
                  <Typography color="text.secondary">
                    {formatRange(startAt, endAt)}
                  </Typography>
                </Stack>
              )}
              {venueName && (
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <PlaceOutlinedIcon fontSize="small" />
                  <Typography color="text.secondary">{venueName}</Typography>
                </Stack>
              )}
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {description && (
              <Box
                sx={{ lineHeight: 1.8, typography: "body1" }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {additionalNotes && (
              <Accordion
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:before": { display: "none" },
                }}
                defaultExpanded
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    bgcolor: "rgba(0,0,0,0.04)",
                    borderRadius: 2,
                    "& .MuiAccordionSummary-content": { my: 1 },
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {notesTitle}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{ fontSize: "0.95rem", lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: additionalNotes }}
                  />
                </AccordionDetails>
              </Accordion>
            )}
          </Box>

          {/* Right */}
          <Box sx={{ width: { xs: "100%", md: 360 }, flexShrink: 0 }}>
            <Card
              variant="outlined"
              sx={{ borderRadius: 3, position: "sticky", top: 24 }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  {priceLabel && (
                    <Typography variant="h5" fontWeight={800}>
                      {priceLabel}
                    </Typography>
                  )}
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <AvailabilityChip total={total} booked={booked} />
                  </Stack>

                  {startAt && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <AccessTimeOutlinedIcon fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {formatRange(startAt, endAt)}
                      </Typography>
                    </Stack>
                  )}

                  {venueName && (
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <PlaceOutlinedIcon fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {venueName}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                {mapUrl && (
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MapOutlinedIcon />}
                    component="a"
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Map
                  </Button>
                )}
                <Tooltip
                  title={
                    isClosed
                      ? available <= 0
                        ? "Sold out"
                        : "Registrations are closed for this event"
                      : "Proceed to registration"
                  }
                >
                  <span style={{ width: "100%" }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<PaymentsOutlinedIcon />}
                      disabled={isClosed}
                      onClick={() => setOpen(true)}
                    >
                      {isClosed
                        ? "Closed"
                        : available === 0
                        ? "Sold out"
                        : "Register"}
                    </Button>
                  </span>
                </Tooltip>
              </CardActions>
            </Card>
          </Box>
        </Stack>

        {!!err && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {err}
          </Alert>
        )}
      </Container>

      {/* Sticky mobile CTA */}
      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            p: 1.5,
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          {priceLabel && (
            <Typography sx={{ flex: 1, fontWeight: 700 }}>
              {priceLabel}
            </Typography>
          )}
          <Button
            variant="contained"
            startIcon={<PaymentsOutlinedIcon />}
            disabled={isClosed}
            onClick={() => setOpen(true)}
            sx={{ flex: 1 }}
          >
            {isClosed ? "Closed" : "Register"}
          </Button>
        </Paper>
      )}

      {/* Register Dialog */}
      <RegisterDialog
        open={open}
        onClose={() => setOpen(false)}
        activity={data}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
