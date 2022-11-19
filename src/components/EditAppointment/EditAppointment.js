
import PropTypes from 'prop-types';
import './EditAppointment.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import appointementHTTPService from '../../main/services/appointementHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientHTTPService from '../../main/services/patientHTTPService';
import CurrentUser from '../../main/config/user';

const EditAppointment = (props) => {
    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [appointement, setAppointement] = useState(props.event);
    const [patients, setPatients] = useState([]);

    useEffect(() => {

        setAppointement(props.appointement)
        getAllPatient()
    }, [props.appointement]);


    const onSubmit = (data) => {

        //EventTestService.update(props.event, data)

        console.log(props.appointement)
        appointementHTTPService.editAppointement(props.appointement, data).then(data => {
            showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
            props.closeModal()
        })
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setAppointement({ ...event, [name]: value });
    };
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


    return (
        <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
            <div class="form-body">

                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Date:</font></font></label>
                    <div class="col-md-12">
                        <input onChange={handleInputChange} value={appointement?.datee} ref={register({ required: true })}
                            type="date" id="date" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />


                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Patient:</font></font></label>
                    <div class="col-md-12">
                        <select onChange={handleInputChange} value={appointement?.patient} ref={register({ required: true })}
                            name="patient" id="patient_id" class="form-control" autocomplete="off" required="">
                            {patients.map(response =>
                                <option value={response?.id}>{response?.namepatient}</option>
                            )}
                        </select>

                    </div>
                </div>





                <div class="form-group">
                    <label class="col-md-3 control-label"><font  ><font  >Problem:</font></font></label>
                    <div class="col-md-12">
                        <textarea onChange={handleInputChange} value={appointement?.problem} ref={register({ required: true })}
                            name="problem" class="form-control" rows="3"></textarea>

                    </div>
                </div>


                <div class="form-group">
                    <div class="col-8">
                        <button name="submit" type="submit" class="btn btn-primary">
                            <i className="fa fa-check"></i><font><font> Save</font></font></button>

                    </div>
                </div>

            </div>
        </form>
    )
}



EditAppointment.propTypes = {};

EditAppointment.defaultProps = {};

export default EditAppointment;
