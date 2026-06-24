import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Paper, Chip, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

const MyAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get patientId from localStorage (assume it's stored as 'patientId')
  const patientId = localStorage.getItem("patientId");

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    axios
      .get(`${BASE_URL}/appointments?patientId=${patientId}`)
      .then((res) => setAppointments(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (!patientId) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          {t("appointments.no_patient_selected") || "No patient connected."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {t("appointments.title")}
      </Typography>
      {loading ? (
        <Typography>{t("loading") || "Loading..."}</Typography>
      ) : appointments.length === 0 ? (
        <Typography color="text.secondary">
          {t("appointments.no_appointments")}
        </Typography>
      ) : (
        appointments.map((app) => (
          <Paper key={app.id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1">
              {t("appointments.date")}: <b>{app.appointmentDate}</b>
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              {t("appointments.start_time")}: {app.startTime} &nbsp;|&nbsp; {t("appointments.end_time")}: {app.endTime}
            </Typography>
            <Typography>
              {t("appointments.doctor")}: {app.doctorName || app.doctorId}
            </Typography>
            <Typography>
              {t("appointments.clinic")}: {app.clinicName || app.clinicLocationId}
            </Typography>
            <Typography>
              {t("appointments.reason")}: {app.reasonForVisit}
            </Typography>
            <Typography>
              {t("appointments.status")}: <Chip label={app.status} color="primary" />
            </Typography>
            {app.notes && (
              <Typography sx={{ mt: 1 }}>
                {t("appointments.notes")}: {app.notes}
              </Typography>
            )}
          </Paper>
        ))
      )}
    </Box>
  );
};

export default MyAppointments;