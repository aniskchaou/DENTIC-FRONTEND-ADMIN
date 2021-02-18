import React, { useState } from 'react';
import './AddPatient.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import patientMessage from '../../main/messages/patientMessage'
import PatientTestService from '../../main/mocks/PatientTestService';
import HTTPService from '../../main/services/HTTPService';
import patientValidation from '../../main/validations/patientValidation'
const AddPatient = () => {
    const initialState = {
        name: '',
        patient_id: '',
        venue: '',
        phone: '',
        blood_group: '',
        address: '',
    };

    const { register, handleSubmit, errors } = useForm()
    const [patient, setPatient] = useState(initialState);

    const onSubmit = (data) => {
        //savePatient(data)
        PatientTestService.create(data)
        setPatient(initialState)
        showMessage('Confirmation', patientMessage.add, 'success')
    }

    const savePatient = (data) => {

        HTTPService.create(data)
            .then(response => {
                setPatient(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setPatient({ ...patient, [name]: value });
    };
    return (
        <div className="AddPatient">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

                <div class="form-body">
                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Nom complet </label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={patient.name} ref={register({ required: true })}
                                type="text" name="name" class="form-control" placeholder="Nom complet" />
                            <div className="error text-danger">
                                {errors.name && patientValidation.name}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Id du patient </label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={patient.patient_id} ref={register({ required: true })}
                                type="text" id="patient_id" autocomplete="off" name="patient_id"
                                class="form-control" placeholder="ID du patient" />
                            <div className="error text-danger">
                                {errors.patient_id && patientValidation.patient_id}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Adresse e-mail </label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={patient.email} ref={register({ required: true })}
                                type="text" name="email" class="form-control" placeholder="Adresse e-mail" />
                            <div className="error text-danger">
                                {errors.email && patientValidation.email}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"> * </span>  Date de naissance </label>
                        <div class="col-md-6 ">
                            <input type="date" name="birth_date" class="form-control datepicker1 birth_date hasDatepicker" placeholder="aaaa-mm-jj" id="dp1608289894893" />

                            <input disabled onChange={handleInputChange} value={patient.old} ref={register({ required: true })}
                                type="text" name="old" id="old" value="15" class="form-control" placeholder="Âge" />
                            <div className="error text-danger">
                                {errors.old && patientValidation.old}
                            </div>

                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label"> <span class="text-danger"> * </span>  Téléphone </label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={patient.phone} ref={register({ required: true })}
                                type="number" name="phone" class="form-control" required="" placeholder="Numéro de téléphone" />
                            <div className="error text-danger">
                                {errors.phone && patientValidation.phone}
                            </div>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label">  Le sexe </label>
                        <div class="col-md-6">
                            <input type="radio" id="checkbox2_5" name="gender" required="" value="Male" />
                            <label for="checkbox2_5">  Masculin </label>
                            <input type="radio" id="checkbox2_10" name="gender" required="" value="Female" />
                            <label for="checkbox2_10">  Femme </label>


                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"> Groupe sanguin  </label>
                        <div class="col-md-6">
                            <select onChange={handleInputChange} value={patient.blood_group} ref={register({ required: true })}
                                class="form-control" name="blood_group">

                                <option value="A+"> A + </option>
                                <option value="A-"> UNE- </option>
                                <option value="B+"> B + </option>
                                <option value="B-"> B- </option>
                                <option value="O+"> O + </option>
                                <option value="O-"> O- </option>
                                <option value="AB+"> AB + </option>
                                <option value="AB-"> UN B- </option>
                                <option value="Unknown"> Inconnue </option>
                            </select>
                            <div className="error text-danger">
                                {errors.blood_group && patientValidation.blood_group}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"> Adresse </label>
                        <div class="col-md-6">
                            <textarea onChange={handleInputChange} value={patient.address}
                                ref={register({ required: true })}
                                name="address" class="form-control"></textarea>
                            <div className="error text-danger">
                                {errors.address && patientValidation.address}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"> Image </label>
                        <div class="col-md-6">
                            <input type="file" name="picture" />
                        </div>
                    </div>


                    <div className="form-group row">
                        <div className="col-sm-offset-9 col-sm-6">
                            <button name="submit" type="submit" class="btn btn-primary">
                                <i className="fa fa-check"></i>  Sauvegarder</button>

                        </div>
                    </div>


                </div>








            </form>
        </div>
    )
};

AddPatient.propTypes = {};

AddPatient.defaultProps = {};

export default AddPatient;
