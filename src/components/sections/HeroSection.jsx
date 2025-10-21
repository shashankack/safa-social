import React from "react";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import MusicControl from "../MusicControl";

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
      {/* Image Box */}
      <Box
        height={{ xs: "50vh", md: "80vh" }}
        width="100%"
        overflow="hidden"
        position="relative"
      >
        <Box
          position="absolute"
          bottom={{ xs: 0, md: 16 }}
          left={16}
          zIndex={3}
        >
          <MusicControl />
        </Box>
        <Typography
          variant="body1"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: { xs: "90%", md: "50%" },
            zIndex: 2,
            color: "white",
            fontSize: isMobile ? "3.4vw" : "1.6vw",
            transform: "translate(-50%, -50%)",
            fontFamily: "Baskerville",
          }}
        >
          When women gather with intention, ordinary moments turn into
          meaningful memories. Safa is not just an event it's a journey of
          connection, growth and belonging
        </Typography>
        <Box
          width="100%"
          height="100%"
          position="absolute"
          top={0}
          left={0}
          zIndex={1}
          bgcolor="#000000aa"
        />
        <motion.video
          src={
            isMobile
              ? "https://res.cloudinary.com/dyclqcoqp/video/upload/v1761050369/IMG_7814_xijj9j.mov"
              : "https://res.cloudinary.com/dyclqcoqp/video/upload/v1761050394/IMG_7723_qwbd3n.mov"
          }
          initial={{ y: "100%", opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: imageDuration, ease: "anticipate" }}
          onAnimationComplete={() => setImgDone(true)}
          autoPlay
          muted
          loop
          playsInline
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
          marginTop: "-5vh",
        }}
      >
        <MotionTypography
          variant="h1"
          variants={titleVariants}
          sx={{
            fontSize: { xs: "8vw", sm: "6vw", md: "4vw" },
            mt: { xs: 4, sm: 6 },
          }}
        >
          About us
        </MotionTypography>

        <MotionTypography
          variants={bodyVariants}
          variant="body1"
          sx={{
            mt: { xs: 3, sm: 5 },
            fontSize: { xs: "3vw", sm: "2vw", md: ".8vw" },
            fontWeight: 600,
            textAlign: "center",
            lineHeight: { xs: 1.6, sm: 1.3 },
            maxWidth: "900px",
            "& span": { color: "primary.main", fontWeight: 700 },
          }}
        >
          Welcome to Safa Social Circle a space where women gather and leave as
          part of a community.
          <br />
          <br />
          Safa was of a simple idea to create moments that bring women together
          beyond small talk and social media. Through workshops, shared
          experiences and intentional gatherings we make space for genuine
          connection, creativity and growth.
          <br />
          <br />
          It’s where stories are shared, boundaries are respected and laughter
          feels easy Where every event feels less like an occasion and more like
          coming home to yourself and to the women around you.
          <br />
          <br />
          Because at the heart of it all Safa is <br />
          <span>#MadeForYouToBelong</span>
        </MotionTypography>
      </Stack>
    </Stack>
  );
};

export default HeroSection;
