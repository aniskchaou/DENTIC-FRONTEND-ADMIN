import React from 'react';
import PropTypes from 'prop-types';
import './SummaryWidget.css';

const SummaryWidget = () => (
  <div class="col-lg-3 col-md-6">
    <div class="card">
      <div class="card-body">
        <div class="stat-widget-four">
          <div class="stat-icon dib">
            <i class="ti-stats-up text-muted"></i>
          </div>
          <div class="stat-content">
            <div class="text-left dib">
              <div class="stat-heading">Daily Sales</div>
              <div class="stat-text">Total: $76,58,714</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

SummaryWidget.propTypes = {};

SummaryWidget.defaultProps = {};

export default SummaryWidget;
