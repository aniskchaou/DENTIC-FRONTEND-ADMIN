import React, { useEffect, useState } from 'react';
import './AddPrescription.css';
import { useForm } from 'react-hook-form';
import showMessage from '../../libraries/messages/messages'
import prescriptionMessage from '../../main/messages/prescriptionMessage'
import PrescriptionTestService from '../../main/mocks/PrescriptionTestService';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import patientHTTPService from '../../main/services/patientHTTPService';
import CurrentUser from '../../main/config/user';

const AddPrescription = (props) => {

    const initialState = {
        patient: "",
        pression: "",
        temperature: "",
        problem: "",
        note: ""
    };

    const { register, handleSubmit, errors } = useForm()
    const [prescription, setPrescription] = useState(initialState);
    const [patients, setPatients] = useState([]);
    const getAllPatient = () => {
        // setLoading(true);
        patientHTTPService.getAllPatient()
            .then(response => {
                setPatients(response.data);
                // setLoading(false);

            })
            .catch(e => {
                showMessage('Error', CurrentUser.ERR_MSG, 'warning')
            });
    };

    useEffect(() => {
        //LoadJSFiles()
        getAllPatient()
    }, []);
    const onSubmit = (data) => {
        //savePrescription(data)
        // PrescriptionTestService.create(data)
        prescriptionHTTPService.createPrescription(data)
            .then(response => {
                setPrescription(initialState)
                props.closeModal(data)
                showMessage('Confirmation', CurrentUser.CREATE_MSG, 'success')
            })
            .catch(e => {
                console.log(e);
            });
        setPrescription(initialState)

    }

    /*  const savePrescription = (data) => {
 
         prescriptionHTTPService.create(data)
             .then(response => {
                 setPrescription(initialState)
             })
             .catch(e => {
                 console.log(e);
             });
 
     }; */


    const handleInputChange = event => {
        const { name, value } = event.target;
        setPrescription({ ...prescription, [name]: value });
    };


    return (
        <div className="AddPrescription">
            <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal" method="post" name="n_p" enctype="multipart/form-data" accept-charset="utf-8">
                <div className="col-md-12">
                    <div className="panel panel-default panel-form">
                        <div className="panel-body">
                            <div className="portlet-body form">

                                <div className="portlet-title">
                                    <div class="form-group row">
                                        <label for="text" class="col-4 col-form-label">Patient</label>
                                        <div class="col-8">
                                            <div class="input-group">
                                                <select onChange={handleInputChange} value={prescription?.patient} ref={register({ required: true })}
                                                    type="text" id="date" name="patient" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" >
                                                    {patients.map(response =>
                                                        <option value={response?.namepatient}>{response?.namepatient}</option>
                                                    )}

                                                </select>


                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="text4" class="col-4 col-form-label">Pression</label>
                                        <div class="col-8">
                                            <input value={prescription.pression} onChange={handleInputChange} ref={register({ required: true })} id="text4" name="pression" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="text5" class="col-4 col-form-label">Temperature</label>
                                        <div class="col-8">
                                            <input value={prescription.temperature} onChange={handleInputChange} ref={register({ required: true })} id="text5" name="temperature" type="text" class="form-control" />
                                        </div>
                                    </div>
                                    <div class="form-group row">
                                        <label for="textarea" class="col-4 col-form-label">Problem</label>
                                        <div class="col-8">
                                            <textarea value={prescription.problem} onChange={handleInputChange} ref={register({ required: true })} id="textarea" name="problem" cols="40" rows="5" class="form-control"></textarea>
                                        </div>
                                    </div>

                                    <div class="form-group row">
                                        <label for="textarea" class="col-4 col-form-label">Note</label>
                                        <div class="col-8">
                                            <textarea value={prescription.note} onChange={handleInputChange} ref={register({ required: true })} id="textarea" name="note" cols="40" rows="5" class="form-control"></textarea>
                                        </div>
                                    </div>

                                </div>

                                <div class="form-group row">
                                    <div class="offset-4 col-8">
                                        <button name="submit" type="submit" class="btn btn-primary">
                                            <i className="fa fa-check"></i><font><font> Save</font></font></button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form >
        </div >
    )
};

AddPrescription.propTypes = {};

AddPrescription.defaultProps = {};

export default AddPrescription;
