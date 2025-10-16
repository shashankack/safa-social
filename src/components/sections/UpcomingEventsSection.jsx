import React from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useActivities } from "../../hooks/useActivities";

const UpcomingEventsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { items } = useActivities({ status: "upcoming" });

  if (items.length > 0) {
    return (
      <Box py={8} px={{ xs: 2, sm: 4, md: 8 }}>
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
            Click on any event to view details and register
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {items.map((event) => {
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
                        src={event.thumbnailUrls[1]}
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

        {/* View All Events Button
        <Box textAlign="center" mt={6}>
          <Button
            component={RouterLink}
            to="/events"
            variant="contained"
            sx={{
              bgcolor: "#da6c81",
              color: "#ffffff",

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
        </Box> */}
      </Box>
    );
  }
};

export default UpcomingEventsSection;
