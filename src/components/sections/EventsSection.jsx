import React from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Skeleton,
  Alert,
  Typography,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useActivities } from "../../hooks/useActivities";

const EventsSection = () => {
  const { items, loading, error } = useActivities({ status: "upcoming" });

  if (loading) {
    return (
      <Box py={6} px={{ xs: 2, sm: 4, md: 8 }}>
        <Box mb={6} textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Agraham, Alternate Gothic, sans-serif",
              fontWeight: 800,
              fontSize: { xs: ".9rem", sm: "1.6rem" },
              color: "#da6c81",
              letterSpacing: 1,
            }}
          >
            Upcoming Events
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              key={i}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(218, 108, 129, 0.15)",
                  border: "2px solid #fecdd7",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height={280}
                  sx={{ bgcolor: "#fecdd7" }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box py={6} px={{ xs: 2, sm: 4, md: 8 }} textAlign="center">
        <Box mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Agraham, Alternate Gothic, sans-serif",
              fontWeight: 800,
              fontSize: { xs: ".9rem", sm: "1.6rem" },
              color: "#da6c81",
              letterSpacing: 1,
            }}
          >
            Upcoming Events
          </Typography>
        </Box>
        <Alert
          severity="error"
          sx={{
            maxWidth: 600,
            mx: "auto",
            bgcolor: "rgba(254, 205, 215, 0.3)",
            color: "#1a3e12",
            border: "2px solid rgba(218, 108, 129, 0.3)",
            borderRadius: 4,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            py: 3,
            "& .MuiAlert-icon": {
              color: "#da6c81",
            },
          }}
        >
          {`${error}. Please try again later.` || "Error loading events"}
        </Alert>
      </Box>
    );
  }

  if (!items.length) {
    return (
      <Box py={6} px={{ xs: 2, sm: 4, md: 8 }} textAlign="center">
        <Box mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: "Agraham, Alternate Gothic, sans-serif",
              fontWeight: 800,
              fontSize: { xs: ".9rem", sm: "1.6rem" },
              color: "#da6c81",
              letterSpacing: 1,
            }}
          >
            Upcoming Events
          </Typography>
        </Box>
        <Alert
          severity="info"
          sx={{
            maxWidth: 600,
            mx: "auto",
            bgcolor: "rgba(254, 205, 215, 0.3)",
            color: "#1a3e12",
            border: "2px solid rgba(218, 108, 129, 0.3)",
            borderRadius: 4,
            fontFamily: "Manrope, sans-serif",
            fontWeight: 500,
            fontSize: 16,
            py: 3,
            "& .MuiAlert-icon": {
              color: "#da6c81",
            },
          }}
        >
          No upcoming events found. Check back soon for exciting new events!
        </Alert>

        {/* View All Events Button */}
        <Box textAlign="center" mt={6}>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            sx={{
              bgcolor: "#da6c81",
              color: "#ffffff",
              fontFamily: "Alternate Gothic, sans-serif",
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem" },
              px: { xs: 3, sm: 4 },
              py: { xs: 1.5, sm: 2 },
              borderRadius: 3,
              textTransform: "uppercase",
              letterSpacing: 1,
              boxShadow: "0 8px 24px rgba(218, 108, 129, 0.3)",
              border: "2px solid transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "#1a3e12",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(26, 62, 18, 0.4)",
                borderColor: "#fecdd7",
              },
            }}
          >
            View All Events
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box py={8} px={{ xs: 2, sm: 4, md: 8 }}>
      <Box mb={6} textAlign="center">
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Agraham, Alternate Gothic, sans-serif",
            fontWeight: 800,
            fontSize: { xs: ".9rem", sm: "1.6rem" },
            color: "#da6c81",
            letterSpacing: 1,
            mb: 1,
          }}
        >
          Upcoming Events
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 5,
            fontFamily: "Manrope, sans-serif",
            color: "#1a3e12",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            opacity: 0.8,
          }}
        >
          Click on any event to view details and register
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {items.map((event) => {
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
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: 3,
              }}
              key={event.id}
            >
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 8px 32px rgba(218, 108, 129, 0.15)",
                  border: "2px solid #fecdd7",
                  bgcolor: "#ffffff",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: "0 20px 40px rgba(218, 108, 129, 0.25)",
                    borderColor: "#da6c81",
                  },
                }}
              >
                <Box
                  component={RouterLink}
                  to={`/event/${event.slug || event.id}`}
                  sx={{
                    display: "block",
                    width: "100%",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(45deg, rgba(218, 108, 129, 0.1) 0%, rgba(254, 205, 215, 0.1) 100%)",
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                        zIndex: 1,
                      },
                      "&:hover::before": {
                        opacity: 1,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={thumb}
                      alt={event?.title || event?.name}
                      loading="lazy"
                      sx={{
                        width: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* View All Events Button */}
      <Box textAlign="center" mt={6}>
        <Button
          component={RouterLink}
          to="/events"
          variant="contained"
          sx={{
            bgcolor: "#da6c81",
            color: "#ffffff",
            fontFamily: "Alternate Gothic, sans-serif",
            fontWeight: 600,
            fontSize: { xs: "1rem", sm: "1.1rem" },
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            borderRadius: 3,
            textTransform: "uppercase",
            letterSpacing: 1,
            boxShadow: "0 8px 24px rgba(218, 108, 129, 0.3)",
            border: "2px solid transparent",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              bgcolor: "#1a3e12",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 32px rgba(26, 62, 18, 0.4)",
              borderColor: "#fecdd7",
            },
          }}
        >
          View All Events
        </Button>
      </Box>
    </Box>
  );
};

export default EventsSection;
