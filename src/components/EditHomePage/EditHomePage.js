
import PropTypes from 'prop-types';
import './EditHomePage.css';
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import React, { useEffect, useState } from 'react';
import showMessage from '../../libraries/messages/messages'

import { useForm } from 'react-hook-form';
/* subTitle: Sequelize.STRING,
  mainTitle: Sequelize.STRING,
    description: Sequelize.STRING */
const EditHomePage = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [frontOffice, setFrontoffice] = useState(props.frontOffice);

  useEffect(() => {
    setFrontoffice(props.frontOffice)
  }, [props.frontOffice]);


  const onSubmit = (data) => {

    //GroupeTestService.update(props.frontOffice, data)
    frontOfficeHTTPService.editHomePage(props.frontOffice.id, data).then(data => {
      props.closeModal()
      showMessage('Confirmation', 'groupeMessage.edit', 'success')
    })

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setFrontoffice({ ...frontOffice, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Title</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={frontOffice.name} ref={register({ required: true })}
              id="text" name="name" type="text" class="form-control" />

          </div>
        </div>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Sub title</label>
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

EditHomePage.propTypes = {};

EditHomePage.defaultProps = {};

export default EditHomePage;
