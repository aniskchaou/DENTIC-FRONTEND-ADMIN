import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ServicePage.css';
import EditServicePage from '../EditServicePage/EditServicePage'
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import { Button, Typography } from '@mui/material';
const ServicePage = () => {
  const [frontOffice, setFrontOffice] = useState({});

  useEffect(() => {
    retrieveEvents()
  }, []);


  const retrieveEvents = () => {
    frontOfficeHTTPService.getServicePage()
      .then(response => {

        setFrontOffice(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const update = (e, data) => {
    e.preventDefault();
    setFrontOffice(data)
    //resfreshComponent()
  }


  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">

            <div className="card-body">
              <Typography variant="h4" gutterBottom>
                <i className="menu-icon fa fa-bars"></i>   Service
              </Typography>
              <div className="table-responsive">

                <Button onClick={e => update(e, frontOffice)} type="button" data-toggle="modal" data-target="#editFrontOffice" ><i class="fas fa-edit"></i> Edit </Button>
                <Button type="button" data-toggle="modal" data-target="#preview" ><i class="fas fa-eye"></i> Preview </Button>


                <ul class="list-group list-group-flush">
                  <li class="list-group-item"> Title : {frontOffice?.title}</li>
                  <li class="list-group-item">Sub Title : {frontOffice?.subtitle} </li>

                </ul>
              </div>
            </div>
            <div class="modal fade" id="editFrontOffice" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <EditServicePage frontOffice={frontOffice} />
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                  </div>
                </div>
              </div>
            </div>

            <div class="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLongTitle">Preview</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <iframe src="https://dentic-client.herokuapp.com/services" height="420" width="750" title="Iframe Example"></iframe>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>

                  </div>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  )
};

ServicePage.propTypes = {};

ServicePage.defaultProps = {};

export default ServicePage;
