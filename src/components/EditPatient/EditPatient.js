import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditPatient.css';
import { useForm } from 'react-hook-form';
import PatientTestService from '../../main/mocks/PatientTestService';
import patientMessage from '../../main/messages/patientMessage';
import showMessage from '../../libraries/messages/messages';
import patientValidation from '../../main/validations/patientValidation';
import patientHTTPService from '../../main/services/patientHTTPService';
import CurrentUser from '../../main/config/user';

const EditPatient = (props) => {

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [patient, setPatient] = useState(props.patient);

    useEffect(() => {
        setPatient(props.patient)
    }, [props.patient]);


    const onSubmit = (data) => {
        patientHTTPService.editPatient(props.patient, data).then(dta => {
            props.closeModal(data)
            showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
        })

    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setPatient({ ...patient, [name]: value });
    };

    // Add or update fields to match AddPatient (example: maritalStatus, occupation, allergies, chronicDiseases, etc.)
    return (
        <div className="EditPatient">
            <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal" role="form" encType="multipart/form-data" method="post" acceptCharset="utf-8">
                <div className="form-body">
                    <div className="form-group">
                        <label className="col-md-3 control-label"><span className="text-danger"> * </span>  Fullname </label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.namepatient} ref={register({ required: true })}
                                type="text" name="namepatient" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label"><span className="text-danger"> * </span> Email</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.emailpatient} ref={register({ required: true })}
                                type="email" id="emailpatient" autoComplete="off" name="emailpatient"
                                className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label"><span className="text-danger"> * </span>  Date Of Birth </label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.birth} ref={register({ required: true })}
                                type="date" name="birth" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label"><span className="text-danger"> * </span>  Telephone </label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.telephone} ref={register({ required: true })}
                                type="text" name="telephone" id="old" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label"> Address </label>
                        <div className="col-md-12">
                            <textarea onChange={handleInputChange} value={patient.address}
                                ref={register({ required: true })}
                                name="address" className="form-control"></textarea>
                        </div>
                    </div>
                    {/* New fields below */}
                    <div className="form-group">
                        <label className="col-md-3 control-label">Gender</label>
                        <div className="col-md-12">
                            <select name="gender" className="form-control" value={patient.gender || ''} onChange={handleInputChange} ref={register({ required: true })}>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">National ID</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.nationalId || ''} ref={register}
                                type="text" name="nationalId" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Insurance Number</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.insuranceNumber || ''} ref={register}
                                type="text" name="insuranceNumber" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Emergency Contact</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.emergencyContact || ''} ref={register}
                                type="text" name="emergencyContact" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Blood Group</label>
                        <div className="col-md-12">
                            <select name="bloodGroup" className="form-control" value={patient.bloodGroup || ''} onChange={handleInputChange} ref={register}>
                                <option value="">Select Blood Group</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Marital Status</label>
                        <div className="col-md-12">
                            <select name="maritalStatus" className="form-control" value={patient.maritalStatus || ''} onChange={handleInputChange} ref={register}>
                                <option value="">Select Marital Status</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Occupation</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.occupation || ''} ref={register}
                                type="text" name="occupation" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Allergies</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.allergies || ''} ref={register}
                                type="text" name="allergies" className="form-control" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="col-md-3 control-label">Chronic Diseases</label>
                        <div className="col-md-12">
                            <input onChange={handleInputChange} value={patient.chronicDiseases || ''} ref={register}
                                type="text" name="chronicDiseases" className="form-control" />
                        </div>
                    </div>
                    {/* End new fields */}
                    <div className="form-group row">
                        <div className="col-sm-offset-9 col-sm-6">
                            <button name="submit" type="submit" className="btn btn-primary">
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
