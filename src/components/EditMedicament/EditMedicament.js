import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditMedicament.css';
import { useForm } from 'react-hook-form';
import MedicamentTestService from '../../main/mocks/MedicamentTestService';
import showMessage from '../../libraries/messages/messages';
import medicamentMessage from '../../main/messages/medicamentMessage';
import medicamentValidation from '../../main/validations/medicamentValidation';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';

const EditMedicament = (props) => {

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [medicament, setMedicament] = useState(props.medicament);
    const [medicamentCategory, setMedicamentCategory] = useState([]);
    const [medicamentManufacture, setMedicamentManufacture] = useState([]);
    useEffect(() => {
        setMedicament(props.medicament)
        getAllMedicamentManufactures()
        getAllMedicamentCategories()
    }, [props.medicament]);


    const onSubmit = (data) => {

        medicamentHTTPService.editMedicament(props.medicament.id, data).then(data => {
            showMessage('Confirmation', medicamentMessage.edit, 'success')
            props.closeModal()
        })

    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setMedicament({ ...medicament, [name]: value });
    };


    const getAllMedicamentManufactures = () => {
        //setLoading(true);
        medicamentManufactureHTTPService.getAllMedicamentManufacture()
            .then(response => {
                setMedicamentManufacture(response.data);
                //setLoading(false);

            })
            .catch(e => {
                showMessage('Confirmation', e, 'info')
            });
    };

    const getAllMedicamentCategories = () => {
        //setLoading(true);
        medicamentCategoryHTTPService.getAllMedicamentCayegory()
            .then(response => {
                setMedicamentCategory(response.data);
                //setLoading(false);
            })
            .catch(e => {
                showMessage('Confirmation', e, 'info')
            });
    };


    return (
        <div className="EditMedicament">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

                <div class="form-body">

                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Name:</font></font></label>
                        <div class="col-md-12">
                            <input onChange={handleInputChange} value={medicament.name}
                                ref={register({ required: true })}
                                type="text" data-toggle="tooltip"
                                name="name" class="form-control test"
                            />


                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Manufacture :</font></font></label>
                        <div class="col-md-12">
                            <select onChange={handleInputChange} value={medicament.company_name} ref={register({ required: true })}
                                type="text" class="form-control" autocomplete="off" id="search-box"
                                placeholder="Nom de la compagnie" data-toggle="tooltip" title="Nom de la compagnie"
                                name="company_name" required="" >
                                {medicamentCategory.map(data =>
                                    <option value={data.id}>{data.name}</option>
                                )}

                            </select>

                        </div>
                    </div>


                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Category :</font></font></label>
                        <div class="col-md-12">
                            <select onChange={handleInputChange} value={medicament.group_name} ref={register({ required: true })}
                                type="text" name="group_name" autocomplete="off" id="search-group" class="form-control"
                                data-toggle="tooltip" title="Nom de groupe " required="" >
                                {medicamentManufacture.map(data =>
                                    <option value={data.id}>{data.name}</option>
                                )}
                            </select>


                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Description:</font></font></label>
                        <div class="col-md-12">
                            <textarea name="description" class="form-control" rows="6"
                                onChange={handleInputChange} value={medicament.description} ref={register({ required: true })}
                            ></textarea>


                        </div>
                    </div>
                </div>



                <div class="form-group row">
                    <div class=" col-8">
                        <button name="submit" type="submit" class="btn btn-primary">
                            <i className="fa fa-check"></i>  Save</button>

                    </div>
                </div>



            </form>
        </div>
    )
};

EditMedicament.propTypes = {};

EditMedicament.defaultProps = {};

export default EditMedicament;
