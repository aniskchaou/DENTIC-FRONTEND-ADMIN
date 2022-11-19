import React, { useEffect, useState } from 'react';
import showMessage from '../../libraries/messages/messages'
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditProgram.css';
import CurrentUser from '../../main/config/user';

const EditProgram = () => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.schedule);

  useEffect(() => {
    setGroupe(props.schedule)
  }, [props.schedule]);


  const onSubmit = (data) => {

    GroupeTestService.update(props.schedule, data)
    showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setGroupe({ ...groupe, [name]: value });
  };


  return (
    <div className="EditGroupe">
      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="form-group row">
          <label for="text" class="col-4 col-form-label">Nom du groupe</label>
          <div class="col-8">
            <input onChange={handleInputChange} value={groupe.groupe_name} ref={register({ required: true })}
              id="text" name="groupe_name" type="text" class="form-control" />
            <div className="error text-danger">
              {errors.groupe_name && groupeValidation.groupe_name}
            </div>
          </div>
        </div>


        <div class="form-group row">
          <div class="offset-4 col-8">
            <button name="submit" type="submit" class="btn btn-primary"><i class="far fa-save"></i>Sauvegarder</button>
          </div>
        </div>

      </form>
    </div>
  )
}

EditProgram.propTypes = {};

EditProgram.defaultProps = {};

export default EditProgram;
