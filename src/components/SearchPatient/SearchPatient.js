import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect } from 'react';
import { useState } from 'react';
import patientHTTPService from '../../main/services/patientHTTPService';

const SearchPatient = (props) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        searchProject(props.match.params.input)
    }, []);
    const columns = [
        {
            field: 'id', headerName: '#', description: 'The identification used by the person with access to the online service.', width: 20
        },
        { field: 'namepatient', headerName: 'Full Name', width: 200 },
        { field: 'emailpatient', headerName: 'Email', width: 200 },
        { field: 'birth', headerName: 'Date of Birth', width: 200 },
        { field: 'telephone', headerName: 'Telephone', width: 200 },
        { field: 'address', headerName: 'Address', width: 200 },
    ];


    const searchProject = (title) => {
        setLoading(true)
        patientHTTPService.searchPatient(title).then(data => {
            console.log(data.data)
            setProjects(data.data);
            setLoading(false)
        })
    }
    return (
        <div className="card">

            <div className="card-header">
                <h4><i class="menu-icon fa fa-search"></i> Search Results</h4>
            </div>
            <div className="card-body">
                {loading ?
                    <LinearProgress />
                    : <div style={{ height: 430, width: '100%' }}><DataGrid
                        rows={projects}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[6]}
                        checkboxSelection

                        components={{ Toolbar: GridToolbar }}
                    /></div>}


            </div>
        </div >
    )
};

SearchPatient.propTypes = {};

SearchPatient.defaultProps = {};

export default SearchPatient;