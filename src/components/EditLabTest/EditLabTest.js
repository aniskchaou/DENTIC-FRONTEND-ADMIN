import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditLabTest.css';
import { useForm } from 'react-hook-form';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
import testlabHTTPService from '../../main/services/testlabHTTPService';

const EditLabTest = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [testLab, setTestLab] = useState(props.testLab);
  const [patients, setPatients] = useState([]);

  useEffect(() => {

    setTestLab(props.testLab)
    console.log(props.testLab)
    //getAllPatient()
    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);
        //  setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  }, [props.testLab]);


  const onSubmit = (data) => {

    //EventTestService.update(props.event, data)
    // showMessage('Confirmation', eventMessage.edit, 'success')
    console.log(props.testLab)
    testlabHTTPService.editTestLab(props.testLab.id, data).then(data => {
      showMessage('Confirmation', 'eventMessage.edit', 'success')
      //props.closeModal()
    })
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setTestLab({ ...event, [name]: value });
  };

  return (
    <div className="EditLabTest">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" role="form" enctype="multipart/form-data" method="post" accept-charset="utf-8">

        <div class="form-body">




          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Result:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={testLab.content} ref={register({ required: true })}
                type="text" class="form-control" autocomplete="off" id="search-box"
                data-toggle="tooltip" title="Nom de la compagnie"
                name="content" required="" >
              </textarea>

            </div>
          </div>


          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={testLab.datee} ref={register({ required: true })}
                type="date" name="datee" autocomplete="off" id="search-group" class="form-control"
                data-toggle="tooltip" title="Nom de groupe " required="" />


            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Patient:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={testLab.patient} ref={register({ required: true })}
                name="patient" id="patient_id" class="form-control" autocomplete="off" required="">
                {patients.map(response =>
                  <option value={response?.id}>{response?.namepatient}</option>
                )}
              </select>


            </div>
          </div>
        </div>



        <div class="form-group row">
          <div class="offset-4">
            <button name="submit" type="submit" class="btn btn-primary">
              <i className="fa fa-check"></i>  Save</button>

          </div>
        </div>



      </form>
    </div>
  )
};

EditLabTest.propTypes = {};

EditLabTest.defaultProps = {};

export default EditLabTest;
