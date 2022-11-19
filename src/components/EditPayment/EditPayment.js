import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditPayment.css';
import { useForm } from 'react-hook-form';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import paymentHTTPService from '../../main/services/paymentHTTPService';
import CurrentUser from '../../main/config/user';

const EditPayment = (props) => {

  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [payment, setPayment] = useState(props.payment);

  useEffect(() => {
    setPayment(props.payment)
  }, [props.payment]);


  const onSubmit = (data) => {
    paymentHTTPService.editPayment(props.payment.id, data)
    props.closeModal(data)
    showMessage('Confirmation', CurrentUser.UPDATE_MSG, 'success')
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPayment({ ...payment, [name]: value });
  };


  return (
    <div className="EditPayment">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Invoice:</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={payment?.invoiceNumber} ref={register({ required: true })}
                type="text" id="date" name="invoiceNumber" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" >
                <option value="1">INV001</option>
              </select>

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Payment Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.paymentDate} ref={register({ required: true })}
                type="date" name="paymentDate" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" />

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


            </div>
          </div>



          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Amount received:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.amountReceived} ref={register({ required: true })}
                name="amountReceived" class="form-control" rows="3" type="text" />

            </div>
          </div>


          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Invoice Balance Due :</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={payment?.invoiceBlanceDue} ref={register({ required: true })}
                name="invoiceBlanceDue" class="form-control" rows="3" type="date" />

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
    </div>
  )
};

EditPayment.propTypes = {};

EditPayment.defaultProps = {};

export default EditPayment;
