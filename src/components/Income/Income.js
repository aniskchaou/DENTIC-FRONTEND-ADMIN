
import PropTypes from 'prop-types';
import './Income.css';
import incomeHTTPService from '../../main/services/incomeHTTPService';
import React, { useEffect, useRef, useState } from 'react';
import useForceUpdate from 'use-force-update';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import patientMessage from '../../main/messages/patientMessage';
import EditIncome from '../EditIncome/EditIncome';
import AddIncome from '../AddIncome/AddIncome';
import { Button, LinearProgress, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';
import { data2 } from '../Certificates/Certificates';
import { Bar } from 'react-chartjs-2';
const Income = () => {

  const [incomes, setIncomes] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllIncomes()
  }, []);


  const getAllIncomes = () => {
    setLoading(true);
    incomeHTTPService.getAllIncome()
      .then(response => {
        setIncomes(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllIncomes()
    forceUpdate()
  }

  const removeIncomeAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      incomeHTTPService.removePatient(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateIncomeAction = (e, data) => {
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
    { field: 'id', headerName: '#', width: 200 },
    { field: 'name_income', headerName: 'Name', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 200 },
    { field: 'datee', headerName: ' Date', width: 200 },
    { field: 'note', headerName: 'Note', width: 200 }
  ];


  const handleRowSelection = (e) => {
    if (e.length == 1) {

      setUpdatedItemId(e[0])
      const selectedItem = incomes.find(item => item.id == e[0])
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

  return (<div className="card">

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
        <i className="menu-icon fa fa-bars"></i>   Incomes
      </Typography>
      <br />
      <Button type="button" data-toggle="modal" data-target="#addPayment" ><i class="fas fa-plus"></i> Create </Button>
      <Button onClick={e => updateIncomeAction(e, updatedItemId)} type="button" data-toggle="modal" data-target="#editMedicament"><i class="fas fa-edit"></i> Edit</Button>
      <Button onClick={e => removeIncomeAction(e, updatedItemIds)} type="button" ><i class="fas fa-trash-alt"></i> Remove</Button>
      <Button type="button" onClick={() => setShowFilter(!showFilter)} ><i class="fas fa-bar-chart"></i> Show/Hide Summary</Button>
      <Button type="button" onClick={() => setShowChart(!showChart)} ><i class="fas fa-pie-chart"></i> Show/Hide Analytics</Button>
      <Button type="button" onClick={() => getAllIncomes()}><i class="fas fa-refresh"></i> Reload</Button>
      <Button type="button" onClick={e => removeAll(e)} ><i class="fas fa-eraser"></i> Remove All</Button>
      <br /><br />
      {loading ?
        <LinearProgress />
        : <div style={{ height: 430, width: '100%' }}><DataGrid
          rows={incomes}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[6]}
          checkboxSelection
          onSelectionModelChange={handleRowSelection}
          components={{ Toolbar: GridToolbar }}
        /></div>}
      <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Ajouter</button>

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
  </div>)
};

Income.propTypes = {};

Income.defaultProps = {};

export default Income;
