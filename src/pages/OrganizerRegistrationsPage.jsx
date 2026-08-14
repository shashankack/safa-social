import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Chip,
  Button,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  organizerLogin,
  getOrganizerRegistrations,
  confirmOrganizerRegistration,
  cancelOrganizerRegistration,
  markOrganizerAttendance,
  confirmWaitingListRegistration,
  removeWaitingListRegistration,
} from "../lib/api";

const STATUS_CHIP = {
  pending: { label: "Pending payment", color: "warning" },
  registered: { label: "Confirmed", color: "success" },
  attended: { label: "Attended", color: "primary" },
  waiting: { label: "Waiting list", color: "info" },
  canceled: { label: "Canceled", color: "default" },
};

const EVENT_STATUS_RANK = {
  upcoming: 0,
  live: 1,
  completed: 2,
  canceled: 3,
};

function statusChip(status) {
  const meta = STATUS_CHIP[status] || { label: status || "Unknown", color: "default" };
  return <Chip size="small" label={meta.label} color={meta.color} />;
}

function sortEvents(groups) {
  return [...groups].sort((a, b) => {
    const rankA = EVENT_STATUS_RANK[a.activity?.status] ?? 9;
    const rankB = EVENT_STATUS_RANK[b.activity?.status] ?? 9;
    if (rankA !== rankB) return rankA - rankB;
    const dateA = new Date(a.activity?.startDateTime || 0).getTime();
    const dateB = new Date(b.activity?.startDateTime || 0).getTime();
    return dateB - dateA;
  });
}

export default function OrganizerRegistrationsPage() {
  const theme = useTheme();
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actingId, setActingId] = useState("");

  const loadRegistrations = useCallback(async (authToken) => {
    const json = await getOrganizerRegistrations(authToken);
    setData(json);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const password = params.get("password");
    if (!email || !password) {
      setError("Missing email or password in URL.");
      setLoading(false);
      return;
    }

    organizerLogin(email, password)
      .then(({ token: authToken }) => {
        if (!authToken) throw new Error("Login did not return a token.");
        setToken(authToken);
        return loadRegistrations(authToken);
      })
      .catch((err) => setError(err.message || "Failed to fetch data."))
      .finally(() => setLoading(false));
  }, [loadRegistrations]);

  const events = useMemo(() => {
    const registrations = data?.registrations || [];
    const waitingList = data?.waitingList || [];
    const waitingByActivity = Object.fromEntries(
      waitingList.map((group) => [group.activity?.id, group.users || []])
    );

    return sortEvents(
      registrations.map((group) => ({
        activity: group.activity,
        users: group.users || [],
        waitingUsers: waitingByActivity[group.activity?.id] || [],
      }))
    );
  }, [data]);

  async function runAction(registrationId, action) {
    if (!token) return;
    setActionError("");
    setActingId(registrationId);
    try {
      await action();
      await loadRegistrations(token);
    } catch (err) {
      setActionError(err.message || "Action failed.");
    } finally {
      setActingId("");
    }
  }

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
  if (!data) return null;

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        py: 4,
        px: { xs: 1, sm: 4 },
        fontFamily: theme.typography.fontFamily,
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: theme.palette.primary.main }}>
        {data.organizer?.organizationName || "Registrations"}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
        Confirm pending UPI payments, manage the waiting list, and mark attendance.
      </Typography>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError("")}>
          {actionError}
        </Alert>
      )}

      {events.map((group, idx) => {
        const pendingCount = group.users.filter((u) => u.registrationStatus === "pending").length;
        const waitingCount = group.waitingUsers.length;
        const shouldExpand = pendingCount > 0 || waitingCount > 0 || idx === 0;

        return (
          <Accordion
            key={group.activity.id || idx}
            defaultExpanded={shouldExpand}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
                  {group.activity.name}
                </Typography>
                {pendingCount > 0 && (
                  <Chip size="small" color="warning" label={`${pendingCount} pending`} />
                )}
                {waitingCount > 0 && (
                  <Chip size="small" color="info" label={`${waitingCount} waiting`} />
                )}
                <Chip size="small" variant="outlined" label={`${group.users.length} registrations`} />
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <RegistrationsTable
                users={group.users}
                actingId={actingId}
                emptyLabel="No pending or confirmed registrations yet."
                onConfirm={(id) =>
                  runAction(id, () => confirmOrganizerRegistration(token, id))
                }
                onCancel={(id) =>
                  runAction(id, () => cancelOrganizerRegistration(token, id))
                }
                onAttend={(id) =>
                  runAction(id, () => markOrganizerAttendance(token, id))
                }
              />

              {group.waitingUsers.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    Waiting list
                  </Typography>
                  <RegistrationsTable
                    users={group.waitingUsers.map((u) => ({
                      ...u,
                      registrationStatus: u.registrationStatus || "waiting",
                    }))}
                    actingId={actingId}
                    emptyLabel="Waiting list is empty."
                    onConfirm={(id) =>
                      runAction(id, () => confirmWaitingListRegistration(token, id))
                    }
                    onCancel={(id) =>
                      runAction(id, () => removeWaitingListRegistration(token, id))
                    }
                    cancelLabel="Remove"
                  />
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}

function RegistrationsTable({
  users,
  actingId,
  emptyLabel,
  onConfirm,
  onCancel,
  onAttend,
  cancelLabel = "Cancel",
}) {
  const theme = useTheme();

  if (!users.length) {
    return (
      <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
        {emptyLabel}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Tickets</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const status = u.registrationStatus;
            const busy = actingId === u.registrationId;
            return (
              <TableRow key={u.registrationId || u.id} hover>
                <TableCell>
                  {u.firstName} {u.lastName}
                </TableCell>
                <TableCell>
                  {u.phone ? (
                    <a
                      href={`tel:${u.phone}`}
                      style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                    >
                      {u.phone}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {u.email ? (
                    <a
                      href={`mailto:${u.email}`}
                      style={{ color: theme.palette.primary.main, textDecoration: "none" }}
                    >
                      {u.email}
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>{u.ticketCount || 1}</TableCell>
                <TableCell>{statusChip(status)}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {(status === "pending" || status === "waiting") && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          disabled={busy}
                          onClick={() => onConfirm(u.registrationId)}
                        >
                          {busy ? "..." : "Confirm"}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          variant="outlined"
                          disabled={busy}
                          onClick={() => onCancel(u.registrationId)}
                        >
                          {cancelLabel}
                        </Button>
                      </>
                    )}
                    {status === "registered" && onAttend && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busy}
                        onClick={() => onAttend(u.registrationId)}
                      >
                        {busy ? "..." : "Mark attended"}
                      </Button>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
