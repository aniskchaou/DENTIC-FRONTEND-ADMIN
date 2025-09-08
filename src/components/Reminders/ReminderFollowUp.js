import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ReminderFollowUp() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
          Follow-up Reminders
        </Typography>
        <Typography variant="body1">
          Automatically remind patients to schedule or attend follow-up visits after their treatment or procedure.
        </Typography>
        {/* Add your follow-up reminder logic/components here */}
      </Paper>
    </Box>
  );
}