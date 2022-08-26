import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddMedicamentCategory.css';
import expenseValidation from '../../main/validations/appointementValidation';
import { useForm } from 'react-hook-form';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import medicamentCategoryValidation from '../../main/validations/medicamentcategoryValidation';
const AddMedicamentCategory = (props) => {
  const initialState = {
    name: ''
  };

  const { register, handleSubmit, errors } = useForm()
  const [medicamentCategory, setMedicamentCategory] = useState(initialState);

  const onSubmit = (data) => {
    medicamentCategoryHTTPService.createMedicamentCayegory(data).then(data => {
      props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMedicamentCategory({ ...medicamentCategory, [name]: value });
  };


  return (
    <div className="AddService">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  >Medecine Category:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={medicamentCategory?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.name && medicamentCategoryValidation.name}
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
}

AddMedicamentCategory.propTypes = {};

AddMedicamentCategory.defaultProps = {};

export default AddMedicamentCategory;
