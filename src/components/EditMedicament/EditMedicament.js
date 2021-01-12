import React from 'react';
import PropTypes from 'prop-types';
import './EditMedicament.css';

const EditMedicament = () => (
  <div className="EditMedicament">
            <form action="https://doctorssnew.bdtask.com/admin/Setup_controller/save_medicine" class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

<div class="form-body">

    <div class="form-group">
        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Nom du médicament:</font></font></label>
        <div class="col-md-6">
            <input type="text" data-toggle="tooltip" title="" name="medicine_name" autocomplete="off" class="form-control test" value="" placeholder="Nom du médicament" required="" data-original-title="Nom du médicament!" />
        </div>
    </div>


    <div class="form-group">
        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Nom de l'entreprise:</font></font></label>
        <div class="col-md-6">
            <input type="text" class="form-control" autocomplete="off" id="search-box" placeholder="Nom de la compagnie" data-toggle="tooltip" title="Nom de la compagnie" name="company_name" required="" />
            <input type="hidden" autocomplete="off" name="company_id" id="search-company_id" value=""/>
                <div id="suggesstion-box"></div>
                    </div>
        </div>


        <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Nom de groupe :</font></font></label>
            <div class="col-md-6">
                <input type="text" name="group_name" autocomplete="off" id="search-group" class="form-control" data-toggle="tooltip" title="Nom de groupe " placeholder="Nom de groupe" required="" />
                <input type="hidden" autocomplete="off" name="group_id" id="search-group_id" value="" />
                <div id="suggesstion-group"></div>
            </div>
        </div>

        <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Description de la médecine:</font></font></label>
            <div class="col-md-6">
                <textarea name="description" class="form-control" rows="6"></textarea>
            </div>
        </div>
    </div>

    <div class="form-group row">
        <div class="col-sm-offset-3 col-sm-6">
            <button type="reset" class="btn btn-danger"><font  ><font  >Réinitialiser</font></font></button>
            <button type="button" onclick="if (!window.__cfRLUnblockHandlers) return false; demoModeOne()" class="btn btn-success"><font  ><font  >Soumettre</font></font></button>
        </div>
    </div>
        </form>
  </div>
);

EditMedicament.propTypes = {};

EditMedicament.defaultProps = {};

export default EditMedicament;
