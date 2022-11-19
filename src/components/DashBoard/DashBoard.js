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
import appointementHTTPService from '../../main/services/appointementHTTPService';
import patientHTTPService from '../../main/services/patientHTTPService';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
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


  const [certificateCountCount, setcertificateCount] = useState(0);
  const [appointementCount, setAppointementsCount] = useState(0);
  const [medicamentCount, setMedicamentCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [dashboardSettings, setDashboardSettings] = useState([]);
  const [appointements, setAppointements] = useState([]);
  const [appointementsCalendar, setAppointementsCalendar] = useState([]);

  useEffect(() => {
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
    appointementHTTPService.getAllAppointement()
      .then(response => {
        setAppointements(response.data);
        console.log(response.data)
        //setLoading(false);
        for (const item of response.data) {
          console.log(item)
          appointementsCalendar.push({ title: item.patient, date: item.createdAt })
        }


        // console.log(aar)
        setAppointements(appointementsCalendar)
        console.log(appointements)
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  }, []);

  const getPatientCount = () => {
    patientHTTPService.getCount().then(data => {
      setPatientCount(data.data.patient)
    })
  }

  const getAppointementCount = () => {
    appointementHTTPService.getCount().then(data => {
      setAppointementsCount(data.data.appointement)
    })
  }

  const getMedicamentCount = () => {
    medicamentHTTPService.getCount().then(data => {
      setMedicamentCount(data.data.medicament)
    })
  }

  const getCertificateCount = () => {
    certificateHTTPService.getCount().then(data => {
      setcertificateCount(data.data.certificate)
    })
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
    <div className="content">

      <div className="row">
        <div className="col-md-12">
          <div className="card">

            <div className="card-body">

              <div className="row">

                <div className="col-lg-3 col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <div className="stat-widget-five">
                        <div className="stat-icon dib flat-color-1">
                          <i class="fas fa-user-injured"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">{patientCount}</span>
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
                          <i class="fas fa-capsules"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">{medicamentCount}</span>
                            </div>
                            <div className="stat-heading">Medicaments</div>
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
                          <i class="fas fa-calendar-check"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">{appointementCount}</span>
                            </div>
                            <div className="stat-heading">Appointements</div>
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
                          <i class="fas fa-certificate"></i>
                        </div>
                        <div className="stat-content">
                          <div className="text-left dib">
                            <div className="stat-text">
                              <span className="count">{certificateCountCount}</span>
                            </div>
                            <div className="stat-heading">Certificates</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {
                  <div class="col-lg-12">
                    <div class="card">
                      <div class="card-body">
                        <h4 class="box-title">Appointements </h4>
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
                        events={appointements}
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
