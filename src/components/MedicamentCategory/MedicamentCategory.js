import React, { useEffect, useRef, useState } from 'react';
import { Button, LinearProgress, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Bar } from 'react-chartjs-2';
import useForceUpdate from 'use-force-update';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [medicamentsCategories, setMedicamentsCategories] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [actionAnchorEl, setActionAnchorEl] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);

  useEffect(() => {
    LoadJSFiles();
    getAllIncomes();
  }, []);

  const getAllIncomes = () => {
    setLoading(true);

    if (CurrentUser.DEMO_MODE) {
      fetch('/demo/medicaments-categories.json')
        .then(res => res.json())
        .then(data => {
          const formatted = data.map((item, index) => ({
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
    } else {
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
    }
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

  // Replace handleEdit to open React modal
  const handleEdit = () => {
    setUpdatedItem(actionRow);
    setUpdatedItemId(actionRow.id);
    setEditModalOpen(true);
    handleActionClose();
  };

  const handleDelete = () => {
    removeMedicamentCategoryAction({ preventDefault: () => {} }, [actionRow.id]);
    handleActionClose();
  };

  const columns = [
    { field: 'name', headerName: t('medicament_category.category'), width: 150 },
    {
      field: 'description',
      headerName: t('medicament_category.description'),
      width: 250
    },
    {
      field: 'actions',
      headerName: t('medicament_category.actions'),
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
              <h4>{t('medicament_category.chart')}</h4>

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
          <i className="menu-icon fa fa-bars"></i> {t('medicament_category.title')}
        </Typography>

        <Button onClick={() => setAddModalOpen(true)}>
          <i className="fas fa-plus"></i> {t('medicament_category.create')}
        </Button>
        <Button onClick={(e) => updateMedicamentCategoryAction(e, updatedItemId)} data-toggle="modal" data-target="#editPatient">
          <i className="fas fa-edit"></i> {t('medicament_category.edit')}
        </Button>
        <Button onClick={(e) => removeMedicamentCategoryAction(e, updatedItemIds)}>
          <i className="fas fa-trash-alt"></i> {t('medicament_category.remove')}
        </Button>
        <Button onClick={getAllIncomes}>
          <i className="fas fa-refresh"></i> {t('medicament_category.reload')}
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
              <MenuItem onClick={handleEdit}>{t('medicament_category.edit')}</MenuItem>
              <MenuItem onClick={handleDelete}>{t('medicament_category.delete')}</MenuItem>
            </Menu>
          </div>
        )}

        {/* Add Modal */}
        <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('medicament_category.new')}</DialogTitle>
          <DialogContent>
            <AddMedicamentCategory closeModal={() => setAddModalOpen(false)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddModalOpen(false)} color="secondary">
              {t('medicament_category.close')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Modal (React Dialog) */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>{t('medicament_category.edit')}</DialogTitle>
          <DialogContent>
            <EditMedicamentCategory
              closeModal={() => setEditModalOpen(false)}
              medicamentCategory={updatedItem}
              onSuccess={resfreshComponent}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">
              {t('medicament_category.close')}
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    </div>
  );
};

MedicamentCategory.propTypes = {};
MedicamentCategory.defaultProps = {};

export default MedicamentCategory;
