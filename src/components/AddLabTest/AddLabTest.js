import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddLabTest.css';
import { useForm } from 'react-hook-form';
import medicamentValidation from '../../main/validations/medicamentValidation'
import patientHTTPService from '../../main/services/patientHTTPService';
import testlabHTTPService from '../../main/services/testlabHTTPService';
const AddLabTest = (props) => {

  const initialState = {
    datee: '',
    patient: '',
    content: '',
    name: '',
  };

  const { register, handleSubmit, errors } = useForm()
  const [testLab, setTestLab] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const onSubmit = (data) => {
    //saveAppointement(data)
    // AppointementTestService.create(data)

    // showMessage('Confirmation', appointementMessage.add, 'success')
    testlabHTTPService.createTestLab(data).then(data => {
      setTestLab(initialState)
      props.closeModal()
    })
  }

  const saveAppointement = (data) => {

    testlabHTTPService.createTestLab(data)
      .then(response => {
        setTestLab(initialState)
      })
      .catch(e => {
        console.log(e);
      });

  };


  const handleInputChange = event => {
    const { name, value } = event.target;
    setTestLab({ ...testLab, [name]: value });
  };

  useEffect(() => {
    //LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {

    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);

      })
      .catch(e => {
        //showMessage('Confirmation', e, 'info')
      });
  };


  return (
    <div className="AddMedicament">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

        <div class="form-body">




          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Result:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={testLab.content} ref={register({ required: true })}
                type="text" class="form-control" autocomplete="off" id="search-box"
                data-toggle="tooltip" title="Nom de la compagnie"
                name="content" required="" >
              </textarea>
              <div className="error text-danger">
                {errors.result && medicamentValidation.result}
              </div>
            </div>
          </div>


          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={testLab.datee} ref={register({ required: true })}
                type="date" name="datee" autocomplete="off" id="search-group" class="form-control"
                data-toggle="tooltip" title="Nom de groupe " required="" />

              <div className="error text-danger">
                {errors.date && medicamentValidation.date}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Patient:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={testLab.patient} ref={register({ required: true })}
                name="patient" id="patient_id" class="form-control" autocomplete="off" required="">
                {patients.map(response =>
                  <option value={response?.id}>{response?.namepatient}</option>
                )}
              </select>

              <div className="error text-danger">
                {errors.patient && medicamentValidation.patient}
              </div>
            </div>
          </div>
        </div>



        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary">
              <i className="fa fa-check"></i>  Save</button>

          </div>
        </div>



      </form>
    </div>
  )
};

AddLabTest.propTypes = {};

AddLabTest.defaultProps = {};

export default AddLabTest;
