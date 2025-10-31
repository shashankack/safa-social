import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useActivities } from "../../hooks/useActivities";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RegisterDialog from "../RegisterDialog";

const UpcomingEventsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { activities } = useActivities({ currentStatus: "upcoming" });
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleRegisterClick = (activity) => {
    setSelectedActivity(activity);
    setRegisterDialogOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateNum = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return {
      day,
      dateNum,
      month,
      year,
      fullDate: `${day}, ${dateNum} ${month}, ${year}`,
    };
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatPrice = (priceInPaise) => {
    return `₹${(priceInPaise / 100).toFixed(2)}`;
  };

  if (activities.length > 0) {
    // Show only the first event
    const activity = activities[0];

    // Format date/time based on activity type
    let dateInfo, timeInfo;
    if (activity.type === "one-time" && activity.startDateTime) {
      dateInfo = formatDate(activity.startDateTime);
      timeInfo = formatTime(activity.startDateTime);
    } else if (
      activity.type === "recurring" &&
      activity.schedules?.length > 0
    ) {
      // For recurring, show next schedule
      const nextSchedule = activity.schedules[0];
      dateInfo = { fullDate: `Every ${nextSchedule.dayOfWeek}` };
      timeInfo = formatTime(nextSchedule.startTime);
    } else {
      dateInfo = { fullDate: "Date TBA" };
      timeInfo = "";
    }

    const priceInfo = formatPrice(activity.registrationFee || 0);

    // Use first image from imageUrls array
    const thumbnailUrl = isMobile
      ? activity.imageUrls[0][1]
      : activity.imageUrls[0][0];

    // Helper to extract first <h4> and <ul> from HTML string
    const extractH4AndUl = (html) => {
      if (!html) return { h4: "More information", ul: "" };
      const h4Match = html.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
      const ulMatch = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
      return {
        h4: h4Match ? h4Match[1].trim() : "More information",
        ul: ulMatch ? ulMatch[0] : "",
      };
    };

    const { h4: additionalInfoTitle, ul: additionalInfoList } = extractH4AndUl(
      activity.additionalInfo
    );

    return (
      <Box
        pt={2}
        pb={6}
        px={{ xs: 2, sm: 4, md: 8 }}
        bgcolor="background.default"
      >
        <Box mb={6} textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "7vw", sm: "6vw", md: "4vw" },
              color: "#da6c81",
              letterSpacing: 1,
            }}
          >
            Upcoming Event
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              maxWidth: { xs: 400, md: "70%" },
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              bgcolor: "#f5f5f0",
            }}
          >
            {/* Event Image with Date Badge */}
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                src={thumbnailUrl}
                alt={activity.name}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: { xs: "auto", lg: "100%" },
                  objectFit: "cover",
                }}
              />
            </Box>

            {/* Event Details */}
            <CardContent
              sx={{
                bgcolor: "#f5f5f0",
                p: 3,
              }}
            >
              {/* Event Title */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#2d2d2d",
                  mb: 2,
                  fontSize: { xs: "1.25rem", sm: "1.5rem" },
                }}
              >
                {activity.name}
              </Typography>

              {/* Venue with Icon */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  mb: 2,
                  gap: 1,
                }}
              >
                <LocationOnIcon
                  sx={{ color: "#da6c81", fontSize: 20, mt: 0.3 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {activity.venueName || "Venue TBA"}
                  </Typography>
                  {activity.mapUrl && (
                    <Button
                      component="a"
                      href={activity.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{
                        color: "#da6c81",
                        textTransform: "none",
                        fontSize: "0.85rem",
                        p: 0,
                        mt: 0.5,
                        minWidth: "auto",
                        "&:hover": {
                          bgcolor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Open in Maps →
                    </Button>
                  )}
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >{`${dateInfo.fullDate}${
                  timeInfo ? ` | ${timeInfo}` : ""
                }`}</Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#2d2d2d",
                  mb: 3,
                  fontSize: "1.25rem",
                }}
              >
                Price: {priceInfo}
              </Typography>

              {activity.additionalInfo && (
                <Box mb={2} mt={-2}>
                  <Accordion sx={{ bgcolor: "transparent", boxShadow: "none" }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: "#da6c81" }} />}
                      aria-controls="additional-info-content"
                      id="additional-info-header"
                      sx={{ p: 0 }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          textTransform: "none",
                        }}
                      >
                        {additionalInfoTitle}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, mt: -1 }}>
                      <Box
                        sx={{
                          "& ul": {
                            fontFamily: "Helvetica Now",
                            pl: 3,
                          },
                          color: "#444",
                        }}
                        component="div"
                        dangerouslySetInnerHTML={{ __html: additionalInfoList }}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {/* Register Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleRegisterClick(activity)}
                disabled={!activity.isRegistrationOpen}
                sx={{
                  bgcolor: "#2d2d2d",
                  color: "white",
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: "#1a1a1a",
                  },
                  "&:disabled": {
                    bgcolor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {activity.isRegistrationOpen
                  ? "Register"
                  : "Registration Closed"}
              </Button>
            </CardContent>
          </Card>
        </Box>

        {/* Registration Dialog */}
        <RegisterDialog
          open={registerDialogOpen}
          onClose={() => setRegisterDialogOpen(false)}
          activity={selectedActivity}
          onSuccess={() => {
            setRegisterDialogOpen(false);
            // Optionally show success message
          }}
        />
      </Box>
    );
  }

  return null;
};

export default UpcomingEventsSection;
