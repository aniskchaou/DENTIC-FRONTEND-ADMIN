import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddMedicamentManufacture.css';
import expenseValidation from '../../main/validations/appointementValidation';
import { useForm } from 'react-hook-form';
import medicamentManufactureValidation from '../../main/validations/medicamentmanufactureValidation';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService'
const AddMedicamentManufacture = (props) => {
  const initialState = {
    name: ''
  };

  const { register, handleSubmit, errors } = useForm()
  const [medicamentManufacture, setMedicamentManufacture] = useState(initialState);

  const onSubmit = (data) => {
    medicamentManufactureHTTPService.createMedicamentManufacture(data).then(data => {
      setMedicamentManufacture(initialState)
      props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMedicamentManufacture({ ...medicamentManufacture, [name]: value });
  };


  return (
    <div className="AddService">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Manufacture:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={medicamentManufacture?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.name && medicamentManufactureValidation.name}
              </div>
            </div>
          </div>


          <div class="form-group row">
            <div class="col-8">
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

AddMedicamentManufacture.propTypes = {};

AddMedicamentManufacture.defaultProps = {};

export default AddMedicamentManufacture;
