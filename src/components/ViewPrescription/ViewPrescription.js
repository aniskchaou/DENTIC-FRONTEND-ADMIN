import React from 'react';
import PropTypes from 'prop-types';
import './ViewPrescription.css';

const ViewPrescription = () => (
  <div className="ViewPrescription">
    <div id="default">

      <link href="https://doctorssnew.bdtask.com/web_assets/css/inline.css" rel="stylesheet" />
      <div id="dif_p" class="container">
        <div class="row">
          <a class="btn btn-primary" href="https://doctorssnew.bdtask.com/admin/Prescription_controller/create_new_prescription"><i class="fa fa-plus" aria-hidden="true"></i> Create (Trade) </a>
          <div class="social-icons pull-right">
            <label class="radio-inline btn btn btn-primary" id="pad">Pad Print</label>
            <ul>
              <li><a href="" title="Print"><i class="fa fa-print"></i></a></li>
            </ul>
          </div>
        </div>
      </div>
      <div id="div1">



        <div class="container">
          <div class="main-header">
            <div class="row header_area">
              <div class="hed-1 ">
                <b>Date :</b>
25-Jun-2020 11:43:21am Thursday </div>
              <div class="hed-2">
                Patient Id: J1234,
                Appointment Id: A20Z9TH
<a class="d-hed-2" target="_blank" href="https://doctorssnew.bdtask.com/History_controller/patient_history/J1234"> History</a>
              </div>
            </div>
            <div class="row address_area">
              <div class="a-one">
                <h4>Dr. Anderson</h4>
MBBS, FRCS <br />
                <b>Surgery Specialist</b><br />
                      Suregeon<br />
                <b>Lorem Ipsum is simply dummy text ofthe industry's standard</b>
              </div>
              <div class="a-two">
                <b>Manan Tower</b><br />
                          Khilkhet, dhaka-1229,
56465644846 </div>
            </div>
            <div class="row patient_area">
              <div class="col-md-12">
                <h5>
                  <strong>Patient Name:</strong> <b>Jenifer</b>,
&nbsp; <strong>Age :</strong>
26-Y:6-M:29-D,
&nbsp;<strong>Gender :</strong> Female,
&nbsp;<strong>Patient Weight :</strong> 59,
&nbsp;<strong>Patient BP :</strong> </h5>
              </div>
            </div>
          </div>
        </div>






        <div class="container">
          <div class="row">

            <div class="col-md-4 col-sm-4 left-side">
              <div class="problem">
                <h4>Patient CC </h4>
                <li class="tg">Nullam aliquet odio et lacus tincidunt aliquam.</li> </div>
              <div class="history">
                <h4>History </h4>
                <li class="tg">Aliquam dapibus odio nec urna ullamcorper</li><li class="tg"> id feugiat lectus lobortis.</li> </div>
              <h4>O/Ex</h4>
              <li class="tg">lorem </li>
              <h4>PD </h4>
              <li class="tg">new PD</li>
              <div class="test-list">
                <h4>Test</h4>
                <ul>
                  <li>1 . It is a long established</li>
ss
<li>2 . x-ray </li>
                  <li>3 . Blood test</li>
                </ul>
              </div>
              <div class="advice-details">
                <h4>Advice</h4>
                <ul>
                  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                  <li>Donec venenatis arcu aliquam erat condimentum, ac cursus neque ultricies.</li>
                  <li>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</li>
                </ul>
              </div>
            </div>

            <div class="col-md-8 col-sm-8 right-side">
              <div class="table-responsive marg">
                <table class="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Type</th>
                      <th>Medicine Name</th>
                      <th>Mg/Ml</th>
                      <th>Dose </th>
                      <th>Day</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>test</td>
                      <td>ALOTRIKA</td>
                      <td>200</td>
                      <td>1</td>
                      <td>1</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>test</td>
                      <td>Napa-ex</td>
                      <td>250</td>
                      <td>1</td>
                      <td>1</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>test</td>
                      <td>ALOTRIKA</td>
                      <td>500</td>
                      <td>1</td>
                      <td>1</td>
                      <td>test</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>1</td>
                      <td>Napa-ex</td>
                      <td>100</td>
                      <td>2</td>
                      <td>7</td>
                      <td>some comment </td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>2</td>
                      <td>ALOTRIKA</td>
                      <td>200</td>
                      <td>1</td>
                      <td>15</td>
                      <td>new comment </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="7" class="text-center">Curabitur hendrerit enim ac arcu mattis, ac molestie metus consectetur..</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>



        <div class="container">
          <div class="row main-footer">
            <div class="col-sm-7 f1">
              <p id="link">https://doctorssnew.bdtask.com/</p>
            </div>
            <div class="col-sm-5 f2">
              <p id="signature">Signature</p>
            </div>
          </div>
          <div class="col-sm-12 footer1">
            CHAMBER TIME:
            Start Time : 04:00 AM,
End Time : 01:00 PM </div>
        </div>
      </div>



    </div>
  </div>
);

ViewPrescription.propTypes = {};

ViewPrescription.defaultProps = {};

export default ViewPrescription;
