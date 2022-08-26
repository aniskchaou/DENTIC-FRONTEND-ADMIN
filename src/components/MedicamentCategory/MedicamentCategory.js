import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './MedicamentCategory.css';
import useForceUpdate from 'use-force-update';
import { LoadJSFiles } from '../init';
import showMessage from '../../libraries/messages/messages';
import medicamentCategoryHTTPService from '../../main/services/medicamentCategoryHTTPService';
import patientMessage from '../../main/messages/patientMessage';
import AddMedicamentCategory from '../AddMedicamentCategory/AddMedicamentCategory';
import EditMedicamentCategory from '../EditMedicamentCategory/EditMedicamentCategory';

const MedicamentCategory = () => {

  const [medicamentsCategories, setMedicamentsCategories] = useState([]);
  const [updatedItem, setUpdatedItem] = useState({});
  const forceUpdate = useForceUpdate();
  const closeButtonEdit = useRef(null);
  const closeButtonAdd = useRef(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    LoadJSFiles()
    getAllIncomes()
  }, []);


  const getAllIncomes = () => {
    setLoading(true);
    medicamentCategoryHTTPService.getAllMedicamentCayegory()
      .then(response => {
        setMedicamentsCategories(response.data);
        setLoading(false);
      })
      .catch(e => {
        showMessage('Confirmation', e, 'info')
      });
  };


  const resfreshComponent = () => {
    getAllIncomes()
    forceUpdate()
  }

  const removeMedicamentCategoryAction = (e, data) => {
    e.preventDefault();
    var r = window.confirm("Etes-vous sûr que vous voulez supprimer ?");
    if (r) {
      showMessage('Confirmation', patientMessage.delete, 'success')
      medicamentCategoryHTTPService.removeMedicamentCayegory(data).then(data => {
        resfreshComponent()
      }).catch(e => {
        showMessage('Confirmation', e, 'warning')
      });
    }
  }

  const updateMedicamentCategoryAction = (e, data) => {
    e.preventDefault();
    setUpdatedItem(data)
    resfreshComponent()
  }

  const closeModalEdit = (data) => {
    resfreshComponent()
    closeButtonEdit.current.click()
  }

  const closeModalAdd = (data) => {
    resfreshComponent()
    closeButtonAdd.current.click()
  }


  return (
    <div className="card">
      <div className="card-header">
        <strong className="card-title">Medicament Categories</strong>
      </div>
      <div className="card-body">
        <button data-toggle="modal" data-target="#addPayment" type="button" className="btn btn-success btn-sm">Create</button>
        <table id="example1" className="table table-striped table-bordered">
          <thead class=" text-primary">
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? "loading..." :
              medicamentsCategories.map(item =>
                <tr>
                  <td> {item.name}</td>
                  <td>

                    <button onClick={e => updateMedicamentCategoryAction(e, item)} type="button" data-toggle="modal" data-target="#editPatient" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button onClick={e => removeMedicamentCategoryAction(e, item.id)} type="button" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
                  </td>

                </tr>
              )}

          </tbody>
        </table>


        <div class="modal fade" id="addPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Nouveau</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <AddMedicamentCategory closeModal={closeModalAdd} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonAdd} class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="editPatient" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Edit</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <EditMedicamentCategory closeModal={closeModalEdit} medicamentCategory={updatedItem} />
              </div>
              <div class="modal-footer">
                <button type="button" onClick={resfreshComponent} ref={closeButtonEdit} class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>

        <div class="modal fade" id="viewPayment" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Voir</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

MedicamentCategory.propTypes = {};

MedicamentCategory.defaultProps = {};

export default MedicamentCategory;
