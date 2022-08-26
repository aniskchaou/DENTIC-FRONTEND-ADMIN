import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Testimonial.css';
import { LoadJSFiles } from '../init';
import AddTestimonial from '../AddTestimonial/AddTestimonial';
import EditTestimonial from '../EditTestimonial/EditTestimonial';

const Testimonial = () => {
  const [patients, setPatients] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});

  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    // setLoading(true);
    /* patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);
        // setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      }); */
  };




  const removePatientAction = (e, data) => {
    /*  e.preventDefault();
     var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
     if (r) {
       showMessage('Confirmation', patientMessage.delete, 'success')
       patientHTTPService.removePatient(data).then(data => {
         resfreshComponent()
       }).catch(e => {
         showMessage('Confirmation', e, 'warning')
       });
     } */
  }

  const updatePatientAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    //resfreshComponent()
  }

  const closeModalEdit = (data) => {
    //resfreshComponent()
    closeButtonEdit.current.click()
    getAllPatient()
  }

  const closeModalAdd = (data) => {
    //resfreshComponent()
    closeButtonAdd.current.click()
    getAllPatient()
  }
  const resfreshComponent = () => {
    getAllPatient()
    //forceUpdate()
  }


  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Testimonials</strong>
      </div>
      <div className="card-body">
        <button type="button" data-toggle="modal" data-target="#addPatient" className="btn btn-success btn-sm">Create</button>

        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>image</th>
              <th> Name</th>
              <th>Actions</th></tr>
          </thead>
          <tbody>

            {loading ? "loading..." :
              patients.map(item =>
                <tr>
                  <td> {item.namepatient}</td>
                  <td>{item.emailpatient} </td>
                  <td>

                    <button onClick={e => updatePatientAction(e, item)} type="button" data-toggle="modal" data-target="#editPatient" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removePatientAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}




          </tbody>
        </table>


        <div class="modal fade" id="addPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button onClick={resfreshComponent} type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddTestimonial />
              </div>
              <div class="modal-footer">
                <button onClick={resfreshComponent} ref={closeButtonAdd} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>





        <div class="modal fade" id="editPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditTestimonial />
              </div>
              <div class="modal-footer">
                <button ref={closeButtonEdit} type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

Testimonial.propTypes = {};

Testimonial.defaultProps = {};

export default Testimonial;
