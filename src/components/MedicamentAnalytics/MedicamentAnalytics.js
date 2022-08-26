import React from 'react';
import PropTypes from 'prop-types';
import './MedicamentAnalytics.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';


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
      data: [1, 2, 3, 4],
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: [1, 2, 3, 4],
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
const MedicamentAnalytics = () => (
  <div className="MedicamentAnalytics">
    <div className="SaleAnalytics">
      <div className="card">
        <div className="card-header">
          <strong className="card-title">Medecine Analytics</strong>
        </div>
        <div className="card-body">

          <Bar options={options} data={data} />



        </div>
      </div>
    </div>
  </div>
);

MedicamentAnalytics.propTypes = {};

MedicamentAnalytics.defaultProps = {};

export default MedicamentAnalytics;
