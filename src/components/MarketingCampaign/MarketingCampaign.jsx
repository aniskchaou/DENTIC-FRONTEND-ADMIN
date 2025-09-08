import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Chip, Button, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BASE_URL from '../../main/urls/urls';
import AddMarketingForm from './AddMarketingForm';
import { useTranslation } from 'react-i18next';

const parseCampaignRow = (row) => ({
  ...row,
  targetAudience: {
    ageGroup: row.ageGroup ?? false,
    lastVisitDate: row.lastVisitDate ?? false,
    treatmentHistory: row.treatmentHistory ?? false
  },
  performanceMetrics: row.performanceMetrics
    ? typeof row.performanceMetrics === "string"
      ? JSON.parse(row.performanceMetrics)
      : row.performanceMetrics
    : {}
});

const Marketing = () => {
  const { t } = useTranslation();

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeButtonAdd = useRef(null);
  const closeButtonEdit = useRef(null);

  const fetchCampaigns = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/marketing`)
      .then(res => {
        const parsed = Array.isArray(res.data)
          ? res.data.map(parseCampaignRow)
          : [];
        setCampaigns(parsed);
      })
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
    if (selectedCampaignId && window.confirm(t('marketing.confirm_delete'))) {
      axios.delete(`${BASE_URL}/marketing/${selectedCampaignId}`)
        .then(() => refresh());
    }
  };

  const columns = [
    { field: 'campaignName', headerName: t('marketing.campaign_name'), width: 200 },
    { field: 'campaignType', headerName: t('marketing.type'), width: 130 },
    {
      field: 'targetAudience',
      headerName: t('marketing.target_audience'),
      width: 300,
      renderCell: (params) => {
        const ta = params.value || {};
        return `${t('marketing.age')}: ${ta.ageGroup || '-'}, ${t('marketing.treatment')}: ${ta.treatmentHistory || '-'}`;
      }
    },
    { field: 'messageTemplate', headerName: t('marketing.message'), width: 250 },
    {
      field: 'scheduleDate',
      headerName: t('marketing.scheduled_date'),
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString()
    },
    {
      field: 'status',
      headerName: t('marketing.status'),
      width: 130,
      renderCell: (params) => {
        const value = params.value;
        let color = "default";
        let label = value;
        if (value === "Scheduled") { color = "info"; label = t('marketing.scheduled'); }
        else if (value === "Active") { color = "success"; label = t('marketing.active'); }
        else if (value === "Completed") { color = "primary"; label = t('marketing.completed'); }
        else if (value === "Draft") { color = "warning"; label = t('marketing.draft'); }
        else if (value === "Cancelled") { color = "error"; label = t('marketing.cancelled'); }
        return <Chip label={label} color={color} size="small" />;
      }
    }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <Typography variant="h4" fontWeight={700} color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <i className="fas fa-bullhorn" style={{ marginRight: 10 }} />
          {t('marketing.campaigns')}
        </Typography>
      </div>

      <div className="card-body">
        <Button
          variant="outlined"
          color="success"
          size="small"
          data-toggle="modal"
          data-target="#addCampaignModal"
          startIcon={<i className="far fa-plus-square"></i>}
          sx={{ mr: 1 }}
        >
          {t('marketing.create')}
        </Button>

        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDelete}
          disabled={!selectedCampaignId}
          startIcon={<i className="fas fa-trash-alt"></i>}
          sx={{ mr: 1 }}
        >
          {t('marketing.delete')}
        </Button>

        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={refresh}
          startIcon={<i className="fas fa-sync-alt"></i>}
        >
          {t('marketing.refresh')}
        </Button>

        {loading ? (
          <LinearProgress sx={{ mt: 2 }} />
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
                <h5 className="modal-title">{t('marketing.create_new_campaign')}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label={t('marketing.close')}
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <AddMarketingForm closeModal={() => closeButtonAdd.current.click()} />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={refresh}
                  ref={closeButtonAdd}
                >
                  {t('marketing.close')}
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
                <h5 className="modal-title">{t('marketing.edit_campaign')}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label={t('marketing.close')}
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
                  {t('marketing.close')}
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
