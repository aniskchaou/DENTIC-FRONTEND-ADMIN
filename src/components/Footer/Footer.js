import React from 'react';
import PropTypes from 'prop-types';
import './Footer.css';
import CurrentUser from '../../main/config/user';

const Footer = ({ connected }) => (


  <footer className="site-footer" style={{ display: (connected ? 'block' : 'none') }}>
    <div className="footer-inner bg-white">
      <div className="row">
        <div className="col-sm-6">

        </div>
        <div className="col-sm-6 text-right">

        </div>
      </div>
    </div>
  </footer>
);

Footer.propTypes = {};

Footer.defaultProps = {};

export default Footer;
