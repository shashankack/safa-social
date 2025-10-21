import React, { useEffect, useRef, useState } from "react";
import {
  IconButton,
  Box,
  Tooltip,
  Typography,
  Avatar,
  Slider,
} from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const MusicControl = () => {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [canAutoplay, setCanAutoplay] = useState(true);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Restore volume and playing state from localStorage
    try {
      const savedVolume = localStorage.getItem("music_volume");
      if (savedVolume !== null) {
        audio.volume = Number(savedVolume);
        setVolume(Number(savedVolume));
      }
      const savedPlaying = localStorage.getItem("music_playing");
      if (savedPlaying === "true") {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setPlaying(true);
              setCanAutoplay(true);
            })
            .catch(() => {
              setPlaying(false);
              setCanAutoplay(false);
            });
        }
      }
    } catch (e) {
      // ignore localStorage failures
    }

    return () => {
      try {
        audio.pause();
      } catch (e) {}
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        setCanAutoplay(true);
        try {
          localStorage.setItem("music_playing", "true");
        } catch (e) {}
      } catch (e) {
        setCanAutoplay(false);
      }
    }
  };

  const [volume, setVolume] = useState(1);

  const handleVolume = (event, value) => {
    const v = Number(value);
    const audio = audioRef.current;
    if (audio) audio.volume = v;
    setVolume(v);
    try {
      localStorage.setItem("music_volume", String(v));
    } catch (e) {}
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        bgcolor: "transparent",
        p: 0.5,
      }}
    >
      <audio ref={audioRef} src="/lost_my_mind.mp3" loop />

      <Tooltip title={playing ? "Pause music" : "Play music"}>
        <IconButton
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          sx={{
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
            width: { xs: 34, md: 44 },
            height: { xs: 34, md: 44 },
          }}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </IconButton>
      </Tooltip>

      <Box sx={{ width: 120, ml: 1 }}>
        <Slider
          value={volume}
          onChange={handleVolume}
          min={0}
          max={1}
          step={0.01}
          aria-label="volume"
        />
      </Box>
    </Box>
  );
};

export default MusicControl;
