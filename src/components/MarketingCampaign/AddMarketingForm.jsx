import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../main/urls/urls";
import { useTranslation } from "react-i18next";

const statusOptions = ["Draft", "Scheduled", "Active", "Completed", "Cancelled"];
const campaignTypeOptions = ["Email", "SMS", "Push"];
const ageGroups = ["18-24", "25-40", "41-60", "60+"];
const treatmentHistoryOptions = ["Orthodontics", "Implants", "Whitening", "Cleaning"];
const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function AddMarketingForm({ closeModal }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    campaignName: "",
    campaignType: "Email",
    ageGroup: "",
    ageGroupEnabled: true,
    treatmentHistory: "",
    treatmentHistoryEnabled: true,
    lastVisitDate: "",
    lastVisitDateEnabled: true,
    messageTemplate: "",
    scheduleDate: "",
    status: "Draft",
    insuranceId: "",
    insuranceIdEnabled: true,
    bloodType: "",
    bloodTypeEnabled: true,
    allergies: "",
    allergiesEnabled: true,
  });

  const [insurances, setInsurances] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`${BASE_URL}/insurances`).then(res => {
      setInsurances(Array.isArray(res.data) ? res.data : []);
    });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      campaignName: form.campaignName,
      campaignType: form.campaignType,
      ageGroup: form.ageGroupEnabled ? form.ageGroup : null,
      treatmentHistory: form.treatmentHistoryEnabled ? form.treatmentHistory : null,
      lastVisitDate: form.lastVisitDateEnabled ? form.lastVisitDate : null,
      messageTemplate: form.messageTemplate,
      scheduleDate: form.scheduleDate,
      status: form.status,
      insuranceId: form.insuranceIdEnabled ? form.insuranceId : null,
      bloodType: form.bloodTypeEnabled ? form.bloodType : null,
      allergies: form.allergiesEnabled ? form.allergies : null,
    };
    try {
      await axios.post(`${BASE_URL}/marketing`, payload);
      closeModal();
    } catch (err) {
      alert(t("marketing.create_failed"));
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>{t("marketing.campaign_name")}</label>
        <input
          type="text"
          className="form-control"
          name="campaignName"
          value={form.campaignName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("marketing.campaign_type")}</label>
        <select
          className="form-control"
          name="campaignType"
          value={form.campaignType}
          onChange={handleChange}
        >
          {campaignTypeOptions.map(opt => (
            <option key={opt} value={opt}>{t(`marketing.type_${opt.toLowerCase()}`)}</option>
          ))}
        </select>
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="ageGroupEnabled"
          checked={form.ageGroupEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_age_group")}</label>
        <select
          className="form-control"
          name="ageGroup"
          value={form.ageGroup}
          onChange={handleChange}
          disabled={!form.ageGroupEnabled}
        >
          <option value="">{t("marketing.select_age_group")}</option>
          {ageGroups.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="treatmentHistoryEnabled"
          checked={form.treatmentHistoryEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_treatment_history")}</label>
        <select
          className="form-control"
          name="treatmentHistory"
          value={form.treatmentHistory}
          onChange={handleChange}
          disabled={!form.treatmentHistoryEnabled}
        >
          <option value="">{t("marketing.select_treatment")}</option>
          {treatmentHistoryOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="lastVisitDateEnabled"
          checked={form.lastVisitDateEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_last_visit_date")}</label>
        <input
          type="date"
          className="form-control"
          name="lastVisitDate"
          value={form.lastVisitDate}
          onChange={handleChange}
          disabled={!form.lastVisitDateEnabled}
        />
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="insuranceIdEnabled"
          checked={form.insuranceIdEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_insurance_id")}</label>
        <select
          className="form-control"
          name="insuranceId"
          value={form.insuranceId}
          onChange={handleChange}
          disabled={!form.insuranceIdEnabled}
        >
          <option value="">{t("marketing.select_insurance")}</option>
          {insurances.map(ins => (
            <option key={ins.id} value={ins.id}>
              {ins.providerName ? `${ins.providerName} (${ins.policyNumber})` : ins.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="bloodTypeEnabled"
          checked={form.bloodTypeEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_blood_type")}</label>
        <select
          className="form-control"
          name="bloodType"
          value={form.bloodType}
          onChange={handleChange}
          disabled={!form.bloodTypeEnabled}
        >
          <option value="">{t("marketing.select_blood_type")}</option>
          {bloodTypes.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
      <div className="form-group d-flex align-items-center">
        <input
          type="checkbox"
          name="allergiesEnabled"
          checked={form.allergiesEnabled}
          onChange={handleChange}
          style={{ marginRight: 8 }}
        />
        <label style={{ marginRight: 8 }}>{t("marketing.enable_allergies")}</label>
        <input
          type="text"
          className="form-control"
          name="allergies"
          value={form.allergies}
          onChange={handleChange}
          disabled={!form.allergiesEnabled}
          placeholder={t("marketing.allergies_placeholder")}
        />
      </div>
      <div className="form-group">
        <label>{t("marketing.message_template")}</label>
        <textarea
          className="form-control"
          name="messageTemplate"
          value={form.messageTemplate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("marketing.schedule_date")}</label>
        <input
          type="date"
          className="form-control"
          name="scheduleDate"
          value={form.scheduleDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>{t("marketing.status")}</label>
        <select
          className="form-control"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{t(`marketing.status_${opt.toLowerCase()}`)}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-success mt-3" disabled={submitting}>
        {submitting ? t("marketing.creating") : t("marketing.create_campaign")}
      </button>
    </form>
  );
}