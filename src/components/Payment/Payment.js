import React from 'react';
import PropTypes from 'prop-types';
import './Payment.css';
const deleteTask=()=>{
  return  window.confirm("Êtes-vous sûr de vouloir supprimer cette tache ?")
}

const Payment = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Paiement</strong>
    </div>
    <div className="card-body">

      <table id="example1" className="table table-striped table-bordered">
        <thead class=" text-primary">
          <th>ID Patient </th>
          <th>ID de rendez-vous</th>
          <th> email</th>
          <th>Montant </th>
          <th>Date </th>
          <th>Remarque </th>
          <th>Actions</th>
        </thead>
        <tbody>
          <tr>
            <td>12E323</td>
            <td>32E3A3</td>
            <td>kchaouanis25@gmail.com</td>
            <td>300$</td>
            <td>22/10/2020</td>
            <td>a tester</td>
            <td><button type="button" data-toggle="modal" data-target="#viewPayment" class="btn btn-primary btn-sm"><i class="fas fa-address-book"></i></button>
              <button type="button" data-toggle="modal" data-target="#editPayment"class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
              <button type="button" class="btn btn-danger btn-sm" onClick={deleteTask}><i class="fas fa-trash-alt"></i></button></td>
          </tr>

        </tbody>
      </table>
      <button data-toggle="modal" data-target="#addPayment"  type="button" className="btn btn-success btn-sm">Ajouter</button>

      <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="editPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="viewPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

Payment.propTypes = {};

Payment.defaultProps = {};

export default Payment;
