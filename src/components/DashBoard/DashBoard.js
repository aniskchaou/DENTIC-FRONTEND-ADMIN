import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './DashBoard.css';
import {
  Bar, Pie, Doughnut, Line, PolarArea, Radar, Scatter, Bubble
} from 'react-chartjs-2';
import Odontogram from '../Odontogram/Odontogram';

//import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { chartBarOption, intialChartBarData } from '../../main/config/chart.bar';
import expenseHTTPService from '../../main/services/expenseHTTPService';


import showMessage from '../../libraries/messages/messages'
import appointementHTTPService from '../../main/services/appointementHTTPService';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import { Link } from 'react-router-dom';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import BASE_URL from '../../main/urls/urls';
import CurrentUser from '../../main/config/user'; // Make sure this import exists or adjust as needed
import { useTranslation } from 'react-i18next';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Skeleton } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend, ArcElement, BarElement
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];



export const data3 = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [3, 5, 6, 4, 2, 7, 8],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }
  ],
};


const labels3 = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];





export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};



export const data2 = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 3, 4, 5, 11, 3, 2],
      borderColor: 'rgba(255, 99, 132, 0.5)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }

  ],
};

export const data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Example chart data for demonstration (replace with real API data as needed)
const chartData = {
  bar: { labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Bar', data: [12, 19, 3, 5], backgroundColor: 'rgba(53, 162, 235, 0.5)' }] },
  pie: { labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Pie', data: [12, 19, 3, 5], backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f'] }] },
  doughnut: { labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Doughnut', data: [12, 19, 3, 5], backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'] }] },
  line: { labels: ['Jan', 'Feb', 'Mar', 'Apr'], datasets: [{ label: 'Line', data: [3, 5, 6, 4], borderColor: '#1976d2', backgroundColor: 'rgba(25, 118, 210, 0.2)', fill: true }] },
  polar: { labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Polar', data: [12, 19, 3, 5], backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f'] }] },
  radar: { labels: ['A', 'B', 'C', 'D'], datasets: [{ label: 'Radar', data: [12, 19, 3, 5], backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)' }] },
  scatter: { datasets: [{ label: 'Scatter', data: [{ x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 1 }], backgroundColor: 'rgba(53, 162, 235, 0.5)' }] },
  bubble: { datasets: [{ label: 'Bubble', data: [{ x: 1, y: 2, r: 10 }, { x: 2, y: 3, r: 15 }, { x: 3, y: 1, r: 8 }], backgroundColor: 'rgba(255, 206, 86, 0.5)' }] },
  bar2: { labels: ['X', 'Y', 'Z', 'W'], datasets: [{ label: 'Bar2', data: [7, 11, 5, 9], backgroundColor: 'rgba(255, 99, 132, 0.5)' }] },
  pie2: { labels: ['X', 'Y', 'Z', 'W'], datasets: [{ label: 'Pie2', data: [7, 11, 5, 9], backgroundColor: ['#0288d1', '#7b1fa2', '#fbc02d', '#388e3c'] }] },
  doughnut2: { labels: ['X', 'Y', 'Z', 'W'], datasets: [{ label: 'Doughnut2', data: [7, 11, 5, 9], backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'] }] },
  line2: { labels: ['May', 'Jun', 'Jul', 'Aug'], datasets: [{ label: 'Line2', data: [8, 6, 7, 5], borderColor: '#d32f2f', backgroundColor: 'rgba(211, 47, 47, 0.2)', fill: true }] },
  polar2: { labels: ['X', 'Y', 'Z', 'W'], datasets: [{ label: 'Polar2', data: [7, 11, 5, 9], backgroundColor: ['#0288d1', '#7b1fa2', '#fbc02d', '#388e3c'] }] },
  radar2: { labels: ['X', 'Y', 'Z', 'W'], datasets: [{ label: 'Radar2', data: [7, 11, 5, 9], backgroundColor: 'rgba(54, 162, 235, 0.2)', borderColor: 'rgba(54, 162, 235, 1)' }] },
  scatter2: { datasets: [{ label: 'Scatter2', data: [{ x: 2, y: 4 }, { x: 3, y: 2 }, { x: 4, y: 5 }], backgroundColor: 'rgba(255, 99, 132, 0.5)' }] },
  bubble2: { datasets: [{ label: 'Bubble2', data: [{ x: 2, y: 4, r: 12 }, { x: 3, y: 2, r: 10 }, { x: 4, y: 5, r: 14 }], backgroundColor: 'rgba(54, 162, 235, 0.5)' }] },
  bar3: { labels: ['M', 'N', 'O', 'P'], datasets: [{ label: 'Bar3', data: [10, 8, 12, 6], backgroundColor: 'rgba(75, 192, 192, 0.5)' }] },
  pie3: { labels: ['M', 'N', 'O', 'P'], datasets: [{ label: 'Pie3', data: [10, 8, 12, 6], backgroundColor: ['#75cdd9', '#fbc02d', '#d32f2f', '#388e3c'] }] },
  doughnut3: { labels: ['M', 'N', 'O', 'P'], datasets: [{ label: 'Doughnut3', data: [10, 8, 12, 6], backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'] }] },
  line3: { labels: ['Sep', 'Oct', 'Nov', 'Dec'], datasets: [{ label: 'Line3', data: [5, 9, 7, 11], borderColor: '#388e3c', backgroundColor: 'rgba(56, 142, 60, 0.2)', fill: true }] },
};

// Add chart data for each model (replace with real API data if available)
const chartList = [
  { type: Bar, data: chartData.bar, title: 'Patients by Month' },
  { type: Pie, data: chartData.pie, title: 'Patients by Gender' },
  { type: Doughnut, data: chartData.doughnut, title: 'Medicaments by Category' },
  { type: Line, data: chartData.line, title: 'Medicaments Added Over Time' },
  { type: PolarArea, data: chartData.polar, title: 'Appointments by Status' },
  { type: Radar, data: chartData.radar, title: 'TestLab Results Distribution' },
  { type: Scatter, data: chartData.scatter, title: 'Expenses: Amount vs Date' },
  { type: Bubble, data: chartData.bubble, title: 'Doctors by Specialty' },
  { type: Bar, data: chartData.bar2, title: 'Staff by Department' },
  { type: Pie, data: chartData.pie2, title: 'Clinics by City' },
  { type: Doughnut, data: chartData.doughnut2, title: 'Membership Types' },
  { type: Line, data: chartData.line2, title: 'Insurance Claims Over Time' },
  { type: PolarArea, data: chartData.polar2, title: 'Expenses by Category' },
  { type: Radar, data: chartData.radar2, title: 'Doctor Ratings' },
  { type: Scatter, data: chartData.scatter2, title: 'Appointments: Duration vs Satisfaction' },
  { type: Bubble, data: chartData.bubble2, title: 'Staff Attendance' },
  { type: Bar, data: chartData.bar3, title: 'Clinic Revenue' },
  { type: Pie, data: chartData.pie3, title: 'Insurance Types' },
  { type: Doughnut, data: chartData.doughnut3, title: 'TestLab Types' },
  { type: Line, data: chartData.line3, title: 'Membership Growth' },
];

const DashBoard = () => {
  const { t } = useTranslation();

  // Update chartList to use translation keys for titles
  const chartList = [
    { type: Bar, data: chartData.bar, title: t('dashboard.chart_patients_by_month') },
    { type: Pie, data: chartData.pie, title: t('dashboard.chart_patients_by_gender') },
    { type: Doughnut, data: chartData.doughnut, title: t('dashboard.chart_medicaments_by_category') },
    { type: Line, data: chartData.line, title: t('dashboard.chart_medicaments_added_over_time') },
    { type: PolarArea, data: chartData.polar, title: t('dashboard.chart_appointments_by_status') },
    { type: Radar, data: chartData.radar, title: t('dashboard.chart_testlab_results_distribution') },
    { type: Scatter, data: chartData.scatter, title: t('dashboard.chart_expenses_amount_vs_date') },
    { type: Bubble, data: chartData.bubble, title: t('dashboard.chart_doctors_by_specialty') },
    { type: Bar, data: chartData.bar2, title: t('dashboard.chart_staff_by_department') },
    { type: Pie, data: chartData.pie2, title: t('dashboard.chart_clinics_by_city') },
    { type: Doughnut, data: chartData.doughnut2, title: t('dashboard.chart_membership_types') },
    { type: Line, data: chartData.line2, title: t('dashboard.chart_insurance_claims_over_time') },
    { type: PolarArea, data: chartData.polar2, title: t('dashboard.chart_expenses_by_category') },
    { type: Radar, data: chartData.radar2, title: t('dashboard.chart_doctor_ratings') },
    { type: Scatter, data: chartData.scatter2, title: t('dashboard.chart_appointments_duration_vs_satisfaction') },
    { type: Bubble, data: chartData.bubble2, title: t('dashboard.chart_staff_attendance') },
    { type: Bar, data: chartData.bar3, title: t('dashboard.chart_clinic_revenue') },
    { type: Pie, data: chartData.pie3, title: t('dashboard.chart_insurance_types') },
    { type: Doughnut, data: chartData.doughnut3, title: t('dashboard.chart_testlab_types') },
    { type: Line, data: chartData.line3, title: t('dashboard.chart_membership_growth') },
  ];

  const [expenseChart, setExpenseChart] = useState(intialChartBarData);
  const [incomeChart, setIncomeChart] = useState(data2);
  const [memberLine, setmemberLine] = useState(data2);
  const [activityPie, setActivityPie] = useState(data);
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true);

  const [certificateCountCount, setcertificateCount] = useState(0);
  const [appointementCount, setAppointementsCount] = useState(0);
  const [medicamentCount, setMedicamentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [dashboardSettings, setDashboardSettings] = useState([]);
  const [appointements, setAppointements] = useState([]);
  const [appointementsCalendar, setAppointementsCalendar] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [topPatients, setTopPatients] = useState([]);
  const [topMedicaments, setTopMedicaments] = useState([]);

  useEffect(() => {
    // Simulate loading for demo, or set loading to false after all data is fetched
    Promise.all([
      appointementHTTPService.getAllAppointement(),
      fetch(BASE_URL+'/doctors?sort=appointments&limit=5'),
      fetch(BASE_URL+'/patients?sort=visits&limit=5'),
      fetch(BASE_URL+'/medicaments?sort=sales&limit=5')
    ])
      .then(async ([appointmentsRes, doctorsRes, patientsRes, medicamentsRes]) => {
        setAppointements(await appointmentsRes.data);
        setTopDoctors(await doctorsRes.json());
        setTopPatients(await patientsRes.json());
        setTopMedicaments(await medicamentsRes.json());
      })
      .catch(() => {
        setTopDoctors([]);
        setTopPatients([]);
        setTopMedicaments([]);
      })
      .finally(() => setLoading(false));

    const aar = []
    // Runs ONCE after initial rendering
    getExpenseChartData()
    getIncomeChartData()
    getMemberLinetData()
    getActivityPieData()
    getAttendencesCalendar()
    getPatientCount()
    getAppointementCount()
    getMedicamentCount()
    getCertificateCount()
    getDashboardSettings()
  }, []);

  const getPatientCount = () => {
    //patientHTTPService.getCount().then(data => {
      //setPatientCount(data.data.patient)
    //})
  }

  const getAppointementCount = () => {
    if (CurrentUser.DEMO_MODE) {
      setAppointementsCount(12); // demo value
    } else {
      appointementHTTPService.getCount()
        .then(data => {
          setAppointementsCount(data.data.appointement);
        })
        .catch(e => {
          // Log error for debugging
          console.warn('Could not load appointment count:', e);
          // Show fallback value, keep UI clean
          setAppointementsCount(0);
        });
    }
  }

  const getMedicamentCount = () => {
    medicamentHTTPService.getCount().then(data => {
      setMedicamentCount(data.data.medicament)
    })
  }

  const getCertificateCount = () => {
    if (CurrentUser.DEMO_MODE) {
      setcertificateCount(5); // demo value
    } else {
      certificateHTTPService.getCount()
        .then(data => {
          setcertificateCount(data.data.certificate);
        })
        .catch(e => {
          console.warn('Could not load certificate count:', e);
          setcertificateCount(0);
        });
    }
  }

  const getAttendencesCalendar = () => {

    /*  attendanceHTTPService.getAllAtendances()
       .then(response => {
         setAttendance(response.data);
 
       })
       .catch(e => {
         showMessage('Confirmation', e, 'info')
       }); */
  };

  const getExpenseChartData = () => {

    /* expenseHTTPService.getExpenseByDate()
      .then(response => {
        setExpenseChart(response.data);

      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      }); */
  };

  const getMemberLinetData = () => {

    /*    memberHTTPService.getAllMemberByDate()
         .then(response => {
           setmemberLine(response.data);
   
         })
         .catch(e => {
           showMessage('Confirmation', e, 'info')
         }); */
  };

  const getIncomeChartData = () => {

    /*  revenueHTTPService.getAllRevenueByDate()
       .then(response => {
         setIncomeChart(response.data);
 
       })
       .catch(e => {
         showMessage('Confirmation', e, 'info')
       }); */
  };

  const getActivityPieData = () => {

    /*   activityHTTPService.getAllActivityByDate()
        .then(response => {
          setActivityPie(response.data);
  
        })
        .catch(e => {
          showMessage('Confirmation', e, 'info')
        }); */
  };

  const getDashboardSettings = () => {
    /*  settingsHTTPService.getDashboardSettings().then(data => {
       setDashboardSettings(data.data[0])
       console.log(dashboardSettings)
 
     }) */
  }

  const widgetColors = [
  { bg: "#1976d2", color: "#fff" },
  { bg: "#388e3c", color: "#fff" },
  { bg: "#fbc02d", color: "#222" },
  { bg: "#d32f2f", color: "#fff" },
  { bg: "#0288d1", color: "#fff" },
  { bg: "#7b1fa2", color: "#fff" },
  { bg: "#ff9800", color: "#fff" },
  { bg: "#009688", color: "#fff" },
  { bg: "#c2185b", color: "#fff" },
  { bg: "#455a64", color: "#fff" },
  { bg: "#43a047", color: "#fff" },
  { bg: "#5d4037", color: "#fff" },
];

  const widgetData = [
    { icon: "fas fa-user-injured", label: t('dashboard.patients'), value: patientCount },
    { icon: "fas fa-capsules", label: t('dashboard.medicaments'), value: medicamentCount },
    { icon: "fas fa-calendar-check", label: t('dashboard.appointments'), value: appointementCount },
    { icon: "fas fa-certificate", label: t('dashboard.certificates'), value: certificateCountCount },
    { icon: "fas fa-flask", label: t('dashboard.laboratory_tests'), value: 12 },
    { icon: "fas fa-money-bill-wave", label: t('dashboard.expenses'), value: 8 },
    { icon: "fas fa-user-md", label: t('dashboard.doctors'), value: 5 },
    { icon: "fas fa-users", label: t('dashboard.staff'), value: 20 },
    { icon: "fas fa-hospital", label: t('dashboard.clinics'), value: 3 },
    { icon: "fas fa-id-card", label: t('dashboard.memberships'), value: 15 },
    { icon: "fas fa-shield-alt", label: t('dashboard.insurance'), value: 7 },
  ];

  // Prepare appointment dates for calendar (using appointmentDate)
  const appointmentDates = appointements
    .filter(item => item.appointmentDate)
    .map(item => new Date(item.appointmentDate).toDateString());

  // Show a dot on days with appointments
  const tileContent = ({ date, view }) => {
    if (view === 'month' && appointmentDates.includes(date.toDateString())) {
      return (
        <div style={{
          marginTop: 2,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#1976d2',
          marginLeft: 'auto',
          marginRight: 'auto'
        }} />
      );
    }
    return null;
  };

  // Highlight days with appointments
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && appointmentDates.includes(date.toDateString())) {
      return 'calendar-appointment-day';
    }
    return null;
  };

  // Helper to get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    return appointements.filter(
      item => item.appointmentDate && new Date(item.appointmentDate).toDateString() === date.toDateString()
    );
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="content">
      {CurrentUser.DEMO_MODE && (
        <div style={{
          background: '#e3f2fd',
          color: '#1565c0',
          border: '1px solid #90caf9',
          borderRadius: 8,
          padding: '14px 20px',
          marginBottom: 24,
          fontWeight: 500,
          fontSize: 15,
          textAlign: 'center'
        }}>
          <i className="fas fa-info-circle" style={{ marginRight: 8 }}></i>
          <span>
            <strong>Demo Mode:</strong> The application is running in presentation mode. Some features are limited or unavailable.
          </span>
        </div>
      )}

      {/* Skeleton loading for statistics cards */}
      <div className="row" style={{ marginBottom: 8 }}>
        <div className="col-md-12">
          <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {loading
              ? Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="col-lg-3 col-md-6"
                    style={{
                      flex: '1 1 220px',
                      minWidth: 220,
                      maxWidth: 260,
                      marginBottom: 8,
                    }}
                  >
                    <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                  </div>
                ))
              : widgetData.map((w, idx) => (
                  <div
                    key={w.label}
                    className="col-lg-3 col-md-6"
                    style={{
                      flex: '1 1 220px',
                      minWidth: 220,
                      maxWidth: 260,
                      marginBottom: 8,
                    }}
                  >
                    <div
                      className="card"
                      style={{
                        width: '100%',
                        border: 'none',
                        borderRadius: 16,
                        background: widgetColors[idx % widgetColors.length].bg,
                        color: widgetColors[idx % widgetColors.length].color,
                        boxShadow: '0 4px 24px rgba(25, 118, 210, 0.10)',
                        transition: 'transform 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)'}
                      onMouseOut={e => e.currentTarget.style.transform = 'none'}
                    >
                      <div className="card-body" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <div style={{
                            fontSize: 36,
                            background: 'rgba(255,255,255,0.12)',
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className={w.icon}></i>
                          </div>
                          <div>
                            <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
                              {w.value}
                            </div>
                            <div style={{ fontSize: 16, opacity: 0.85 }}>{w.label}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          margin: '24px 0'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px'
          }}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx}>
                  <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 2 }} />
                  <Skeleton variant="text" width={120} />
                </div>
              ))
            : chartList.map((chart, idx) => (
                <div key={idx}>
                  <h5>{chart.title}</h5>
                  <chart.type data={chart.data} options={chartBarOption} />
                </div>
              ))}
        </div>
      </div>

      {/* Skeleton loading for Top 5 Lists */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          margin: '24px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <h5 style={{ marginBottom: 24 }}>{t('dashboard.top_performers')}</h5>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} style={{
                  flex: 1,
                  minWidth: 220,
                  background: '#f8fafc',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: '0 1px 4px rgba(25,118,210,0.06)'
                }}>
                  <Skeleton variant="text" width={180} sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                </div>
              ))
            : (
              <>
                {/* Top 5 Doctors */}
                <div style={{
                  flex: 1,
                  minWidth: 220,
                  background: '#f8fafc',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: '0 1px 4px rgba(25,118,210,0.06)'
                }}>
                  <strong style={{ fontSize: 16, color: '#1976d2' }}>{t('dashboard.top_doctors_by_appointments')}</strong>
                  <ol style={{ marginTop: 12, paddingLeft: 20 }}>
                    {topDoctors.length === 0 && <li style={{ color: '#888' }}>{t('dashboard.no_data')}</li>}
                    {topDoctors.slice(0, 5).map((doc, idx) => (
                      <li key={doc.id || idx} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>{doc.name || doc.fullName || doc.doctorName}</span>
                        <span style={{
                          marginLeft: 8,
                          color: '#388e3c',
                          fontSize: 13,
                          background: '#e8f5e9',
                          borderRadius: 6,
                          padding: '2px 8px'
                        }}>
                          {doc.appointmentCount || doc.visits || 0} appts
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* Top 5 Patients */}
                <div style={{
                  flex: 1,
                  minWidth: 220,
                  background: '#f8fafc',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: '0 1px 4px rgba(25,118,210,0.06)'
                }}>
                  <strong style={{ fontSize: 16, color: '#388e3c' }}>{t('dashboard.top_patients_by_visits')}</strong>
                  <ol style={{ marginTop: 12, paddingLeft: 20 }}>
                    {topPatients.length === 0 && <li style={{ color: '#888' }}>{t('dashboard.no_data')}</li>}
                    {topPatients.slice(0, 5).map((pat, idx) => (
                      <li key={pat.id || idx} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>{pat.name || pat.fullName || pat.patientName}</span>
                        <span style={{
                          marginLeft: 8,
                          color: '#1976d2',
                          fontSize: 13,
                          background: '#e3f2fd',
                          borderRadius: 6,
                          padding: '2px 8px'
                        }}>
                          {pat.visitCount || pat.visits || 0} visits
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* Top 5 Medicaments */}
                <div style={{
                  flex: 1,
                  minWidth: 220,
                  background: '#f8fafc',
                  borderRadius: 10,
                  padding: 16,
                  boxShadow: '0 1px 4px rgba(25,118,210,0.06)'
                }}>
                  <strong style={{ fontSize: 16, color: '#d32f2f' }}>{t('dashboard.top_medicaments_by_sales')}</strong>
                  <ol style={{ marginTop: 12, paddingLeft: 20 }}>
                    {topMedicaments.length === 0 && <li style={{ color: '#888' }}>{t('dashboard.no_data')}</li>}
                    {topMedicaments.slice(0, 5).map((med, idx) => (
                      <li key={med.id || idx} style={{ marginBottom: 8 }}>
                        <span style={{ fontWeight: 600 }}>{med.name || med.medicamentName}</span>
                        <span style={{
                          marginLeft: 8,
                          color: '#d32f2f',
                          fontSize: 13,
                          background: '#ffebee',
                          borderRadius: 6,
                          padding: '2px 8px'
                        }}>
                          {med.salesCount || med.sold || 0} sold
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
        </div>
      </div>
      {/* Calendar Widget */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '24px',
          margin: '24px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h5 style={{ margin: 0 }}>Appointments Calendar</h5>
          <Link to="/rendezvous" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ fontSize: 14, padding: '4px 16px' }}>
              {t('dashboard.view_all_appointments')}
            </button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ minWidth: 320, flex: 1 }}>
             <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label={t('dashboard.select_date')}
                value={selectedDate}
                onChange={setSelectedDate}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                  <div style={{ position: 'relative' }}>
                    <input
                      ref={inputRef}
                      {...inputProps}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #1976d2',
                        fontSize: '16px'
                      }}
                    />
                    {InputProps?.endAdornment}
                  </div>
                )}
              />
            </LocalizationProvider> 
            <div style={{ marginTop: 18 }}>
              <strong>{t('dashboard.appointment_days')}</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
                {appointmentDates.slice(0, 10).map((dateStr, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: '#e3f2fd',
                    borderRadius: 8,
                    padding: '2px 8px',
                    fontSize: 13
                  }}>
                    <span style={{
                      display: 'inline-block',
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#1976d2'
                    }}></span>
                    {new Date(dateStr).toLocaleDateString()}
                  </div>
                ))}
                {appointmentDates.length > 10 && (
                  <span style={{ fontSize: 13, color: '#888' }}>+{appointmentDates.length - 10} more</span>
                )}
              </div>
            </div>
          </div>
          <div style={{
            flex: 2,
            minWidth: 280,
            maxWidth: 500,
            background: '#f8fafc',
            borderRadius: 12,
            padding: 20,
            marginLeft: 16,
            boxShadow: '0 1px 4px rgba(25,118,210,0.06)'
          }}>
            <div style={{ marginBottom: 8 }}>
              <strong>
                {getAppointmentsForDate(selectedDate).length > 0
                  ? `Appointments for ${selectedDate.toLocaleDateString()}`
                  : `No appointments for ${selectedDate.toLocaleDateString()}`}
              </strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {getAppointmentsForDate(selectedDate).map((item, idx) => (
                <li key={item.id} style={{
                  background: '#fff',
                  borderRadius: 8,
                  marginBottom: 12,
                  padding: '12px 16px',
                  boxShadow: '0 1px 4px rgba(25,118,210,0.04)',
                  borderLeft: '4px solid #1976d2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#1976d2' }}>
                      {item.patient || item.patientId}
                    </span>
                    <span style={{
                      background:
                        item.status === 'Confirmed' || item.status === 'Scheduled' ? '#e8f5e9'
                          : item.status === 'Pending' ? '#fff8e1'
                          : item.status === 'Cancelled' ? '#ffebee'
                          : '#e3f2fd',
                      color:
                        item.status === 'Confirmed' || item.status === 'Scheduled' ? '#388e3c'
                          : item.status === 'Pending' ? '#ffa000'
                          : item.status === 'Cancelled' ? '#e53935'
                          : '#1976d2',
                      borderRadius: 8,
                      padding: '2px 10px',
                      fontSize: 13,
                      fontWeight: 600,
                    }}>
                      {item.status}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>{t('dashboard.time')}:</span>{' '}
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>{t('dashboard.doctor')}:</span>{' '}
                    <span>{item.doctor || item.doctorId}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 500 }}>{t('dashboard.type')}:</span>{' '}
                    <span>{item.appointmentType}</span>
                  </div>
                  {item.reasonForVisit && (
                    <div>
                      <span style={{ fontWeight: 500 }}>{t('dashboard.reason')}:</span>{' '}
                      <span>{item.reasonForVisit}</span>
                    </div>
                  )}
                  {item.notes && (
                    <div>
                      <span style={{ fontWeight: 500 }}>{t('dashboard.notes')}:</span>{' '}
                      <span>{item.notes}</span>
                    </div>
                  )}
                  <div style={{ marginTop: 4 }}>
                    <Link to={`/rendezvous/${item.id}`} style={{ color: '#1976d2', textDecoration: 'underline', fontSize: 13 }}>
                      {t('dashboard.view_details')}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* System Health/Status */}
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          margin: '32px 0',
          boxShadow: '0 4px 24px rgba(25,118,210,0.10)',
          maxWidth: '100%',
          width: '100%',
          minWidth: 0
        }}
      >
        <h5 style={{
          marginBottom: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 700,
          color: '#d32f2f',
          fontSize: 22,
          letterSpacing: 1
        }}>
          <i className="fas fa-heartbeat" style={{ color: '#d32f2f', fontSize: 28 }}></i>
          {t('dashboard.system_health')}
        </h5>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}>
          <div style={{
            flex: 1,
            minWidth: 150,
            background: '#e8f5e9',
            borderRadius: 10,
            padding: '18px 20px',
            margin: '0 8px',
            boxShadow: '0 1px 4px rgba(56,142,60,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#388e3c', marginBottom: 6 }}>
              <i className="fas fa-server" style={{ marginRight: 6 }}></i>
              {t('dashboard.backend')}
            </div>
            <div style={{ color: '#388e3c', fontWeight: 500, fontSize: 15 }}>
              <i className="fas fa-circle" style={{ color: '#43a047', fontSize: 10, marginRight: 6 }}></i>
              {t('dashboard.online')}
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: 150,
            background: '#e3f2fd',
            borderRadius: 10,
            padding: '18px 20px',
            margin: '0 8px',
            boxShadow: '0 1px 4px rgba(25,118,210,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1976d2', marginBottom: 6 }}>
              <i className="fas fa-network-wired" style={{ marginRight: 6 }}></i>
              {t('dashboard.api')}
            </div>
            <div style={{ color: '#1976d2', fontWeight: 500, fontSize: 15 }}>
              <i className="fas fa-circle" style={{ color: '#1976d2', fontSize: 10, marginRight: 6 }}></i>
              {t('dashboard.healthy')}
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: 150,
            background: '#fffde7',
            borderRadius: 10,
            padding: '18px 20px',
            margin: '0 8px',
            boxShadow: '0 1px 4px rgba(251,192,45,0.08)',
            textAlign: 'center'
          }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#fbc02d', marginBottom: 6 }}>
              <i className="fas fa-clock" style={{ marginRight: 6 }}></i>
              {t('dashboard.uptime')}
            </div>
            <div style={{ color: '#fbc02d', fontWeight: 500, fontSize: 15 }}>
              99.9%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DashBoard.propTypes = {};

DashBoard.defaultProps = {};

export default DashBoard;

/* Add this CSS to your DashBoard.css for appointment highlight
.calendar-appointment-day {
  position: relative;
}

.calendar-appointment-day::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1976d2;
}
*/
