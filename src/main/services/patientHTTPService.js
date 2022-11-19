import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPatient = () => {
    return http.get(`${BASE_URL}/api/patient`)
}

const getCount = () => {
    return http.get(`${BASE_URL}/api/patient/count`)
}

const getPatientByDate = () => {
    return http.get(`${BASE_URL}/api/analytics/patient`)
}

const createPatient = data => {
    return http.post(`${BASE_URL}/api/patient`, data);
};

const editPatient = (id, data) => {
    return http.put(`${BASE_URL}/api/patient/${id}`, data);
};

const removePatient = id => {
    return http.delete(`${BASE_URL}/api/patient/${id}`);
};

const searchPatient = (patient) => {
    return http.get(`${BASE_URL}/api/search/patient/${patient}`)
}

export default {
    getAllPatient,
    createPatient,
    editPatient,
    getCount,
    removePatient,
    searchPatient,
    getPatientByDate
};