import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditCertificate.css';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
import patientHTTPService from '../../main/services/patientHTTPService';

const EditCertificate = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [certificate, setCertificate] = useState(props.certificate);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    setCertificate(props.certificate)
    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);

      })
      .catch(e => {
        // showMessage('Confirmation', e, 'info')
      });
  }, [props.certificate]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.certificate, data)
    certificateHTTPService.editCertificate(props.certificate.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', 'groupeMessage.edit', 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCertificate({ ...certificate, [name]: value });
  };

  return (
    <div className="EditCertificate">

      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={certificate?.date} ref={register({ required: true })}
                type="date" id="date" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

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

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Template:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={certificate?.template} ref={register({ required: true })}
                name="template" class="form-control" rows="3">
                <option value="1">template</option>
              </select>

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Content:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={certificate?.content} placeholder="Content" ref={register({ required: true })}
                name="content" class="form-control" rows="3"></textarea>

            </div>
          </div>


          <div class="form-group">
            <div >
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>

    </div>)
};

EditCertificate.propTypes = {};

EditCertificate.defaultProps = {};

export default EditCertificate;
