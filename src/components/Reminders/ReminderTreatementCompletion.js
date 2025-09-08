import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function ReminderTreatementCompletion() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
          Treatment Completion Reminders
        </Typography>
        <Typography variant="body1">
          Notify patients when it’s time to complete the next step in their treatment plan or schedule a final check.
        </Typography>
        {/* Add your treatment completion reminder logic/components here */}
      </Paper>
    </Box>
  );
}