import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddService.css';
import appointementValidation from '../../main/validations/appointementValidation';
import { useForm } from 'react-hook-form';
import serviceHTTPService from '../../main/services/serviceHTTPService';
import showMessage from '../../libraries/messages/messages';
import appointementMessage from '../../main/messages/appointementMessage';
import CurrentUser from '../../main/config/user';

const AddService = (props) => {

  const initialState = {
    name: '',
    description: '',
    status: '',
    file: null,
    fileName: ''
  };

  useEffect(() => {
    setService({ 'file': null });
    setService(initialState)
  }, []);

  const { register, handleSubmit, errors } = useForm()
  const [service, setService] = useState(initialState);

  const onSubmit = (data) => {
    const formData = new FormData(document.getElementById("addService"));

    // Update the formData object 
    /* formData.append(
      "file",
      service.file,
      'file'
    ); */


    //setService({ 'fileName': formData.get('file').name })

    console.log(formData.get('file').name)

    serviceHTTPService.uploadFile(formData).then(data => { })
    serviceHTTPService.createService(formData.get('file').name, data).then(data => {
      setService(initialState)
      showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success')
      props.closeModal()
    })





  }

  const handleFileChange = event => {

    setService({ 'file': event.target.files[0] });
    // setService({ 'fileName': event.target.files[0].name });
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setService({ ...service, [name]: value });
  };


  return (
    <div className="AddService">
      <form id="addService" onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data" class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">

        <div class="form-group">
          <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Image:</font></font></label>
          <div class="col-md-12">
            <input ref={register({ required: true })} name="file" type="file" onChange={handleFileChange} />
          </div>
        </div>




        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Service Name:</font></font></label>
            <div class="col-md-12">
              <input value={service.name} onChange={handleInputChange} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.date && appointementValidation.date}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Description:</font></font></label>
            <div class="col-md-12">
              <textarea value={service.description} onChange={handleInputChange} ref={register({ required: false })}
                type="text" name="description" id="service_id" class="form-control" autocomplete="off" required="" >
              </textarea>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Status:</font></font></label>
            <div class="col-md-12">
              <select value={service.status} onChange={handleInputChange} ref={register({ required: true })}
                name="status" class="form-control" rows="3">
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="error text-danger">
                {errors.status && appointementValidation.status}
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

AddService.propTypes = {};

AddService.defaultProps = {};

export default AddService;
