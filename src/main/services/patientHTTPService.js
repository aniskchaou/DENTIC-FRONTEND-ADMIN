import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPatients = () => {
    return http.get(`${BASE_URL}/patients`);
};

const getPatientById = (id) => {
    return http.get(`${BASE_URL}/patients/${id}`);
};

const createPatient = (data) => {
    return http.post(`${BASE_URL}/patients`, data);
};

const editPatient = (id, data) => {
    return http.put(`${BASE_URL}/patients/${id}`, data);
};

const removePatient = (id) => {
    return http.delete(`${BASE_URL}/patients/${id}`);
};

const removeAllPatients = () => {
    return http.delete(`${BASE_URL}/patients`);
};

export default {
    getAllPatients,
    getPatientById,
    createPatient,
    editPatient,
    removePatient,
    removeAllPatients
};
