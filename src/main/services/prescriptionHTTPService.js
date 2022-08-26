import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPrescription = () => {
    return http.get(`${BASE_URL}/api/prescription`)
}
const createPrescription = data => {
    return http.post(`${BASE_URL}/api/prescription`, data);
};

const editPrescription = (id, data) => {
    return http.put(`${BASE_URL}/api/prescription/${id}`, data);
};

const removePrescription = id => {
    return http.delete(`${BASE_URL}/api/prescription/${id}`);
};

export default {
    getAllPrescription,
    createPrescription,
    editPrescription,
    removePrescription
};