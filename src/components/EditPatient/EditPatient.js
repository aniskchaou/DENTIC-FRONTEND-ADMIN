import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditPatient.css';
import { useForm } from 'react-hook-form';
import PatientTestService from '../../main/mocks/PatientTestService';
import patientMessage from '../../main/messages/patientMessage';
import showMessage from '../../libraries/messages/messages';
import patientValidation from '../../main/validations/patientValidation';
import patientHTTPService from '../../main/services/patientHTTPService';

const EditPatient = (props) => {

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [patient, setPatient] = useState(props.patient);

    useEffect(() => {
        setPatient(props.patient)
    }, [props.patient]);


    const onSubmit = (data) => {
        patientHTTPService.editPatient(props.patient.id, data)
        props.closeModal(data)
        showMessage('Confirmation', patientMessage.edit, 'success')
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPatient({ ...patient, [name]: value });
    };

    return (
        <div className="EditPatient">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Fullname </label>
                        <div class="col-md-12">
                            <input onChange={handleInputChange} value={patient.namepatient} ref={register({ required: true })}
                                type="text" name="namepatient" class="form-control" />

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span> Email</label>
                        <div class="col-md-12">
                            <input onChange={handleInputChange} value={patient.emailpatient} ref={register({ required: true })}
                                type="text" id="emailpatient" autocomplete="off" name="emailpatient"
                                class="form-control" />

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Date Of Birth </label>
                        <div class="col-md-12">
                            <input onChange={handleInputChange} value={patient.birth} ref={register({ required: true })}
                                type="date" name="birth" class="form-control" />

                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Telephone </label>
                        <div class="col-md-12">

                            <input onChange={handleInputChange} value={patient.telephone} ref={register({ required: true })}
                                type="text" name="telephone" id="old" class="form-control" />


                        </div>
                    </div>



                    <div class="form-group">
                        <label class="col-md-3 control-label"> Address </label>
                        <div class="col-md-12">
                            <textarea onChange={handleInputChange} value={patient.address}
                                ref={register({ required: true })}
                                name="address" class="form-control"></textarea>

                        </div>
                    </div>



                    <div className="form-group row">
                        <div className="col-sm-offset-9 col-sm-6">
                            <button name="submit" type="submit" class="btn btn-primary">
                                <i className="fa fa-check"></i>  Save</button>

                        </div>
                    </div>


                </div>

            </form>
        </div>
    )
};

EditPatient.propTypes = {};

EditPatient.defaultProps = {};

export default EditPatient;
