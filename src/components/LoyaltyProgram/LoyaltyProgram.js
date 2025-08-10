import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import BASE_URL from '../../main/urls/urls';


const Loyalty = () => {
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [selectedLoyalty, setSelectedLoyalty] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeButtonAdd = useRef(null);
  const closeButtonEdit = useRef(null);

  const fetchLoyalty = () => {
    setLoading(true);
    axios.get(`${BASE_URL}/loyalty`)
      .then(res => {
        // Parse JSON strings inside data before setting state
        const parsedData = res.data.map(item => ({
          ...item,
          earnedFrom: JSON.parse(item.earnedFrom),
          redeemedRewards: JSON.parse(item.redeemedRewards),
        }));
        setLoyaltyData(parsedData);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoyalty();
  }, []);

  const refresh = () => {
    fetchLoyalty();
  };

  const handleRowSelection = (ids) => {
    if (ids.length === 1) {
      const item = loyaltyData.find(i => i.id === ids[0]);
      setSelectedLoyalty(item);
      setSelectedId(ids[0]);
    } else {
      setSelectedLoyalty(null);
      setSelectedId(null);
    }
  };

  const handleDelete = () => {
    if (selectedId && window.confirm('Are you sure you want to delete this loyalty record?')) {
      axios.delete(`${BASE_URL}/loyalty/${selectedId}`).then(() => refresh());
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'patientId', headerName: 'Patient ID', width: 220 },
    { field: 'points', headerName: 'Total Points', width: 120 },
    {
      field: 'earnedFrom',
      headerName: 'Points Earned From',
      width: 400,
      renderCell: (params) => {
        return params.value.map((entry, index) => (
          <div key={index}>
            {entry.activity}: {entry.pointsEarned} pts ({new Date(entry.date).toLocaleDateString()})
          </div>
        ));
      }
    },
    {
      field: 'redeemedRewards',
      headerName: 'Redeemed Rewards',
      width: 400,
      renderCell: (params) => {
        return params.value.length > 0 ? (
          params.value.map((reward, idx) => (
            <div key={idx}>
              {reward.rewardName}: {reward.pointsUsed} pts ({new Date(reward.redeemedDate).toLocaleDateString()})
            </div>
          ))
        ) : (
          <span>No rewards redeemed</span>
        );
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
        <h4><i className="fas fa-gift"></i> Loyalty Points</h4>
      </div>
      <div className="card-body">
        <button
          type="button"
          className="btn btn-success btn-sm"
          data-toggle="modal"
          data-target="#addLoyaltyModal"
        >
          <i className="far fa-plus-square"></i> Add Loyalty
        </button>

        <button
          type="button"
          className="btn btn-warning btn-sm"
          data-toggle="modal"
          data-target="#editLoyaltyModal"
          disabled={!selectedLoyalty}
        >
          <i className="fas fa-edit"></i> Edit
        </button>

        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          disabled={!selectedId}
        >
          <i className="fas fa-trash-alt"></i> Remove
        </button>

        {loading ? (
          <LinearProgress />
        ) : (
          <div style={{ height: 480, width: '100%', marginTop: '10px' }}>
            <DataGrid
              rows={loyaltyData}
              getRowId={(row) => row.id}
              columns={columns}
              pageSize={5}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              components={{ Toolbar: GridToolbar }}
            />
          </div>
        )}

        {/* Add Loyalty Modal */}
        <div className="modal fade" id="addLoyaltyModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Loyalty Points</h5>
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
                {/* <AddLoyaltyForm closeModal={() => closeButtonAdd.current.click()} /> */}
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

        {/* Edit Loyalty Modal */}
        <div className="modal fade" id="editLoyaltyModal" tabIndex="-1" role="dialog" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Loyalty Points</h5>
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
                {/* <EditLoyaltyForm loyalty={selectedLoyalty} closeModal={() => closeButtonEdit.current.click()} /> */}
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

export default Loyalty;
