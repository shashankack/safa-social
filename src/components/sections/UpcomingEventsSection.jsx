import React from "react";
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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useActivities } from "../../hooks/useActivities";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const UpcomingEventsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const { items } = useActivities({ status: "upcoming" });

  const items = [
    {
      id: "8014c11c-b3c9-4d06-9309-366ef43f85a5",
      slug: "perfume-making-workshop",
      title: "Perfume Making Workshop",
      description:
        '<p class="activity-description">\r\n  Join us for an immersive Perfume Making Workshop where you’ll explore\r\n  different fragrance notes and create your own perfume.\r\n  <br />\r\n  <br />\r\n  Enjoy a relaxing afternoon with good food and better company. Includes a\r\n  welcome drink, 1 starter, 1 main course and dessert at Justbe Cafe\r\n</p>',
      additionalNotes: null,
      startAt: "2025-10-25T06:00:00.000Z",
      endAt: "2025-10-25T08:00:00.000Z",
      totalSlots: 100,
      bookedSlots: 0,
      venueName: "Justbe Cafe",
      thumbnailUrls: [
        "https://res.cloudinary.com/dyclqcoqp/image/upload/v1760637065/Safa_fragor_poster_web_zeq2bx.png",
        "https://res.cloudinary.com/dyclqcoqp/image/upload/v1760637067/Safa_fragor_poster_copy_ymnnwe.png",
      ],
      galleryUrls: [],
      mapUrl: "https://maps.app.goo.gl/uDS76hoZajPZPDLT9",
      currency: "INR",
      registrationFee: 150000,
      isPublished: true,
      clubId: null,
      clubName: null,
      clubSlug: null,
      typeId: "c0fc2add-b700-414f-9e7f-5a0ba5833f2f",
      typeName: "One Time",
      status: "upcoming",
      canBook: true,
    },
  ];

  const handleRegisterClick = (event) => {
    // Placeholder for Google Form redirect in future
    console.log("Register clicked for event:", event.id);
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

  const formatPrice = (price, currency) => {
    return `₹${(price / 100).toFixed(2)}`;
  };

  if (items.length > 0) {
    // Show only the first event
    const event = items[0];
    const dateInfo = formatDate(event.startAt);
    const timeInfo = formatTime(event.startAt);
    const priceInfo = formatPrice(event.registrationFee, event.currency);

    // Use index 0 for PC (desktop), index 1 for mobile
    const thumbnailUrl = isMobile
      ? event.thumbnailUrls[1]
      : event.thumbnailUrls[0];

    return (
      <Box py={8} px={{ xs: 2, sm: 4, md: 8 }} bgcolor="background.default">
        <Box mb={6} textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "8vw", sm: "6vw", md: "4vw" },
              color: "#da6c81",
              letterSpacing: 1,
              mb: 1,
            }}
          >
            Upcoming Event
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mt: 5,
              color: "#1a3e12",
              fontSize: { xs: "0.9rem", sm: "1rem" },
              opacity: 0.8,
            }}
          >
            Join us for our next amazing event
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
                alt={event.title}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: { xs: "auto", lg: "100%" },
                  objectFit: "cover",
                }}
              />

              {/* Date and Time Badge */}
              <Chip
                label={`${dateInfo.fullDate} | ${timeInfo}`}
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  bgcolor: "#da6c81",
                  color: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.85rem" },
                  px: 1,
                  py: 2,
                  height: "auto",
                  "& .MuiChip-label": {
                    px: 1.5,
                    py: 0.5,
                  },
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
                {event.title}
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
                    {event.venueName}
                  </Typography>
                  {event.mapUrl && (
                    <Button
                      component="a"
                      href={event.mapUrl}
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

              {/* Register Button */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleRegisterClick(event)}
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
                }}
              >
                Register
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }
};

export default UpcomingEventsSection;
