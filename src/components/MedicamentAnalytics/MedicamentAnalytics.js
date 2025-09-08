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
  RadialLinearScale
} from 'chart.js';
import { Bar, Pie, Doughnut, Line, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2';
import { chartBarOption } from '../../main/config/chart.bar';
import showMessage from '../../libraries/messages/messages';
import BASE_URL from '../../main/urls/urls';
import CurrentUser from '../../main/config/user';
import { useTranslation } from 'react-i18next';

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
  RadialLinearScale
);

const MedicamentAnalytics = () => {
  const { t } = useTranslation();
  const [medicaments, setMedicaments] = useState([]);
  const [charts, setCharts] = useState({
    bar: { labels: [], datasets: [] },
    pie: { labels: [], datasets: [] },
    doughnut: { labels: [], datasets: [] },
    line: { labels: [], datasets: [] },
    polar: { labels: [], datasets: [] },
    radar: { labels: [], datasets: [] },
    scatter: { datasets: [] },
    bubble: { datasets: [] },
    typePie: { labels: [], datasets: [] }
  });

  useEffect(() => {
    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/medicaments.json')
        .then(res => res.json())
        .then(data => {
          setMedicaments(data);
          prepareCharts(data);
        })
        .catch(e => {
          showMessage('Error', "HTTP_ERR_MESSAGE", 'warning');
        });
    } else {
      fetch(`${BASE_URL}/medicaments`)
        .then(res => res.json())
        .then(data => {
          setMedicaments(data);
          prepareCharts(data);
        })
        .catch(e => {
          showMessage('Error', "HTTP_ERR_MESSAGE", 'warning');
        });
    }
  }, []);

  const prepareCharts = (data) => {
    // 1. Bar: Count by Category
    const categoryCounts = {};
    data.forEach(m => {
      categoryCounts[m.category || 'Unknown'] = (categoryCounts[m.category || 'Unknown'] || 0) + 1;
    });
    // 2. Pie: Manufacturer
    const manufacturerCounts = {};
    data.forEach(m => {
      manufacturerCounts[m.manufacturerName || 'Unknown'] = (manufacturerCounts[m.manufacturerName || 'Unknown'] || 0) + 1;
    });
    // 3. Doughnut: Type
    const typeCounts = {};
    data.forEach(m => {
      typeCounts[m.type || 'Unknown'] = (typeCounts[m.type || 'Unknown'] || 0) + 1;
    });
    // 4. Line: Added per Month
    const monthCounts = {};
    data.forEach(m => {
      const month = new Date(m.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    const months = Object.keys(monthCounts);

    // 5. PolarArea: Stock Status
    const stockCounts = {};
    data.forEach(m => {
      stockCounts[m.stockStatus || 'Unknown'] = (stockCounts[m.stockStatus || 'Unknown'] || 0) + 1;
    });

    // 6. Radar: Active Ingredient
    const ingredientCounts = {};
    data.forEach(m => {
      (m.activeIngredients || []).forEach(a => {
        ingredientCounts[a] = (ingredientCounts[a] || 0) + 1;
      });
    });

    // 7. Scatter: Price vs. Stock
    const scatterData = data.map(m => ({
      x: m.price || Math.floor(Math.random() * 100),
      y: m.stock || Math.floor(Math.random() * 500)
    }));

    // 8. Bubble: Price by Category
    const bubbleData = Object.keys(categoryCounts).map(cat => ({
      x: cat,
      y: categoryCounts[cat],
      r: categoryCounts[cat] * 2
    }));

    // 9. Pie: Type
    setCharts({
      bar: {
        labels: Object.keys(categoryCounts),
        datasets: [{
          label: 'Category',
          data: Object.values(categoryCounts),
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      },
      pie: {
        labels: Object.keys(manufacturerCounts),
        datasets: [{
          label: 'Manufacturer',
          data: Object.values(manufacturerCounts),
          backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'],
        }]
      },
      doughnut: {
        labels: Object.keys(typeCounts),
        datasets: [{
          label: 'Type',
          data: Object.values(typeCounts),
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#009688', '#8bc34a'],
        }]
      },
      line: {
        labels: months,
        datasets: [{
          label: 'Added',
          data: months.map(m => monthCounts[m]),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.2)',
          fill: true,
        }]
      },
      polar: {
        labels: Object.keys(stockCounts),
        datasets: [{
          label: 'Stock Status',
          data: Object.values(stockCounts),
          backgroundColor: ['#1976d2', '#388e3c', '#fbc02d', '#d32f2f', '#7b1fa2', '#0288d1'],
        }]
      },
      radar: {
        labels: Object.keys(ingredientCounts),
        datasets: [{
          label: 'Active Ingredients',
          data: Object.values(ingredientCounts),
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
        }]
      },
      scatter: {
        datasets: [{
          label: 'Price vs Stock',
          data: scatterData,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
      },
      bubble: {
        datasets: [{
          label: 'Price by Category',
          data: bubbleData,
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        }]
      },
      typePie: {
        labels: Object.keys(typeCounts),
        datasets: [{
          label: 'Type',
          data: Object.values(typeCounts),
          backgroundColor: ['#1976d2', '#d32f2f', '#7b1fa2', '#388e3c'],
        }]
      }
    });
  };

  return (
    <div className="MedicamentAnalytics">
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
            <h5>{t('medicament_analytics.by_category')}</h5>
            <Bar options={chartBarOption} data={charts.bar} />
          </div>
          <div>
            <h5>{t('medicament_analytics.by_manufacturer')}</h5>
            <Pie data={charts.pie} />
          </div>
          <div>
            <h5>{t('medicament_analytics.by_type_doughnut')}</h5>
            <Doughnut data={charts.doughnut} />
          </div>
          <div>
            <h5>{t('medicament_analytics.added_per_month')}</h5>
            <Line data={charts.line} />
          </div>
          <div>
            <h5>{t('medicament_analytics.stock_status')}</h5>
            <PolarArea data={charts.polar} />
          </div>
          <div>
            <h5>{t('medicament_analytics.active_ingredients')}</h5>
            <Radar data={charts.radar} />
          </div>
          <div>
            <h5>{t('medicament_analytics.price_vs_stock')}</h5>
            <Scatter data={charts.scatter} />
          </div>
          <div>
            <h5>{t('medicament_analytics.price_by_category')}</h5>
            <Bubble data={charts.bubble} />
          </div>
          <div>
            <h5>{t('medicament_analytics.by_type_pie')}</h5>
            <Pie data={charts.typePie} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicamentAnalytics;