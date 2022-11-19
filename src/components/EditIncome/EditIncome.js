import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditIncome.css';
import { useForm } from 'react-hook-form';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import CurrentUser from '../../main/config/user';

const EditIncome = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [patient, setPatient] = useState(props.patient);

  useEffect(() => {
    setPatient(props.patient)
  }, [props.patient]);


  const onSubmit = (data) => {
    patientHTTPService.editPatient(props.patient.id, data)
    props.closeModal(data)
    showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPatient({ ...patient, [name]: value });
  };
  return (
    <div className="EditIncome">
      EditIncome Component
    </div>
  )
};

EditIncome.propTypes = {};

EditIncome.defaultProps = {};

export default EditIncome;
