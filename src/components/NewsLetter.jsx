import React, { useState } from "react";
import { Stack, TextField, Button, Alert } from "@mui/material";

const NewsLetter = ({ bgcolor = "#da6c81" }) => {
  const [formData, setFormData] = useState({ fullname: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    const scriptURL = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;

    try {
      const formBody = new URLSearchParams(formData).toString();

      const res = await fetch(scriptURL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setFormData({ fullname: "", email: "" });
      setAlert({ type: "success", message: "Thank you for subscribing!" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          name="fullname"
          label="Full Name"
          variant="outlined"
          value={formData.fullname}
          onChange={handleChange}
          fullWidth
          color="primary"
        />
        <TextField
          name="email"
          label="Email"
          variant="outlined"
          type="email"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          color="primary"
        />
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          disabled={loading}
          sx={{
            px: 10,
            fontSize: 20,
            color: "#fecdd7",
            bgcolor: bgcolor,
            fontFamily: "Alternate Gothic",
            letterSpacing: 1.5,
          }}
        >
          {loading ? "Submitting..." : "Subscribe"}
        </Button>
      </Stack>

      {alert && (
        <Alert
          severity={alert.type}
          sx={{ mt: 2, width: "100%" }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}
    </form>
  );
};

export default NewsLetter;
