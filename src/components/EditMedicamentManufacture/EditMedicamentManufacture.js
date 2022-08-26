
import PropTypes from 'prop-types';
import './EditMedicamentManufacture.css';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
const EditMedicamentManufacture = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [medicamentManufacture, setMedicamentManufacture] = useState(props.medicamentManufacture);
  const [typeSubs, setTypeSubs] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMedicamentManufacture(props.medicamentManufacture)

  }, [props.medicamentManufacture]);


  const onSubmit = (data) => {

    //ActivityTestService.update(props.medicamentManufacture, data)
    medicamentManufactureHTTPService.editMedicamentManufacture(props.medicamentManufacture.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', ' activityMessage.edit', 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMedicamentManufacture({ ...medicamentManufacture, [name]: value });
  };





  return (
    <div className="EditActivity">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Manufacture:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={medicamentManufacture?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

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
};

EditMedicamentManufacture.propTypes = {};

EditMedicamentManufacture.defaultProps = {};

export default EditMedicamentManufacture;
