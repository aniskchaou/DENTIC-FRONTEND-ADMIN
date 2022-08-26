
import PropTypes from 'prop-types';
import './EditMedicamentCategory.css';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import React, { useEffect, useState } from 'react';


import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
const EditMedicamentCategory = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [medicamentCategory, setMedicamentCategory] = useState(props.medicamentCategory);
  const [typeSubs, setTypeSubs] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMedicamentCategory(props.medicamentCategory)

  }, [props.medicamentCategory]);


  const onSubmit = (data) => {

    //ActivityTestService.update(props.medicamentCategory, data)
    medicamentCategoryHTTPService.editMedicamentCayegory(props.medicamentCategory.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', 'activityMessage.edit', 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setMedicamentCategory({ ...medicamentCategory, [name]: value });
  };






  return (
    <div className="EditActivity">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  >Medecine Category:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={medicamentCategory?.name} ref={register({ required: true })}
                type="text" id="date" name="name" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

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

EditMedicamentCategory.propTypes = {};

EditMedicamentCategory.defaultProps = {};

export default EditMedicamentCategory;
