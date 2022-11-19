import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPrescription = () => {
    return http.get(`${BASE_URL}/api/prescription`)
}
const createPrescription = data => {
    return http.post(`${BASE_URL}/api/prescription`, data);
};

const createMedicamentPrescription = data => {
    return http.post(`${BASE_URL}/api/prescription/medicament`, data);
};

const getPrescription = (id, data) => {
    return http.get(`${BASE_URL}/api/prescription/${id}`, data);
};

const getMedicamentPrescription = (id, data) => {
    return http.get(`${BASE_URL}/api/prescription/medicament/${id}`, data);
};

const editPrescription = (id, data) => {
    return http.put(`${BASE_URL}/api/prescription/${id}`, data);
};

const removePrescription = id => {
    return http.delete(`${BASE_URL}/api/prescription/${id}`);
};

const removeMedicamentPrescription = (id, data) => {
    return http.delete(`${BASE_URL}/api/prescription/medicament/${id}`, data);
};

export default {
    getAllPrescription,
    createPrescription,
    editPrescription,
    removePrescription,
    createMedicamentPrescription,
    getPrescription,
    getMedicamentPrescription,
    removeMedicamentPrescription
};