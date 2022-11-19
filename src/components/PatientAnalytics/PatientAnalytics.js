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
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartBarOption, intialChartBarData } from '../../main/config/chart.bar';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
/* import memberHTTPService from '../../main/services/memberHTTPService';
import { chartBarOption, intialChartBarData } from '../../../main/config/chart.bar';
import showMessage from '../../libraries/messages/messages'; */
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4, 5, 6, 7],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
const PatientAnalytics = () => {
  const [incomeChart, setIncomeChart] = useState(intialChartBarData);

  useEffect(() => {
    getIncomeChartData()

  }, []);

  const getIncomeChartData = () => {

    patientHTTPService.getPatientByDate()
      .then(response => {
        setIncomeChart(response.data);
      })
      .catch(e => {
        showMessage('Error', "HTTP_ERR_MESSAGE", 'warning')
      })
  };
  return (


    <div className="MedicamentAnalytics">
      <div className="SaleAnalytics">
        <div className="card">
          <div className="card-header">
            <strong className="card-title">Patient Analytics</strong>
          </div>
          <div className="card-body">

            <Bar options={chartBarOption} data={incomeChart} />



          </div>
        </div>
      </div>
    </div>
  )
};

PatientAnalytics.propTypes = {};

PatientAnalytics.defaultProps = {};

export default PatientAnalytics;
