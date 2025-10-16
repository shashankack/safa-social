import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Card,
  CardMedia,
  Tabs,
  Tab,
  Skeleton,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useActivities } from "../hooks/useActivities";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Loader from "../components/Loader";

export default function EventsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tabValue, setTabValue] = useState(0);

  // Get all activities and filter based on tab
  const { items: allItems, loading, error } = useActivities();

  const upcomingItems = allItems.filter((item) => item.status === "upcoming");
  const pastItems = allItems.filter((item) => item.status === "past");
  const ongoingItems = allItems.filter((item) => item.status === "ongoing");

  const getCurrentItems = () => {
    switch (tabValue) {
      case 0:
        return allItems;
      case 1:
        return upcomingItems;
      case 2:
        return ongoingItems;
      case 3:
        return pastItems;
      default:
        return allItems;
    }
  };

  const currentItems = getCurrentItems();

  {
    loading && <Loader />;
  }

  return (
    <Box
      minHeight="100vh"
      sx={{
        bgcolor: "#f4eacf",
        pt: { xs: 8, sm: 10 },
        pb: 8,
      }}
    >
      <Box px={{ xs: 2, sm: 4, md: 8 }}>
        {/* Back Button */}
        <Box mb={4}>
          <IconButton
            component={RouterLink}
            to="/"
            sx={{
              bgcolor: "#ffffff",
              color: "#da6c81",
              boxShadow: "0 4px 16px rgba(218, 108, 129, 0.2)",
              border: "2px solid #fecdd7",
              "&:hover": {
                bgcolor: "#da6c81",
                color: "#ffffff",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(218, 108, 129, 0.3)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Header */}
        <Box mb={6} textAlign="center">
          <Typography
            variant="h1"
            sx={{
              fontFamily: "Agraham, Alternate Gothic, sans-serif",
              fontWeight: 800,
              fontSize: "2rem",
              color: "#da6c81",
              letterSpacing: 2,
              mb: 2,
            }}
          >
            All Events
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Manrope, sans-serif",
              color: "#1a3e12",
              fontSize: { xs: "1rem", sm: "1.1rem" },
              opacity: 0.8,
            }}
          >
            Discover all our exciting events and activities
          </Typography>
        </Box>

        {/* Filter Tabs */}
        <Box mb={6} display="flex" justifyContent="center">
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              bgcolor: "#ffffff",
              borderRadius: 3,
              p: 1,
              boxShadow: "0 8px 32px rgba(218, 108, 129, 0.15)",
              border: "2px solid #fecdd7",
              "& .MuiTabs-indicator": {
                display: "none",
              },
              "& .MuiTab-root": {
                fontFamily: "Manrope, sans-serif",
                fontWeight: 500,
                fontSize: { xs: "0.9rem", sm: "1rem" },
                textTransform: "capitalize",
                color: "#1a3e12",
                borderRadius: 2,
                mx: 0.5,
                minHeight: 40,
                transition: "all 0.3s ease",
                "&.Mui-selected": {
                  bgcolor: "#da6c81",
                  color: "#ffffff",
                },
              },
            }}
          >
            <Tab label="All" />
            <Tab label="Upcoming" />
            <Tab label="Ongoing" />
            <Tab label="Completed" />
          </Tabs>
        </Box>

        {/* Error State */}
        {error && (
          <Box textAlign="center" mb={6}>
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
              {error || "Error loading events"}
            </Alert>
          </Box>
        )}

        {/* Empty State */}
        {!loading && !error && currentItems.length === 0 && (
          <Box textAlign="center" mb={6}>
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
              No events found in this category. Check back soon for exciting new
              events!
            </Alert>
          </Box>
        )}

        {/* Events Grid */}
        <Grid container spacing={4} justifyContent="center">
          {currentItems.map((event) => {
            const thumbnail =
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
                  component={RouterLink}
                  to={`/event/${event.slug || event.id}`}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 8px 32px rgba(218, 108, 129, 0.15)",
                    border: "2px solid #fecdd7",
                    bgcolor: "#ffffff",
                    textDecoration: "none",
                    display: "block",
                    position: "relative",
                    "&:hover": {
                      transform: "scale(1.01)",
                      boxShadow: "0 20px 40px rgba(218, 108, 129, 0.25)",
                      borderColor: "#da6c81",
                    },
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
                    image={thumbnail}
                    alt={event?.title || event?.name}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.3s ease",
                    }}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
