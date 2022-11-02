import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPatient = () => {
    return http.get(`${BASE_URL}/api/patient`)
}

const getCount = () => {
    return http.get(`${BASE_URL}/api/patient/count`)
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

export default {
    getAllPatient,
    createPatient,
    editPatient,
    getCount,
    removePatient
};