import React from 'react';
import PropTypes from 'prop-types';
import './AddAppointment.css';

const AddAppointment = () => (
  <div className="AddAppointment">
    <form action="https://doctorssnew.bdtask.com/admin/Appointment_controller/save_appointment" class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
                        <div class="form-body">

                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Date:</font></font></label>
                                <div class="col-md-5">
                                    <input type="text" id="date" value="" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" placeholder="aaaa-mm-jj" required="">
                                    <span class="text-danger"> </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> ID du patient:</font></font></label>
                                <div class="col-md-5">
                                    <input type="text" name="p_id" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" placeholder="ID du patient" value="" required=""> 
                                    <span class="text-danger"> </span>
                                    <span class="p_name"></span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label "><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Lieu:</font></font></label>
                                <div class="col-md-5">
                                    <select class="form-control v_name" id="venue" onchange="if (!window.__cfRLUnblockHandlers) return false; loadSchedul(this.value);" name="venue" value="" required="">
                                        <option value=""><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">--Sélectionnez le lieu--</font></font></option>
                                        <option value="1"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Démo Medical Collage</font></font></option><option value="3"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tour verte</font></font></option><option value="4"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tour de Manan</font></font></option>                                    </select>
                                    <span class="text-danger"> </span>
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label"><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Choisissez Série:</font></font></label>
                                <div class="col-md-5 schedul"></div>
                            </div>

                            <div class="form-group">
                                <label class="col-md-3 control-label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">CC du patient:</font></font></label>
                                <div class="col-md-5">
                                    <textarea name="problem" class="form-control" rows="3"></textarea>
                                    <span class="text-danger"> </span>
                                </div>
                            </div>

                            <div class="form-group row">
                                <div class="col-sm-offset-3 col-sm-6">
                                    <button type="reset" class="btn btn-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Réinitialiser</font></font></button>
                                    <button type="button" onclick="if (!window.__cfRLUnblockHandlers) return false; demoModeOne()" disabled="" class="btn btn-success"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Rendez-vous</font></font></button>
                                </div>
                            </div>

                          </div>  
                        </form>
  </div>
);

AddAppointment.propTypes = {};

AddAppointment.defaultProps = {};

export default AddAppointment;
