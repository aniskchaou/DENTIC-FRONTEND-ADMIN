import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddIncome.css';
import patientHTTPService from '../../main/services/patientHTTPService';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';

const AddIncome = (props) => {

  const initialState = {
    namepatient: '',
    emailpatient: '',
    birth: '',
    telephone: '',
    gender: '',
    address: '',
  };

  const { register, handleSubmit, errors } = useForm()
  const [patient, setPatient] = useState(initialState);

  const onSubmit = (data) => {
    patientHTTPService.createPatient(data)
      .then(response => {
        setPatient(initialState)
        props.closeModal(data)
        showMessage('Confirmation', patientMessage.add, 'success')
      })
      .catch(e => {
        showMessage('Confirmation', e, 'warning')
      });

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPatient({ ...patient, [name]: value });
  };
  return (
    <div className="AddIncome">
      AddIncome Component
    </div>)
};

AddIncome.propTypes = {};

AddIncome.defaultProps = {};

export default AddIncome;
