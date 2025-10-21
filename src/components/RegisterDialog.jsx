// src/components/RegisterDialog.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { registerForActivity } from "../lib/api";

/**
 * activity: {
 *   id, name, registrationFee (paise),
 *   availableSlots, bookedSlots, isRegistrationOpen, type
 * }
 */
export default function RegisterDialog({ open, onClose, activity, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ticketCount: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // price (₹)
  const inrPrice = useMemo(() => {
    const fee =
      typeof activity?.registrationFee === "number"
        ? activity.registrationFee
        : 0;
    return (fee / 100).toFixed(2);
  }, [activity]);

  // capacity math
  const total = Number(activity?.availableSlots ?? 0);
  const booked = Number(activity?.bookedSlots ?? 0);
  const remaining = Math.max(0, total - booked);
  const perUserCap = 4; // <= 4 tickets per user
  const maxSelectable = Math.min(perUserCap, Math.max(1, remaining));

  const qtyOptions = Array.from({ length: maxSelectable }, (_, i) => i + 1);
  const disabled = !activity || remaining <= 0 || !activity.isRegistrationOpen;

  // validators (email+phone required)
  const emailValid = useMemo(
    () => /\S+@\S+\.\S+/.test(form.email.trim()),
    [form.email]
  );
  const phoneDigits = useMemo(
    () => form.phone.replace(/\D/g, ""),
    [form.phone]
  );
  const phoneValid = useMemo(
    () => phoneDigits.length >= 10 && phoneDigits.length <= 13,
    [phoneDigits]
  );

  // reset error/success on open
  useEffect(() => {
    if (open) {
      setErr("");
      setSuccess("");
    }
  }, [open]);

  // clamp quantity if remaining/per-user cap changes
  useEffect(() => {
    setForm((prev) => {
      const nextQty = Math.min(prev.ticketCount || 1, maxSelectable);
      return nextQty === prev.ticketCount
        ? prev
        : { ...prev, ticketCount: nextQty };
    });
  }, [maxSelectable]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: name === "ticketCount" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();
    setErr("");
    setSuccess("");

    if (!emailValid) return setErr("Please enter a valid email address.");
    if (!phoneValid)
      return setErr("Please enter a valid phone number (10–13 digits).");
    if (remaining <= 0) return setErr("This event is sold out.");
    if (form.ticketCount < 1) return setErr("Please select at least 1 ticket.");
    if (form.ticketCount > maxSelectable) {
      return setErr(`You can book up to ${maxSelectable} ticket(s) right now.`);
    }

    setSubmitting(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: phoneDigits,
        ticketCount: form.ticketCount,
      };

      const result = await registerForActivity(activity.id, payload);

      console.log("Registration result:", result);

      setSuccess(result.message || "Registration successful!");

      // Show payment popup for manual payment or if registration fee > 0
      if (result.paymentInfo && result.paymentInfo.type === "manual") {
        console.log("Showing payment popup");
        setShowPaymentPopup(true);
        return;
      }

      // If registration fee > 0, show payment popup even without paymentInfo
      if (activity.registrationFee > 0) {
        console.log("Registration fee > 0, showing payment popup");
        setShowPaymentPopup(true);
        return;
      }

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess?.(result.registration?.id);
        onClose?.();
      }, 2000);
    } catch (e) {
      setErr(e.message || String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Dialog
        open={open && !showPaymentPopup && !showConfirmation}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pr: 6, color: "#000" }}>
          Register for {activity?.name ?? "Event"}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <form onSubmit={handleSubmit} id="register-form">
            <Stack spacing={2}>
              {disabled && (
                <Alert severity="warning">
                  This event is sold out or registration is closed.
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  name="firstName"
                  label="First name"
                  value={form.firstName}
                  onChange={onChange}
                  required
                  fullWidth
                />
                <TextField
                  name="lastName"
                  label="Last name"
                  value={form.lastName}
                  onChange={onChange}
                  required
                  fullWidth
                />
              </Box>

              <TextField
                name="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={onChange}
                required
                fullWidth
                error={!!form.email && !emailValid}
                helperText={
                  form.email && !emailValid
                    ? "Enter a valid email address"
                    : "We'll email your confirmation"
                }
              />

              <TextField
                name="phone"
                label="Phone"
                value={form.phone}
                onChange={onChange}
                required
                fullWidth
                error={!!form.phone && !phoneValid}
                helperText={
                  form.phone && !phoneValid
                    ? "Enter a valid number (10–13 digits)"
                    : "Include country code if not from India"
                }
              />

              {/* Qty dropdown — capped by remaining and 4 per user */}
              <TextField
                select
                name="ticketCount"
                label="Tickets"
                value={form.ticketCount}
                onChange={onChange}
                fullWidth
                disabled={disabled}
                helperText={
                  typeof activity?.registrationFee === "number"
                    ? `₹${inrPrice} per ticket`
                    : `${remaining} left • limit ${perUserCap}/user`
                }
              >
                {qtyOptions.map((q) => (
                  <MenuItem key={q} value={q}>
                    {q}
                  </MenuItem>
                ))}
              </TextField>

              {err ? <Alert severity="error">{err}</Alert> : null}
              {success ? <Alert severity="success">{success}</Alert> : null}
            </Stack>
          </form>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              submitting ||
              disabled ||
              !form.firstName.trim() ||
              !form.lastName.trim() ||
              !emailValid ||
              !phoneValid
            }
            startIcon={submitting ? <CircularProgress size={16} /> : null}
          >
            {submitting ? "Processing..." : "Register"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Popup */}
      <Dialog
        open={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          onClose();
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#f5f5f0",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#da6c81" }}>
          Complete Payment
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src="/images/qr.png"
              alt="QR Code"
              style={{ width: 180, borderRadius: 8, marginBottom: 8 }}
            />
            <Typography variant="h6" sx={{ color: "#2d2d2d", fontWeight: 700 }}>
              Amount: ₹
              {((activity?.registrationFee * form.ticketCount) / 100).toFixed(
                2
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
              UPI ID: <b style={{ color: "#da6c81" }}>saberazehra37@okicici</b>
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
              Scan the QR code above using your UPI app and pay the total
              amount.
              <br />
              After payment, click Continue.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#da6c81",
              color: "white",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
            }}
            onClick={() => {
              setShowPaymentPopup(false);
              setShowConfirmation(true);
            }}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Popup */}
      <Dialog
        open={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          onClose();
        }}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: "#f5f5f0",
            textAlign: "center",
            p: 3,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#da6c81" }}>
          Thank You!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
            We will verify your payment and send you a confirmation email in a
            few hours.
            <br />
            If you have any questions, contact us at{" "}
            <a
              href="mailto:safasocialcircle@gmail.com"
              style={{ color: "#da6c81", textDecoration: "none" }}
            >
              safasocialcircle@gmail.com
            </a>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#da6c81",
              color: "white",
              fontWeight: 700,
              borderRadius: 2,
              px: 4,
            }}
            onClick={() => {
              setShowConfirmation(false);
              onClose();
            }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
