import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ReminderAppointment() {
  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", mt: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
          Appointment Reminders
        </Typography>
        <Typography variant="body1">
          Send automated reminders to patients before their scheduled appointments via SMS, email, or push notification.
        </Typography>
        {/* Add your appointment reminder logic/components here */}
      </Paper>
    </Box>
  );
}