import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './DashBoard.css';
/* import { drawChart } from './../../../libraries/chart/chart';
import Member from './../../memberModule/Member/Member';
import { Line } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2'; */
import { Bar } from 'react-chartjs-2';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css'; // a dependency of timegrid
import '@fullcalendar/timegrid/main.css';

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
const DashBoard = () => {
  const [expenseChart, setExpenseChart] = useState(intialChartBarData);
  const [incomeChart, setIncomeChart] = useState(data2);
  const [memberLine, setmemberLine] = useState(data2);
  const [activityPie, setActivityPie] = useState(data);
  const [attendance, setAttendance] = useState([])


  const [groupCount, setGroupCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [activityCount, setActivityCount] = useState(0);
  const [dashboardSettings, setDashboardSettings] = useState([]);


  useEffect(() => {
    // Runs ONCE after initial rendering
    getExpenseChartData()
    getIncomeChartData()
    getMemberLinetData()
    getActivityPieData()
    getAttendencesCalendar()
    getActivityCount()
    getMemberCount()
    getStaffCount()
    getGroupCount()
    getDashboardSettings()
  }, []);

  const getActivityCount = () => {
    /*  activityHTTPService.getCountActivity().then(data => {
       setActivityCount(data.data.activity)
     }) */
  }

  const getMemberCount = () => {
    /*  memberHTTPService.getCountMember().then(data => {
       setMemberCount(data.data.member)
     }) */
  }

  const getStaffCount = () => {
    /*  staffHTTPService.getCountStaff().then(data => {
       setStaffCount(data.data.staff)
     }) */
  }

  const getGroupCount = () => {
    /*  groupeHTTPService.getCountGroup().then(data => {
       setGroupCount(data.data.group)
     }) */
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

  return (
    <div classNameName="content">
      <div classNameName="row">
        <div classNameName="col-md-12">
          <div classNameName="card">

            <div classNameName="card-body">

              <div className="row">

                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="stat-widget-five">
                        <div className="stat-icon dib flat-color-1">
                          <i className="pe-7s-cash"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              $<span className="count">2</span>
                            </div>
                            <div className="stat-heading">Patients</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="stat-widget-five">
                        <div className="stat-icon dib flat-color-2">
                          <i className="pe-7s-cart"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">12</span>
                            </div>
                            <div className="stat-heading">Préscription</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="stat-widget-five">
                        <div className="stat-icon dib flat-color-3">
                          <i className="pe-7s-browser"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">1</span>
                            </div>
                            <div className="stat-heading">Rendez-vous</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="stat-widget-five">
                        <div className="stat-icon dib flat-color-4">
                          <i className="pe-7s-users"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">2</span>
                            </div>
                            <div className="stat-heading">Médicaments</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>




                {
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">

                        <h4 className="mb-3">Incomes</h4>
                        <Bar options={chartBarOption} data={incomeChart} />
                      </div>
                    </div>
                  </div>
                }
                {
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-body">

                        <h4 className="mb-3">Expenses</h4>
                        <Bar data={expenseChart} options={chartBarOption} />
                      </div>
                    </div>
                  </div>
                }




                {
                  <div class="col-lg-12">
                    <div class="card">
                      <div class="card-body">
                        <h4 class="box-title">Events </h4>
                      </div>
                      <div className="card-calendar"><FullCalendar
                        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        weekends={true}
                        select={console.log('select')} //NOT WORKING HERE
                        dateClick={console.log('dateclick')} //SAME
                        headerToolbar={{
                          left: 'dayGridMonth,timeGridWeek,timeGridDay',
                          center: 'title',
                          right: 'prevYear,prev,next,nextYear'
                        }}
                        slotMinTime="07:00:00"
                        slotMaxTime="20:00:00"
                        editable={false}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={false}
                        events={[
                          { title: 'rende-vous', date: '2021-03-19' },
                          { title: 'event 2', date: '2019-04-02' }
                        ]}
                      /></div>

                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
};

DashBoard.propTypes = {};

DashBoard.defaultProps = {};

export default DashBoard;
