import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Certificates.css';
import AddAppointment from '../AddAppointment/AddAppointment';
import AddCertificate from '../AddCertificate/AddCertificate';
import EditCertificate from '../EditCertificate/EditCertificate';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import showMessage from '../../libraries/messages/messages';
const Certificates = () => {
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [updatedItem, setUpdatedItem] = useState({});
  useEffect(() => {
    //LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    setLoading(true);
    certificateHTTPService.getAllCertificate()
      .then(response => {
        setCertificates(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };

  const removeActivityAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      certificateHTTPService.removeCertificate(data).then(data => {
        getAllPatient()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateActivityAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)

  }

  const closeModalEdit = (data) => {
    getAllPatient()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    getAllPatient()
    closeButtonAdd.current.click()
  }

  return (
    <div className="Certificates">
      <div className="card">
        <div className="card-header">
          <strong className="card-title">Certificates</strong>
        </div>
        <div className="card-body">
          <button type="button" data-toggle="modal" data-target="#addMedicament" className="btn btn-success btn-sm">Create</button>
          <table id="example1" className="table table-striped table-bordered">
            <thead class=" text-primary">
              <tr>
                <th>Date </th>
                <th> Template</th>
                <th>Patient </th>
                <th>Actions</th></tr>
            </thead>
            <tbody>
              {certificates.map(data =>
                <tr>
                  <td>{data.date}</td>
                  <td>{data.template}</td>
                  <td>{data.patient}</td>
                  <td><button style={{ margin: "3px" }} onClick={e => updateActivityAction(e, data)} type="button" data-toggle="modal" data-target="#editActivity" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removeActivityAction(e, data.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button></td>
                </tr>
              )}



            </tbody>
          </table>


          <div class="modal fade" id="addMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <AddCertificate closeModal={closeModalAdd} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal">Close</button>

                </div>
              </div>
            </div>
          </div>

          <div class="modal fade" id="viewMedicament" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <EditCertificate closeModal={closeModalEdit} />
                </div>
                <div class="modal-footer">
                  <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  )
};

Certificates.propTypes = {};

Certificates.defaultProps = {};

export default Certificates;
