import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddTestimonial.css';
import { useForm } from 'react-hook-form';

const AddTestimonial = () => {

  const initialState = {
    name: '',
    date: '',
    status: ''
  };

  const { register, handleSubmit, errors } = useForm()
  const [service, setService] = useState(initialState);

  const onSubmit = (data) => {
    /* serviceHTTPService.createService(data).then(data => {

    }) */
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setService({ ...service, [name]: value });
  };


  return (
    <div className="AddService">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Service Name:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={service?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Description:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={service?.description} ref={register({ required: false })}
                type="text" name="description" id="patient_id" class="form-control" autocomplete="off" required="" >
              </textarea>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Status:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={service?.status} ref={register({ required: true })}
                name="status" class="form-control" rows="3">
                <option>Active</option>
                <option>Inactive</option>
              </select>

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

AddTestimonial.propTypes = {};

AddTestimonial.defaultProps = {};

export default AddTestimonial;
