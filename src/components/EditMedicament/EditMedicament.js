import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditMedicament.css';
import { useForm } from 'react-hook-form';
import MedicamentTestService from '../../main/mocks/MedicamentTestService';
import showMessage from '../../libraries/messages/messages';
import medicamentMessage from '../../main/messages/medicamentMessage';
import medicamentValidation from '../../main/validations/medicamentValidation';

const EditMedicament = (props) => {

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [medicament, setMedicament] = useState(props.medicament);

    useEffect(() => {
        setMedicament(props.medicament)
    }, [props.medicament]);


    const onSubmit = (data) => {

        MedicamentTestService.update(props.medicament, data)
        showMessage('Confirmation', medicamentMessage.edit, 'success')
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setMedicament({ ...medicament, [name]: value });
    };

    return (
        <div className="EditMedicament">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

                <div class="form-body">

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Nom du médicament:</font></font></label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={medicament.medicine_name}
                                ref={register({ required: true })}
                                type="text" data-toggle="tooltip"
                                name="medicine_name" class="form-control test"
                                placeholder="Nom du médicament" />

                            <div className="error text-danger">
                                {errors.medicine_name && medicamentValidation.medicine_name}
                            </div>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Nom de l'entreprise:</font></font></label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={medicament.company_name} ref={register({ required: true })}
                                type="text" class="form-control" autocomplete="off" id="search-box"
                                placeholder="Nom de la compagnie" data-toggle="tooltip" title="Nom de la compagnie"
                                name="company_name" required="" />

                            <div className="error text-danger">
                                {errors.company_name && medicamentValidation.company_name}
                            </div>
                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Nom de groupe :</font></font></label>
                        <div class="col-md-6">
                            <input onChange={handleInputChange} value={medicament.group_name} ref={register({ required: true })}
                                type="text" name="group_name" autocomplete="off" id="search-group" class="form-control"
                                data-toggle="tooltip" title="Nom de groupe " placeholder="Nom de groupe" required="" />

                            <div className="error text-danger">
                                {errors.group_name && medicamentValidation.group_name}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Description de la médecine:</font></font></label>
                        <div class="col-md-6">
                            <textarea name="description" class="form-control" rows="6"
                                onChange={handleInputChange} value={medicament.description} ref={register({ required: true })}
                            ></textarea>

                            <div className="error text-danger">
                                {errors.description && medicamentValidation.description}
                            </div>
                        </div>
                    </div>
                </div>



                <div class="form-group">
                    <div class="offset-4 col-8">
                        <button name="submit" type="submit" class="btn btn-primary">
                            <i className="fa fa-check"></i>  Sauvegarder</button>

                    </div>
                </div>



            </form>
        </div>
    )
};

EditMedicament.propTypes = {};

EditMedicament.defaultProps = {};

export default EditMedicament;
