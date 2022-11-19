import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ViewPrescription.css';
import prescriptionHTTPService from '../../main/services/prescriptionHTTPService';
import { Button } from 'bootstrap';

const ViewPrescription = (props) => {
  const [medicament, setMedicament] = useState({});
  const [medicaments, setMedicaments] = useState([]);
  useEffect(() => {
    console.log(props.updatedItem)
    prescriptionHTTPService.getPrescription(props.updatedItem).then(data => {
      console.log(data.data)
      setMedicament(data.data)
    })

    prescriptionHTTPService.getMedicamentPrescription(props.updatedItem).then(data => {
      console.log(data.data)
      setMedicaments(data.data)
    })
  }, [props.updatedItem]);

  const remove = (e, id) => {
    prescriptionHTTPService.removeMedicamentPrescription(id).then(data => {
      prescriptionHTTPService.getMedicamentPrescription(props.updatedItem).then(data => {
        console.log(data.data)
        setMedicaments(data.data)
      })
    })

  }

  return (
    <div className="ViewPrescription">
      <p>Patient :{medicament.patient}</p>
      <p>Pression : {medicament.pression}</p>
      <p>temperature :{medicament.temperature} </p>
      <p>Problem : {medicament.problem}</p>
      <p>Note : {medicament.note}</p>

      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Medicament</th>
            <th scope="col">Duration</th>
            <th scope="col">Dose</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            medicaments.map(data =>
              <tr>
                <th scope="row">{data.medicament}
                </th>
                <td>{data.duration}</td>
                <td>{data.dose}</td>
                <td> <button className="btn btn-danger" onClick={e => remove(e, data.id)} type="button" ><i class="fas fa-trash"></i> </button></td>
              </tr>
            )
          }


        </tbody>
      </table>



    </div>
  )
};

ViewPrescription.propTypes = {};

ViewPrescription.defaultProps = {};

export default ViewPrescription;
