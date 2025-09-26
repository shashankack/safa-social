import React, { act } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useActivity } from "../hooks/useActivity";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import Loader from "../components/Loader";
import PolaroidSection from "../components/sections/PolaroidSection";
import RegisterDialog from "../components/RegisterDialog";
import Gallery from "../components/Gallery";
import { formatDate, formatTime, getStatusBadge } from "../lib/helpers";
import VideoSection from "../components/sections/VideoSection";

// Component to render feature list from HTML

const ActivityDetailsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { slug } = useParams();
  const { data: activity, loading, error } = useActivity(slug);
  const gallery = activity?.galleryUrls || [];

  // Register dialog state
  const [registerOpen, setRegisterOpen] = React.useState(false);

  const ActivityDescription = ({ description }) => {
    if (!description) return null;
    return (
      <Box
        className="activity-description"
        sx={{
          fontFamily: "Manrope",
          textAlign: { xs: "justify", sm: "start" },
          fontSize: { xs: 16, sm: 18 },
          lineHeight: 1.7,
          color: "text.secondary",
          mb: 2,
        }}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    );
  };

  const FeatureList = ({ html }) => {
    if (!html) return null;

    // Extract title and list items from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const titleElement = doc.querySelector(".feature-title, h3");
    const listItems = doc.querySelectorAll("li");

    if (listItems.length === 0) return null;

    return (
      <Box>
        {titleElement && (
          <Typography
            variant="h1"
            fontSize={{ xs: "10vw", sm: "2vw" }}
            fontWeight={600}
            mb={2}
          >
            {titleElement.textContent}
          </Typography>
        )}
        <Box
          component="ul"
          sx={{ pl: 0, m: 0, listStyle: "none", fontFamily: "Manrope" }}
        >
          {Array.from(listItems).map((item, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                pl: { xs: 0, sm: 2 },
                mb: 1.5,
                fontSize: { xs: 16, sm: 17 },
                lineHeight: 1.6,
                color: "text.primary",
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  mt: 1,
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <Box dangerouslySetInnerHTML={{ __html: item.innerHTML }} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  if (loading) return <Loader />;
  if (error) return <Box>Error loading activity details</Box>;
  if (!activity) return <Box>No activity found</Box>;

  return (
    <Stack
      width="100%"
      minHeight="100vh"
      justifyContent="start"
      alignItems="center"
      pt={10}
      overflow={"hidden"}
    >
      <PolaroidSection
        gallery={gallery.slice(3, 6)} // Show only first 3 images in hero
        title={activity.title}
        size={isMobile ? 180 : 330}
      />

      <Box
        sx={{
          width: { xs: "90%", sm: "80%", md: "70%" },
          mt: 4,
          mb: 8,
          p: { xs: 0, sm: 4 },
        }}
      >
        {/* Header with Status and Register Button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          mb={3}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <EventIcon fontSize="small" sx={{ color: "primary.main" }} />
              <Typography variant="body1" color="text.secondary">
                {formatDate(activity.startAt)}
              </Typography>
              <AccessTimeIcon
                fontSize="small"
                sx={{ ml: 2, color: "primary.main" }}
              />
              <Typography variant="body1" color="text.secondary">
                {formatTime(activity.startAt)}
              </Typography>
            </Stack>
            {activity.status === "upcoming" && (
              <Stack direction="row" spacing={1} alignItems="center">
                <CurrencyRupeeIcon
                  fontSize="small"
                  sx={{ color: "primary.main" }}
                />
                <Typography variant="body1" color="text.secondary">
                  ₹{(activity.registrationFee / 100).toLocaleString()}
                </Typography>
              </Stack>
            )}
            {activity.venueName && (
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocationOnIcon
                    fontSize="small"
                    sx={{ color: "primary.main" }}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {activity.venueName}
                  </Typography>
                </Stack>
                {activity.mapUrl && (
                  <Button
                    variant="outlined"
                    size="small"
                    href={activity.mapUrl}
                    target="_blank"
                    sx={{ textTransform: "none" }}
                  >
                    View Map
                  </Button>
                )}
              </Stack>
            )}
          </Stack>

          <Stack
            direction="column"
            spacing={2}
            alignItems={{ xs: "stretch", sm: "flex-end" }}
          >
            {(() => {
              const badge = getStatusBadge(activity.status);
              return (
                <Chip
                  label={badge.label}
                  color={badge.color === "default" ? "default" : badge.color}
                  variant="outlined"
                  sx={{
                    textTransform: "uppercase",
                    px: 1,
                    fontWeight: 500,
                    fontSize: 16,
                    alignSelf: { xs: "flex-start", sm: "flex-end" },
                  }}
                />
              );
            })()}

            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                fontSize: 16,
                borderRadius: 2,
                minWidth: { xs: "100%", sm: 180 },
              }}
              onClick={() => setRegisterOpen(true)}
              disabled={!activity.canBook}
            >
              {activity.canBook ? "Register Now" : "Registration Closed"}
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Description Section */}
        <Box mb={4} mt={5}>
          <Typography
            variant="h2"
            fontSize={{ xs: "5vw", sm: "1.6vw" }}
            mb={2}
            fontWeight={600}
          >
            About this event
          </Typography>
          <ActivityDescription description={activity.description} />
        </Box>

        {/* Additional Notes Section */}
        {activity.additionalNotes && activity.status === "upcoming" && (
          <Box mb={4}>
            <FeatureList html={activity.additionalNotes} />
          </Box>
        )}

        {/* Video Section  */}
        <Box>
          <VideoSection videos={activity.galleryUrls.slice(0, 3) || []} />
        </Box>

        {/* Gallery Section */}
        {gallery && gallery.length > 3 && (
          <Box mt={8}>
            <Gallery images={gallery.slice(3)} title={activity.title} />
          </Box>
        )}
      </Box>

      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        activity={activity}
        onSuccess={() => setRegisterOpen(false)}
      />
    </Stack>
  );
};

export default ActivityDetailsPage;
