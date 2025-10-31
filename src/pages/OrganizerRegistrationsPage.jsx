import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";

function formatDateTime(dt) {
  return new Date(dt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function OrganizerRegistrationsPage() {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get params from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const password = params.get("password");
    if (!email || !password) {
      setError("Missing email or password in URL.");
      setLoading(false);
      return;
    }
    fetch(
      `https://evntly.shashank-ac-dev.workers.dev/organizer/registrations?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.error) setError(json.error);
        else setData(json);
      })
      .catch(() => setError("Failed to fetch data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <Box sx={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  if (!data)
    return null;

  const { registrations } = data;

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        py: 4,
        px: { xs: 1, sm: 4 },
        fontFamily: theme.typography.fontFamily,
        maxWidth: 900,
        mx: "auto",
      }}
    >
      {registrations.map((reg, idx) => (
        <Accordion key={reg.activity.id || idx} defaultExpanded={idx === 0} sx={{ mb: 2, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
              {reg.activity.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reg.users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell>
                        <a href={`tel:${u.phone}`} style={{ color: theme.palette.primary.main, textDecoration: "none" }}>
                          {u.phone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${u.email}`} style={{ color: theme.palette.primary.main, textDecoration: "none" }}>
                          {u.email}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
