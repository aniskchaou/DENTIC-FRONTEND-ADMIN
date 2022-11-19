import React, { useEffect, useState } from 'react';
import './AddAppointment.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import appointementMessage from '../../main/messages/appointementMessage'
import AppointementTestService from '../../main/mocks/AppointementTestService';
import appointementValidation from '../../main/validations/appointementValidation'
import appointementHTTPService from '../../main/services/appointementHTTPService';
import patientHTTPService from '../../main/services/patientHTTPService';
import CurrentUser from '../../main/config/user';

const AddAppointment = (props) => {

    const initialState = {
        date: '',
        patient: '',
        problem: '',
    };

    const { register, handleSubmit, errors } = useForm()
    const [appointement, setAppointement] = useState(initialState);
    const [patients, setPatients] = useState([]);


    const onSubmit = (data) => {
        //saveAppointement(data)
        //AppointementTestService.create(data)
        appointementHTTPService.createAppointement(data).then(data => {
            setAppointement(initialState)
            showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success')
            props.closeModal()
        })

    }

    useEffect(() => {
        getAllPatient()
    }, []);


    const getAllPatient = () => {

        patientHTTPService.getAllPatient()
            .then(response => {
                console.log(response.data)
                setPatients(response.data);

            })
            .catch(e => {
                showMessage('Error', CurrentUser.ERR_MSG, 'warning')
            });
    };

    const saveAppointement = (data) => {

        appointementHTTPService.create(data)
            .then(response => {
                setAppointement(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setAppointement({ ...appointement, [name]: value });
    };


    return (
        <div className="AddAppointment">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
                <div class="form-body">

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Date:</font></font></label>
                        <div class="col-md-12">
                            <input onChange={handleInputChange} value={appointement.date} ref={register({ required: true })}
                                type="date" id="date" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

                            <div className="error text-danger">
                                {errors.date && appointementValidation.date}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Patient:</font></font></label>
                        <div class="col-md-12">
                            <select onChange={handleInputChange} value={appointement.patient} ref={register({ required: true })}
                                name="patient" id="patient_id" class="form-control" autocomplete="off" required="">
                                {patients.map(response =>
                                    <option value={response?.id}>{response?.namepatient}</option>
                                )}
                            </select>
                            <div className="error text-danger">
                                {errors.patient_id && appointementValidation.patient}
                            </div>
                        </div>
                    </div>





                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Problem:</font></font></label>
                        <div class="col-md-12">
                            <textarea onChange={handleInputChange} value={appointement.problem} ref={register({ required: true })}
                                name="problem" class="form-control" rows="3"></textarea>
                            <div className="error text-danger">
                                {errors.problem && appointementValidation.problem}
                            </div>
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

AddAppointment.propTypes = {};

AddAppointment.defaultProps = {};

export default AddAppointment;
