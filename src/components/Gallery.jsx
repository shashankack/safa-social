import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
  useMediaQuery,
  ImageList,
  ImageListItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Gallery = ({ images = [], title = "Gallery" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedImage, setSelectedImage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedImage("");
  };

  return (
    <Box>
      {/* Gallery Accordion */}
      <Accordion
        sx={{
          bgcolor: "transparent",
          border: "2px solid #da6c81",
          boxShadow: "0 4px 12px rgba(218, 108, 129, 0.2)",
          borderRadius: 3,
          py: 2,
          "&:before": {
            display: "none",
          },
          "& .MuiAccordionSummary-root": {
            px: 2,
            minHeight: "auto",
            "& .MuiAccordionSummary-content": {
              margin: "12px 0",
            },
          },
          "& .MuiAccordionDetails-root": {
            px: 2,
            pt: 2,
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon
              sx={{
                color: "#da6c81",
                fontSize: 32,
              }}
            />
          }
          sx={{
            "& .MuiAccordionSummary-expandIconWrapper": {
              ml: 1,
            },
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2vw", sm: "1vw" },
              fontWeight: 600,
              color: "#da6c81",
              fontFamily: "Agraham, Alternate Gothic, sans-serif",
            }}
          >
            `${title} Archives'`
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          {/* Gallery Masonry */}
          <ImageList variant="masonry" cols={isMobile ? 2 : 3} gap={8}>
            {images.map((image, index) => (
              <ImageListItem
                key={index}
                onClick={() => handleImageClick(image)}
                sx={{
                  overflow: "hidden",
                  borderRadius: 3,
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: "3px solid #fecdd7",

                  "&:hover": {
                    transform: "scale(.98)",
                    boxShadow: "0 12px 24px rgba(218, 108, 129, 0.3)",
                    borderColor: "#da6c81",

                    "& img": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <Box
                  component="img"
                  src={`${image}?w=300&fit=crop&auto=format`}
                  srcSet={`${image}?w=300&fit=crop&auto=format&dpr=2 2x`}
                  alt={`${title} image ${index + 1}`}
                  loading="lazy"
                  sx={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    transition: "transform 0.3s ease",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </AccordionDetails>
      </Accordion>

      {/* Simple Image Preview Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth={false}
        fullScreen
        sx={{
          "& .MuiDialog-paper": {
            bgcolor: "rgba(0, 0, 0, 0.95)",
            borderRadius: 0,
            margin: 0,
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            width: "100%",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: "rgba(218, 108, 129, 0.8)",
              color: "#ffffff",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(26, 62, 18, 0.9)",
                transform: "scale(1.1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Preview Image */}
          {selectedImage && (
            <Box
              component="img"
              src={`${selectedImage}?w=1200&auto=format`}
              alt={`${title} preview`}
              sx={{
                maxWidth: "95%",
                maxHeight: "95%",
                objectFit: "contain",
                borderRadius: 2,
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
                transition: "all 0.3s ease",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Gallery;
