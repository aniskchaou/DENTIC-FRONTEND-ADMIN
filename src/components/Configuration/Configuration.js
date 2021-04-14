import React from 'react';
import PropTypes from 'prop-types';
import './Configuration.css';
import ConfigurationContent from '../ConfigurationContent/ConfigurationContent';

const Configuration = () => (
  <div className="card">
    <div className="card-header">
      <strong className="card-title">Paramètres</strong>
    </div>
    <div className="card-body">
      <ConfigurationContent />

    </div>
  </div>

);

Configuration.propTypes = {};

Configuration.defaultProps = {};

export default Configuration;
