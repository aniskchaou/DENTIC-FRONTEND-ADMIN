
import PropTypes from 'prop-types';
import './EditContactPage.css';
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import React, { useEffect, useState } from 'react';
import showMessage from '../../libraries/messages/messages'

import { useForm } from 'react-hook-form';
import CurrentUser from '../../main/config/user';
const EditContactPage = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [frontOffice, setfrontOffice] = useState(props.frontOffice);

  useEffect(() => {
    setfrontOffice(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.frontOffice, data)
    frontOfficeHTTPService.editContactPage(props.frontOffice.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setfrontOffice({ ...frontOffice, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Email</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.email} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Subject</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.subject} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Message</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.message} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">send</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.sendButton} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Name</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.name} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

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

EditContactPage.propTypes = {};

EditContactPage.defaultProps = {};

export default EditContactPage;
