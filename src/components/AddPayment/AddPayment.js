import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddPayment.css';
import { useForm } from 'react-hook-form';
import patientHTTPService from '../../main/services/patientHTTPService';
import patientMessage from '../../main/messages/patientMessage';
import showMessage from '../../libraries/messages/messages';
import paymentValidation from '../../main/validations/paymentValidation';
import paymentHTTPService from '../../main/services/paymentHTTPService';

const AddPayment = (props) => {

  const initialState = {
    invoiceNumber: '',
    paymentDate: '',
    paymenMode: '',
    amountReceived: '',
    invoiceBlanceDue: ''
  };

  const { register, handleSubmit, errors } = useForm()
  const [payment, setPayment] = useState(initialState);
  const [patients, setPatients] = useState([]);
  const onSubmit = (data) => {
    paymentHTTPService.createPayment(data)
      .then(response => {
        setPayment(initialState)
        props.closeModal(data)
        showMessage('Confirmation', patientMessage.add, 'success')
      })
      .catch(e => {
        showMessage('Confirmation', e, 'warning')
      });

  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPayment({ ...payment, [name]: value });
  };

  useEffect(() => {
    //LoadJSFiles()
    getAllPatient()
  }, []);


  const getAllPatient = () => {
    // setLoading(true);
    patientHTTPService.getAllPatient()
      .then(response => {
        setPatients(response.data);
        // setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };

  return (
    <div className="AddPayment">

      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Invoice:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={payment?.invoiceNumber} ref={register({ required: true })}
                type="text" id="date" name="invoiceNumber" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" >
                <option value="1">INV001</option>
              </select>
              <div className="error text-danger">
                {errors.invoiceNumber && paymentValidation.invoiceNumber}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Payment Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.paymentDate} ref={register({ required: true })}
                type="date" name="paymentDate" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" />
              <div className="error text-danger">
                {errors.paymentDate && paymentValidation.paymentDate}
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Payment Mode</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={payment?.paymenMode} ref={register({ required: true })}
                type="text" name="paymenMode" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" >
                <option>Cash</option>
                <option>Credit Card</option>
              </select>

              <div className="error text-danger">
                {errors.paymenMode && paymentValidation.paymenMode}
              </div>
            </div>
          </div>



          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Amount received:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.amountReceived} ref={register({ required: true })}
                name="amountReceived" class="form-control" rows="3" type="text" />
              <div className="error text-danger">
                {errors.amountReceived && paymentValidation.amountReceived}
              </div>
            </div>
          </div>


          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Invoice Balance Due :</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.invoiceBlanceDue} ref={register({ required: true })}
                name="invoiceBlanceDue" class="form-control" rows="3" type="date" />
              <div className="error text-danger">
                {errors.invoiceBlanceDue && paymentValidation.InvoiceBlanceDue}
              </div>
            </div>
          </div>


          <div class="form-group row">
            <div class="col-8">
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form >
    </div >)
};

AddPayment.propTypes = {};

AddPayment.defaultProps = {};

export default AddPayment;
