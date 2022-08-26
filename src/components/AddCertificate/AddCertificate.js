import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddCertificate.css';
import { useForm } from 'react-hook-form';
import certificateValidation from '../../main/validations/certificateValidation';
import patientHTTPService from '../../main/services/patientHTTPService';
import certificateHTTPService from '../../main/services/certificateHTTPService';
const AddCertificate = (props) => {
  const { register, handleSubmit, errors } = useForm()
  const [certificate, setCertificate] = useState();
  const [patients, setPatients] = useState([]);


  const handleInputChange = event => {
    const { name, value } = event.target;
    setCertificate({ ...certificate, [name]: value });
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
        // showMessage('Confirmation', e, 'info')
      });
  };

  const onSubmit = (data) => {
    certificateHTTPService.createCertificate(data).then(data => {
      setCertificate(initialState)
      props.closeModal()
    })

  }

  const initialState = {
    date: '',
    patient: '',
    content: '',
    template: ''
  };


  return (
    <div className="AddCertificate">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={certificate?.date} ref={register({ required: true })}
                type="date" id="date" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.date && certificateValidation.date}
              </div>
            </div>
          </div>


          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Patient:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={certificate?.patient} ref={register({ required: true })}
                name="patient" id="patient_id" class="form-control" autocomplete="off" required="">
                {patients.map(response =>
                  <option value={response?.id}>{response?.namepatient}</option>
                )}
              </select>
              <div className="error text-danger">
                {errors.patient && certificateValidation.patient}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Template:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={certificate?.template} ref={register({ required: true })}
                name="template" class="form-control" rows="3">
                <option value="1">template</option>
              </select>
              <div className="error text-danger">
                {errors.template && certificateValidation.template}
              </div>
            </div>
          </div>





          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Content:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={certificate?.content} ref={register({ required: true })}
                name="content" class="form-control" rows="3"></textarea>
              <div className="error text-danger">
                {errors.content && certificateValidation.content}
              </div>
            </div>
          </div>


          <div class="form-group row">
            <div class=" col-8">
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>
    </div>
  )
};

AddCertificate.propTypes = {};

AddCertificate.defaultProps = {};

export default AddCertificate;
