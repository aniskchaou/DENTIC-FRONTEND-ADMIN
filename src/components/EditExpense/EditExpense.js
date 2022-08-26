import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './EditExpense.css';
import { useForm } from 'react-hook-form';
import patientHTTPService from '../../main/services/patientHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import expenseHTTPService from '../../main/services/expenseHTTPService';

const EditExpense = (props) => {
  const { register, handleSubmit, errors } = useForm() // initialise the hook
  const [expense, setExpense] = useState(props.expense);

  useEffect(() => {
    setExpense(props.expense)
  }, [props.expense]);


  const onSubmit = (data) => {
    expenseHTTPService.editExpense(props.expense.id, data)
    props.closeModal(data)
    showMessage('Confirmation', patientMessage.edit, 'success')
  }

  const handleInputChange = event => {
    const { name, value } = event.target;
    setExpense({ ...expense, [name]: value });
  };
  return (
    <div className="EditExpense">
      <form onSubmit={handleSubmit(onSubmit)} class="form-horizontal" target="_blank" name="p_info" method="post" accept-charset="utf-8">
        <div class="form-body">

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Date:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={expense?.date} ref={register({ required: true })}
                type="date" id="date" name="date" class="form-control datepicker3 hasDatepicker" autocomplete="off" required="" />

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Name:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={expense?.name} ref={register({ required: true })}
                type="text" name="name" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" />

            </div>
          </div>





          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Amount:</font></font></label>
            <div class="col-md-12">
              <input onChange={handleInputChange} value={expense?.amount} ref={register({ required: true })}
                name="amount" class="form-control" type="number" />

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><font  ><font  >Note:</font></font></label>
            <div class="col-md-12">
              <textarea onChange={handleInputChange} value={expense?.note} ref={register({ required: true })}
                name="note" class="form-control" rows="3"></textarea>

            </div>
          </div>

          <div class="form-group">
            <label class="col-md-3 control-label"><span class="text-danger"><font  ><font  >*</font></font></span><font  ><font  > Payment Mode</font></font></label>
            <div class="col-md-12">
              <select onChange={handleInputChange} value={expense?.paymenMode} ref={register({ required: true })}
                type="text" name="paymenMode" id="patient_id" onkeyup="if (!window.__cfRLUnblockHandlers) return false; loadName(this.value);" class="form-control" autocomplete="off" required="" >
                <option>Cash</option>
                <option>Credit Card</option>
              </select>


            </div>
          </div>



          <div class="form-group row">
            <div class="col-8">
              <button name="submit" type="submit" class="btn btn-primary">
                <i className="fa fa-check"></i><font><font> Save</font></font></button>

            </div>
          </div>

        </div>
      </form>
    </div>
  )
};

EditExpense.propTypes = {};

EditExpense.defaultProps = {};

export default EditExpense;
