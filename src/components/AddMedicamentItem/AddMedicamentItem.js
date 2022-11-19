import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import medicamentHTTPService from '../../main/services/medicamentHTTPService';
import showMessage from '../../libraries/messages/messages';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import CurrentUser from '../../main/config/user';


const AddMedicamentItem = (props) => {

    const initialState = {
        medicament: "",
        dose: "",
        duration: "",
    };

    const { register, handleSubmit, errors } = useForm() // initialise the hook
    const [medicament, setMedicament] = useState({});
    useEffect(() => {
        console.log('kjbkblk')
        console.log(props.updatedItem)

    }, [props.updatedItem]);

    const onSubmit = (data) => {
        //savePrescription(data)
        // PrescriptionTestService.create(data)
        prescriptionHTTPService.createMedicamentPrescription(data)
            .then(response => {
                setMedicament(initialState)
            })
            .catch(e => {
                console.log(e);
            });
        setMedicament(initialState)
        showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success')
    }

    /*  const savePrescription = (data) => {
     
         medicamentHTTPService.create(data)
             .then(response => {
                 setPrescription(initialState)
             })
             .catch(e => {
                 console.log(e);
             });
     
     }; */


    const handleInputChange = event => {
        const { name, value } = event.target;
        setMedicament({ ...medicament, [name]: value });
    }


    return (
        <div className="card">
            <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal">

                <input value={props.updatedItem} onChange={handleInputChange} ref={register({ required: false })} id="appendedtext" name="prescription" class="form-control" placeholder="placeholder" type="hidden" />
                <div class="form-group">
                    <label class="col-md-4 control-label" for="Medicament">Medicament</label>
                    <div class="col-md-5">
                        <select value={medicament.medicament} onChange={handleInputChange} ref={register({ required: true })} id="Medicament" name="medicament" class="form-control">
                            <option value="1">Option one</option>
                            <option value="2">Option two</option>
                        </select>
                    </div>
                </div>


                <div class="form-group">
                    <label class="col-md-4 control-label" for="appendedtext">Dose</label>
                    <div class="col-md-5">
                        <div class="input-group">
                            <input value={medicament.dose} onChange={handleInputChange} ref={register({ required: true })} id="appendedtext" name="dose" class="form-control" placeholder="placeholder" type="text" />
                            <span class="input-group-addon">Mg/ml</span>
                        </div>

                    </div>
                </div>



                <div class="form-group">
                    <label class="col-md-4 control-label" for="appendedtext">Duration</label>
                    <div class="col-md-5">
                        <div class="input-group">
                            <input value={medicament.duration} onChange={handleInputChange} ref={register({ required: true })} id="appendedtext" name="duration" class="form-control" placeholder="placeholder" type="text" />
                            <span class="input-group-addon">Days</span>
                        </div>

                    </div>
                </div>

                <div class="form-group">
                    <label class="col-md-4 control-label" for="singlebutton"></label>
                    <div class="col-md-4">
                        <button id="singlebutton" name="singlebutton" class="btn btn-primary">Add Item</button>
                    </div>
                </div>


            </form>

        </div>
    )
};

AddMedicamentItem.propTypes = {};

AddMedicamentItem.defaultProps = {};

export default AddMedicamentItem;
