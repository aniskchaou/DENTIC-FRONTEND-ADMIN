
import PropTypes from 'prop-types';
import './Expense.css';
import expenseHTTPService from '../../main/services/expenseHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import useForceUpdate from 'use-force-update';
import AddExpense from '../AddExpense/AddExpense';
import EditExpense from '../EditExpense/EditExpense';
import { Typography, Button, LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
import CurrentUser from '../../main/config/user';
const Expense = () => {

  const [expenses, setExpenses] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllExpenses()
  }, []);


  const getAllExpenses = () => {
    setLoading(true);
    expenseHTTPService.getAllExpense()
      .then(response => {
        setExpenses(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
  };


  const resfreshComponent = () => {
    getAllExpenses()
    //   forceUpdate()
  }

  const removeExpenseAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success')
      expenseHTTPService.removeExpense(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning')
      });
    }
  }

  const updateExpenseAction = (e, data) => {
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

  const columns = [
    { field: 'id', headerName: '#', width: 20 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 200 },
    { field: 'datee', headerName: 'Date', width: 200 },
    { field: 'note', headerName: 'Note', width: 200 },
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = expenses.find(item => item.id == e[0])
      setUpdatedItem(selectedItem)
      console.log(updatedItem);
    }
    setUpdatedItemIds(e)

  }
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const removeAll = (e) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {

      /*   certificateHTTPService.removeAllCertificates().then(data => {
          getAllPatient()
        }) */
    }
  }

  return (
    <div className="card">
      <div className="card-body">

        {
          showChart &&
          <div className="card">
            <div className="card-body">
              <h4>Chart</h4>
              <br />
              <Bar options={chartBarOption} data={data2} />
            </div>
          </div>
        }

        {showFilter &&
          <div className="row">
            <SummaryWidget />

            <SummaryWidget />

            <SummaryWidget />

            <SummaryWidget />
          </div>
        }
        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i>   Expenses
        </Typography>
        <br />
        <Button type="button" data-toggle="modal" data-target="#addPayment" ><i class="fas fa-plus"></i> Create </Button>
        <Button onClick={e => updateExpenseAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editPayment"><i class="fas fa-edit"></i> Edit</Button>
        <Button onClick={e => removeExpenseAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
        <Button type="button" onClick={() => getAllExpenses()}><i class="fas fa-refresh"></i> Reload</Button>

        <br /><br />




        {loading ?
          <LinearProgress />
          : <div style={{ height: 430, width: '100%' }}><DataGrid
            rows={expenses}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[6]}
            checkboxSelection
            onSelectionModelChange={handleRowSelection}
            components={{ Toolbar: GridToolbar }}
          /></div>}


        <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">New</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddExpense closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal">Close</button>

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
                <EditExpense expense={updatedItem} closeModal={closeModalEdit} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Close</button>

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
    </div>)
};

Expense.propTypes = {};

Expense.defaultProps = {};

export default Expense;
