import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicament = () => {
    return http.get(`${BASE_URL}/api/medicament`)
}
const createMedicament = data => {
    return http.post(`${BASE_URL}/api/medicament`, data);
};

const editMedicament = (id, data) => {
    return http.put(`${BASE_URL}/api/medicament/${id}`, data);
};

const removeMedicament = id => {
    return http.delete(`${BASE_URL}/api/medicament/${id}`);
};
const getCount = () => {
    return http.get(`${BASE_URL}/api/medicament/count`)
}
export default {
    getAllMedicament,
    createMedicament,
    editMedicament,
    getCount,
    removeMedicament
};