import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AddCertificate.css';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import certificateValidation from '../../main/validations/certificateValidation';
import patientHTTPService from '../../main/services/patientHTTPService';
import certificateHTTPService from '../../main/services/certificateHTTPService';
import certificationtemplatetHTTPServiceCopy from '../../main/services/certificationtemplatetHTTPService copy';
import showMessage from '../../libraries/messages/messages';

const AddCertificate = (props) => {
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm();
  const [certificate, setCertificate] = useState();
  const [patients, setPatients] = useState([]);
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [certificateContent, setCertificateContentValue] = useState([]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCertificate({ ...certificate, [name]: value });
  };

  useEffect(() => {
    getAllPatients();
    getAllTemplates();
  }, []);

  const getAllTemplates = () => {
    certificationtemplatetHTTPServiceCopy.getAllCertificationTemplate()
      .then(response => {
        setCertificateTemplates(response.data);
      })
      .catch(e => {
        showMessage(t('certificate.confirmation'), e, 'info');
      });
  };

  const getAllPatients = () => {
    patientHTTPService.getAllPatients()
      .then(response => {
        setPatients(response.data);
      })
      .catch(e => {
        // showMessage(t('certificate.confirmation'), e, 'info');
      });
  };

  const onSubmit = (data) => {
    certificateHTTPService.createCertificate(data).then(data => {
      setCertificate(initialState);
      props.closeModal();
    });
  };

  const setCertificateContent = () => {
    certificationtemplatetHTTPServiceCopy.setCertificateContentValue(certificate?.template);
  };

  const initialState = {
    date: '',
    patient: '',
    content: '',
    template: ''
  };

  return (
    <div className="AddCertificate">
      <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal" target="_blank" name="p_info" method="post" acceptCharset="utf-8">
        <div className="form-body">

          <div className="form-group">
            <label className="col-md-3 control-label">
              <span className="text-danger">*</span>
              {t('certificate.date')}
            </label>
            <div className="col-md-12">
              <input
                onChange={handleInputChange}
                value={certificate?.date}
                ref={register({ required: true })}
                type="date"
                id="date"
                name="date"
                className="form-control datepicker3 hasDatepicker"
                autoComplete="off"
                required
              />
              <div className="error text-danger">
                {errors.date && certificateValidation.date}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="col-md-3 control-label">{t('certificate.patient')}</label>
            <div className="col-md-12">
              <select
                onChange={handleInputChange}
                value={certificate?.patient}
                ref={register({ required: true })}
                name="patient"
                id="patient_id"
                className="form-control"
                autoComplete="off"
                required
              >
                {patients.map(response =>
                  <option key={response?.id} value={response?.id}>{response?.namepatient}</option>
                )}
              </select>
              <div className="error text-danger">
                {errors.patient && certificateValidation.patient}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="col-md-3 control-label">{t('certificate.template')}</label>
            <div className="col-md-12">
              <select
                onChange={handleInputChange}
                onClick={setCertificateContent}
                value={certificate?.template}
                ref={register({ required: true })}
                name="template"
                className="form-control"
                rows="3"
              >
                {certificateTemplates.map(data =>
                  <option key={data.id} value={data.id}>{data.name}</option>
                )}
              </select>
              <div className="error text-danger">
                {errors.template && certificateValidation.template}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="col-md-3 control-label">{t('certificate.content')}</label>
            <div className="col-md-12">
              <textarea
                onChange={handleInputChange}
                value={certificateContent}
                placeholder={t('certificate.content')}
                ref={register({ required: true })}
                name="content"
                className="form-control"
                rows="3"
              ></textarea>
              <div className="error text-danger">
                {errors.content && certificateValidation.content}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-12">
              <button name="submit" type="submit" className="btn btn-primary">
                <i className="fa fa-check"></i> {t('certificate.save')}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
};

AddCertificate.propTypes = {};

AddCertificate.defaultProps = {};

export default AddCertificate;
