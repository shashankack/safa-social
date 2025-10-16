import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const taglines = [
  // "Safa Social certified",
  "Pure Connections. Beautiful Gatherings.",
  "Cherished memories of a lifetime",
  "Thoughtful Events, Lasting Connections",
];

const vectors = ["/images/vectors/arrow_1.svg"];

const PolaroidCard = ({ url, size = 300, position = {} }) => {
  const { left, right, top, bottom, rotate, zIndex } = position;
  // Handle responsive rotate
  let transform;
  if (typeof rotate === "object" && rotate !== null) {
    transform = {};
    for (const key in rotate) {
      transform[key] = `rotate(${rotate[key]}deg)`;
    }
  } else if (typeof rotate === "number") {
    transform = `rotate(${rotate}deg)`;
  } else {
    transform = undefined;
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        gap: 2,
        position: "absolute",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        bgcolor: "white",
        px: size * 0.006,
        pt: size * 0.006,
        pb: size * 0.003,
        left,
        right,
        top,
        bottom,
        transform,
        zIndex: zIndex || 1,
      }}
    >
      <Box
        component="img"
        src={url}
        sx={{
          width: size,
          height: size,
          objectFit: "cover",
        }}
      />
      <Stack width="100%" justifyContent="space-between" direction="row">
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Priestacy",
            fontWeight: 500,
            color: "text.secondary",
            fontSize: { xs: "3.4vw", sm: "1.2vw" },
            transform: "translateY(-4px)",
          }}
        >
          Made for you to belong.
        </Typography>
        <Box
          component="img"
          src="/images/vectors/heart.png"
          sx={{ width: 24, transform: "rotate(20deg) translateY(-4px)" }}
        />
      </Stack>
    </Box>
  );
};

// PolaroidSection now accepts positions as a prop
const PolaroidSection = ({
  gallery,
  title = "Safa Social Circle",
  size = 300,
  positions = [
    // Images
    [
      {
        left: { xs: "5%", sm: "10%" },
        top: { xs: "9%", sm: "17%" },
        rotate: { xs: -6, sm: -6 },
      },
      {
        right: { xs: "5%", sm: "35%" },
        top: { xs: "35%", sm: "20%" },
        rotate: { xs: 5, sm: 4 },
      },
      {
        left: { xs: "10%", sm: "70%" },
        bottom: { xs: 14, sm: "auto" },
        top: { xs: "auto", sm: "17%" },
        rotate: { xs: -3, sm: 10 },
      },
    ],
    // Taglines
    [
      {
        right: "10%",
        top: "15%",
        text: taglines[Math.floor(Math.random() * taglines.length)],
      },
    ],
  ],
}) => {
  const stackHeight = size * 3.4;
  const stackWidth = size * 2.3;
  return (
    // Polaroid-style image gallery
    <Stack
      // border={1}
      position="relative"
      width={{ xs: stackWidth, sm: stackWidth * 2 }}
      height={{ xs: stackHeight, sm: stackHeight * 0.6 }}
      overflow="hidden"
    >
      <Typography
        variant="h3"
        sx={{
          color: "primary.main",
          fontWeight: 500,
          fontSize: {
            xs: `${stackWidth * 0.03}vw`,
            sm: `${stackWidth * 0.006}vw`,
          },
          textAlign: { xs: "start", sm: "center" },
          transform: { xs: "rotate(-4deg)", sm: "none" },
          position: "relative",
          zIndex: 10,
          pl: { xs: 2, sm: 0 },
        }}
      >
        {title}
      </Typography>
      {vectors.map((vector, index) => (
        <Box
          key={index}
          sx={{
            display: { xs: "block", sm: "none" },
            position: "absolute",
            left: "auto",
            top: "23%",
            right: "20%",
            transform: "rotate(-100deg)",
            width: 34,
          }}
        >
          <Box component={"img"} src={vector} width={"100%"} />
        </Box>
      ))}
      {gallery.map((url, index) => (
        <React.Fragment key={index}>
          <PolaroidCard
            url={url}
            position={positions[0][index] || {}}
            size={size}
          />
          <Typography
            sx={() => {
              const { rotate, ...rest } = positions[1][index] || {};
              let transform;
              if (typeof rotate === "object" && rotate !== null) {
                transform = {};
                for (const key in rotate) {
                  transform[key] = `rotate(${rotate[key]}deg)`;
                }
              } else if (typeof rotate === "number") {
                transform = `rotate(${rotate}deg)`;
              } else {
                transform = undefined;
              }
              return {
                display: { xs: "block", sm: "none" },
                position: "absolute",
                zIndex: 10,
                width: "15ch",
                fontSize: size * 0.08,
                ...rest,
                transform,
              };
            }}
          >
            {positions[1][index]?.text}
          </Typography>
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default PolaroidSection;
