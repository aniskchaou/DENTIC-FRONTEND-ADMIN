import React, { useState } from 'react';
import './AddPrescription.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import prescriptionMessage from '../../main/messages/prescriptionMessage'
import PrescriptionTestService from '../../main/mocks/PrescriptionTestService';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';

const AddPrescription = () => {

    const initialState = {
        post: "",
        description: "",
        start: "",
        end: "",
        location: "",
        requirement: ""
    };

    const { register, handleSubmit, errors } = useForm()
    const [prescription, setPrescription] = useState(initialState);

    const onSubmit = (data) => {
        //savePrescription(data)
        PrescriptionTestService.create(data)
        setPrescription(initialState)
        showMessage('Confirmation', prescriptionMessage.add, 'success')
    }

    const savePrescription = (data) => {

        prescriptionHTTPService.create(data)
            .then(response => {
                setPrescription(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setPrescription({ ...prescription, [name]: value });
    };


    return (
        <div classNameName="AddPrescription">
            <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal" method="post" name="n_p" enctype="multipart/form-data" accept-charset="utf-8">
                <div className="col-md-12">
                    <div className="panel panel-default panel-form">
                        <div className="panel-body">
                            <div className="portlet-body form">

                                <div className="portlet-title">
                                    <div class="form-group row">
                                        <label for="text" class="col-4 col-form-label">Nom de patient</label>
                                        <div class="col-8">
                                            <div class="input-group">
                                                <div class="input-group-prepend">
                                                    <div class="input-group-text">
                                                        <i class="fa fa-user"></i>
                                                    </div>
                                                </div>
                                                <input id="text" name="text" type="text" class="form-control" />
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="text4" class="col-4 col-form-label">Pression</label>
                                        <div class="col-8">
                                            <input id="text4" name="text4" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="text5" class="col-4 col-form-label">Température</label>
                                        <div class="col-8">
                                            <input id="text5" name="text5" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="textarea" class="col-4 col-form-label">problème</label>
                                        <div class="col-8">
                                            <textarea id="textarea" name="textarea" cols="40" rows="5" class="form-control"></textarea>
                                        </div>
                                    </div>
















                                </div>



                                <div className="portlet-title">
                                    <div className="row">


                                        <div className="col-sm-12 col-md-12">
                                            <table className="table table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <td colspan="6" className="m_add_btn">Médicament <a href="javascript:void(0);" className="btn btn-primary pull-right"
                                                            title="Ajouter le champ">
                                                            <span className="glyphicon glyphicon-plus"></span>Ajouter</a></td>
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
                                                                    <a href="javascript:void(0);" className="btn btn-danger" title="Supprimer le champ"><i class="fas fa-minus"></i></a>
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
                                                        <td colspan="6" className="t_add_btn">Tester
                                                            <a href="javascript:void(0);" className="btn btn-primary pull-right" title="Ajouter le champ"><span className="glyphicon glyphicon-plus"></span>Ajouter</a>
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

                                                                            <input placeholder="Test Name" className="test_name form-control" name="te_name[]" autocomplete="off" />
                                                                            <div id="test-box"></div>
                                                                        </div>
                                                                        <div className="col-md-5">
                                                                            <input placeholder="Description" name="test_description[]" className="form-control" />
                                                                        </div>
                                                                        <a href="javascript:void(0);" className=" btn btn-danger" title="Remove field"><i class="fas fa-minus"></i></a>
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
                                                        <td colspan="6" className="a_btn">Conseil
                                                            <a href="javascript:void(0);" className="btn btn-primary add_advice pull-right" title="Add field">
                                                                <span className="glyphicon glyphicon-plus"></span>Ajouter</a>
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

                                    <div class="form-group row">
                                        <div class="offset-4 col-8">
                                            <button name="submit" type="submit" class="btn btn-primary">
                                                <i className="fa fa-check"></i><font><font> Sauvegarder</font></font></button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};

AddPrescription.propTypes = {};

AddPrescription.defaultProps = {};

export default AddPrescription;
