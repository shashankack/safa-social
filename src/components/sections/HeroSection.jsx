import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";

import AnimatedLogo from "../AnimatedLogo"; // optional

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// ---- Stagger controls ----
const STAGGER_CHILDREN = 0.2;
const DELAY_CHILDREN = 0.05;

const aboutContainer = {
  hidden: {},
  show: {
    transition: {
      delayChildren: DELAY_CHILDREN,
      staggerChildren: STAGGER_CHILDREN,
    },
  },
};

const titleVariants = {
  hidden: { y: 24, opacity: 0, filter: "blur(4px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const bodyVariants = {
  hidden: { y: 16, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const HeroSection = () => {
  const [imgDone, setImgDone] = React.useState(false);
  const imageDuration = 1.2;

  return (
    <Stack
      bgcolor="background.default"
      minHeight="100vh"
      border={1}
      justifyContent="start"
      alignItems="center"
      width="100%"
      position="relative"
    >
      {/* Logo */}
      <MotionBox
        position="absolute"
        initial={{ scale: 0, opacity: 0 }}
        animate={imgDone ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: "backOut" }}
        pt={4}
      >
        <Box
          component="img"
          src="/images/white_logo.svg"
          alt="Logo"
          sx={{ height: { xs: 80, sm: 100 } }}
        />
      </MotionBox>

      {/* Image Box */}
      <Box height="60vh" width="100%" overflow="hidden">
        <motion.img
          src="/images/hero_image.jpg"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: imageDuration, ease: "anticipate" }}
          onAnimationComplete={() => setImgDone(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </Box>

      {/* About Us (stagger kicks in right after image completes) */}
      <Stack
        component={motion.div}
        variants={aboutContainer}
        initial="hidden"
        animate={imgDone ? "show" : "hidden"}
        width="100%"
        justifyContent="center"
        alignItems="center"
        px={{ xs: 2, sm: 10 }}
        py={{ xs: 5, sm: 10 }}
      >
        <MotionTypography
          variants={titleVariants}
          variant="h1"
          fontSize={{ xs: "1.5rem", sm: "3rem" }}
        >
          Safa Social Circle
        </MotionTypography>

        <MotionTypography
          variants={bodyVariants}
          variant="body1"
          mt={4}
          fontSize={{ xs: "1rem", sm: "1.6rem" }}
          fontWeight={500}
          sx={{ textAlign: "justify", textAlignLast: "center" }}
        >
          A space created for Muslim women to connect, share, and grow together
          through creative events, meaningful conversations, and uplifting
          experiences. When women gather with intention, ordinary moments turn
          into meaningful memories. Safa is not just an event it's a journey of
          connection, growth and belonging.
        </MotionTypography>
      </Stack>
    </Stack>
  );
};

export default HeroSection;
