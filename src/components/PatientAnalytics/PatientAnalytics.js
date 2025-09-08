import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale // <-- Add this import
} from 'chart.js';
import { Bar, Pie, Doughnut, Line, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';
import { chartBarOption } from '../../main/config/chart.bar';
import showMessage from '../../libraries/messages/messages';
import BASE_URL from '../../main/urls/urls';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';

// Register RadialLinearScale for PolarArea and Radar charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale // <-- Register here
);

const PatientAnalytics = () => {
  const { t } = useTranslation();
  const [patients, setPatients] = useState([]);
  const [charts, setCharts] = useState({
    bar: { labels: [], datasets: [] },
    pie: { labels: [], datasets: [] },
    doughnut: { labels: [], datasets: [] },
    line: { labels: [], datasets: [] },
    polar: { labels: [], datasets: [] },
    radar: { labels: [], datasets: [] },
    scatter: { datasets: [] },
    bubble: { datasets: [] },
    genderPie: { labels: [], datasets: [] }
  });

  useEffect(() => {
    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/patients.json')
        .then(res => res.json())
        .then(data => {
          setPatients(data);
          prepareCharts(data);
        })
        .catch(e => {
          showMessage('Error', "HTTP_ERR_MESSAGE", 'warning');
        });
    } else {
      fetch(`${BASE_URL}/patients`)
        .then(res => res.json())
        .then(data => {
          setPatients(data);
          prepareCharts(data);
        })
        .catch(e => {
          showMessage('Error', "HTTP_ERR_MESSAGE", 'warning');
        });
    }
  }, []);

  // Helper to get full name by id
  const getPatientName = (id) => {
    const pat = patients.find(p => p.id === id);
    return pat ? pat.fullName : id;
  };

  const prepareCharts = (data) => {
    // 1. Bar: Insurance (show fullName in tooltip)
    const insuranceCounts = {};
    data.forEach(p => {
      insuranceCounts[p.insuranceId] = (insuranceCounts[p.insuranceId] || 0) + 1;
    });
    // 2. Pie: Blood Type
    const bloodTypeCounts = {};
    data.forEach(p => {
      bloodTypeCounts[p.bloodType] = (bloodTypeCounts[p.bloodType] || 0) + 1;
    });
    // 3. Doughnut: City
    const cityCounts = {};
    data.forEach(p => {
      const city = p.address?.city || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    // 4. Line: Registrations per Month
    const monthCounts = {};
    data.forEach(p => {
      const month = new Date(p.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const months = Object.keys(monthCounts);

    // 5. PolarArea: Payment Status
    const paymentStatusCounts = {};
    data.forEach(p => {
      paymentStatusCounts[p.paymentStatus || 'Unknown'] = (paymentStatusCounts[p.paymentStatus || 'Unknown'] || 0) + 1;
    });

    // 6. Radar: Allergies
    const allergyCounts = {};
    data.forEach(p => {
      (p.allergies || []).forEach(a => {
        allergyCounts[a] = (allergyCounts[a] || 0) + 1;
      });
    });

    // 7. Scatter: Age vs. Amount (if available)
    const scatterData = data.map(p => ({
      x: p.age || Math.floor(Math.random() * 60) + 18,
      y: p.amount || Math.floor(Math.random() * 1000)
    }));

    // 8. Bubble: Amount by Blood Type
    const bubbleData = Object.keys(bloodTypeCounts).map(bt => ({
      x: bt,
      y: bloodTypeCounts[bt],
      r: bloodTypeCounts[bt] * 2
    }));

    // 9. Pie: Gender
    const genderCounts = {};
    data.forEach(p => {
      genderCounts[p.gender || 'Unknown'] = (genderCounts[p.gender || 'Unknown'] || 0) + 1;
    });

    setCharts({
      bar: {
        labels: Object.keys(insuranceCounts),
        datasets: [{
          label: 'Insurance',
          data: Object.values(insuranceCounts),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      },
      pie: {
        labels: Object.keys(bloodTypeCounts),
        datasets: [{
          label: 'Blood Type',
          data: Object.values(bloodTypeCounts),
          backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'],
        }]
      },
      doughnut: {
        labels: Object.keys(cityCounts),
        datasets: [{
          label: 'City',
          data: Object.values(cityCounts),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#009688', '#8bc34a'],
        }]
      },
      line: {
        labels: months,
        datasets: [{
          label: 'Registrations',
          data: months.map(m => monthCounts[m]),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          fill: true,
        }]
      },
      polar: {
        labels: Object.keys(paymentStatusCounts),
        datasets: [{
          label: 'Payment Status',
          data: Object.values(paymentStatusCounts),
          backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'],
        }]
      },
      radar: {
        labels: Object.keys(allergyCounts),
        datasets: [{
          label: 'Allergies',
          data: Object.values(allergyCounts),
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
        }]
      },
      scatter: {
        datasets: [{
          label: 'Age vs Amount',
          data: scatterData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      },
      bubble: {
        datasets: [{
          label: 'Amount by Blood Type',
          data: bubbleData,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        }]
      },
      genderPie: {
        labels: Object.keys(genderCounts),
        datasets: [{
          label: 'Gender',
          data: Object.values(genderCounts),
          backgroundColor: ['#1976d2', '#d32f2f', '#7b1fa2', '#388e3c'],
        }]
      }
    });
  };

  return (
    <div className="PatientAnalytics">
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
          <div>
            <h5>{t('patient_analytics.by_insurance')}</h5>
            <Bar options={chartBarOption} data={charts.bar} />
          </div>
          <div>
            <h5>{t('patient_analytics.by_blood_type')}</h5>
            <Pie data={charts.pie} />
          </div>
          <div>
            <h5>{t('patient_analytics.by_city')}</h5>
            <Doughnut data={charts.doughnut} />
          </div>
          <div>
            <h5>{t('patient_analytics.registrations_per_month')}</h5>
            <Line data={charts.line} />
          </div>
          <div>
            <h5>{t('patient_analytics.payment_status')}</h5>
            <PolarArea data={charts.polar} />
          </div>
          <div>
            <h5>{t('patient_analytics.allergies')}</h5>
            <Radar data={charts.radar} />
          </div>
          <div>
            <h5>{t('patient_analytics.age_vs_amount')}</h5>
            <Scatter data={charts.scatter} />
          </div>
          <div>
            <h5>{t('patient_analytics.amount_by_blood_type')}</h5>
            <Bubble data={charts.bubble} />
          </div>
          <div>
            <h5>{t('patient_analytics.by_gender')}</h5>
            <Pie data={charts.genderPie} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAnalytics;
