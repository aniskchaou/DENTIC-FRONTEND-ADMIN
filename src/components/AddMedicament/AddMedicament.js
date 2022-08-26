import React, { useEffect, useState } from 'react';
import './AddMedicament.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import medicamentMessage from '../../main/messages/medicamentMessage'
import medicamentValidation from '../../main/validations/medicamentValidation'
import MedicamentTestService from '../../main/mocks/MedicamentTestService';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import medicamentManufactureHTTPService from '../../main/services/medicamentManufactureHTTPService';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';

const AddMedicament = (props) => {

    const initialState = {
        medicine_name: "",
        company_name: "",
        group_name: "",
        description: "",
    };

    const { register, handleSubmit, errors } = useForm()
    const [medicament, setMedicament] = useState(initialState);

    const onSubmit = (data) => {
        //saveMedicament(data)
        //MedicamentTestService.create(data)
        medicamentHTTPService.createMedicament(data).then(data => {
            setMedicament(initialState)
            showMessage('Confirmation', medicamentMessage.add, 'success')
            props.closeModal()
        })

    }

    const saveMedicament = (data) => {

        medicamentHTTPService.create(data)
            .then(response => {
                setMedicament(initialState)
            })
            .catch(e => {
                console.log(e);
            });

    };


    const handleInputChange = event => {
        const { name, value } = event.target;
        setMedicament({ ...medicament, [name]: value });
    };

    const [medicamentCategory, setMedicamentCategory] = useState([]);
    const [medicamentManufacture, setMedicamentManufacture] = useState([]);

    useEffect(() => {
        //LoadJSFiles()
        getAllMedicamentManufactures()
        getAllMedicamentCategories()
    }, []);


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
        <div className="AddMedicament">
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

                            <div className="error text-danger">
                                {errors.name && medicamentValidation.name}
                            </div>
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

                            <div className="error text-danger">
                                {errors.company_name && medicamentValidation.company_name}
                            </div>
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

                            <div className="error text-danger">
                                {errors.group_name && medicamentValidation.group_name}
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-md-3 control-label"><font  ><font  >Description:</font></font></label>
                        <div class="col-md-12">
                            <textarea name="description" class="form-control" rows="6"
                                onChange={handleInputChange} value={medicament.description} ref={register({ required: true })}
                            ></textarea>

                            <div className="error text-danger">
                                {errors.description && medicamentValidation.description}
                            </div>
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

AddMedicament.propTypes = {};

AddMedicament.defaultProps = {};

export default AddMedicament;
