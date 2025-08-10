import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const BASE_URL = 'https://your-api-url.com'; // replace with your API base URL

const Marketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeButtonAdd = useRef(null);
  const closeButtonEdit = useRef(null);

  const fetchCampaigns = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/marketing`)
      .then(res => setCampaigns(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const refresh = () => {
    fetchCampaigns();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const campaign = campaigns.find(c => c.id === ids[0]);
      setSelectedCampaign(campaign);
      setSelectedCampaignId(ids[0]);
    } else {
      setSelectedCampaign(null);
      setSelectedCampaignId(null);
    }
  };

  const handleDelete = () => {
    if (selectedCampaignId && window.confirm('Are you sure you want to delete this campaign?')) {
      axios.delete(`${BASE_URL}/marketing/${selectedCampaignId}`)
        .then(() => refresh());
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'campaignName', headerName: 'Campaign Name', width: 200 },
    { field: 'campaignType', headerName: 'Type', width: 130 },
    {
      field: 'targetAudience',
      headerName: 'Target Audience',
      width: 300,
      renderCell: (params) => {
        const ta = params.value || {};
        return `Age: ${ta.ageGroup || '-'}, Last Visit: ${ta.lastVisitDate || '-'}, Treatment: ${ta.treatmentHistory || '-'}`;
      }
    },
    { field: 'messageTemplate', headerName: 'Message', width: 250 },
    {
      field: 'scheduleDate',
      headerName: 'Scheduled Date',
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    { field: 'status', headerName: 'Status', width: 130 },
    {
      field: 'performanceMetrics',
      headerName: 'Performance',
      width: 300,
      renderCell: (params) => {
        const metrics = params.value || {};
        return `Open Rate: ${metrics.openRate ?? '-'}, Click-Through: ${metrics.clickThroughRate ?? '-'}, Conversion: ${metrics.conversionRate ?? '-'}`;
      }
    },
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
        <h4><i className="fas fa-bullhorn"></i> Marketing Campaigns</h4>
      </div>

      <div className="card-body">
        <button
          type="button"
          className="btn btn-success btn-sm"
          data-toggle="modal"
          data-target="#addCampaignModal"
        >
          <i className="far fa-plus-square"></i> Create Campaign
        </button>

        <button
          type="button"
          className="btn btn-warning btn-sm"
          data-toggle="modal"
          data-target="#editCampaignModal"
          disabled={!selectedCampaign}
        >
          <i className="fas fa-edit"></i> Edit
        </button>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={!selectedCampaignId}
        >
          <i className="fas fa-trash-alt"></i> Delete
        </button>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 480, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={campaigns}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Campaign Modal */}
        <div className="modal fade" id="addCampaignModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Campaign</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* AddMarketingForm component here */}
                {/* <AddMarketingForm closeModal={() => closeButtonAdd.current.click()} /> */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Campaign Modal */}
        <div className="modal fade" id="editCampaignModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Campaign</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {/* EditMarketingForm component here */}
                {/* <EditMarketingForm campaign={selectedCampaign} closeModal={() => closeButtonEdit.current.click()} /> */}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonEdit}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Marketing;
