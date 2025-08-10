import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Chip, Box } from '@mui/material';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ViewStaff = ({ staff, open, onClose }) => {
  if (!staff) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>View Staff Member</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography><strong>Full Name:</strong> {staff.fullName}</Typography>
          <Typography><strong>Role:</strong> {staff.role}</Typography>
          <Typography><strong>Email:</strong> {staff.email}</Typography>
          <Typography><strong>Phone:</strong> {staff.phone}</Typography>
          <Typography><strong>Status:</strong> {staff.status}</Typography>
          <Box>
            <Typography sx={{ mb: 1 }}><strong>Shift Schedule:</strong></Typography>
            <Stack spacing={0.5}>
              {daysOfWeek.map(day => (
                <Box key={day} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ width: 40 }}>{day}</Typography>
                  <Chip
                    label={
                      staff.shiftSchedule?.[day]?.start && staff.shiftSchedule?.[day]?.end
                        ? `${staff.shiftSchedule[day].start} - ${staff.shiftSchedule[day].end}`
                        : 'Off'
                    }
                    color={staff.shiftSchedule?.[day]?.start ? "primary" : "default"}
                    size="small"
                  />
                </Box>
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography sx={{ mb: 1 }}><strong>Permissions:</strong></Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {(staff.permissions || []).map(perm => (
                <Chip key={perm} label={perm} color="success" size="small" />
              ))}
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStaff;