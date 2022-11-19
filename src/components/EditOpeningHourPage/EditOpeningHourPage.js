
import PropTypes from 'prop-types';
import './EditOpeningHourPage.css';
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import React, { useEffect, useState } from 'react';
import showMessage from '../../libraries/messages/messages'

import { useForm } from 'react-hook-form';
import CurrentUser from '../../main/config/user';
const EditOpeningHourPage = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [frontOffice, setFrontOffice] = useState(props.frontOffice);

  useEffect(() => {
    setFrontOffice(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.frontOffice, data)
    frontOfficeHTTPService.editOpeningHourPage(props.frontOffice.id, data).then(data => {
      // props.closeModal()
      showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFrontOffice({ ...frontOffice, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Title</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.title} ref={register({ required: true })}
              id="text" name="title" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Sub title</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.subtitle} ref={register({ required: true })}
              id="text" name="subtitle" type="text" class="form-control" />

          </div>
        </div>


        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i>Save </button>
          </div>
        </div>

      </form>
    </div>
  )
}

EditOpeningHourPage.propTypes = {};

EditOpeningHourPage.defaultProps = {};

export default EditOpeningHourPage;
