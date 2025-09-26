import React from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);
const MotionTypography = motion.create(Typography);

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      bgcolor="background.default"
      justifyContent="start"
      alignItems="center"
      width="100%"
      position="relative"
    >
      {/* Logo */}
      <MotionBox
        position="absolute"
        initial={{ scale: 0.1, opacity: 0 }}
        animate={imgDone ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, ease: "backOut" }}
        pt={4}
        zIndex={10}
      >
        <Box
          component="img"
          src="/images/logo.svg"
          alt="Logo"
          sx={{
            width: { xs: "18vw", sm: "6vw", height: "100%", display: "block" },
          }}
        />
      </MotionBox>

      {/* Image Box */}
      <Box height={"60vh"} width="100%" overflow="hidden" position="relative">
        <Box
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          bgcolor="#00000090"
        />
        <motion.img
          src={
            isMobile
              ? "/images/hero_image_mobile.jpg"
              : "/images/hero_image.jpg"
          }
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
        pt={{ xs: 5, sm: 10 }}
        pb={{ xs: 5, sm: 10 }}
        sx={{
          background:
            "linear-gradient(180deg, rgba(244, 234, 207, 0) 0%, rgba(244, 234, 207, 1) 20%)",
          marginTop: "-5vh",
        }}
      >
        <MotionTypography
          variants={titleVariants}
          fontFamily="Alternate Gothic"
          fontSize={{ xs: "8vw", sm: "4vw" }}
          textTransform="uppercase"
          mt={{ xs: 2, sm: 0 }}
          color="primary.main"
        >
          Safa Social Circle
        </MotionTypography>

        <MotionTypography
          variants={bodyVariants}
          variant="body1"
          mt={{ xs: 3, sm: 4 }}
          fontSize={{ xs: "3.4vw", sm: "1.4vw" }}
          fontWeight={500}
          sx={{
            textAlign: "justify",
            textAlignLast: "center",
            lineHeight: { xs: 1.6, sm: 1.8 },
            maxWidth: "900px",
          }}
        >
          A space created for Muslim women to connect, share and grow together
          through creative events, meaningful conversations and uplifting
          experiences. When women gather with intention, ordinary moments turn
          into meaningful memories. Safa is not just an event it's a journey of
          connection, growth and belonging.
        </MotionTypography>
      </Stack>
    </Stack>
  );
};

export default HeroSection;
