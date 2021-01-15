import React from 'react';
import PropTypes from 'prop-types';
import './EditPrescription.css';

const EditPrescription = () => (
    <div className="EditPrescription">
        <form className="form-horizontal" method="post" name="n_p" enctype="multipart/form-data" accept-charset="utf-8">
            <div className="col-md-12">
                <div className="panel panel-default panel-form">
                    <div className="panel-body">
                        <div className="portlet-body form">

                            <div className="portlet-title">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="portlet-title">
                                            <div className="form-group ">


                                                <div className="col-md-12">
                                                    <select className="form-control" name="venue_id" required="">
                                                        <option value="">--Sélectionnez le lieu--</option>
                                                        <option value="1"><b  ><b  >Démo Medical Collage</b></b></option><option value="3"><b  ><b  >Tour verte</b></b></option><option value="4"><b  ><b  >Tour de Manan</b></b></option>                                                        </select>

                                                </div><br /><hr />

                                                <div className="col-md-12 ">
                                                    <div id="ab"></div>
                                                </div>
                                                <div className="col-md-6 pid">
                                                    <input type="text" name="p_id" id="p_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadNameOne(this.value);" className="form-control" placeholder="ID du patient" />
                                                </div>

                                                <div className="had">
                                                    <div className="col-md-6">
                                                        <input type="text" className="form-control" placeholder="Nom du patient" name="name" required="" />
                                                    </div>
                                                    <input type="hidden" name="patient_id" required="" />

                                                    <div className="col-md-6">
                                                        <input type="text" className="form-control" placeholder="Numéro de téléphone" name="phone" required="" />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <input type="text" name="birth_date" className="form-control datepicker1 birth_date hasDatepicker" placeholder="Date de naissance" required="" id="dp1608289767518" />
                                                    </div>

                                                    <div className="col-md-6">
                                                        <input type="text" name="age" id="age" className="form-control" placeholder="Âge" />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <div className="md-radio">
                                                            <input type="radio" id="lb1" name="gender" value="Male" />
                                                            <label for="lb1"><b  ><b  > Masculin</b></b></label>

                                                            <input type="radio" id="lb2" name="gender" value="Female" />

                                                            <label for="lb2"><b  ><b  > Femme</b></b></label>



                                                        </div>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div> <hr />

                                <div className="portlet-title">
                                    <div className="form-group ">
                                        <div className="col-md-6"><input type="text" className="form-control" placeholder="CC du patient" name="Problem" /><samp></samp></div>
                                        <div className="col-md-6"><input type="text" className="form-control" placeholder="Poids du patient" name="Weight" value="" /></div>
                                        <div className="col-md-6"><input type="text" className="form-control" placeholder="PA du patient" name="Pressure" value="" /></div>
                                        <div className="col-md-6"><input type="text" className="form-control" placeholder="Température" name="temperature" value="" /></div>
                                    </div>
                                </div><hr />

                                <div className="portlet-title">
                                    <div className="form-group ">
                                        <div className="col-md-4"><input type="text" className="form-control" placeholder="L'histoire" name="history" /></div>
                                        <div className="col-md-4"><input type="text" className="form-control" placeholder="O / Ex" name="oex" /></div>
                                        <div className="col-md-4"><input type="text" className="form-control" placeholder="PD" name="pd" value="" /></div>
                                    </div>
                                </div>
                            </div>



                            <div className="portlet-title">
                                <div className="row">


                                    <div className="col-sm-12 col-md-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <td colspan="6" className="m_add_btn"><b  ><b  >Médicament </b></b><a href="javascript:void(0);" className="btn btn-primary add_button pull-right" title="Ajouter le champ"> <span className="glyphicon glyphicon-plus"></span><b  ><b  >Ajouter</b></b></a></td>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="field_wrapper">
                                                            <div className="form-group ">
                                                                <div className="col-md-6 col-md-12">
                                                                    <input type="text" className="form-control" name="type[]" placeholder="Type" />

                                                                </div>
                                                                <div className="col-md-3">
                                                                    <input type="hidden" className="mdcn_value" name="group_id[]" value="" id="search-group_id" />
                                                                    <input type="text" className="group_name form-control" name="group_name[]" id="search-group" autocomplete="off" placeholder="Nom générique" />
                                                                    <div id="suggesstion-box"></div>

                                                                </div>

                                                                <div className="col-md-6"><input type="text" className="form-control" placeholder="Mg / ml" name="mg[]" /></div>
                                                                <div className="col-md-6"><input type="text" className="form-control" placeholder="Dose" name="dose[]" /></div>
                                                                <div className="col-md-6"><input type="text" className="form-control" placeholder="journée" name="day[]" /></div>
                                                                <div className="col-md-3"><input type="text" className="form-control" placeholder="commentaires" name="comments[]" /></div>
                                                                <a href="javascript:void(0);" className=" btn btn-danger remove_button" title="Supprimer le champ"><i class="fas fa-minus"></i></a>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="6">
                                                        <div className="form-group col-md-12">
                                                            <textarea placeholder="Commentaire général" name="prescription_comment" className="form-control" rows="2"></textarea>
                                                        </div>
                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>



                                    <div className="col-sm-6 col-md-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <td colspan="6" className="t_add_btn"><b  ><b  >Tester
                                                                </b></b><a href="javascript:void(0);" className="btn btn-primary add_button1 pull-right" title="Ajouter le champ"><span className="glyphicon glyphicon-plus"></span><b  ><b  >Ajouter</b></b></a>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="field_wrapper1">
                                                            <div id="count_test1">
                                                                <div className="form-group ">
                                                                    <div className="col-md-5">
                                                                        <input type="hidden" className="test_value" name="test_name[]" value="" />
                                                                        <input placeholder="Test Name" className="test_name form-control" name="te_name[]" autocomplete="off" />
                                                                        <div id="test-box"></div>
                                                                    </div>
                                                                    <div className="col-md-5">
                                                                        <input placeholder="Description" name="test_description[]" className="form-control" />
                                                                    </div>
                                                                    <a href="javascript:void(0);" className=" btn btn-danger remove_button" title="Remove field"><i class="fas fa-minus"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div>



                                    <div className="col-sm-6 col-md-12">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <td colspan="6" className="a_btn"><b  ><b  >Conseil
                                                                </b></b><a href="javascript:void(0);" className="btn btn-primary add_advice pull-right" title="Add field"><span className="glyphicon glyphicon-plus"></span><b  ><b  >Ajouter</b></b></a>
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="field_wrapper2">
                                                            <div id="count_advice1">
                                                                <div className="form-group ">
                                                                    <div className="col-md-10">
                                                                        <input type="hidden" className="advice_value" name="advice[]" value="" />
                                                                        <input placeholder="Advice" className="advice_name form-control" name="adv[]" autocomplete="off" />
                                                                        <div id="advice-box"></div>
                                                                    </div><a href="javascript:void(0);" className=" btn btn-danger remove_button" title="Remove field"><i class="fas fa-minus"></i></a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-sm-offset-9 col-sm-6">
                                        <button type="reset" className="btn btn-danger"><b  ><b  >Réinitialiser</b></b></button>
                                        <button type="button" onclick="if (!window.__cfRLUnblockHandlers) return false; demoModeOne()" className="btn btn-success"><b  ><b  >Soumettre</b></b></button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
);

EditPrescription.propTypes = {};

EditPrescription.defaultProps = {};

export default EditPrescription;
