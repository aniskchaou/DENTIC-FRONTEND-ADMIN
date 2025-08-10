import React, { useEffect, useRef, useState } from 'react';
import { Button, LinearProgress, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Bar } from 'react-chartjs-2';
import useForceUpdate from 'use-force-update';
import PropTypes from 'prop-types';

import './MedicamentCategory.css';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import CurrentUser from '../../main/config/user';
import patientMessage from '../../main/messages/patientMessage';

import AddMedicamentCategory from './AddMedicamentCategory';
import EditMedicamentCategory from '../EditMedicamentCategory/EditMedicamentCategory';
import SummaryWidget from '../SummaryWidget/SummaryWidget';
import { chartBarOption } from '../../main/config/chart.bar';


const MedicamentCategory = () => {
  const [medicamentsCategories, setMedicamentsCategories] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);

  useEffect(() => {
    LoadJSFiles();
    getAllIncomes();
  }, []);

  const getAllIncomes = () => {
    setLoading(true);
    medicamentCategoryHTTPService.getAllMedicamentCayegory()
      .then(response => {
        const formatted = response.data.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        }));
        setMedicamentsCategories(formatted);
        setLoading(false);
      })
      .catch(() => {
        showMessage('Error', CurrentUser.ERR_MSG, 'warning');
        setLoading(false);
      });
  };

  const resfreshComponent = () => {
    getAllIncomes();
    forceUpdate();
  };

  const removeMedicamentCategoryAction = (e, data) => {
    e.preventDefault();
    if (window.confirm("Etes-vous sûr que vous voulez supprimer ?")) {
      showMessage('Confirmation', CurrentUser.REMOVE_MSG, 'success');
      medicamentCategoryHTTPService.removeMedicamentCayegory(data)
        .then(() => resfreshComponent())
        .catch(() => showMessage('Error', CurrentUser.ERR_MSG, 'warning'));
    }
  };

  const updateMedicamentCategoryAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data);
    resfreshComponent();
  };

  const closeModalEdit = () => {
    resfreshComponent();
    closeButtonEdit.current.click();
  };

  const closeModalAdd = () => {
    resfreshComponent();
    closeButtonAdd.current.click();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      setUpdatedItemId(ids[0]);
      const selectedItem = medicamentsCategories.find(item => item.id === ids[0]);
      setUpdatedItem(selectedItem);
    }
    setUpdatedItemIds(ids);
  };

  const handleActionClick = (event, row) => {
    setActionAnchorEl(event.currentTarget);
    setActionRow(row);
  };

  const handleActionClose = () => {
    setActionAnchorEl(null);
    setActionRow(null);
  };

  const handleEdit = () => {
    setUpdatedItem(actionRow);
    setUpdatedItemId(actionRow.id);
    document.querySelector('[data-target="#editPatient"]').click();
    handleActionClose();
  };

  const handleDelete = () => {
    removeMedicamentCategoryAction({ preventDefault: () => {} }, [actionRow.id]);
    handleActionClose();
  };

  const columns = [
    { field: 'id', headerName: '#', width: 70 },
    { field: 'name', headerName: 'Category', width: 150 },
    {
      field: 'description',
      headerName: 'Description',
      width: 250
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
            aria-controls="action-menu"
            aria-haspopup="true"
            onClick={(event) => handleActionClick(event, params.row)}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
        </>
      ),
    }
  ];

  return (
    <div className="card">
      <div className="card-body">
        {showChart && (
          <div className="card">
            <div className="card-body">
              <h4>Chart</h4>

            </div>
          </div>
        )}

        {showFilter && (
          <div className="row">
            <SummaryWidget />
            <SummaryWidget />
            <SummaryWidget />
            <SummaryWidget />
          </div>
        )}

        <Typography variant="h4" gutterBottom>
          <i className="menu-icon fa fa-bars"></i> Medicaments Categories
        </Typography>

        <Button data-toggle="modal" data-target="#addPayment">
          <i className="fas fa-plus"></i> Create
        </Button>
        <Button onClick={(e) => updateMedicamentCategoryAction(e, updatedItemId)} data-toggle="modal" data-target="#editPatient">
          <i className="fas fa-edit"></i> Edit
        </Button>
        <Button onClick={(e) => removeMedicamentCategoryAction(e, updatedItemIds)}>
          <i className="fas fa-trash-alt"></i> Remove
        </Button>
        <Button onClick={getAllIncomes}>
          <i className="fas fa-refresh"></i> Reload
        </Button>

        <br /><br />
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={medicamentsCategories}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
            <Menu
              id="action-menu"
              anchorEl={actionAnchorEl}
              open={Boolean(actionAnchorEl)}
              onClose={handleActionClose}
            >
              <MenuItem onClick={handleEdit}>Edit</MenuItem>
              <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
          </div>
        )}

        {/* Add Modal */}
        <div className="modal fade" id="addPayment" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nouveau</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddMedicamentCategory closeModal={closeModalAdd} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonAdd} className="btn btn-secondary" data-dismiss="modal">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <div className="modal fade" id="editPatient" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <EditMedicamentCategory closeModal={closeModalEdit} medicamentCategory={updatedItem} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonEdit} className="btn btn-secondary" data-dismiss="modal">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

MedicamentCategory.propTypes = {};
MedicamentCategory.defaultProps = {};

export default MedicamentCategory;
