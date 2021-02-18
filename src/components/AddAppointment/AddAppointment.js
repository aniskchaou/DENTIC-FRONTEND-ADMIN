import React, { useState } from 'react';
import './AddAppointement.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import appointementMessage from '../../main/messages/appointementMessage'
import AppointementTestService from '../../main/mocks/AppointementTestService';
import HTTPService from '../../main/services/HTTPService';
import appointementValidation from '../../main/validations/appointementValidation'

const AddAppointment = () => {

    const initialState = {
        date: '',
        patient: '',
        problem: '',
        venue: '',
    };

    const { register, handleSubmit, errors } = useForm()
    const [appointement, setAppointement] = useState(initialState);

    const onSubmit = (data) => {
        //saveAppointement(data)
        AppointementTestService.create(data)
        setAppointement(initialState)
        showMessage('Confirmation', appointementMessage.add, 'success')
    }

    const saveAppointement = (data) => {

        HTTPService.create(data)
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
                        <div class="col-md-5">
                            <input onChange={handleInputChange} value={appointement.post} ref={register({ required: true })}
                                type="text" id="date" value="" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" placeholder="aaaa-mm-jj" required="" />
                            <div className="error text-danger">
                                {errors.date && appointementValidation.date}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > ID du patient:</font></font></label>
                        <div class="col-md-5">
                            <input onChange={handleInputChange} value={appointement.post} ref={register({ required: true })}
                                type="text" name="p_id" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" placeholder="ID du patient" value="" required="" />
                            <div className="error text-danger">
                                {errors.patient_id && appointementValidation.patient_id}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label "><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Lieu:</font></font></label>
                        <div class="col-md-5">
                            <select onChange={handleInputChange} value={appointement.post} ref={register({ required: true })}
                                class="form-control v_name" id="venue" name="venue" value="" required="" >
                                <option value=""><font  ><font  >--Sélectionnez le lieu--</font></font></option>
                                <option value="1"><font  ><font  >Démo Medical Collage</font></font></option><option value="3"><font  ><font  >Tour verte</font></font></option><option value="4"><font  ><font  >Tour de Manan</font></font></option>
                            </select>
                            <div className="error text-danger">
                                {errors.venue && appointementValidation.venue}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Choisissez Série:</font></font></label>
                        <div class="col-md-5 schedul"></div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >CC du patient:</font></font></label>
                        <div class="col-md-5">
                            <textarea onChange={handleInputChange} value={appointement.problem} ref={register({ required: true })}
                                name="problem" class="form-control" rows="3"></textarea>
                            <div className="error text-danger">
                                {errors.problem && appointementValidation.problem}
                            </div>
                        </div>
                    </div>


                    <div class="form-group row">
                        <div class="offset-4 col-8">
                            <button name="submit" type="submit" class="btn btn-primary">
                                <i className="fa fa-check"></i><font><font> Sauvegarder</font></font></button>

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
