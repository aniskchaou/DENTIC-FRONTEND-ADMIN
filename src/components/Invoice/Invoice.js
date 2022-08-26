import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Invoice.css';
import useForceUpdate from 'use-force-update';
import { LoadJSFiles } from '../init';
import invoiceHTTPService from '../../main/services/invoiceHTTPService';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import AddInvoice from '../AddInvoice/AddInvoice';

const Invoice = () => {

  const [invoices, setInvoices] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllInvoices()
  }, []);


  const getAllInvoices = () => {
    setLoading(true);
    invoiceHTTPService.getAllInvoice()
      .then(response => {
        setInvoices(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllInvoices()
    forceUpdate()
  }

  const removeInvoiceAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      invoiceHTTPService.removeInvoice(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateInvoiceAction = (e, data) => {
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
        <strong className="card-title">Invoices</strong>
      </div>
      <div className="card-body">
        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">

            <tr>
              <th>Invoice</th>
              <th>Amount</th>
              <th> Tax</th>
              <th>Date </th>
              <th>Customer</th>

              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? "loading..." :
              invoices.map(item =>
                <tr>
                  <td>INV002</td>
                  <td>1000$</td>
                  <td>110$</td>
                  <td>11/11/2022</td>
                  <td> {item.client}</td>
                  <td>UNPAID</td>
                  <td>
                    <button type="button" data-toggle="modal" data-target="#viewPatient" class="btn btn-warning btn-sm"><i class="fas fa-eye"></i></button>
                    <button onClick={e => updateInvoiceAction(e, item)} type="button" data-toggle="modal" data-target="#editPatient" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i>view</button>
                    <button onClick={e => removeInvoiceAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}

          </tbody>
        </table>
        <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Ajouter</button>
        <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Batch payment</button>
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
                <AddInvoice />
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

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
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

Invoice.propTypes = {};

Invoice.defaultProps = {};

export default Invoice;
