import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddCertificateTemplate.css';
import appointementValidation from '../../main/validations/appointementValidation';
import { useForm } from 'react-hook-form';
import certificateTemplateValidation from '../../main/validations/certificationtemplateValidation';
import certificationtemplatetHTTPServiceCopy from '../../main/services/certificationtemplatetHTTPService copy';
const AddCertificateTemplate = (props) => {
  const { register, handleSubmit, errors } = useForm()
  const [certificateTemplate, setCertificateTemplate] = useState();

  const onSubmit = (data) => {
    certificationtemplatetHTTPServiceCopy.createCertificationTemplate(data).then(data => {
      setCertificateTemplate(initialState)
      props.closeModal()
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCertificateTemplate({ ...certificateTemplate, [name]: value });
  };

  const initialState = {
    name: '',
    content: ''
  };

  return (
    <div className="AddCertificateTemplate">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Title:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={certificateTemplate?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.date && certificateTemplateValidation.name}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Content:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={certificateTemplate?.content} ref={register({ required: true })}
                type="text" name="content" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" >
              </textarea>
              <div className="error text-danger">
                {errors.content && certificateTemplateValidation.content}
              </div>
            </div>
          </div>

          <div class="form-group row">
            <div class="offset-4 col-8">
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>
    </div>
  )
};

AddCertificateTemplate.propTypes = {};

AddCertificateTemplate.defaultProps = {};

export default AddCertificateTemplate;
