import React from "react";
import { Link } from "react-router-dom";
import { Stack, Typography, IconButton, Box } from "@mui/material";

import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";

const Footer = () => {
  const socialLinks = [
    {
      icon: <LinkedInIcon />,
      url: "https://www.linkedin.com/in/safa-social-circle-103baa386?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    },
    {
      icon: <InstagramIcon />,
      url: "https://www.instagram.com/safasocialcircle?igsh=NWh6cmtjaWU4aGJm&utm_source=qr",
    },
    {
      icon: <YouTubeIcon />,
      url: "https://youtube.com/@safasocialcircle?si=7Mb0EluskIqL6Nqi",
    },
    {
      icon: <PinterestIcon />,
      url: "https://pin.it/6QYDy6CPC",
    },
    {
      icon: <FacebookIcon />,
      url: "https://www.facebook.com/share/17NrcvU5Wi/?mibextid=wwXIfr",
    },
  ];

  return (
    <Stack bgcolor="background.default" px={{ xs: 2, md: 3 }} py={2}>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap={{ xs: 2, md: 4 }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "5vw", sm: "10vw", md: "2vw" },
              color: "textPrimary",
              lineHeight: 1.5,
            }}
          >
            Why <br />
            Safa?
          </Typography>
        </Box>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "2.4vw", sm: "1.1rem", md: "1vw" },
              width: { xs: "100%", sm: "300px", md: "600px" },
              fontWeight: 500,
              "& span": { color: "primary.main" },
            }}
          >
            The name <span>SAFA</span> comes from the Arabic word for purity and
            clarity. It reflects our intention to create pure, uplifting and
            welcoming spaces where women can truly be themselves.
          </Typography>
        </Box>
      </Stack>
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap={2}
        mt={2}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#555",
            fontSize: { xs: "2.8vw", sm: "1.1rem", md: "1.4vw" },
            fontWeight: 600,
          }}
        >
          Let's stay connected
        </Typography>
        <Stack direction="row">
          {socialLinks.map((link, index) => (
            <IconButton
              key={index}
              component="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "primary.main",
                // border: 2,
                borderRadius: "50%",
                transition: "all 0.3s ease",
                p: { xs: 0.3, md: 1 },

                "&:hover": {
                  transform: "scale(1.1) rotate(10deg) translateY(-2px)",
                  bgcolor: "transparent",
                },
                "& svg": {
                  fontSize: { xs: 26, md: 40 },
                },
              }}
            >
              {link.icon}
            </IconButton>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Footer;
