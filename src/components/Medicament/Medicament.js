import React from 'react';
import PropTypes from 'prop-types';
import './Medicament.css';

const Medicament = () => (
  <div className="card">
  <div className="card-header">
    <strong className="card-title">Médicaments</strong>
  </div>
  <div className="card-body">
    
    <table id="example1" className="table table-striped table-bordered">
    <thead class=" text-primary">
                        <th>Nom </th>
                        <th> Compagnie</th>
                        <th> Groupe</th>
                        <th>Description </th>
                        
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            AEZED
                          </td>
                          <td>
                            Dakota Rice
                          </td>
                          <td>
                            Niger
                          </td>
                          <td>
                            Oud-Turnhout
                          </td>
                          
                        
                        </tr>
                       
                      </tbody>
    </table>
  </div>
</div>
);

Medicament.propTypes = {};

Medicament.defaultProps = {};

export default Medicament;
