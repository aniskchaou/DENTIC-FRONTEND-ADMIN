import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './HomePage.css';
import EditHomePage from '../EditHomePage/EditHomePage'
import frontOfficeHTTPService from '../../main/services/frontOfficeHTTPService';
import axios from 'axios';
import BASE_URL from '../../main/urls/urls';
import { Button, Typography, Paper, Divider } from '@mui/material';

const HomePage = () => {
  const [frontOffice, setFrontOffice] = useState({});
  const [aboutUs, setAboutUs] = useState(null);

  useEffect(() => {
    retrieveEvents();
    fetchAboutUs();
  }, []);

  const retrieveEvents = () => {
    frontOfficeHTTPService.getHomePage()
      .then(response => {
        setFrontOffice(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const fetchAboutUs = async () => {
    try {
      const res = await axios.get(BASE_URL + '/aboutus');
      setAboutUs(res.data.aboutUs);
    } catch (e) {
      setAboutUs(null);
    }
  };

  const update = (e, data) => {
    e.preventDefault();
    setFrontOffice(data)
    //resfreshComponent()
  }

  const handleContactScroll = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookVisit = () => {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
    // Or open a booking modal if you have one:
    // setBookingModalOpen(true);
  };

  return (
    <div className="FrontOffice">
      <div className="row">
        <div className="col-md-12">
          <div className="card">

            <div className="card-body">
              <Typography variant="h4" gutterBottom>
                <i className="menu-icon fa fa-bars"></i>   HomePage
              </Typography>
              <div className="table-responsive">


                <Button onClick={e => update(e, frontOffice)} type="button" data-toggle="modal" data-target="#editFrontOffice" ><i className="fas fa-edit"></i> Edit </Button>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Sub Title : {frontOffice?.title1}</li>
                  <li className="list-group-item">Main Title : {frontOffice?.title2} </li>
                  <li className="list-group-item">Description : {frontOffice?.title3} </li>
                </ul>

                <Divider sx={{ my: 3 }} />

                <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
                  <Typography variant="h5" gutterBottom color="primary">
                    About Us
                  </Typography>
                  {aboutUs ? (
                    <>
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        {aboutUs.description}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                        Highlights:
                      </Typography>
                      <ul>
                        {aboutUs.highlights && aboutUs.highlights.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Typography color="error">Failed to load About Us.</Typography>
                  )}
                </Paper>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleContactScroll}
                  sx={{ mr: 2, fontWeight: 600 }}
                >
                  Contact Us
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleBookVisit}
                  sx={{ fontWeight: 600 }}
                >
                  Book Visit
                </Button>
              </div>
            </div>
            <div className="modal fade" id="editFrontOffice" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Edit</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <EditHomePage frontOffice={frontOffice} />
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

                  </div>
                </div>
              </div>
            </div>


            <div className="modal fade" id="preview" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Preview</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <iframe src="https://dentic-client.herokuapp.com/" height="420" width="750" title="Iframe Example"></iframe>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>

                  </div>
                </div>
              </div>
            </div>





          </div>

        </div>
      </div>
    </div >
  )
}

HomePage.propTypes = {};

HomePage.defaultProps = {};

export default HomePage;
