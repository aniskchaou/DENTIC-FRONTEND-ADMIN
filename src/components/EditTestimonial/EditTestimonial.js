import React, { useEffect, useState } from 'react';
import showMessage from '../../libraries/messages/messages'
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './EditTestimonial.css';

const EditTestimonial = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [groupe, setGroupe] = useState(props.testimonial);

  useEffect(() => {
    setGroupe(props.testimonial)
  }, [props.testimonial]);


  const onSubmit = (data) => {

    // GroupeTestService.update(props.testimonial, data)
    // showMessage('Confirmation', 'groupeMessage.edit', 'success')
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
            <input onChange={handleInputChange} value={groupe?.groupe_name} ref={register({ required: true })}
              id="text" name="groupe_name" type="text" class="form-control" />

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
};

EditTestimonial.propTypes = {};

EditTestimonial.defaultProps = {};

export default EditTestimonial;
