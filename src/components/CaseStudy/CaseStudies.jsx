import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './CaseStudies.css';
import useForceUpdate from 'use-force-update';
import { LinearProgress, Tooltip, Button, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CurrentUser from '../../main/config/user';
import BASE_URL from '../../main/urls/urls';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const CaseStudies = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filteredCaseStudies, setFilteredCaseStudies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatedItem, setUpdatedItem] = useState({});
  const [updatedItemId, setUpdatedItemId] = useState(0);

  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const forceUpdate = useForceUpdate();
  const [loading, setLoading] = useState(false);

  const retrieveCaseStudies = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/casestudies`)
      .then(response => {
        setCaseStudies(response.data);
        setFilteredCaseStudies(response.data);
      })
      .finally(() => setLoading(false));
  };

  const resfresh = () => {
    retrieveCaseStudies();
    forceUpdate();
  };

  useEffect(() => {
    retrieveCaseStudies();
  }, []);

  const update = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data);
    resfresh();
  };

  const remove = (e, id) => {
    e.preventDefault();
    if (window.confirm(CurrentUser.DELETE_MSG)) {
      axios.delete(`${BASE_URL}/casestudies/${id}`).then(() => resfresh());
    }
  };

  const handleRowSelection = (e) => {
    if (e.length === 1) {
      setUpdatedItemId(e[0]);
      const selected = caseStudies.find(item => item.id === e[0]);
      setUpdatedItem(selected);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = caseStudies.filter(cs =>
      cs.title.toLowerCase().includes(query) ||
      cs.description.toLowerCase().includes(query)
    );
    setFilteredCaseStudies(filtered);
  };

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCaseStudies);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CaseStudies');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'CaseStudies.xlsx');
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientId', headerName: 'Patient ID', width: 200 },
    { field: 'doctorId', headerName: 'Doctor ID', width: 200 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 250 },
    {
      field: 'proceduresPerformed',
      headerName: 'Procedures',
      width: 200,
      renderCell: (params) => params.value.join(', ')
    },
    { field: 'outcome', headerName: 'Outcome', width: 250 },
    {
      field: 'researchFiles',
      headerName: 'Files',
      width: 200,
      renderCell: (params) => (
        <Tooltip title="View Research File">
          <Button href={params.value[0]} target="_blank" rel="noopener noreferrer" variant="contained" color="primary">
            View PDF
          </Button>
        </Tooltip>
      )
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="menu-icon fas fa-file-medical-alt"></i> Case Studies</h4>
      </div>

      <div className="card-body">
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search Case Studies"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '300px' }}
          />
          <Button onClick={exportToCSV} variant="contained" color="primary">
            Export to CSV
          </Button>
        </div>

        <Tooltip title="Create New Case Study">
          <Button type="button" variant="contained" color="success" data-toggle="modal" data-target="#addCaseStudy">
            <i className="far fa-plus-square"></i> Create
          </Button>
        </Tooltip>
        <Tooltip title="Edit Selected Case Study">
          <Button onClick={e => update(e, updatedItem)} type="button" variant="contained" color="warning" data-toggle="modal" data-target="#editCaseStudy">
            <i className="fas fa-edit"></i> Edit
          </Button>
        </Tooltip>
        <Tooltip title="Remove Selected Case Study">
          <Button onClick={e => remove(e, updatedItemId)} type="button" variant="contained" color="error">
            <i className="fas fa-trash-alt"></i> Remove
          </Button>
        </Tooltip>

        {loading ? <LinearProgress /> : (
          <div style={{ height: 430, width: '100%' }}>
            <DataGrid
              rows={filteredCaseStudies}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[6]}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Case Study Modal */}
        <div className="modal fade" id="addCaseStudy" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Case Study</h5>
                <button onClick={resfresh} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* AddCaseStudy component can be added here */}
              </div>
              <div className="modal-footer">
                <Button onClick={resfresh} ref={closeButtonAdd} type="button" variant="contained" color="secondary" data-dismiss="modal">Close</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Case Study Modal */}
        <div className="modal fade" id="editCaseStudy" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Case Study</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* EditCaseStudy component can be added here */}
              </div>
              <div className="modal-footer">
                <Button onClick={resfresh} ref={closeButtonEdit} type="button" variant="contained" color="secondary" data-dismiss="modal">Close</Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaseStudies;
