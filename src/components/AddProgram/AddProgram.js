import React from 'react';
import PropTypes from 'prop-types';
import './AddProgram.css';

const AddProgram = () => (
  <div className="AddProgram">
    <form action="https://doctorssnew.bdtask.com/admin/Schedule_controller/save_schedule" class="form-horizontal" role="form" method="post" accept-charset="utf-8">

<div class="form-body">
    <div class="form-group">
        <label class="col-md-3 control-label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Lieu:</font></font></label>
        <div class="col-md-5">
            <select class="form-control v_name" name="venue" id="v_id">
                <option value=""><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">--Sélectionnez le lieu--</font></font></option>
                 <option value="1"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Démo Medical Collage</font></font></option><option value="3"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tour verte</font></font></option><option value="4"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tour de Manan</font></font></option>                                </select>
                                        </div>
    </div>

    <div class="form-group">
        <label class="col-md-3 control-label"> <span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Jour:</font></font></label>
        <div class="col-md-5">
            <div class="md-checkbox-inline">
            
                    <input id="checkbox7" name="day[]" value="3" class="md-check" type="checkbox">
                    <label for="checkbox7"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Lundi </font></font></label>

                    <input id="checkbox8" name="day[]" value="4" class="md-check" type="checkbox">
                    <label for="checkbox8"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Mardi </font></font></label>
            
                
                    <input id="checkbox9" name="day[]" value="5" class="md-check" type="checkbox">
                    <label for="checkbox9"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Mercredi </font></font></label>
                
                    <input id="checkbox10" name="day[]" value="6" class="md-check" type="checkbox">
                    <label for="checkbox10"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Jeudi </font></font></label>
                
                    <input id="checkbox11" name="day[]" value="7" class="md-check" type="checkbox">
                    <label for="checkbox11"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Vendredi </font></font></label>
                    
                     <input id="checkbox5" name="day[]" value="1" class="md-check" type="checkbox">
                    <label for="checkbox5"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">samedi </font></font></label>
                
                    <input id="checkbox6" name="day[]" value="2" class="md-check" type="checkbox">
                    <label for="checkbox6"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> dimanche </font></font></label>
              
                
            </div>
        </div>
    </div>

    <div class="form-group erromsg">
                                </div>


    <div class="form-group">
        <label class="col-md-3 control-label"><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Régler l'heure:</font></font></label>
        <div class="col-md-5">
            <div class="input-group  input-daterange">
                
                
                <div class="input-group ">
                    <input type="text" class="form-control hasDatepicker" id="basic_example_1" autocomplete="off" placeholder="Heure de début" name="s_time">
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-time"></span>
                    </span>
                </div>
                
                <span class="input-group-addon"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> à </font></font></span>

                <div class="input-group ">
                    <input type="text" class="form-control hasDatepicker" id="basic_example_2" autocomplete="off" placeholder="Heure de fin" name="e_time">
                    <span class="input-group-addon">
                        <span class="glyphicon glyphicon-time"></span>
                    </span>
                </div>
            </div>
            
            <!-- /input-group -->
        </div>
                                                            </div>

    <div class="form-group">
        <label class="col-md-3 control-label"><span class="text-danger"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">*</font></font></span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Temps par patient:</font></font></label>
        <div class="col-md-5">
            <div class=" input-daterange">
                <input type="number" name="p_time" class="form-control" autocomplete="off" placeholder="Défini par heure patient">
                <span class="help-block"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Vous ne pouvez définir que la minute </font></font></span>
                                                </div> 
        </div>
    </div>
    
    <div class="form-group">
        <label class="col-md-3 control-label"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Visibilité:</font></font></label>
        <div class="col-md-5">
            <input type="radio" id="checkbox2_5" value="1" name="visible" class="md-radiobtn">
            <label for="checkbox2_5"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Oui </font></font></label>
       
            <input type="radio" id="checkbox2_10" value="0" name="visible" class="md-radiobtn">
            <label for="checkbox2_10"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> Non </font></font></label>
        </div>
                                        </div>
    </div>
</form>
  </div>
);

AddProgram.propTypes = {};

AddProgram.defaultProps = {};

export default AddProgram;
