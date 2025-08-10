import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  LinearProgress,
  Chip,
  Typography,
  Link
} from '@mui/material';
import BASE_URL from '../../main/urls/urls';

const LegalCompliance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASE_URL}/legalcompliance`)
      .then((res) => setRecords(res.data))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'patientId', headerName: 'Patient ID', width: 250 },
    { field: 'documentType', headerName: 'Document Type', width: 150 },
    {
      field: 'signedDate',
      headerName: 'Signed Date',
      width: 140,
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString()
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 140,
      valueFormatter: ({ value }) =>
        value ? new Date(value).toLocaleDateString() : 'N/A'
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          color={value === 'Signed' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    {
      field: 'documentUrl',
      headerName: 'View Document',
      width: 180,
      renderCell: ({ value }) => (
        <Link href={value} target="_blank" rel="noopener">
          View PDF
        </Link>
      )
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <h4><i className="fas fa-file-signature"></i> Legal Compliance Documents</h4>
      </div>
      <div className="card-body">
        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={records}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              checkboxSelection
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalCompliance;
