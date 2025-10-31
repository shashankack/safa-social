import React from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";
import { useActivities } from "../../hooks/useActivities";
import "swiper/css";
import "swiper/css/effect-coverflow";

const EventsSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { activities: events, loading, error } = useActivities();

  if (loading) return <Typography>Loading events...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!events.length) return <Typography>No events found.</Typography>;

  return (
    <Stack
      spacing={2}
      bgcolor="background.default"
      width="100%"
      justifyContent="center"
      alignItems="center"
      py={8}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: "8vw", sm: "6vw", md: "4vw" },
          color: "#da6c81",
          letterSpacing: 1,
          mb: 1,
        }}
      >
        Events
      </Typography>

      <Swiper
        modules={[EffectCoverflow]}
        effect="coverflow"
        grabCursor
        centeredSlides
        slidesPerView={isMobile ? 1 : 3}
        coverflowEffect={{
          rotate: 30,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        style={{
          width: "90%",
          zIndex: 2,
          overflow: "hidden",
          paddingBottom: "20px",
        }}
      >
        {events.map((event) => {
          return (
            <SwiperSlide key={event.slug}>
              <Box
                sx={{
                  position: "relative",
                  height: 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "background.default",
                  borderRadius: 3,
                  boxShadow: 3,
                  p: 0,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={
                    Array.isArray(event.imageUrls?.[0])
                      ? isMobile
                        ? event.imageUrls[0][1]
                        : event.imageUrls[0][0]
                      : event.imageUrls?.[0]
                  }
                  alt={event.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 3,
                  }}
                />

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 2,
                    px: 4,
                    borderRadius: 2,
                    fontWeight: 600,
                    boxShadow: 2,
                  }}
                  href={"/events/" + event.slug}
                >
                  View Details
                </Button>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Stack>
  );
};

export default EventsSection;
