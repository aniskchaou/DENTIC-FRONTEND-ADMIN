import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ContactPage.css';
import EditContactPage from '../EditContactPage/EditContactPage'
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import { Button, Typography } from '@mui/material';
const ContactPage = () => {
  const [frontOffice, setFrontOffice] = useState({});

  useEffect(() => {
    retrieveEvents()
  }, []);


  const retrieveEvents = () => {
    frontOfficeHTTPService.getContactPage()
      .then(response => {

        setFrontOffice(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };


  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">

            <div className="card-body">
              <Typography variant="h4" gutterBottom>
                <i className="menu-icon fa fa-bars"></i>   Contact
              </Typography>
              <div className="table-responsive">

                <Button type="button" data-toggle="modal" data-target="#editFrontOffice" ><i class="fas fa-edit"></i> Edit </Button>
                <Button type="button" data-toggle="modal" data-target="#preview" ><i class="fas fa-eye"></i> Preview </Button>



                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Email Label: {frontOffice?.email}</li>
                  <li class="list-group-item">Subject Label: {frontOffice?.subject} </li>
                  <li class="list-group-item">Message Label: {frontOffice?.message} </li>
                  <li class="list-group-item">Button Label :  {frontOffice?.sendButton} Title </li>
                  <li class="list-group-item">Name Label : {frontOffice?.name}  </li>


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
                    <EditContactPage frontOffice={frontOffice} />
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
                    <iframe src="https://dentic-client.herokuapp.com/contact" height="420" width="750" title="Iframe Example"></iframe>
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

ContactPage.propTypes = {};

ContactPage.defaultProps = {};

export default ContactPage;
