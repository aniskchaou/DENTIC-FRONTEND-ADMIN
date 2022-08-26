import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Payment.css';
import { LoadJSFiles } from './../init';
import useForceUpdate from 'use-force-update';
import paymentHTTPService from '../../main/services/paymentHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import patientHTTPService from '../../main/services/patientHTTPService';
import AddPayment from '../AddPayment/AddPayment';
import EditPayment from '../EditPayment/EditPayment';
const deleteTask = () => {
  return window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllPayments()
  }, []);

  const getAllPayments = () => {
    setLoading(true);
    paymentHTTPService.getAllPayment()
      .then(response => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllPayments()
    // forceUpdate()
  }

  const removePaymentAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      paymentHTTPService.removePayment(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updatePaymentAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfreshComponent()
  }

  const closeModalEdit = (data) => {
    resfreshComponent()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    resfreshComponent()
    closeButtonAdd.current.click()
  }


  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Payments</strong>
      </div>
      <div className="card-body">
        <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>

              <th>Invoice Number # </th>
              <th>Payment Date</th>
              <th>Payment Mode</th>
              <th>Amount received</th>
              <th>Invoice Balance Due</th>
              <th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? "loading..." :
              payments.map(item =>
                <tr>
                  <td> {item.invoiceNumber}</td>
                  <td>{item.paymentDate} </td>
                  <td>{item.paymenMode} </td>
                  <td>{item.amountReceived}</td>
                  <td>{item.invoiceBlanceDue}</td>
                  <td>
                    <button type="button" data-toggle="modal" data-target="#viewPatient" class="btn btn-primary btn-sm"><i class="fas fa-eye"></i></button>
                    <button onClick={e => updatePaymentAction(e, item)} type="button" data-toggle="modal" data-target="#editPayment" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removePaymentAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}

          </tbody>
        </table>


        <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddPayment closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" ref={closeButtonAdd} data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditPayment closeModal={closeModalEdit} payment={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Payment.propTypes = {};

Payment.defaultProps = {};

export default Payment;
