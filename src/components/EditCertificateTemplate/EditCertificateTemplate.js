import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditCertificateTemplate.css';
import certificationtemplatetHTTPServiceCopy from '../../main/services/certificationtemplatetHTTPService copy';
import patientHTTPService from '../../main/services/patientHTTPService';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';

const EditCertificateTemplate = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [certificateTemplate, setCertificate] = useState(props.certificateTemplate);
  const [patients, setPatients] = useState([]);
  useEffect(() => {
    setCertificate(props.certificateTemplate)
    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);

      })
      .catch(e => {
        // showMessage('Confirmation', e, 'info')
      });
  }, [props.certificateTemplate]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.certificateTemplate, data)
    certificationtemplatetHTTPServiceCopy.editCertificationTemplate(props.certificateTemplate.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', 'groupeMessage.edit', 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCertificate({ ...certificateTemplate, [name]: value });
  };



  return (
    <div className="EditCertificateTemplate">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Title:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={certificateTemplate?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Content:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={certificateTemplate?.content} ref={register({ required: true })}
                type="text" name="content" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" >
              </textarea>

            </div>
          </div>

          <div class="form-group row">
            <div >
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>
    </div>
  )

};

EditCertificateTemplate.propTypes = {};

EditCertificateTemplate.defaultProps = {};

export default EditCertificateTemplate;
