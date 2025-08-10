import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import useForceUpdate from 'use-force-update';

import AddConsultation from './AddConsultation';
import EditConsultation from './EditConsultation';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';

const Consultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);
  const [updatedItemIds, setUpdatedItemIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const forceUpdate = useForceUpdate();

  const retrieveConsultations = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/consultations`)
      .then(response => setConsultations(response.data))
      .finally(() => setLoading(false));
  };

  const refresh = () => {
    retrieveConsultations();
    forceUpdate();
  };

  const closeModalEdit = () => {
    refresh();
    closeButtonEdit.current.click();
  };

  const closeModalAdd = () => {
    refresh();
    closeButtonAdd.current.click();
  };

  useEffect(() => {
    retrieveConsultations();
  }, []);

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data);
    refresh();
  };

  const remove = (e, id) => {
    e.preventDefault();
    if (window.confirm(CurrentUser.DELETE_MSG)) {
      axios.delete(`${BASE_URL}/consultations/${id}`).then(() => refresh());
    }
  };

  const handleRowSelection = (e) => {
    if (e.length === 1) {
      setUpdatedItemId(e[0]);
      const selected = consultations.find(item => item.id === e[0]);
      setUpdatedItem(selected);
    }
    setUpdatedItemIds(e);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'appointmentId', headerName: 'Appointment ID', width: 220 },
    { field: 'patientId', headerName: 'Patient ID', width: 220 },
    { field: 'doctorId', headerName: 'Doctor ID', width: 220 },
    { field: 'clinicId', headerName: 'Clinic ID', width: 220 },
    {
      field: 'consultationDate',
      headerName: 'Date',
      width: 160,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { field: 'consultationType', headerName: 'Type', width: 130 },
    { field: 'reasonForVisit', headerName: 'Reason', width: 200 },
    {
      field: 'symptoms',
      headerName: 'Symptoms',
      width: 180,
      renderCell: (params) => params.value?.join(', ')
    },
    {
      field: 'diagnosis',
      headerName: 'Diagnosis',
      width: 180,
      renderCell: (params) => params.value?.diagnosisName
    },
    {
      field: 'prescribedMedications',
      headerName: 'Medications',
      width: 200,
      renderCell: (params) => params.value?.map(m => `${m.medicamentName} (${m.dosage})`).join(', ')
    },
    {
      field: 'recommendedTreatments',
      headerName: 'Treatments',
      width: 180,
      renderCell: (params) => params.value?.map(t => t.treatmentName).join(', ')
    },
    {
      field: 'labTestsOrdered',
      headerName: 'Lab Tests',
      width: 150,
      renderCell: (params) => params.value?.map(l => l.testName).join(', ')
    },
    { field: 'consultationNotes', headerName: 'Notes', width: 250 },
    { field: 'followUpRequired', headerName: 'Follow-up', width: 120 },
    {
      field: 'followUpDate',
      headerName: 'Follow-up Date',
      width: 160,
      valueFormatter: (params) => params.value ? new Date(params.value).toLocaleString() : 'N/A'
    },
    { field: 'consultationFee', headerName: 'Fee ($)', width: 100 },
    { field: 'paymentStatus', headerName: 'Payment', width: 120 },
    {
      field: 'attachments',
      headerName: 'Attachments',
      width: 150,
      renderCell: (params) => params.value?.length ? (
        <a href={params.value[0]} target="_blank" rel="noopener noreferrer">View</a>
      ) : "None"
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 160,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 160,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-stethoscope"></i> Consultations</h4>
      </div>

      <div className="card-body">
        <button type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#addConsultation">
          <i className="far fa-plus-square"></i> Create
        </button>
        <button onClick={e => update(e, updatedItem)} type="button" data-toggle="modal" data-target="#editConsultation" className="btn btn-warning btn-sm">
          <i className="fas fa-edit"></i> Edit
        </button>
        <button onClick={e => remove(e, updatedItemId)} type="button" className="btn btn-danger btn-sm">
          <i className="fas fa-trash-alt"></i> Remove
        </button>

        {loading ? <LinearProgress /> : (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={consultations}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Consultation Modal */}
        <div className="modal fade" id="addConsultation" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Consultation</h5>
                <button onClick={refresh} type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
              </div>
              <div className="modal-body">
                {/* <AddConsultation closeModal={closeModalAdd} /> */}
              </div>
              <div className="modal-footer">
                <button onClick={refresh} ref={closeButtonAdd} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Consultation Modal */}
        <div className="modal fade" id="editConsultation" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Consultation</h5>
                <button type="button" className="close" data-dismiss="modal"><span>&times;</span></button>
              </div>
              <div className="modal-body">
                {/* <EditConsultation consultation={updatedItem} closeModal={closeModalEdit} /> */}
              </div>
              <div className="modal-footer">
                <button onClick={refresh} ref={closeButtonEdit} type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Consultations;
